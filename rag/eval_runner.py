"""
eval_runner.py — RAG quality evaluation for AussieVisa Tracker.

Computes four RAGAS-style metrics using Claude as the LLM judge (no RAGAS /
LangChain dependency — consistent with the rest of the stack):

  - context_recall     : fraction of the reference answer's claims that ARE
                         supported by the retrieved context (retrieval coverage).
  - context_precision  : are the retrieved chunks relevant, rank-weighted?
                         (rewards putting relevant chunks earlier — MAP@k).
  - faithfulness       : fraction of the GENERATED answer's claims that are
                         grounded in the retrieved context (anti-hallucination).
  - answer_relevancy   : does the answer actually address the question? (RAGAS
                         method: generate questions from the answer, embed, and
                         cosine-compare to the original — reuses the same
                         all-MiniLM embedder as retrieval).

Retrieval uses the production VectorStore.hybrid_search (BM25 + vector, RRF).
Generation uses the same system prompt as the terminal agent. Judging uses a
stronger model (Opus) for reliability. All calls go through the Anthropic SDK.

Runs offline against the local .chroma_db — build it first:
    pip install -r requirements.txt
    python main.py ingest-docs

Usage:
    python eval_runner.py                    # built-in eval set
    python eval_runner.py --dataset my.json  # [{"question":..., "ground_truth":...}, ...]
    python eval_runner.py --k 5 --out results.json
"""

import argparse
import json
import os
import re
import sys

import numpy as np
from dotenv import load_dotenv
from rich.console import Console
from rich.table import Table

import anthropic

sys.path.insert(0, os.path.dirname(__file__))
from vectorstore import VectorStore, EMBED_MODEL
from agent import SYSTEM_PROMPT, MODEL as GEN_MODEL

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
console = Console()

JUDGE_MODEL = "claude-opus-4-8"   # correctness matters more than cost for judging
JUDGE_SYSTEM = (
    "You are a meticulous evaluation judge for a retrieval-augmented generation "
    "system. Be strict and literal. Respond with ONLY valid JSON — no prose, no "
    "markdown fences."
)

# Reference set grounded in docs/immigration/*.md. ground_truth is required for
# context_recall / context_precision; faithfulness / answer_relevancy don't need it.
EVAL_SET = [
    {"question": "How many points is Superior English worth on the skilled points test?",
     "ground_truth": "Superior English is worth 20 points."},
    {"question": "Which visa subclass is the Skilled Independent visa?",
     "ground_truth": "The Skilled Independent visa is subclass 189."},
    {"question": "What replaced the Temporary Skill Shortage (subclass 482) TSS visa in December 2024?",
     "ground_truth": "The Skills in Demand (SID) visa replaced the TSS visa in December 2024. It is still "
                     "subclass 482, with Core Skills, Specialist Skills and Labour Agreement streams."},
    {"question": "What is the Core Skills Income Threshold (CSIT) from 1 July 2025?",
     "ground_truth": "The Core Skills Income Threshold is AUD $76,515 from 1 July 2025."},
    {"question": "How many extra points does state nomination give for a subclass 190 visa?",
     "ground_truth": "State or territory nomination gives an extra 5 points for a subclass 190 visa."},
    {"question": "How many extra points does the subclass 491 regional visa give?",
     "ground_truth": "The subclass 491 regional visa gives an extra 15 points."},
]


# ── JSON parsing ──────────────────────────────────────────────────────────────

