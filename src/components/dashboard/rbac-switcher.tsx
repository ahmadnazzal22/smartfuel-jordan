"use client";
import { motion, LayoutGroup } from "framer-motion";
import { Crown, Building2, User } from "lucide-react";

export type Role = "minister" | "owner" | "citizen";
interface RbacSwitcherProps {
  role: Role;
  onChange: (role: Role) => void;
}

const roles: { id: Role; label: string; icon: typeof Crown }[] = [
  { id: "minister", label: "Minister", icon: Crown },
  { id: "owner", label: "Station Owner", icon: Building2 },
  { id: "citizen", label: "Citizen", icon: User },
];

export function RbacSwitcher({ role, onChange }: RbacSwitcherProps) {
  return (
    <div className="flex items-center gap-1 bg-zinc-900/60 border border-zinc-800/40 rounded-lg p-0.5">
      <LayoutGroup id="rbac">{roles.map((r) => {
        const Icon = r.icon;
        const active = role === r.id;
        return (
          <button
            key={r.id}
            onClick={() => onChange(r.id)}
            className={`relative flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
              active
                ? "text-emerald-300"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {active && (
              <motion.span
                layoutId="rbac-pill"
                className="absolute inset-0 rounded-md bg-emerald-500/10 border border-emerald-500/20"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Icon className="h-3 w-3" />
              {r.label}
            </span>
          </button>
        );
      })}</LayoutGroup>
    </div>
  );
}
