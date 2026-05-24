"""
Scrapes official Australian immigration government websites.
Respects robots.txt conventions with delays between requests.
"""

import time
import re
import requests
from bs4 import BeautifulSoup
from typing import Iterator
from dataclasses import dataclass

from sites import OFFICIAL_SITES

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; ImmiWebRAG/1.0; "
        "Australian Immigration Research Tool; "
        "+https://github.com/oliverwang008/immi-web)"
    ),
    "Accept": "text/html,application/xhtml+xml",
    "Accept-Language": "en-AU,en;q=0.9",
}

REQUEST_DELAY = 2.0  # seconds between requests


@dataclass
class Document:
    url: str
    title: str
    department: str
    source_name: str
    content: str
    chunks: list[str] = None


def _clean_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _extract_content(soup: BeautifulSoup) -> str:
    """Extract main content, removing nav, footer, scripts, ads."""
    for tag in soup(["script", "style", "nav", "footer", "header",
                     "aside", "noscript", "form", "button",
                     "[class*='cookie']", "[class*='banner']"]):
        tag.decompose()

    # Try common content containers first
    for selector in [
        "main", "article", "#content", ".content",
        "[role='main']", ".main-content", "#main-content",
    ]:
        container = soup.select_one(selector)
        if container:
            return _clean_text(container.get_text(separator="\n"))

    # Fall back to body
    body = soup.find("body")
    return _clean_text(body.get_text(separator="\n")) if body else ""


def _chunk_text(text: str, chunk_size: int = 800, overlap: int = 100) -> list[str]:
    """Split text into overlapping chunks by sentence boundaries."""
    sentences = re.split(r"(?<=[.!?])\s+", text)
    chunks = []
    current = []
    current_len = 0

    for sentence in sentences:
        sentence_len = len(sentence)
        if current_len + sentence_len > chunk_size and current:
            chunks.append(" ".join(current))
            # keep overlap
            overlap_sentences = []
            overlap_len = 0
            for s in reversed(current):
                if overlap_len + len(s) > overlap:
                    break
                overlap_sentences.insert(0, s)
                overlap_len += len(s)
            current = overlap_sentences
            current_len = overlap_len
        current.append(sentence)
        current_len += sentence_len

    if current:
        chunks.append(" ".join(current))

    return [c for c in chunks if len(c.strip()) > 50]


def fetch_page(url: str, session: requests.Session) -> Document | None:
    try:
        resp = session.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"  [skip] {url} — {e}")
        return None

    soup = BeautifulSoup(resp.text, "lxml")
    title_tag = soup.find("title")
    title = title_tag.get_text(strip=True) if title_tag else url

    content = _extract_content(soup)
    if len(content) < 100:
        print(f"  [skip] {url} — too little content")
        return None

    # Find which site this URL belongs to
    source_name = "Unknown"
    department = "Unknown"
    for name, info in OFFICIAL_SITES.items():
        if info["base"] in url:
            source_name = name
            department = info["department"]
            break

    return Document(
        url=url,
        title=title,
        department=department,
        source_name=source_name,
        content=content,
        chunks=_chunk_text(content),
    )


def scrape_all(sites: dict = None) -> Iterator[Document]:
    """Yield Document objects for every configured URL."""
    if sites is None:
        sites = OFFICIAL_SITES

    session = requests.Session()

    for site_name, info in sites.items():
        print(f"\n[{info['department']}]")
        for url in info["urls"]:
            print(f"  Fetching {url}")
            doc = fetch_page(url, session)
            if doc:
                print(f"    -> {len(doc.chunks)} chunks from '{doc.title[:60]}'")
                yield doc
            time.sleep(REQUEST_DELAY)
