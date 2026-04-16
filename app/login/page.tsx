"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gradient-warm p-6">
      <div className="w-full max-w-sm animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-5xl">🍳</span>
          <h1 className="text-3xl font-bold mt-4 text-stone-900">Welcome back</h1>
          <p className="text-stone-500 mt-1">Sign in to your kitchen</p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-stone-100">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-5 text-center font-medium animate-slide-down">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Email</label>
              <input
                id="login-email"
                name="email"
                type="email"
                className="w-full border border-stone-200 rounded-xl p-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all"
                required
                placeholder="chef@kitchen.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-stone-200 rounded-xl p-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all pr-12"
                  required
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 gradient-brand text-white font-semibold py-3.5 rounded-xl mt-1 hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg btn-press disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  <LogIn size={18} /> Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-stone-500">
          New here?{" "}
          <Link href="/register" className="text-brand-600 font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
