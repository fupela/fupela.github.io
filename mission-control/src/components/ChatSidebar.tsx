"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MessageCircle, X, Send, Loader, ChevronRight } from "lucide-react";

const GW_URL = "ws://localhost:18789";
const GW_TOKEN = "719206aef9469d0804e69ecb5fdd1b1554f60b3bf750e3d3";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  streaming?: boolean;
}

let msgId = 0;
function uid() { return `m${++msgId}-${Date.now()}`; }
let reqId = 0;
function rid() { return `r${++reqId}`; }

export default function ChatSidebar() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<string | null>(null); // id of streaming assistant msg

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    const ws = new WebSocket(`${GW_URL}?token=${GW_TOKEN}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      // Load recent history
      ws.send(JSON.stringify({ id: rid(), method: "chat.history", params: { limit: 20 } }));
    };

    ws.onclose = () => {
      setConnected(false);
      setTimeout(connect, 3000);
    };

    ws.onerror = () => ws.close();

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);

        // History response
        if (data.result?.rows) {
          const rows: ChatMessage[] = data.result.rows
            .filter((r: { role: string; text: string }) => r.text?.trim())
            .map((r: { role: string; text: string; id?: string }) => ({
              id: r.id ?? uid(),
              role: r.role as "user" | "assistant",
              text: r.text,
            }));
          setMessages(rows);
          return;
        }

        // Streaming chat event
        if (data.event === "chat") {
          const row = data.params ?? data.data ?? data;
          if (!row.text) return;

          if (row.role === "assistant") {
            setTyping(false);
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              // Append to existing streaming msg or create new
              if (last?.streaming && last.role === "assistant") {
                return [
                  ...prev.slice(0, -1),
                  { ...last, text: row.text, streaming: row.streaming !== false },
                ];
              }
              return [
                ...prev,
                { id: uid(), role: "assistant", text: row.text, streaming: row.streaming !== false },
              ];
            });
          }

          if (row.role === "user" && row.text?.trim()) {
            setMessages((prev) => {
              // Avoid duplicate if we added it optimistically
              const exists = prev.some((m) => m.role === "user" && m.text === row.text);
              if (exists) return prev;
              return [...prev, { id: uid(), role: "user", text: row.text }];
            });
          }
        }

        // Agent thinking indicator
        if (data.event === "agent" && data.params?.status === "running") {
          setTyping(true);
        }
        if (data.event === "agent" && data.params?.status === "idle") {
          setTyping(false);
          // Mark last streaming msg as done
          setMessages((prev) =>
            prev.map((m, i) =>
              i === prev.length - 1 && m.streaming ? { ...m, streaming: false } : m
            )
          );
        }
      } catch { /* ignore parse errors */ }
    };
  }, []);

  useEffect(() => { connect(); return () => wsRef.current?.close(); }, [connect]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function send() {
    const text = input.trim();
    if (!text || !connected) return;
    setInput("");
    // Optimistic user message
    setMessages((prev) => [...prev, { id: uid(), role: "user", text }]);
    setTyping(true);
    wsRef.current?.send(JSON.stringify({
      id: rid(),
      method: "chat.send",
      params: { text, sessionKey: "agent:main:main" },
    }));
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center gap-1.5 px-2 py-3 rounded-l-lg glass-panel border border-card-border transition-all ${
          open ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{ writingMode: "vertical-rl" }}
      >
        <MessageCircle size={13} className="text-accent rotate-90" />
        <span className="text-[11px] text-muted font-medium">Chat</span>
        <div className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-success" : "bg-muted-2"}`} />
      </button>

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 right-0 h-full z-50 flex flex-col glass-panel border-l border-card-border transition-all duration-300 ease-in-out ${
          open ? "w-[340px] opacity-100" : "w-0 opacity-0 overflow-hidden"
        }`}
      >
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-card-border shrink-0">
          <div className="flex items-center gap-2">
            <MessageCircle size={14} className="text-accent" />
            <span className="text-[13px] font-semibold">Fupie</span>
            <div className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-success animate-pulse" : "bg-muted-2"}`} />
          </div>
          <button onClick={() => setOpen(false)} className="text-muted-2 hover:text-muted transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
              <div className="w-10 h-10 rounded-full bg-accent-subtle flex items-center justify-center">
                <MessageCircle size={18} className="text-accent" />
              </div>
              <p className="text-[12px] text-muted">Ask Fupie anything</p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-[12px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-accent text-white rounded-br-sm"
                    : "glass-panel border border-card-border text-foreground rounded-bl-sm"
                }`}
              >
                {msg.text}
                {msg.streaming && (
                  <span className="inline-block w-1 h-3 bg-accent ml-0.5 animate-pulse rounded-sm" />
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="glass-panel border border-card-border rounded-xl rounded-bl-sm px-3 py-2">
                <div className="flex gap-1 items-center h-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-3 pb-3 pt-2 border-t border-card-border shrink-0">
          <div className="flex gap-2 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Message Fupie…"
              rows={1}
              className="flex-1 resize-none bg-input-bg border border-input-border rounded-lg px-3 py-2 text-[12px] text-foreground placeholder:text-muted-2 focus:outline-none focus:border-accent transition-colors"
              style={{ maxHeight: "120px" }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || !connected}
              className="w-8 h-8 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
            >
              <Send size={13} className="text-white" />
            </button>
          </div>
          <p className="text-[10px] text-muted-2 mt-1.5 text-center">Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </>
  );
}
