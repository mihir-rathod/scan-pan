"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
    return (
        <button
            id="sign-out-btn"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Sign Out"
        >
            <LogOut size={18} />
        </button>
    );
}
