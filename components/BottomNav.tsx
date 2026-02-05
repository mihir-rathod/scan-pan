"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ScanLine, ChefHat, Book, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 w-full border-t border-gray-200 bg-white pb-safe">
      <div className="flex h-16 items-center justify-around">
        <Link
          href="/pantry"
          className={`flex flex-col items-center gap-1 ${isActive('/pantry') ? 'text-black' : 'text-gray-400'}`}
        >
          <Home size={24} />
          <span className="text-xs font-medium">Pantry</span>
        </Link>

        <Link
          href="/scan"
          className={`flex flex-col items-center gap-1 ${isActive('/scan') ? 'text-black' : 'text-gray-400'}`}
        >
          <ScanLine size={24} />
          <span className="text-xs font-medium">Scan</span>
        </Link>

        <Link
          href="/recipes"
          className={`flex flex-col items-center gap-1 ${isActive('/recipes') ? 'text-black' : 'text-gray-400'}`}
        >
          <ChefHat size={24} />
          <span className="text-xs font-medium">Recipes</span>
        </Link>

        <Link
          href="/saved"
          className={`flex flex-col items-center gap-1 ${isActive('/saved') ? 'text-black' : 'text-gray-400'}`}
        >
          <Book size={24} />
          <span className="text-xs font-medium">Saved</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-black' : 'text-gray-400'}`}
        >
          <User size={24} />
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </div>
    </nav>
  );
}