def _extract_json(text: str):
    """Robustly pull a JSON object/array out of an LLM response."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?|```$", "", text, flags=re.MULTILINE).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    for open_c, close_c in (("{", "}"), ("[", "]")):
        i, j = text.find(open_c), text.rfind(close_c)
        if 0 <= i < j:
            try:
                return json.loads(text[i:j + 1])
            except json.JSONDecodeError:
                continue
    raise ValueError(f"No JSON found in judge response: {text[:200]!r}")


# ── Metric math (pure, unit-testable) ─────────────────────────────────────────

def average_precision(relevances: list[int]) -> float:
    """Mean average precision at k — rank-weighted context precision.

    relevances is 1/0 per retrieved chunk, in retrieval order. Rewards relevant
    chunks appearing earlier. Returns 0.0 if nothing relevant.
    """
    total_rel = sum(relevances)
    if total_rel == 0:
        return 0.0
    hits, score = 0, 0.0
    for k, rel in enumerate(relevances, start=1):
        if rel:
            hits += 1
            score += hits / k
    return score / total_rel


def _cosine(a: np.ndarray, b: np.ndarray) -> float:
    denom = float(np.linalg.norm(a) * np.linalg.norm(b))
    return float(np.dot(a, b) / denom) if denom else 0.0


# ── Evaluator ─────────────────────────────────────────────────────────────────

class RagEvaluator:
    def __init__(self, store: VectorStore, k: int = 5):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise EnvironmentError("ANTHROPIC_API_KEY not set (check rag/.env)")
        self._client = anthropic.Anthropic(api_key=api_key)
        self._store = store
        self._embedder = store._embedder  # reuse the loaded all-MiniLM model
        self._k = k

    # -- LLM helpers --
    def _judge(self, prompt: str, max_tokens: int = 1024):
        msg = self._client.messages.create(
            model=JUDGE_MODEL,
            max_tokens=max_tokens,
            system=[{"type": "text", "text": JUDGE_SYSTEM,
                     "cache_control": {"type": "ephemeral"}}],
            messages=[{"role": "user", "content": prompt}],
        )
        text = "".join(b.text for b in msg.content if b.type == "text")
        return _extract_json(text)

    def _decompose(self, text: str) -> list[str]:
        data = self._judge(
            "Break the following text into a list of atomic, self-contained factual "
            'claims. Respond as {"claims": ["...", "..."]}.\n\nText:\n' + text
        )
        return [c for c in data.get("claims", []) if str(c).strip()]

    def _verify(self, claims: list[str], contexts: list[str]) -> list[int]:
        """For each claim, 1 if it can be inferred from the context, else 0."""
        ctx = "\n\n---\n\n".join(f"[{i + 1}] {c}" for i, c in enumerate(contexts))
        numbered = "\n".join(f"{i + 1}. {c}" for i, c in enumerate(claims))
        data = self._judge(
            "Given ONLY the context below, decide for each claim whether it can be "
            "directly inferred/supported by the context. Use 1 for supported, 0 for "
            'not supported. Respond as {"verdicts": [1, 0, ...]} in claim order.\n\n'
            f"Context:\n{ctx}\n\nClaims:\n{numbered}"
        )
        verdicts = [1 if int(v) else 0 for v in data.get("verdicts", [])]
        # length-guard: pad/truncate to match claims
        verdicts = (verdicts + [0] * len(claims))[:len(claims)]
        return verdicts

    def _relevance_per_context(self, question: str, ground_truth: str,
                               contexts: list[str]) -> list[int]:
        numbered = "\n\n---\n\n".join(f"[{i + 1}] {c}" for i, c in enumerate(contexts))
        data = self._judge(
            "For each retrieved context chunk, decide whether it is useful for "
            "answering the question (1) or not (0). A reference answer is provided "
            'to anchor relevance. Respond as {"relevant": [1, 0, ...]} in chunk '
            f"order.\n\nQuestion: {question}\nReference answer: {ground_truth}\n\n"
            f"Chunks:\n{numbered}"
        )
        rel = [1 if int(v) else 0 for v in data.get("relevant", [])]
        return (rel + [0] * len(contexts))[:len(contexts)]

    def _is_noncommittal(self, answer: str) -> bool:
        data = self._judge(
            "Is the following answer noncommittal, evasive, or a refusal to answer "
            '(e.g. "I cannot determine that")? Respond as {"noncommittal": true|false}.'
            "\n\nAnswer:\n" + answer
        )
        return bool(data.get("noncommittal", False))

    def _gen_questions(self, answer: str, n: int = 3) -> list[str]:
        data = self._judge(
            f"Generate {n} distinct questions that the following answer would be a "
            'direct and complete answer to. Respond as {"questions": ["...", ...]}.'
            "\n\nAnswer:\n" + answer
        )
        return [q for q in data.get("questions", []) if str(q).strip()]

    def _generate_answer(self, question: str, contexts: list[str]) -> str:
        block = "\n\n---\n\n".join(f"[Source {i + 1}]\n{c}" for i, c in enumerate(contexts))
        user = (f"<government_sources>\n{block}\n</government_sources>\n\n"
                f"User question: {question}")
        msg = self._client.messages.create(
            model=GEN_MODEL,
            max_tokens=1024,
            system=[{"type": "text", "text": SYSTEM_PROMPT,
                     "cache_control": {"type": "ephemeral"}}],
            messages=[{"role": "user", "content": user}],
        )
        return "".join(b.text for b in msg.content if b.type == "text")

    # -- Metrics --
    def faithfulness(self, answer: str, contexts: list[str]):
        claims = self._decompose(answer)
        if not claims:
            return None
        v = self._verify(claims, contexts)
        return sum(v) / len(v)

    def context_recall(self, ground_truth: str, contexts: list[str]):
        claims = self._decompose(ground_truth)
        if not claims:
            return None
        v = self._verify(claims, contexts)
        return sum(v) / len(v)

    def context_precision(self, question: str, ground_truth: str, contexts: list[str]):
        if not contexts:
            return 0.0
        rel = self._relevance_per_context(question, ground_truth, contexts)
        return average_precision(rel)

    def answer_relevancy(self, question: str, answer: str):
        if self._is_noncommittal(answer):
            return 0.0
        gen_qs = self._gen_questions(answer)
        if not gen_qs:
            return 0.0
        emb = self._embedder.encode([question] + gen_qs)
        q0 = np.asarray(emb[0])
        sims = [_cosine(q0, np.asarray(e)) for e in emb[1:]]
        return float(np.mean(sims))

    # -- One sample --
    def evaluate(self, sample: dict) -> dict:
        question = sample["question"]
        ground_truth = sample.get("ground_truth")

        results = self._store.hybrid_search(question, n_results=self._k)
        contexts = [r["content"] for r in results]
        answer = self._generate_answer(question, contexts)

        row = {
            "question": question,
            "answer": answer,
            "n_contexts": len(contexts),
            "faithfulness": _safe(self.faithfulness, answer, contexts),
            "answer_relevancy": _safe(self.answer_relevancy, question, answer),
            "context_recall": None,
            "context_precision": None,
        }
        if ground_truth:
            row["context_recall"] = _safe(self.context_recall, ground_truth, contexts)
            row["context_precision"] = _safe(
                self.context_precision, question, ground_truth, contexts)
        return row


def _safe(fn, *args):
    """Run a metric; record None on failure so one bad sample doesn't abort the run."""
    try:
        return fn(*args)
    except Exception as e:  # judge/network hiccup
        console.print(f"[yellow]metric {fn.__name__} failed: {e}[/yellow]")
        return None


