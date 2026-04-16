import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SavedRecipeCard from "@/components/SavedRecipeCard";
import ClearRecipesButton from "@/components/ClearRecipesButton";

export default async function SavedRecipesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { rows: recipes } = await db.query(
    "SELECT * FROM saved_recipes WHERE user_id = $1 ORDER BY created_at DESC",
    [session.user.id]
  );

  return (
    <div className="min-h-screen bg-surface p-4 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 animate-slide-down">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">My Cookbook</h1>
          <span className="text-sm text-stone-400">
            {recipes?.length || 0} recipe{recipes?.length !== 1 ? "s" : ""} saved
          </span>
        </div>
        {recipes && recipes.length > 0 && <ClearRecipesButton />}
      </div>

      <div className="grid gap-4">
        {recipes?.map((recipe: any, i: number) => (
          <div key={recipe.id} className={`animate-slide-up delay-${Math.min(i + 1, 6)}`}>
            <SavedRecipeCard recipe={recipe} />
          </div>
        ))}

        {recipes?.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <span className="text-6xl block mb-4 animate-float">📖</span>
            <p className="text-stone-400 font-medium">No recipes saved yet</p>
            <p className="text-sm text-stone-300 mt-1">
              Generate a recipe and save it here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}