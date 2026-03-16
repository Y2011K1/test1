"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8">
      <div className="glassmorphism p-12 rounded-3xl border border-white/10 max-w-lg w-full text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-red-500/10 blur-[80px] rounded-full -mt-20 pointer-events-none" />
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-black mb-3 tracking-tight">Something went wrong</h1>
          <p className="text-gray-400 text-sm mb-2 leading-relaxed">
            An unexpected error occurred. The details have been logged.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-gray-600 mb-8">Error ID: {error.digest}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              onClick={reset}
              className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
            >
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </button>
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
