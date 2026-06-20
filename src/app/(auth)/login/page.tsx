"use client";
import { useState } from "react";
import { Fuel, LogIn, Shield } from "lucide-react";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(searchParams?.error || "");

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-950 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-emerald-500/3 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm px-4">
        <div className="text-center mb-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-2xl shadow-emerald-500/20 ring-1 ring-white/10">
            <Fuel className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-[1.75rem] font-bold tracking-tight text-zinc-100">
            SmartFuel <span className="text-emerald-400">Jordan</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1.5 font-medium tracking-wide">
            National Fuel Intelligence Command
          </p>
        </div>

        <div className="glass-panel p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-zinc-100">Welcome back</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Sign in to the command center</p>
            </div>
            <Shield className="h-5 w-5 text-emerald-500/40" />
          </div>

          <form action="/api/v1/auth/login" method="POST" onSubmit={() => setLoading(true)}>
            {error && (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/15 px-3.5 py-2.5 text-xs text-rose-400 flex items-center gap-2 mb-4">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500/20 text-[9px] font-bold">!</span>
                {error}
              </div>
            )}

            <div className="space-y-1.5 mb-4">
              <label className="text-xs text-zinc-400 font-medium">Email</label>
              <input
                name="email"
                type="email"
                placeholder="admin@smartfuel.jo"
                required
                className="flex h-11 w-full rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-3 py-1 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30"
              />
            </div>

            <div className="space-y-1.5 mb-4">
              <label className="text-xs text-zinc-400 font-medium">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="flex h-11 w-full rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-3 py-1 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 h-11 w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold text-black shadow-xl shadow-emerald-500/20 disabled:opacity-50"
            >
              {loading ? "Signing in..." : <><LogIn className="h-4 w-4" /> Sign In</>}
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-3 mt-8">
          <span className="live-dot" />
          <span className="text-[9px] text-zinc-600 tracking-[0.15em] uppercase font-medium">System Online</span>
        </div>
      </div>
    </div>
  );
}
