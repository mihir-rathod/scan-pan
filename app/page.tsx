import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ScanLine, ChefHat, ShoppingBasket } from "lucide-react";

const FEATURES = [
  {
    icon: ScanLine,
    title: "AI Receipt Scanner",
    description: "Snap a photo of your receipt and AI extracts every item automatically.",
    color: "text-brand-500",
    bg: "bg-brand-50",
  },
  {
    icon: ShoppingBasket,
    title: "Smart Pantry Tracker",
    description: "Track quantities, expiry dates, and categories — never waste food again.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    icon: ChefHat,
    title: "AI Recipe Generator",
    description: "Get creative recipes based on exactly what's in your pantry right now.",
    color: "text-violet-500",
    bg: "bg-violet-50",
  },
];

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If logged in, go straight to the app
  if (session) {
    redirect("/pantry");
  }

  return (
    <div className="min-h-screen gradient-hero text-white">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center px-6 pt-10 pb-8 text-center">
        {/* Floating emoji */}
        <div className="animate-float mb-4">
          <span className="text-5xl drop-shadow-lg">🍳</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight animate-slide-up">
          Scan<span className="text-brand-400">Pan</span>
        </h1>

        <p className="mt-4 text-lg text-stone-300 max-w-sm animate-slide-up delay-1">
          AI Recipe Lab.
          <br />
          Scan receipts. Track pantry. Cook smarter.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-2.5 mt-8 w-full max-w-xs animate-slide-up delay-2">
          <Link
            href="/register"
            className="flex items-center justify-center gap-2 px-8 py-3.5 text-lg font-semibold rounded-2xl gradient-brand text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all btn-press"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/login"
            className="flex items-center justify-center px-8 py-3 text-base font-medium rounded-2xl border border-white/20 text-white/90 hover:bg-white/10 transition-all"
          >
            I have an account
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 pb-20 max-w-lg mx-auto">
        <div className="flex flex-col gap-4">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className={`flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm animate-slide-up delay-${i + 3}`}
            >
              <div className={`p-3 rounded-xl ${feature.bg}`}>
                <feature.icon size={24} className={feature.color} />
              </div>
              <div>
                <h3 className="font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-stone-400 mt-1 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
