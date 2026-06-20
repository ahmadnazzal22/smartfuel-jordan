"use client";
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface ChatAction {
  label: string;
  action: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: ChatAction[];
  timestamp: Date;
}

interface ChatContextType {
  messages: ChatMessage[];
  isOpen: boolean;
  sendMessage: (text: string) => void;
  executeAction: (action: string) => void;
  toggle: () => void;
  open: () => void;
  close: () => void;
  loading: boolean;
}

const ChatContext = createContext<ChatContextType | null>(null);

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Strategic Briefing Engine initialized.\nConnected to National Fuel Database.\n\nAsk me about: trucks, stations, risk, fuel inventory, zone status, or alerts.",
    actions: [
      { label: "Fleet Status", action: "fleet_status" },
      { label: "Risk Overview", action: "risk_overview" },
      { label: "Active Alerts", action: "active_alerts" },
    ],
    timestamp: new Date(),
  },
];

function generateId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

const actionMap: Record<string, string> = {
  fleet_status: "Show me the truck fleet status",
  risk_overview: "What is the current risk situation?",
  active_alerts: "Show active alerts",
  station_status: "Show station network status",
  fuel_inventory: "What is the fuel inventory?",
  zone_amman: "Show me zone Amman",
  zone_irbid: "Show me zone Irbid",
  zone_zarqa: "Show me zone Zarqa",
  zone_aqaba: "Show me zone Aqaba",
};

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallback: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "⚠️ Connection error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallback]);
    }
    setLoading(false);
  }, []);

  const executeAction = useCallback((action: string) => {
    const cmd = actionMap[action] || action;
    sendMessage(cmd);
  }, [sendMessage]);

  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ChatContext.Provider value={{ messages, isOpen, sendMessage, executeAction, toggle, open, close, loading }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
