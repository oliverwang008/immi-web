"""
Entry point for the Australian Immigration RAG system.

Usage:
  python main.py ingest          # Scrape gov sites + index curated docs
  python main.py ingest --clear  # Clear DB then re-ingest everything
  python main.py ingest-docs     # (Re)index only docs/immigration/*.md — no scraping
  python main.py chat            # Start interactive chat
  python main.py stats           # Show DB stats
"""

import sys
import os
from dotenv import load_dotenv
from rich.console import Console
from rich.markdown import Markdown
from rich.prompt import Prompt
from rich.panel import Panel
from rich import print as rprint

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

console = Console()


def _ingest_curated(store):
    """(Re)index the curated docs/immigration/*.md files. Returns chunks added.

    Deletes each doc's existing chunks first so edits propagate on re-ingest.
    """
    from curated_docs import load_curated_docs

    total = 0
    for doc in load_curated_docs():
        store.delete_document(doc.url)
        added = store.add_document(doc)
        total += added
        console.print(
            f"  [green]✓[/green] {doc.title[:40]:<40} [dim]+{added} chunks[/dim]"
        )
    return total


def cmd_ingest(clear: bool = False):
    from scraper import scrape_all
    from vectorstore import VectorStore

    store = VectorStore()

    if clear:
        console.print("[yellow]Clearing existing database...[/yellow]")
        store.clear()

    console.print(Panel(
        "[bold green]Ingesting official Australian immigration websites[/bold green]\n"
        "This will take several minutes due to polite request delays.",
        title="RAG Ingestion"
    ))

    total_chunks = 0
    total_docs = 0

    for doc in scrape_all():
        added = store.add_document(doc)
        total_chunks += added
        total_docs += 1
        console.print(
            f"  [green]✓[/green] {doc.source_name[:40]:<40} "
            f"[dim]+{added} chunks[/dim]"
        )

    console.print("\n[bold]Indexing curated reference docs[/bold]")
    total_chunks += _ingest_curated(store)

    console.print(Panel(
        f"[bold]Ingestion complete[/bold]\n"
        f"Scraped documents: {total_docs}\n"
        f"Total chunks added: {total_chunks}\n"
        f"DB total: {store.count()} chunks",
        title="Done"
    ))


def cmd_ingest_docs():
    from vectorstore import VectorStore

    store = VectorStore()
    console.print(Panel(
        "[bold green]Indexing curated reference docs[/bold green]\n"
        "docs/immigration/*.md — markdown-aware chunking, no scraping.",
        title="Docs Ingestion"
    ))
    added = _ingest_curated(store)
    console.print(Panel(
        f"[bold]Done[/bold]\nChunks added: {added}\nDB total: {store.count()} chunks",
        title="Done"
    ))


def cmd_chat():
    from agent import ImmigrationAgent
    from vectorstore import VectorStore

    store = VectorStore()
    if store.count() == 0:
        console.print(
            "[red]Vector store is empty. Run [bold]python main.py ingest[/bold] first.[/red]"
        )
        sys.exit(1)

    agent = ImmigrationAgent(vector_store=store)

    console.print(Panel(
        "[bold]Australian Immigration AI Advisor[/bold]\n"
        "Powered by Claude + official government sources\n\n"
        "Type [bold]exit[/bold] to quit, [bold]reset[/bold] to clear conversation history.",
        title="Immigration RAG Agent"
    ))
    console.print(f"[dim]Knowledge base: {store.count()} indexed chunks[/dim]\n")

    while True:
        try:
            user_input = Prompt.ask("[bold cyan]You[/bold cyan]")
        except (KeyboardInterrupt, EOFError):
            console.print("\n[dim]Goodbye.[/dim]")
            break

        if not user_input.strip():
            continue

        if user_input.lower() == "exit":
            console.print("[dim]Goodbye.[/dim]")
            break

        if user_input.lower() == "reset":
            agent.reset()
            console.print("[yellow]Conversation history cleared.[/yellow]\n")
            continue

        with console.status("[bold green]Searching government sources...[/bold green]"):
            reply = agent.chat(user_input)

        console.print()
        console.print(Panel(
            Markdown(reply),
            title="[bold green]Immigration Advisor[/bold green]",
            border_style="green",
        ))
        console.print()


def cmd_stats():
    from vectorstore import VectorStore
    store = VectorStore()
    console.print(Panel(
        f"[bold]Vector Store Statistics[/bold]\n"
        f"Total indexed chunks: [green]{store.count()}[/green]",
        title="DB Stats"
    ))


def main():
    args = sys.argv[1:]
    if not args or args[0] == "chat":
        cmd_chat()
    elif args[0] == "ingest":
        cmd_ingest(clear="--clear" in args)
    elif args[0] == "ingest-docs":
        cmd_ingest_docs()
    elif args[0] == "stats":
        cmd_stats()
    else:
        console.print(f"[red]Unknown command: {args[0]}[/red]")
        console.print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
