#!/usr/bin/env python3
"""Generate sitemap.xml for jedaiflow.com from the public site files."""

from __future__ import annotations

import datetime as dt
import re
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "https://jedaiflow.com"

STATIC_PATHS = [
    ("", "1.0"),
    ("guides/", "0.8"),
    ("free/", "0.8"),
    ("free/25-ai-business-prompts.html", "0.7"),
    ("shipclean/", "0.8"),
    ("shipclean/thanks.html", "0.3"),
    ("vibeship.html", "0.7"),
    ("voice-agent-kit.html", "0.8"),
    ("voice-agent-checklist.html", "0.8"),
    ("purchase.html", "0.6"),
]

PRODUCTS = [
    "ai-money-machine.html",
    "automation-guide.html",
    "blueprint-pack.html",
    "cheat-sheet.html",
    "cheat-sheet-gumroad.html",
    "gpt-55-playbook.html",
    "mastery-guide.html",
    "side-hustle-guide.html",
    "voice-agent-guide.html",
]

CANONICAL_RE = re.compile(
    r'<link\s+rel=["\']canonical["\']\s+href=["\']([^"\']+)["\']',
    re.IGNORECASE,
)


def file_date(path: Path) -> str:
    return dt.datetime.fromtimestamp(path.stat().st_mtime).date().isoformat()


def add_url(parent: ET.Element, loc: str, lastmod: str, priority: str) -> None:
    url = ET.SubElement(parent, "url")
    ET.SubElement(url, "loc").text = loc
    ET.SubElement(url, "lastmod").text = lastmod
    ET.SubElement(url, "priority").text = priority


def canonical_for(path: Path) -> str:
    html = path.read_text(errors="replace")
    match = CANONICAL_RE.search(html)
    if match:
        return match.group(1)

    rel = path.relative_to(ROOT).as_posix()
    if rel == "index.html":
        rel = ""
    elif rel.endswith("/index.html"):
        rel = rel.removesuffix("index.html")
    return f"{BASE_URL}/{rel}"


def main() -> int:
    entries: dict[str, tuple[str, str]] = {}

    for rel, priority in STATIC_PATHS:
        path = ROOT / (rel or "index.html")
        if path.exists():
            entries[f"{BASE_URL}/{rel}"] = (file_date(path), priority)

    for product in PRODUCTS:
        path = ROOT / "products" / product
        if path.exists():
            entries[f"{BASE_URL}/products/{product}"] = (file_date(path), "0.7")

    blog_index = ROOT / "blog" / "index.html"
    if blog_index.exists():
        entries[canonical_for(blog_index)] = (file_date(blog_index), "0.9")

    for path in sorted((ROOT / "blog").glob("*.html")):
        if path.name == "index.html":
            continue
        entries[canonical_for(path)] = (file_date(path), "0.8")

    ET.register_namespace("", "http://www.sitemaps.org/schemas/sitemap/0.9")
    urlset = ET.Element("{http://www.sitemaps.org/schemas/sitemap/0.9}urlset")
    for loc in sorted(entries):
        lastmod, priority = entries[loc]
        add_url(urlset, loc, lastmod, priority)

    tree = ET.ElementTree(urlset)
    ET.indent(tree, space="  ")
    tree.write(ROOT / "sitemap.xml", encoding="UTF-8", xml_declaration=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
