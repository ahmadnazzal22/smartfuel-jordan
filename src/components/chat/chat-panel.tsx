"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat, type ChatMessage } from "@/contexts/chat-context";
import { X, Send, Bot, Terminal, ChevronRight, ArrowLeft } from "lucide-react";

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-2">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );
}

interface MessageBubbleProps {
  msg: ChatMessage;
  onAction: (action: string) => void;
  isLatest: boolean;
}

function MessageBubble({ msg, onAction, isLatest }: MessageBubbleProps) {
  const [typingDone, setTypingDone] = useState(!isLatest);
  const [displayedText, setDisplayedText] = useState(isLatest ? "" : msg.content);

  useEffect(() => {
    if (!isLatest || msg.role === "user") {
      setDisplayedText(msg.content);
      setTypingDone(true);
      return;
    }
    setDisplayedText("");
    setTypingDone(false);
    let i = 0;
    const lines = msg.content.split("\n");
    const totalChars = msg.content.length;
    const speed = Math.max(8, Math.min(20, Math.floor(totalChars / 8)));

    const interval = setInterval(() => {
      i++;
      setDisplayedText(msg.content.slice(0, i));
      if (i >= totalChars) {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [msg.content, isLatest, msg.role]);

  if (msg.role === "user") {
    return (
      <div className="flex justify-end mb-3">
        <div className="max-w-[80%] rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2.5">
          <p className="text-xs text-zinc-200 whitespace-pre-wrap">{msg.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <div className="flex items-start gap-2.5">
        {/* Terminal marker */}
        <div className="flex-shrink-0 mt-1">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-zinc-800/60 border border-zinc-700/40">
            <Terminal className="h-3 w-3 text-emerald-400" />
          </div>
        </div>

        {/* Bubble */}
        <div className="flex-1 min-w-0">
          <div className="rounded-xl bg-zinc-900/90 border border-zinc-700/40 px-3.5 py-2.5 shadow-lg">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[9px] font-semibold text-emerald-400 uppercase tracking-wider">Advisor</span>
              <span className="text-[7px] text-zinc-600 font-mono">
                {msg.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <pre className="font-mono text-[10px] leading-relaxed text-zinc-300 whitespace-pre-wrap m-0">
              {displayedText}
              {!typingDone && <span className="inline-block w-1.5 h-3.5 bg-emerald-400 ml-0.5 animate-pulse" />}
            </pre>
          </div>

          {/* Action buttons — show only after typing is done */}
          {typingDone && msg.actions && msg.actions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1.5 ml-1">
              {msg.actions.map((a) => (
                <button
                  key={a.action}
                  onClick={() => onAction(a.action)}
                  className="inline-flex items-center gap-1 rounded-md bg-zinc-800/60 border border-zinc-700/40 hover:border-emerald-500/30 hover:bg-emerald-500/5 px-2 py-1 text-[9px] font-semibold text-zinc-400 hover:text-emerald-300 transition-all"
                >
                  <ChevronRight className="h-2.5 w-2.5" />
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ChatPanel() {
  const { messages, isOpen, sendMessage, executeAction, close, loading } = useChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={close}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] z-50 flex flex-col"
            style={{ backdropFilter: "blur(24px)" }}
          >
            {/* Glass background layers */}
            <div className="absolute inset-0 bg-zinc-900/85 border-l border-zinc-700/40" />
            <div className="absolute inset-0 backdrop-blur-xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.02] to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative flex flex-col h-full z-10">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-700/40">
                <div className="flex items-center gap-2.5">
                  {/* Mobile back button */}
                  <button
                    onClick={close}
                    className="flex sm:hidden h-11 w-11 items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 transition-all"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15">
                    <Bot className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-200">AI Cabinet Advisor</h3>
                    <p className="text-[8px] text-zinc-500 font-mono">Strategic Briefing Engine · Online</p>
                  </div>
                </div>
                <button
                  onClick={close}
                  className="hidden sm:flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 transition-all"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {messages.map((msg, i) => (
                  <MessageBubble
                    key={msg.id}
                    msg={msg}
                    onAction={executeAction}
                    isLatest={i === messages.length - 1}
                  />
                ))}
                {loading && (
                  <div className="flex items-center gap-1.5 px-2 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="text-[9px] text-zinc-500 font-mono ml-1">Querying database...</span>
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
                    onKeyDown={handleKeyDown}
                    placeholder="Type a command..."
                    className="flex-1 bg-transparent text-xs text-zinc-200 placeholder-zinc-600 outline-none font-mono"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
