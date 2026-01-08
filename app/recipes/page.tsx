import { supabase } from "@/lib/supabase";
// We need a clear button to test the generation
import GenerateRecipeButton from "./GenerateRecipeButton";

export default async function RecipesPage() {
  const { data: items } = await supabase.from('pantry_items').select('name');

  // Convert array of objects to simple string list: "Eggs, Milk, Bread"
  const ingredients = items?.map(i => i.name).join(", ") || "";

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-4">Chef's Suggestions 👨‍🍳</h1>
      
      <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-6">
        <h2 className="font-semibold text-orange-800 mb-2">Based on your pantry:</h2>
        <p className="text-gray-600 text-sm">{ingredients || "No ingredients found."}</p>
      </div>

      <GenerateRecipeButton ingredients={ingredients} />
    </div>
  );
}