import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-emerald-500/3 rounded-full blur-[200px] pointer-events-none" />
      <div className="relative text-center space-y-6 animate-fade-in-scale">
        <div className="text-8xl font-mono font-bold text-zinc-800 leading-none tracking-tight">
          4<span className="text-emerald-400/80">0</span>4
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-zinc-300">Page Not Found</h1>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto">
            The page you are looking for does not exist or has been relocated.
          </p>
        </div>
        <Link
          href="/overview"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-5 py-2.5 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
        >
          Return to Command Center
        </Link>
      </div>
    </div>
  );
}
