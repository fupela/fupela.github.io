#!/usr/bin/env python3
"""bridge_to_telegram.py — Forwards Claude->Fupie bridge messages to Telegram via Bot API (macOS)"""
import json, os, time, urllib.request, urllib.parse
from datetime import datetime

BRIDGE_PATH = os.path.expanduser("~/.openclaw/workspace/projects/agent-hq/mcp-bridge/messages.json")
LOG_DIR = os.path.expanduser("~/.openclaw/workspace/projects/agent-hq/logs")
STATE_FILE = os.path.join(LOG_DIR, "bridge_telegram_state.json")
CONFIG_FILE = os.path.expanduser("~/.openclaw/workspace/projects/agent-hq/scripts/telegram_config.json")
POLL = 10
AGENT = "fupie"
processed = set()

def log(m):
    os.makedirs(LOG_DIR, exist_ok=True)
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {m}"
    print(line)
    with open(os.path.join(LOG_DIR, "bridge_to_telegram.log"), "a") as f:
        f.write(line + "\n")

def load_config():
    """Load bot token and chat ID from config file."""
    if not os.path.exists(CONFIG_FILE):
        log(f"ERROR: Config file not found at {CONFIG_FILE}")
        log("Create it with: {\"bot_token\": \"YOUR_TOKEN\", \"chat_id\": \"YOUR_CHAT_ID\"}")
        return None, None
    try:
        with open(CONFIG_FILE) as f:
            cfg = json.load(f)
        token = cfg.get("bot_token", "").strip()
        chat_id = cfg.get("chat_id", "").strip()
        if not token or not chat_id:
            log("ERROR: bot_token or chat_id missing in config")
            return None, None
        return token, chat_id
    except Exception as e:
        log(f"ERROR: Failed to read config: {e}")
        return None, None

def load_state():
    global processed
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE) as f:
                processed = set(json.load(f).get("processed_ids", []))
        except:
            processed = set()

def save_state():
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    with open(STATE_FILE, "w") as f:
        json.dump({"processed_ids": list(processed)}, f)

def send_telegram(token, chat_id, message):
    """Send message via Telegram Bot API (no external dependencies)."""
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    text = f"[Bridge from Claude]\n{message}"
    data = urllib.parse.urlencode({
        "chat_id": chat_id,
        "text": text,
    }).encode("utf-8")
    try:
        req = urllib.request.Request(url, data=data)
        resp = urllib.request.urlopen(req, timeout=10)
        result = json.loads(resp.read().decode("utf-8"))
        if result.get("ok"):
            log("SUCCESS: Sent via Bot API")
            return True
        else:
            log(f"ERROR: API returned ok=false: {result}")
            return False
    except Exception as e:
        log(f"ERROR: Bot API request failed: {e}")
        return False

def main():
    log("Bridge-to-Telegram daemon starting (Bot API mode)")
    token, chat_id = load_config()
    if not token or not chat_id:
        log("FATAL: Cannot start without valid config. Exiting.")
        return

    load_state()

    # On first run, mark all existing messages as processed
    if not processed and os.path.exists(BRIDGE_PATH):
        try:
            with open(BRIDGE_PATH) as f:
                for m in json.load(f).get("messages", []):
                    processed.add(m.get("id", ""))
            save_state()
            log(f"Marked {len(processed)} existing msgs as processed")
        except:
            pass

    while True:
        try:
            if os.path.exists(BRIDGE_PATH):
                with open(BRIDGE_PATH) as f:
                    data = json.load(f)
                for m in data.get("messages", []):
                    mid = m.get("id", "")
                    if (m.get("to", "").lower() == AGENT and
                        m.get("from", "").lower() == "claude" and
                        mid not in processed):
                        if send_telegram(token, chat_id, m.get("message", "")):
                            processed.add(mid)
                            save_state()
                        time.sleep(1)
        except KeyboardInterrupt:
            save_state()
            break
        except Exception as e:
            log(f"Error: {e}")
        time.sleep(POLL)

if __name__ == "__main__":
    main()
