"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

const briefingLines = [
  { prefix: "STRATEGIC", content: "National fuel reserves at 78.4% capacity" },
  { prefix: "ANALYSIS", content: "Amman corridor demand +12% vs forecast" },
  { prefix: "ALERT", content: "Irbid-Zarqa supply chain: reroute recommended" },
  { prefix: "FORECAST", content: "Next 48h: stable distribution, no disruption risk" },
  { prefix: "ACTION", content: "Aqaba port: schedule 3 additional tankers by 22:00" },
];

export function AdvisorTerminal() {
  const [visibleIndex, setVisibleIndex] = useState(-1);

  useEffect(() => {
    const t = setInterval(() => {
      setVisibleIndex((prev) => (prev < briefingLines.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="glass-panel p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/15">
            <Brain className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-zinc-200">AI Cabinet Advisor</h3>
            <p className="text-[9px] text-zinc-500 font-mono">Strategic Briefing Engine</p>
          </div>
        </div>
        <span className="badge-live text-[7px]">ACTIVE</span>
      </div>

      {/* Terminal output */}
      <div className="space-y-1.5">
        {briefingLines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={i <= visibleIndex ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-start gap-2"
          >
            {/* Line number */}
            <span className="text-[9px] text-zinc-700 font-mono w-4 flex-shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Bracket */}
            <span className="text-[9px] text-zinc-600 font-mono flex-shrink-0">[</span>

            {/* Prefix tag */}
            <span className={`text-[9px] font-bold font-mono flex-shrink-0 ${
              line.prefix === "ALERT" ? "text-amber-400" :
              line.prefix === "ACTION" ? "text-emerald-400" :
              line.prefix === "FORECAST" ? "text-sky-400" :
              "text-zinc-400"
            }`}>
              {line.prefix}
            </span>

            {/* Closing bracket */}
            <span className="text-[9px] text-zinc-600 font-mono flex-shrink-0">]</span>

            {/* Content */}
            <span className="text-[10px] text-zinc-300 font-mono leading-relaxed">{line.content}</span>
          </motion.div>
        ))}

        {/* Blinking cursor */}
        {visibleIndex < briefingLines.length - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="flex items-center gap-2"
          >
            <span className="text-[9px] text-zinc-700 font-mono w-4 flex-shrink-0">{String(briefingLines.length + 1).padStart(2, "0")}</span>
            <span className="text-[9px] text-emerald-400 font-mono">▌</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
