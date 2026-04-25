#!/usr/bin/env python3
"""Validate JSON-LD blocks in static HTML files."""

from __future__ import annotations

import argparse
import html.parser
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {".git", ".wrangler", "archive", "node_modules", "projects"}


class JsonLdParser(html.parser.HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.blocks: list[str] = []
        self._capture = False
        self._buffer: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag != "script":
            return
        values = {name.lower(): value or "" for name, value in attrs}
        if values.get("type", "").lower() == "application/ld+json":
            self._capture = True
            self._buffer = []

    def handle_endtag(self, tag: str) -> None:
        if tag == "script" and self._capture:
            self.blocks.append("".join(self._buffer).strip())
            self._capture = False
            self._buffer = []

    def handle_data(self, data: str) -> None:
        if self._capture:
            self._buffer.append(data)


def html_files() -> list[Path]:
    paths: list[Path] = []
    for path in ROOT.rglob("*.html"):
        if any(part in SKIP_DIRS for part in path.relative_to(ROOT).parts):
            continue
        paths.append(path)
    return sorted(paths)


def audit(path: Path) -> list[str]:
    parser = JsonLdParser()
    parser.feed(path.read_text(errors="replace"))
    issues: list[str] = []

    for index, block in enumerate(parser.blocks, start=1):
        if not block:
            issues.append(f"JSON-LD block {index} is empty")
            continue
        try:
            parsed = json.loads(block)
        except json.JSONDecodeError as exc:
            issues.append(f"JSON-LD block {index} invalid JSON: line {exc.lineno}, column {exc.colno}: {exc.msg}")
            continue

        records = parsed if isinstance(parsed, list) else [parsed]
        for record_index, record in enumerate(records, start=1):
            if not isinstance(record, dict):
                issues.append(f"JSON-LD block {index} record {record_index} is not an object")
                continue
            if not record.get("@context"):
                issues.append(f"JSON-LD block {index} record {record_index} missing @context")
            if not record.get("@type"):
                issues.append(f"JSON-LD block {index} record {record_index} missing @type")

    return issues


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--quiet", action="store_true", help="Only print pages with issues")
    args = ap.parse_args()

    pages = html_files()
    pages_with_json_ld = 0
    issues: dict[Path, list[str]] = {}

    for path in pages:
        parser = JsonLdParser()
        parser.feed(path.read_text(errors="replace"))
        if parser.blocks:
            pages_with_json_ld += 1
        page_issues = audit(path)
        if page_issues:
            issues[path] = page_issues

    if not args.quiet:
        print(f"HTML files scanned: {len(pages)}")
        print(f"Pages with JSON-LD: {pages_with_json_ld}")
        print(f"Pages with structured-data issues: {len(issues)}")

    for path, page_issues in issues.items():
        for issue in page_issues:
            print(f"{path.relative_to(ROOT)} -> {issue}")

    return 1 if issues else 0


if __name__ == "__main__":
    raise SystemExit(main())
