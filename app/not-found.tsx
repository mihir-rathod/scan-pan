"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface p-6 text-center">
      <span className="text-7xl mb-6 animate-float">🍽️</span>
      <h1 className="text-3xl font-bold text-stone-900 mb-2">Page Not Found</h1>
      <p className="text-stone-400 mb-8 max-w-xs">
        Looks like this recipe doesn&apos;t exist. Let&apos;s get you back to the kitchen.
      </p>
      <Link
        href="/pantry"
        className="px-6 py-3 rounded-xl gradient-brand text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all btn-press"
      >
        Back to Pantry
      </Link>
    </div>
  );
}
