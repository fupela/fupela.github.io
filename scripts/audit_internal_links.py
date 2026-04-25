#!/usr/bin/env python3
"""Audit local links in static HTML files without crawling the network."""

from __future__ import annotations

import argparse
import html.parser
from pathlib import Path
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).resolve().parents[1]
SITE_HOSTS = {"jedaiflow.com", "www.jedaiflow.com"}
SKIP_DIRS = {".git", ".wrangler", "archive", "node_modules", "projects"}
SKIP_SCHEMES = {"mailto", "tel", "sms", "javascript"}


class LinkParser(html.parser.HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_names = ("href", "src") if tag in {"a", "link", "script", "img", "source"} else ()
        for name, value in attrs:
            if name in attr_names and value:
                self.links.append((name, value.strip()))


def html_files() -> list[Path]:
    paths: list[Path] = []
    for path in ROOT.rglob("*.html"):
        if any(part in SKIP_DIRS for part in path.relative_to(ROOT).parts):
            continue
        paths.append(path)
    return sorted(paths)


def normalize_target(source: Path, raw: str) -> Path | None:
    href = raw.split("#", 1)[0].split("?", 1)[0]
    if not href:
        return None

    parsed = urlparse(href)
    if parsed.scheme in SKIP_SCHEMES:
        return None
    if parsed.scheme in {"http", "https"}:
        if parsed.netloc.lower() not in SITE_HOSTS:
            return None
        href = parsed.path
    elif parsed.scheme:
        return None

    href = unquote(href)
    if href.startswith("/"):
        target = ROOT / href.lstrip("/")
    else:
        target = source.parent / href
    return target.resolve()


def exists_as_static_path(target: Path) -> bool:
    if target.exists():
        return True
    if target.suffix:
        return False
    return (target / "index.html").exists() or target.with_suffix(".html").exists()


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--quiet", action="store_true", help="Only print broken links")
    args = ap.parse_args()

    broken: list[tuple[Path, str]] = []
    checked = 0
    for source in html_files():
        parser = LinkParser()
        parser.feed(source.read_text(errors="replace"))
        for _attr, raw in parser.links:
            target = normalize_target(source, raw)
            if target is None:
                continue
            try:
                target.relative_to(ROOT)
            except ValueError:
                broken.append((source, raw))
                continue
            checked += 1
            if not exists_as_static_path(target):
                broken.append((source, raw))

    if not args.quiet:
        print(f"HTML files scanned: {len(html_files())}")
        print(f"Internal links checked: {checked}")
        print(f"Broken links found: {len(broken)}")

    for source, raw in broken:
        print(f"{source.relative_to(ROOT)} -> {raw}")

    return 1 if broken else 0


if __name__ == "__main__":
    raise SystemExit(main())
