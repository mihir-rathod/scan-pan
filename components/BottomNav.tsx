"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ScanLine, ChefHat, Book, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/pantry", icon: Home, label: "Pantry" },
  { href: "/scan", icon: ScanLine, label: "Scan" },
  { href: "/recipes", icon: ChefHat, label: "Recipes" },
  { href: "/saved", icon: Book, label: "Saved" },
  { href: "/profile", icon: User, label: "Profile" },
];

// Routes where the bottom nav should be hidden
const HIDDEN_ROUTES = ["/", "/login", "/register"];

export default function BottomNav() {
  const pathname = usePathname();

  // Hide nav on landing, login, and register pages
  if (HIDDEN_ROUTES.includes(pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/20 pb-safe">
      <div className="flex h-16 items-center justify-around max-w-lg mx-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 btn-press ${
                active
                  ? "text-brand-600"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span
                className={`text-[10px] tracking-wide ${
                  active ? "font-semibold" : "font-medium"
                }`}
              >
                {label}
              </span>
              {/* Active indicator dot */}
              {active && (
                <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}