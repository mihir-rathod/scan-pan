import { supabase } from "@/lib/supabase";
import SavedRecipeCard from "@/components/SavedRecipeCard";
import ClearRecipesButton from "@/components/ClearRecipesButton";

export default async function SavedRecipesPage() {
  const { data: recipes } = await supabase.from('saved_recipes').select('*').order('created_at', { ascending: false });

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