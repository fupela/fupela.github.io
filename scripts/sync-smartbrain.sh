#!/bin/bash
# Bi-directional sync: SmartBrain Obsidian vault <-> GitHub
set -e

VAULT_DIR="$(cd "$(dirname "$0")/.." && pwd)/Obsidian/SmartBrain"

if [ ! -d "$VAULT_DIR/.git" ]; then
  echo "SmartBrain vault not found at $VAULT_DIR"
  exit 1
fi

cd "$VAULT_DIR"

# Pull remote changes first (from other computer)
git pull --no-rebase origin main 2>&1

# Sync Notion pages into Notion-Sync/
python3 "$(dirname "$0")/notion-to-obsidian.py" 2>&1 | tail -3

# Stage and push any local changes OpenClaw made
if ! git diff --quiet || ! git diff --cached --quiet || [ -n "$(git ls-files --others --exclude-standard)" ]; then
  git add -A
  git commit -m "OpenClaw sync: $(date '+%Y-%m-%d %H:%M')"
  git push origin main 2>&1
  echo "SmartBrain: local changes pushed at $(date)"
else
  echo "SmartBrain: already up to date at $(date)"
fi