# ── Reporting ─────────────────────────────────────────────────────────────────

METRICS = ["context_recall", "context_precision", "faithfulness", "answer_relevancy"]


def _fmt(v):
    return "—" if v is None else f"{v:.2f}"


def report(rows: list[dict]) -> dict:
    table = Table(title="RAG Evaluation", show_lines=True)
    table.add_column("Question", overflow="fold", max_width=42)
    for m in METRICS:
        table.add_column(m.replace("context_", "ctx_"), justify="right")

    for r in rows:
        table.add_row(r["question"], *[_fmt(r[m]) for m in METRICS])
    console.print(table)

    aggregates = {}
    for m in METRICS:
        vals = [r[m] for r in rows if r[m] is not None]
        aggregates[m] = round(sum(vals) / len(vals), 4) if vals else None

    summary = Table(title="Aggregate (mean over scored samples)")
    summary.add_column("Metric")
    summary.add_column("Score", justify="right")
    for m in METRICS:
        summary.add_row(m, _fmt(aggregates[m]))
    console.print(summary)
    return aggregates


# ── CLI ───────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser(description="Evaluate RAG quality (RAGAS-style, Claude judge).")
    ap.add_argument("--dataset", help='JSON list of {"question","ground_truth"?} objects')
    ap.add_argument("--k", type=int, default=5, help="chunks to retrieve per question")
    ap.add_argument("--limit", type=int, help="only evaluate the first N samples")
    ap.add_argument("--out", help="write full per-sample results + aggregates to this JSON file")
    args = ap.parse_args()

    if args.dataset:
        with open(args.dataset, encoding="utf-8") as f:
            dataset = json.load(f)
    else:
        dataset = EVAL_SET
    if args.limit:
        dataset = dataset[:args.limit]

    store = VectorStore()
    if store.count() == 0:
        console.print("[red]Vector store is empty. Run [bold]python main.py ingest-docs[/bold] first.[/red]")
        sys.exit(1)

    console.print(f"[dim]Judge: {JUDGE_MODEL} · Generator: {GEN_MODEL} · Embedder: {EMBED_MODEL} · "
                  f"k={args.k} · {len(dataset)} samples[/dim]\n")

    evaluator = RagEvaluator(store, k=args.k)
    rows = []
    for i, sample in enumerate(dataset, 1):
        console.print(f"[dim]({i}/{len(dataset)}) {sample['question'][:70]}[/dim]")
        rows.append(evaluator.evaluate(sample))

    aggregates = report(rows)

    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            json.dump({"aggregates": aggregates, "samples": rows}, f, indent=2, ensure_ascii=False)
        console.print(f"[green]Wrote {args.out}[/green]")


if __name__ == "__main__":
    main()
