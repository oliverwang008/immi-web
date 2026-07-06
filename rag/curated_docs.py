"""
Markdown-aware ingestion of the curated reference docs in docs/immigration/
into the same Chroma vector store used for scraped government pages.

Why a separate chunker: scraper._chunk_text() sentence-splits, which shreds
Markdown tables (and the curated docs are mostly tables). This chunks on
Markdown headings instead, so each chunk keeps a heading "breadcrumb" and any
tables/lists in that section stay intact.

The breadcrumb is deliberately placed at the FRONT of every chunk. The embedding
model (all-MiniLM-L6-v2) only encodes the first ~256 tokens, so leading with the
section path ("Visas > Subclass 482 (Skills in Demand) > Core Skills stream")
puts the most query-relevant text inside the embedding window.
"""

import os
import re

from scraper import Document

# docs/immigration lives at the repo root; this file is in rag/
DOCS_DIR = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "docs", "immigration")
)

DEPARTMENT = "AussieVisa Tracker Reference"
SOURCE_NAME = "Curated Reference Docs"

MAX_CHARS = 1500   # soft cap per chunk before a long section is split on blocks
MIN_CHARS = 40     # drop trivially small chunks

_HEADING_RE = re.compile(r"^(#{1,6})\s+(.*)$")
_FENCE_RE = re.compile(r"^```")


def _split_sections(md: str):
    """Yield (breadcrumb, body) for each heading section in a Markdown doc.

    Tracks the heading stack so each section carries its full breadcrumb.
    Lines inside fenced code blocks are never treated as headings.
    """
    lines = md.splitlines()
    stack: list[tuple[int, str]] = []   # (level, text)
    body: list[str] = []
    in_fence = False

    def breadcrumb() -> str:
        return " > ".join(text for _, text in stack)

    def flush():
        text = "\n".join(body).strip()
        return (breadcrumb(), text) if text else None

    for line in lines:
        if _FENCE_RE.match(line):
            in_fence = not in_fence
            body.append(line)
            continue

        m = None if in_fence else _HEADING_RE.match(line)
        if m:
            section = flush()
            if section:
                yield section
            body = []

            level = len(m.group(1))
            heading = m.group(2).strip()
            # Pop headings at the same or deeper level, then push this one.
            while stack and stack[-1][0] >= level:
                stack.pop()
            stack.append((level, heading))
        else:
            body.append(line)

    section = flush()
    if section:
        yield section


def _is_table(block: str) -> bool:
    lines = block.splitlines()
    return len(lines) >= 2 and sum(l.lstrip().startswith("|") for l in lines) >= len(lines) - 1


def _split_table(block: str) -> list[str]:
    """Split an oversized Markdown table into row-groups, repeating the header.

    Keeps each piece a valid table so a query can match an individual row
    (e.g. one glossary term) instead of a single 8k-char blob.
    """
    lines = [l for l in block.splitlines() if l.strip()]
    if len(lines) < 3:
        return [block]
    header, sep, rows = lines[0], lines[1], lines[2:]
    head = f"{header}\n{sep}"

    pieces, current, current_len = [], [], len(head)
    for row in rows:
        if current and current_len + len(row) + 1 > MAX_CHARS:
            pieces.append("\n".join([head, *current]))
            current, current_len = [], len(head)
        current.append(row)
        current_len += len(row) + 1
    if current:
        pieces.append("\n".join([head, *current]))
    return pieces


def _pack(breadcrumb: str, body: str) -> list[str]:
    """Turn one section body into one or more breadcrumb-prefixed chunks.

    Splits long sections on blank-line block boundaries. A non-table block is
    kept whole; an oversized table is split by rows (header repeated) so big
    tables stay searchable per row.
    """
    prefix = f"[{breadcrumb}]\n\n" if breadcrumb else ""
    raw = [b.strip() for b in re.split(r"\n\s*\n", body) if b.strip()]

    # Pre-split any oversized table block into row-groups.
    blocks: list[str] = []
    for b in raw:
        if len(b) > MAX_CHARS and _is_table(b):
            blocks.extend(_split_table(b))
        else:
            blocks.append(b)

    chunks: list[str] = []
    current: list[str] = []
    current_len = len(prefix)

    for block in blocks:
        block_len = len(block) + 2
        if current and current_len + block_len > MAX_CHARS:
            chunks.append(prefix + "\n\n".join(current))
            current = []
            current_len = len(prefix)
        current.append(block)
        current_len += block_len

    if current:
        chunks.append(prefix + "\n\n".join(current))

    return [c for c in chunks if len(c.strip()) >= MIN_CHARS]


def load_doc(path: str) -> Document:
    """Read one Markdown file into a Document with heading-aware chunks."""
    with open(path, "r", encoding="utf-8") as f:
        md = f.read()

    fname = os.path.basename(path)
    title_match = re.search(r"^#\s+(.*)$", md, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else fname

    chunks: list[str] = []
    for breadcrumb, body in _split_sections(md):
        chunks.extend(_pack(breadcrumb, body))

    return Document(
        url=f"local://docs/immigration/{fname}",
        title=title,
        department=DEPARTMENT,
        source_name=SOURCE_NAME,
        content=md,
        chunks=chunks,
    )


def load_curated_docs(docs_dir: str = DOCS_DIR) -> list[Document]:
    """Load every reference Markdown file (skips the README index)."""
    if not os.path.isdir(docs_dir):
        return []
    docs = []
    for fname in sorted(os.listdir(docs_dir)):
        if not fname.endswith(".md") or fname.lower() == "readme.md":
            continue
        docs.append(load_doc(os.path.join(docs_dir, fname)))
    return docs
