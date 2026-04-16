"use client";

import { registerUser } from "@/lib/actions";
import Link from "next/link";
import { useActionState } from "react";
import { UserPlus } from "lucide-react";

const initialState = { error: "" };

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, initialState);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gradient-warm p-6">
      <div className="w-full max-w-sm animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-5xl">👨‍🍳</span>
          <h1 className="text-3xl font-bold mt-4 text-stone-900">Join ScanPan</h1>
          <p className="text-stone-500 mt-1">Start your smart kitchen journey</p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-stone-100">
          {state.error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-5 text-center font-medium animate-slide-down">
              {state.error}
            </div>
          )}

          <form action={formAction} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Name</label>
              <input
                id="register-name"
                name="name"
                type="text"
                className="w-full border border-stone-200 rounded-xl p-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all"
                required
                placeholder="Chef John"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Email</label>
              <input
                id="register-email"
                name="email"
                type="email"
                className="w-full border border-stone-200 rounded-xl p-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all"
                required
                placeholder="chef@kitchen.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Password</label>
              <input
                id="register-password"
                name="password"
                type="password"
                className="w-full border border-stone-200 rounded-xl p-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all"
                required
                minLength={6}
                placeholder="••••••"
              />
            </div>

            <button
              id="register-submit"
              type="submit"
              className="flex items-center justify-center gap-2 gradient-brand text-white font-semibold py-3.5 rounded-xl mt-1 hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg btn-press"
            >
              <UserPlus size={18} /> Create Account
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-stone-500">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-600 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
