#!/usr/bin/env python3
"""
Notion → Obsidian sync
Fetches all pages from John's Notion workspace and writes them as Markdown
into Obsidian/SmartBrain/Notion-Sync/
"""

import os, sys, json, re, time
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.error import HTTPError

NOTION_TOKEN = "ntn_M1720116062aaaJuaVxFtl3LrtttBm9KrTLDkChyaxAdVi"
NOTION_VERSION = "2022-06-28"
SCRIPT_DIR = Path(__file__).parent
VAULT_DIR = SCRIPT_DIR.parent / "Obsidian" / "SmartBrain" / "Notion-Sync"

def notion_request(path, method="GET", body=None):
    url = f"https://api.notion.com/v1{path}"
    headers = {
        "Authorization": f"Bearer {NOTION_TOKEN}",
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
    }
    data = json.dumps(body).encode() if body else None
    req = Request(url, data=data, headers=headers, method=method)
    try:
        with urlopen(req, timeout=30) as resp:
            return json.loads(resp.read())
    except HTTPError as e:
        print(f"  API error {e.code} for {path}: {e.read().decode()[:200]}")
        return None

def rich_text_to_md(rich_texts):
    out = ""
    for rt in rich_texts:
        text = rt.get("plain_text", "")
        ann = rt.get("annotations", {})
        if ann.get("code"):        text = f"`{text}`"
        if ann.get("bold"):        text = f"**{text}**"
        if ann.get("italic"):      text = f"*{text}*"
        if ann.get("strikethrough"): text = f"~~{text}~~"
        href = rt.get("href")
        if href:                   text = f"[{text}]({href})"
        out += text
    return out

def blocks_to_md(blocks, depth=0):
    lines = []
    indent = "  " * depth
    for b in blocks:
        btype = b.get("type", "")
        content = b.get(btype, {})

        if btype in ("paragraph",):
            text = rich_text_to_md(content.get("rich_text", []))
            lines.append(f"{indent}{text}" if text else "")

        elif btype.startswith("heading_"):
            level = int(btype[-1])
            text = rich_text_to_md(content.get("rich_text", []))
            lines.append(f"{'#' * level} {text}")

        elif btype == "bulleted_list_item":
            text = rich_text_to_md(content.get("rich_text", []))
            lines.append(f"{indent}- {text}")

        elif btype == "numbered_list_item":
            text = rich_text_to_md(content.get("rich_text", []))
            lines.append(f"{indent}1. {text}")

        elif btype == "to_do":
            text = rich_text_to_md(content.get("rich_text", []))
            checked = "x" if content.get("checked") else " "
            lines.append(f"{indent}- [{checked}] {text}")

        elif btype == "toggle":
            text = rich_text_to_md(content.get("rich_text", []))
            lines.append(f"{indent}> **{text}**")

        elif btype == "quote":
            text = rich_text_to_md(content.get("rich_text", []))
            lines.append(f"{indent}> {text}")

        elif btype == "callout":
            text = rich_text_to_md(content.get("rich_text", []))
            emoji = content.get("icon", {}).get("emoji", "")
            lines.append(f"{indent}> {emoji} {text}")

        elif btype == "code":
            lang = content.get("language", "")
            text = rich_text_to_md(content.get("rich_text", []))
            lines.append(f"```{lang}\n{text}\n```")

        elif btype == "divider":
            lines.append("---")

        elif btype == "image":
            url = content.get("file", {}).get("url") or content.get("external", {}).get("url", "")
            caption = rich_text_to_md(content.get("caption", []))
            lines.append(f"![{caption}]({url})")

        elif btype == "table_row":
            cells = [rich_text_to_md(c) for c in content.get("cells", [])]
            lines.append("| " + " | ".join(cells) + " |")

        elif btype == "child_page":
            title = content.get("title", "")
            lines.append(f"[[{title}]]")

        elif btype == "bookmark":
            url = content.get("url", "")
            caption = rich_text_to_md(content.get("caption", []))
            lines.append(f"[{caption or url}]({url})")

        # Recurse into children if present
        if b.get("has_children"):
            children = fetch_blocks(b["id"])
            if children:
                child_md = blocks_to_md(children, depth + 1)
                if child_md.strip():
                    lines.append(child_md)

    return "\n".join(lines)

def fetch_blocks(block_id):
    blocks = []
    cursor = None
    while True:
        path = f"/blocks/{block_id}/children?page_size=100"
        if cursor:
            path += f"&start_cursor={cursor}"
        data = notion_request(path)
        if not data:
            break
        blocks.extend(data.get("results", []))
        if data.get("has_more"):
            cursor = data.get("next_cursor")
        else:
            break
    return blocks

def get_page_title(page):
    props = page.get("properties", {})
    for k, v in props.items():
        if v.get("type") == "title":
            parts = v.get("title", [])
            if parts:
                return "".join(t.get("plain_text", "") for t in parts)
    return page.get("id", "untitled")

def safe_filename(title):
    title = re.sub(r'[<>:"/\\|?*\x00-\x1f]', '', title)
    title = title.strip('. ')
    return title[:120] or "Untitled"

def fetch_all_pages():
    pages = []
    cursor = None
    while True:
        body = {"filter": {"value": "page", "property": "object"}, "page_size": 100}
        if cursor:
            body["start_cursor"] = cursor
        data = notion_request("/search", method="POST", body=body)
        if not data:
            break
        pages.extend(data.get("results", []))
        if data.get("has_more"):
            cursor = data.get("next_cursor")
        else:
            break
    return pages

def sync():
    VAULT_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Fetching Notion pages...")
    pages = fetch_all_pages()
    print(f"Found {len(pages)} pages")

    synced, skipped, errors = 0, 0, 0

    for page in pages:
        title = get_page_title(page)
        if not title or title == page["id"]:
            skipped += 1
            continue

        filename = safe_filename(title) + ".md"
        filepath = VAULT_DIR / filename

        try:
            blocks = fetch_blocks(page["id"])
            md_body = blocks_to_md(blocks)

            # Build frontmatter
            notion_url = page.get("url", "")
            last_edited = page.get("last_edited_time", "")
            frontmatter = f"---\nnotion_id: {page['id']}\nnotion_url: {notion_url}\nlast_synced: {time.strftime('%Y-%m-%d %H:%M')}\nlast_edited: {last_edited}\n---\n\n"

            content = frontmatter + f"# {title}\n\n" + md_body
            filepath.write_text(content, encoding="utf-8")
            synced += 1
            print(f"  ✓ {title[:60]}")
            time.sleep(0.15)  # stay within Notion rate limits

        except Exception as e:
            print(f"  ✗ {title[:50]}: {e}")
            errors += 1

    print(f"\nDone: {synced} synced, {skipped} skipped, {errors} errors")
    print(f"Output: {VAULT_DIR}")

if __name__ == "__main__":
    sync()
