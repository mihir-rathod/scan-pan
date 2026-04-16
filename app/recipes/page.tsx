import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import GenerateRecipeButton from "./GenerateRecipeButton";
import { redirect } from "next/navigation";

export default async function RecipesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { rows: items } = await db.query(
    "SELECT name FROM pantry_items WHERE user_id = $1",
    [session.user.id]
  );

  const ingredients = items?.map((i: any) => i.name).join(", ") || "";

  return (
    <div className="min-h-screen bg-surface p-4 pb-24">
      {/* Header */}
      <div className="animate-slide-down mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Chef&apos;s Suggestions</h1>
        <p className="text-stone-400 text-sm mt-1">AI-powered recipes from your pantry</p>
      </div>

      {/* Ingredients overview */}
      <div className="animate-slide-up mb-6">
        <div className="gradient-card rounded-2xl p-5 border border-brand-100">
          <h2 className="font-semibold text-brand-800 mb-3 text-sm uppercase tracking-wide">
            Your Ingredients
          </h2>
          {ingredients ? (
            <div className="flex flex-wrap gap-2">
              {items?.map((i: any, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-white rounded-full text-sm font-medium text-stone-600 border border-stone-100 shadow-sm"
                >
                  {i.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-stone-400 text-sm">
              Your pantry is empty — add items to generate recipes.
            </p>
          )}
        </div>
      </div>

      <div className="animate-slide-up delay-1">
        <GenerateRecipeButton ingredients={ingredients} />
      </div>
    </div>
  );
}