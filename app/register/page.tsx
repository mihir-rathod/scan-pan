"use client";

import { registerUser } from "@/lib/actions";
import Link from "next/link";
import { useActionState } from "react";

export default function RegisterPage() {
    // Basic form handling
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center">Join ScanPan 🍳</h1>

                <form action={registerUser} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input name="name" type="text" className="w-full border rounded-lg p-2" required placeholder="Chef John" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input name="email" type="email" className="w-full border rounded-lg p-2" required placeholder="chef@kitchen.com" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input name="password" type="password" className="w-full border rounded-lg p-2" required minLength={6} placeholder="******" />
                    </div>

                    <button type="submit" className="bg-black text-white font-bold py-3 rounded-xl mt-2 hover:scale-[1.02] transition-transform">
                        Sign Up
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account? <Link href="/api/auth/signin" className="text-blue-600 font-medium">Log In</Link>
                </p>
            </div>
        </div>
    );
}
