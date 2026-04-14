#!/bin/bash
# Sync OpenClaw workspace data to Obsidian Business vault
# Run manually or via cron: */30 * * * * /path/to/sync-obsidian.sh

WORKSPACE="/Users/fupie/.openclaw/workspace"
OBSIDIAN="$WORKSPACE/Obsidian/Business"

# Sync memory files
echo "Syncing memory files..."
for f in "$WORKSPACE/memory/"*.md; do
  [ -f "$f" ] || continue
  base=$(basename "$f")
  cp "$f" "$OBSIDIAN/Memory/$base"
done

# Sync dream/recall data if present
if [ -f "$WORKSPACE/memory/.dreams/short-term-recall.json" ]; then
  cp "$WORKSPACE/memory/.dreams/short-term-recall.json" "$OBSIDIAN/Memory/short-term-recall.json"
fi

echo "Obsidian sync complete: $(date)"
