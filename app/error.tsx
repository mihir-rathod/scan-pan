"use client";

import { useEffect } from "react";

export default function Error({
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface p-6 text-center">
      <span className="text-7xl mb-6">🔥</span>
      <h1 className="text-3xl font-bold text-stone-900 mb-2">Something went wrong</h1>
      <p className="text-stone-400 mb-8 max-w-xs">
        The kitchen had a small fire. Don&apos;t worry, we can try again.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 rounded-xl gradient-brand text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all btn-press"
      >
        Try Again
      </button>
    </div>
  );
}
