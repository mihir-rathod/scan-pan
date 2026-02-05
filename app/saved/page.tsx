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
    <div className="p-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cookbook 📖</h1>
        {recipes && recipes.length > 0 && <ClearRecipesButton />}
      </div>

      <div className="grid gap-6">
        {recipes?.map((recipe: any) => (
          <SavedRecipeCard key={recipe.id} recipe={recipe} />
        ))}

        {recipes?.length === 0 && (
          <p className="text-center text-gray-400 py-10">No recipes saved yet.</p>
        )}
      </div>
    </div>
  );
}