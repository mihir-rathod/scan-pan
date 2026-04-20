import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";
import { User, Mail, Calendar, ChefHat, ShoppingBasket } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  // Parallel data fetching for speed
  const [userRes, pantryRes, recipeRes] = await Promise.all([
    db.query("SELECT * FROM users WHERE id = $1", [session.user.id]),
    db.query("SELECT COUNT(*) FROM pantry_items WHERE user_id = $1", [session.user.id]),
    db.query("SELECT COUNT(*) FROM saved_recipes WHERE user_id = $1", [session.user.id]),
  ]);

  const user = userRes.rows[0];
  const pantryCount = parseInt(pantryRes.rows[0].count);
  const recipeCount = parseInt(recipeRes.rows[0].count);

  // Relative time for "member since"
  const joinedDate = new Date(user.created_at);
  const daysSinceJoin = Math.floor(
    (Date.now() - joinedDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const memberSince =
    daysSinceJoin === 0
      ? "Joined today"
      : daysSinceJoin === 1
      ? "Joined yesterday"
      : daysSinceJoin < 30
      ? `Joined ${daysSinceJoin} days ago`
      : `Joined ${joinedDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;

  return (
    <div className="min-h-screen bg-surface p-5 pb-24">
      <h1 className="text-2xl font-bold text-stone-900 mb-6 animate-slide-down">
        Profile
      </h1>

      {/* User Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 mb-5 flex flex-col items-center text-center animate-scale-in">
        {/* Avatar with gradient ring */}
        <div className="p-1 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 mb-4">
          <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center">
            <User size={32} className="text-brand-600" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-stone-900">{user.name}</h2>
        <p className="text-stone-400 mb-2 flex items-center gap-1.5 text-sm mt-1">
          <Mail size={13} /> {user.email}
        </p>
        <div className="text-xs text-stone-400 flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-full">
          <Calendar size={11} /> {memberSince}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center justify-center gap-2 animate-slide-up delay-1">
          <div className="p-2.5 rounded-xl bg-blue-50">
            <ShoppingBasket size={20} className="text-blue-500" />
          </div>
          <span className="text-3xl font-bold text-stone-900 animate-[countUp_0.5s_ease-out_both]">
            {pantryCount}
          </span>
          <span className="text-xs text-stone-400 font-medium">Pantry Items</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center justify-center gap-2 animate-slide-up delay-2">
          <div className="p-2.5 rounded-xl bg-emerald-50">
            <ChefHat size={20} className="text-emerald-500" />
          </div>
          <span className="text-3xl font-bold text-stone-900 animate-[countUp_0.5s_ease-out_0.1s_both]">
            {recipeCount}
          </span>
          <span className="text-xs text-stone-400 font-medium">Saved Recipes</span>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden animate-slide-up delay-3">
        <SignOutButton />
      </div>
    </div>
  );
}
