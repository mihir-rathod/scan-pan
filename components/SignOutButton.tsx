"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
    return (
        <button
            id="sign-out-btn"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors cursor-pointer group text-left"
        >
            <span className="font-medium text-red-500 group-hover:text-red-600 transition-colors">
                Sign Out
            </span>
            <div className="p-2 text-stone-400 group-hover:text-red-500 rounded-full transition-colors">
                <LogOut size={18} />
            </div>
        </button>
    );
}
