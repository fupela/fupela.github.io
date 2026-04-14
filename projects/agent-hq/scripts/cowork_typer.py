#!/usr/bin/env python3
"""cowork_typer.py — Types messages into Claude Desktop via AppleScript (macOS)"""
import subprocess, sys, os, time, json
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROMPT_FILE = os.path.join(SCRIPT_DIR, "cowork_prompt.txt")
STATUS_FILE = os.path.join(SCRIPT_DIR, "cowork_status.json")
LOG_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), "logs")

def log(msg):
    os.makedirs(LOG_DIR, exist_ok=True)
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line)
    with open(os.path.join(LOG_DIR,"cowork_typer.log"),"a") as f: f.write(line+"\n")

def write_status(ok, msg=""):
    with open(STATUS_FILE,"w") as f: json.dump({"timestamp":datetime.now().isoformat(),"success":ok,"message":msg},f,indent=2)

def osa(script):
    try:
        r = subprocess.run(["osascript","-e",script], capture_output=True, text=True, timeout=15)
        return r.returncode==0, r.stdout.strip()
    except: return False, "error"

def frontmost():
    ok, out = osa('tell application "System Events" to return name of first application process whose frontmost is true')
    return out if ok else None

def type_message(message):
    # Check Claude running
    ok, out = osa('tell application "System Events" to return (name of processes) contains "Claude"')
    if not (ok and out=="true"):
        log("ERROR: Claude Desktop not running"); write_status(False,"Claude not running"); return False
    # Activate
    osa('tell application "Claude" to activate'); time.sleep(1.5)
    if frontmost() != "Claude":
        time.sleep(1); osa('tell application "Claude" to activate'); time.sleep(1)
        if frontmost() != "Claude":
            log(f"ERROR: Claude not frontmost ({frontmost()})"); write_status(False,"Not frontmost"); return False
    # Copy to clipboard
    p = subprocess.Popen(["pbcopy"], stdin=subprocess.PIPE)
    p.communicate(message.encode("utf-8"))
    if p.returncode != 0:
        log("ERROR: clipboard failed"); write_status(False,"Clipboard failed"); return False
    # Verify focus
    if frontmost() != "Claude":
        log("ERROR: Lost focus"); write_status(False,"Lost focus"); return False
    # Paste and send
    ok, _ = osa('tell application "System Events" to tell process "Claude" to keystroke "v" using command down')
    time.sleep(0.5)
    ok2, _ = osa('tell application "System Events" to tell process "Claude" to keystroke return')
    if ok and ok2:
        log("SUCCESS: Message sent"); write_status(True,"Sent"); return True
    log("ERROR: Paste/send failed"); write_status(False,"Paste failed"); return False

if __name__ == "__main__":
    msg = None
    if len(sys.argv) > 1:
        msg = " ".join(sys.argv[1:]); log(f"Arg message ({len(msg)} chars)")
    elif os.path.exists(PROMPT_FILE):
        with open(PROMPT_FILE) as f: msg = f.read().strip()
        if msg:
            log(f"File message ({len(msg)} chars)")
            with open(PROMPT_FILE,"w") as f: f.write("")
        else: log("ERROR: prompt file empty"); write_status(False,"Empty"); sys.exit(1)
    else: log("ERROR: No message"); write_status(False,"No source"); sys.exit(1)
    sys.exit(0 if type_message(msg) else 1)
