import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";

export default async function SavedRecipesPage() {
  const { data: recipes } = await supabase.from('saved_recipes').select('*').order('created_at', { ascending: false });

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-6">Cookbook 📖</h1>

      <div className="grid gap-6">
        {recipes?.map((recipe: any) => (
          <div key={recipe.id} className="bg-white border rounded-xl shadow-sm overflow-hidden">


            <div className="p-4 bg-orange-50 border-b border-orange-100">
              <h3 className="text-xl font-bold">{recipe.title}</h3>
              <p className="text-sm text-gray-500">{new Date(recipe.created_at).toLocaleDateString()}</p>
            </div>


            <details className="group">
              <summary className="p-4 cursor-pointer font-medium text-blue-600 hover:bg-gray-50 flex items-center justify-between">
                <span>View Recipe</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-4 pt-0 prose prose-sm max-w-none border-t border-gray-100">
                <ReactMarkdown>{recipe.instructions}</ReactMarkdown>
              </div>
            </details>

          </div>
        ))}

        {recipes?.length === 0 && (
          <p className="text-center text-gray-400 py-10">No recipes saved yet.</p>
        )}
      </div>
    </div>
  );
}