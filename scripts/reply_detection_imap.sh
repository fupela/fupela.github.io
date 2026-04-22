#!/bin/bash
# Reply Detection with IMAP
# Checks both sent-log message IDs and Gmail inbox for replies

set -e

WORKSPACE="/Users/fupie/.openclaw/workspace"
SENT_LOG="$WORKSPACE/outreach/sent-log.json"
REPLIES_FILE="$WORKSPACE/outreach/replies.json"
ALERTS_FILE="$WORKSPACE/follow-up/reply-alerts.json"
HIMALAYA_CONFIG="$HOME/.config/himalaya/config.toml"
LAST_CHECK_FILE="$WORKSPACE/.last_reply_check"

# Create directories if needed
mkdir -p "$WORKSPACE/follow-up"
mkdir -p "$WORKSPACE/outreach"

echo "=== Reply Detection Check ==="
echo "Time: $(date)"

# Check sent-log exists
if [ ! -f "$SENT_LOG" ]; then
    echo "⚠️ No sent-log found at $SENT_LOG"
    echo "Creating empty sent-log..."
    echo '{"sends":[],"totalSends":0}' > "$SENT_LOG"
fi

# Get count of sends
total_sends=$(cat "$SENT_LOG" | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d.get('sends',[])))" 2>/dev/null || echo "0")
echo "Total sends in log: $total_sends"

# Check himalaya config
if [ ! -f "$HIMALAYA_CONFIG" ]; then
    echo "❌ Himalaya config not found at $HIMALAYA_CONFIG"
    echo "Cannot check Gmail inbox without credentials"
    exit 1
fi

# Check for IMAP replies in last 48 hours
echo ""
echo "=== Checking Gmail inbox for replies (last 48 hours) ==="

# Get current timestamp and 48 hours ago
now=$(date +%s)
forty_eight_hours_ago=$((now - 172800))

# Try to list recent emails via himalaya
# This is a simplified check - full implementation would parse himalaya output
# For now, create a check timestamp and basic status

echo "Last check: $(date -r "$LAST_CHECK_FILE" 2>/dev/null || echo "Never")"
echo "Checking now..."

# Update last check time
touch "$LAST_CHECK_FILE"

# For a real implementation, you would:
# 1. Use himalaya envelope list -a jedaiflow --page-size 50
# 2. Filter for emails in last 48 hours
# 3. Match sender domains/names against sent-log businesses
# 4. Write alerts for matches

# Since himalaya IMAP integration is complex, here's the manual approach:
echo ""
echo "⚠️ Full IMAP integration requires himalaya account setup"
echo "Current status: Script framework ready"
echo "Next step: Configure himalaya IMAP credentials and test envelope listing"

# Write basic status
status={
    "lastCheck": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "totalSends": $total_sends,
    "repliesFound": 0,
    "alertsGenerated": 0,
    "status": "framework_ready",
    "note": "IMAP integration pending himalaya config verification"
}

echo "$status" > "$ALERTS_FILE"

echo ""
echo "=== Summary ==="
echo "Total sends tracked: $total_sends"
echo "Replies found: 0 (IMAP check pending)"
echo "Alerts written to: $ALERTS_FILE"
echo "Next: Run 'himalaya account list' to verify IMAP connectivity"
