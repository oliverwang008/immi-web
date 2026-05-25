import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import { fetchAllImmigrationNews } from './immigration-news.js';

const app = express();
const PORT = process.env.PORT || 8080;
const RAG_SERVER_URL = process.env.RAG_SERVER_URL ?? '';
const RAG_TIMEOUT_MS = 3000;

app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://auvtracker.web.app',
    'https://auvtracker.firebaseapp.com',
  ],
}));

// ── Health check ─────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── RAG retrieval ─────────────────────────────────────────────────────────────

async function fetchRagContext(query) {
  if (!RAG_SERVER_URL) return [];
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), RAG_TIMEOUT_MS);
  try {
    const res = await fetch(`${RAG_SERVER_URL}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, n_results: 5 }),
      signal: controller.signal,
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results ?? [];
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

function buildContextBlock(chunks) {
  if (!chunks.length) return '';
  const parts = chunks.map((c) => `[${c.department} — ${c.url}]\n${c.content}`);
  return `<government_sources>\n${parts.join('\n\n---\n\n')}\n</government_sources>\n\n`;
}

function buildSourcesFooter(chunks) {
  const seen = new Map();
  for (const c of chunks) {
    if (!seen.has(c.url)) seen.set(c.url, c.title);
  }
  if (!seen.size) return '';
  const lines = ['\n\n---\n**Official sources consulted:**'];
  for (const [url, title] of seen) lines.push(`- [${title}](${url})`);
  return lines.join('\n');
}

// ── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert Australian immigration visa consultant working with AussieVisa Tracker, a community-driven platform that tracks skilled visa processing times and EOI statistics.

Your deep expertise covers:
- Skilled Independent Visa (Subclass 189) — points-tested, no state sponsorship needed
- Skilled Nominated Visa (Subclass 190) — requires state or territory nomination, earns an extra 5 points
- Skilled Work Regional (Provisional) Visa (Subclass 491) — regional or family-sponsored, earns an extra 15 points
- Temporary Skill Shortage Visa (Subclass 482) — employer-sponsored
- Employer Nomination Scheme (Subclass 186) — permanent employer-sponsored
- EOI through SkillSelect — pool mechanics, invitation rounds, withdrawals and resubmissions
- Points test mechanics — age brackets, English proficiency, qualifications, work experience, partner skills
- Skilled Occupation Lists — MLTSSL, STSOL, ROL
- State and territory nomination programs — NSW, Victoria, Queensland, SA, WA, Tasmania, ACT, NT
- Skills assessment bodies — Engineers Australia, VETASSESS, ACS, AHPRA, TRA, and more
- Bridging visas (A, B, C, E) — rights and conditions
- Character and health requirements

When <government_sources> are provided, prioritise that content for facts, fees, and occupation lists — and cite the source URL.

Communication style:
- Knowledgeable, professional, warm, and empathetic
- Clear structured responses with bullet points where helpful
- Australian English spelling (e.g. recognised, organisation)
- Always note responses are general guidance only, not legal advice
- Recommend MARA-registered agents for complex situations

Mandatory disclaimer: Include a brief reminder — "This is general information only — for your specific circumstances, consult a MARA-registered migration agent or immigration lawyer."`;

// ── POST /api/chat ────────────────────────────────────────────────────────────

app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const ragChunks = lastUser ? await fetchRagContext(lastUser.content) : [];
  const contextBlock = buildContextBlock(ragChunks);
  const sourcesFooter = buildSourcesFooter(ragChunks);

  const augmentedMessages = messages.map((m, i) => {
    if (i === messages.length - 1 && m.role === 'user' && contextBlock) {
      return { ...m, content: contextBlock + m.content };
    }
    return m;
  });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const client = new Anthropic({ apiKey });
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: augmentedMessages,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify(event.delta.text)}\n\n`);
      }
    }

    if (sourcesFooter) {
      res.write(`data: ${JSON.stringify(sourcesFooter)}\n\n`);
    }
  } catch (err) {
    console.error('Chat error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to process request' });
      return;
    }
  }

  res.end();
});

// ── GET /api/immigration-news ─────────────────────────────────────────────────

const newsCache = { data: null, fetchedAt: 0 };
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

app.get('/api/immigration-news', async (_req, res) => {
  try {
    const now = Date.now();
    if (!newsCache.data || now - newsCache.fetchedAt > CACHE_TTL_MS) {
      newsCache.data = await fetchAllImmigrationNews();
      newsCache.fetchedAt = now;
    }
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.json(newsCache.data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
  console.log(`RAG server: ${RAG_SERVER_URL || '(not configured — RAG disabled)'}`);
});
