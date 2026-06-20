"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, Zap, Globe, Truck, AlertTriangle, BarChart3, Terminal } from "lucide-react";

const quickActions = [
  { icon: Truck, label: "Fleet Status", action: "Show truck fleet status with current loads" },
  { icon: AlertTriangle, label: "Risk Scan", action: "Run a full national risk scan" },
  { icon: Globe, label: "Zone Report", action: "Show fuel status for all zones" },
  { icon: BarChart3, label: "Predictions", action: "What are the current AI predictions?" },
  { icon: Zap, label: "Emergency", action: "Activate emergency fuel reserve protocol" },
];

export function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { if (isOpen) inputRef.current?.focus(); }, [isOpen]);

  const handleSend = async (text: string) => {
    const msg = text.trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Connection error." }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-200 lg:bottom-6"
      >
        <Bot className="h-5 w-5 text-white" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50" onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed bottom-24 right-4 z-50 w-[380px] max-w-[calc(100vw-32px)] rounded-2xl border border-zinc-700/40 bg-zinc-900/95 backdrop-blur-xl shadow-2xl overflow-hidden lg:bottom-20"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700/40 bg-gradient-to-r from-emerald-500/5 to-transparent">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-200">AI Copilot</h3>
                    <p className="text-[8px] text-zinc-500 font-mono">SmartFuel Command Interface</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 transition-all">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Quick Actions */}
              {messages.length === 0 && (
                <div className="px-4 py-3 border-b border-zinc-800/40">
                  <p className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider mb-2">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {quickActions.map((qa) => (
                      <button
                        key={qa.label}
                        onClick={() => handleSend(qa.action)}
                        className="flex items-center gap-1.5 rounded-lg bg-zinc-800/40 hover:bg-emerald-500/10 border border-zinc-700/30 hover:border-emerald-500/30 px-2 py-1.5 text-[9px] font-medium text-zinc-400 hover:text-emerald-300 transition-all"
                      >
                        <qa.icon className="h-3 w-3 flex-shrink-0" />
                        {qa.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="h-64 overflow-y-auto px-4 py-3 space-y-2">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-xl px-3 py-2 ${msg.role === "user" ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-zinc-800/40 border border-zinc-700/30"}`}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {msg.role === "assistant" && <Terminal className="h-2.5 w-2.5 text-emerald-400" />}
                        <span className="text-[8px] font-semibold uppercase tracking-wider text-zinc-500">{msg.role === "user" ? "You" : "Copilot"}</span>
                      </div>
                      <pre className="font-mono text-[9px] text-zinc-300 whitespace-pre-wrap m-0 leading-relaxed">{msg.content}</pre>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-1.5 px-2 py-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-zinc-700/40">
                <div className="flex items-center gap-2 rounded-xl bg-zinc-800/50 border border-zinc-700/40 px-3 py-2 focus-within:border-emerald-500/30 transition-colors">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                    placeholder="Type a command..."
                    className="flex-1 bg-transparent text-[11px] text-zinc-200 placeholder-zinc-600 outline-none font-mono"
                  />
                  <button onClick={() => handleSend(input)} disabled={!input.trim() || loading} className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 disabled:opacity-30 transition-all">
                    <Send className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
