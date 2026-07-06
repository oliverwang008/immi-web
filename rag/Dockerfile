# RAG service (FastAPI + ChromaDB) for Cloud Run.
#
# IMPORTANT: build with the repo root as context, not rag/, because the curated
# reference docs live at ../docs/immigration relative to the rag/ code:
#
#   docker build -f rag/Dockerfile -t immi-web-rag .
#
# The vector index is baked into the image at build time (read-only at runtime),
# which suits Cloud Run's ephemeral, per-instance filesystem: the index ships
# inside the immutable image and is refreshed by rebuilding + redeploying.
#
# INGEST build arg:
#   docs (default) — index only docs/immigration/*.md. Offline, fast, reliable.
#   full           — also scrape the official gov sites (network + several
#                    minutes; can fail the build if a source is unreachable).
#
#   docker build -f rag/Dockerfile --build-arg INGEST=full -t immi-web-rag .

FROM python:3.11-slim

WORKDIR /app

# Install deps first for layer caching.
COPY rag/requirements.txt ./rag/
RUN pip install --no-cache-dir -r rag/requirements.txt

# Mirror the repo layout so curated_docs.py resolves ../docs/immigration.
COPY rag/ ./rag/
COPY docs/ ./docs/

WORKDIR /app/rag

# Build the vector index into the image. rm -rf .chroma_db drops any stale
# local index that slipped through .dockerignore so the bake is reproducible.
# Running ingest here also caches the sentence-transformers model in the image,
# avoiding a slow model download on cold start.
ARG INGEST=docs
RUN rm -rf .chroma_db && \
    python main.py ingest-docs && \
    if [ "$INGEST" = "full" ]; then python main.py ingest; fi

ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "uvicorn server:app --host 0.0.0.0 --port ${PORT}"]
