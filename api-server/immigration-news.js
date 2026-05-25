// Ported from src/lib/immigration-news.ts

const IMMIGRATION_KEYWORDS = [
  'visa', 'migrat', 'skilled', 'nominat', 'employer',
  'immigration', 'subclass', 'permanent resident', 'eoi',
  'expression of interest', 'sponsored', 'regional',
  'residency', 'work permit', 'state nomination',
];

function isImmigrationRelated(text) {
  const lower = text.toLowerCase();
  return IMMIGRATION_KEYWORDS.some((kw) => lower.includes(kw));
}

function simpleId(str) {
  let hash = 0;
  for (let i = 0; i < Math.min(str.length, 100); i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function extractXmlField(xml, tag) {
  const cdata = xml.match(new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tag}>`, 'i'));
  if (cdata) return cdata[1].trim();
  const plain = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  if (plain) return plain[1].trim();
  return '';
}

function parseRSSFeed(xml, state, stateName, filterByKeywords, maxItems = 5) {
  const items = [];
  const blocks = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/gi));
  for (const block of blocks) {
    const itemXml = block[1];
    const title = decodeHtmlEntities(extractXmlField(itemXml, 'title'));
    const description = extractXmlField(itemXml, 'description');
    const link = extractXmlField(itemXml, 'link') || (itemXml.match(/<link>([^<]+)<\/link>/i)?.[1] ?? '');
    const pubDate = extractXmlField(itemXml, 'pubDate');
    if (!title || title.length < 5) continue;
    if (filterByKeywords && !isImmigrationRelated(title + ' ' + description)) continue;
    const summary = decodeHtmlEntities(stripHtml(description)).slice(0, 220) || 'Click to read more.';
    const dateStr = pubDate ? (() => { try { return new Date(pubDate).toISOString().split('T')[0]; } catch { return ''; } })() : '';
    items.push({ id: `${state}-${simpleId(link || title)}`, state, stateName, title, summary: summary + (summary.length === 220 ? '…' : ''), url: link, date: dateStr });
    if (items.length >= maxItems) break;
  }
  return items;
}

function parseHTMLPage(html, state, stateName, baseUrl, maxItems = 5) {
  const items = [];
  const seen = new Set();
  const patterns = [
    /<h[2-4][^>]*>\s*<a[^>]+href="([^"#][^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,
    /<a[^>]+href="([^"#][^"]*)"[^>]*class="[^"]*(?:news|article|item|title|heading|link)[^"]*"[^>]*>([\s\S]*?)<\/a>/gi,
    /<a[^>]+class="[^"]*(?:news|article|item|title|heading)[^"]*"[^>]*href="([^"#][^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,
  ];
  const base = (() => { try { return new URL(baseUrl); } catch { return null; } })();
  for (const pattern of patterns) {
    const matches = Array.from(html.matchAll(pattern));
    for (const match of matches) {
      let href = match[1].trim();
      const title = decodeHtmlEntities(stripHtml(match[2]).replace(/\s+/g, ' ').trim());
      if (!title || title.length < 10 || seen.has(title)) continue;
      if (!isImmigrationRelated(title)) continue;
      seen.add(title);
      if (href.startsWith('/') && base) href = `${base.protocol}//${base.host}${href}`;
      else if (!href.startsWith('http')) continue;
      items.push({ id: `${state}-${simpleId(title)}`, state, stateName, title, summary: 'Visit the official state immigration website for full details.', url: href, date: '' });
      if (items.length >= maxItems) break;
    }
    if (items.length >= maxItems) break;
  }
  return items;
}

const SOURCES = [
  { state: 'NSW', stateName: 'New South Wales', stateColor: '#003DA5', sourceUrl: 'https://www.nsw.gov.au/immigration', rssUrl: 'https://www.nsw.gov.au/rss/news', filterByKeywords: true },
  { state: 'VIC', stateName: 'Victoria', stateColor: '#003DA5', sourceUrl: 'https://www.vic.gov.au/immigration-news', rssUrl: 'https://www.vic.gov.au/rss.xml', filterByKeywords: true },
  { state: 'QLD', stateName: 'Queensland', stateColor: '#7B1C1C', sourceUrl: 'https://www.qld.gov.au/about/news-publications/news', htmlUrl: 'https://www.qld.gov.au/about/news-publications/news', filterByKeywords: true },
  { state: 'WA', stateName: 'Western Australia', stateColor: '#1A5276', sourceUrl: 'https://www.migration.wa.gov.au/news', htmlUrl: 'https://www.migration.wa.gov.au/news', filterByKeywords: false },
  { state: 'SA', stateName: 'South Australia', stateColor: '#C8102E', sourceUrl: 'https://www.migration.sa.gov.au/news-and-events', htmlUrl: 'https://www.migration.sa.gov.au/news-and-events', filterByKeywords: false },
  { state: 'TAS', stateName: 'Tasmania', stateColor: '#1E8449', sourceUrl: 'https://www.migration.tas.gov.au/news', htmlUrl: 'https://www.migration.tas.gov.au/news', filterByKeywords: false },
  { state: 'ACT', stateName: 'Australian Capital Territory', stateColor: '#5B2C6F', sourceUrl: 'https://www.act.gov.au/migration/news', htmlUrl: 'https://www.act.gov.au/migration/news', filterByKeywords: false },
  { state: 'NT', stateName: 'Northern Territory', stateColor: '#E07B00', sourceUrl: 'https://theterritory.com.au/migrate', htmlUrl: 'https://theterritory.com.au/migrate', filterByKeywords: false },
];

async function fetchSource(source) {
  try {
    const url = source.rssUrl ?? source.htmlUrl;
    if (!url) throw new Error('No URL configured');
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.text();
    const items = source.rssUrl
      ? parseRSSFeed(body, source.state, source.stateName, source.filterByKeywords)
      : parseHTMLPage(body, source.state, source.stateName, url);
    return { state: source.state, stateName: source.stateName, stateColor: source.stateColor, sourceUrl: source.sourceUrl, items, error: false };
  } catch {
    return { state: source.state, stateName: source.stateName, stateColor: source.stateColor, sourceUrl: source.sourceUrl, items: [], error: true };
  }
}

export async function fetchAllImmigrationNews() {
  const results = await Promise.allSettled(SOURCES.map(fetchSource));
  return results.map((r, i) => {
    if (r.status === 'fulfilled') return r.value;
    return { state: SOURCES[i].state, stateName: SOURCES[i].stateName, stateColor: SOURCES[i].stateColor, sourceUrl: SOURCES[i].sourceUrl, items: [], error: true };
  });
}
