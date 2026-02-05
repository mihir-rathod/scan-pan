"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
                router.push("/"); // Redirect to home on success
                router.refresh();
            }
        } catch (err) {
            setError("Something went wrong");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back 🍳</h1>

                {error && (
                    <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input name="email" type="email" className="w-full border rounded-lg p-2" required placeholder="chef@kitchen.com" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input name="password" type="password" className="w-full border rounded-lg p-2" required placeholder="******" />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-black text-white font-bold py-3 rounded-xl mt-2 hover:scale-[1.02] transition-transform disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Need an account? <Link href="/register" className="text-blue-600 font-medium">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
