#!/usr/bin/env python3
"""Report missing core SEO/social metadata on blog HTML pages."""

from __future__ import annotations

import argparse
import html.parser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BLOG = ROOT / "blog"

REQUIRED_META = {
    "description": ("name", "description"),
    "og:title": ("property", "og:title"),
    "og:description": ("property", "og:description"),
    "og:url": ("property", "og:url"),
}


class MetadataParser(html.parser.HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.title = ""
        self.in_title = False
        self.canonical = ""
        self.meta: dict[str, str] = {}

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {name: value or "" for name, value in attrs}
        if tag == "title":
            self.in_title = True
        elif tag == "link" and values.get("rel", "").lower() == "canonical":
            self.canonical = values.get("href", "").strip()
        elif tag == "meta":
            for key, (attr_name, attr_value) in REQUIRED_META.items():
                if values.get(attr_name, "").lower() == attr_value:
                    self.meta[key] = values.get("content", "").strip()

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self.in_title = False

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title += data


def audit(path: Path) -> list[str]:
    parser = MetadataParser()
    parser.feed(path.read_text(errors="replace"))
    missing: list[str] = []

    if not parser.title.strip():
        missing.append("title")
    if not parser.canonical:
        missing.append("canonical")
    for key in REQUIRED_META:
        if not parser.meta.get(key):
            missing.append(key)
    return missing


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--quiet", action="store_true", help="Only print pages with issues")
    args = ap.parse_args()

    pages = sorted(BLOG.glob("*.html"))
    issues: dict[Path, list[str]] = {}
    for path in pages:
        missing = audit(path)
        if missing:
            issues[path] = missing

    if not args.quiet:
        print(f"Blog pages scanned: {len(pages)}")
        print(f"Pages with metadata issues: {len(issues)}")

    for path, missing in issues.items():
        print(f"{path.relative_to(ROOT)} -> missing: {', '.join(missing)}")

    return 1 if issues else 0


if __name__ == "__main__":
    raise SystemExit(main())
