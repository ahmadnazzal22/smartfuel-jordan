"use client";
import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center h-64 text-zinc-500 space-y-3">
          <div className="text-3xl">⚠️</div>
          <p className="text-sm font-medium">Something went wrong</p>
          <p className="text-xs text-zinc-600 max-w-xs text-center">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="text-xs text-emerald-400 hover:underline mt-2"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
