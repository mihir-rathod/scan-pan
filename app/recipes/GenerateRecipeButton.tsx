"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { RefreshCw, Save, ShoppingCart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function GenerateRecipeButton({ ingredients }: { ingredients: string }) {

  const [recipeData, setRecipeData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    setRecipeData(null);

    try {
      const response = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });

      const data = await response.json();

      if (data.recipe) {
        setRecipeData(data.recipe);
      } else {
        alert("Failed. Try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Error generating recipe");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {

    const { error } = await supabase.from('saved_recipes').insert({
      title: recipeData.title,
      description: recipeData.description,
      instructions: recipeData.instructions,
      created_at: new Date().toISOString(),
      missing_ingredients: recipeData.missing_ingredients
    });
    if (error) {
      alert("Failed to save.");
      console.error(error);
    } else {
      alert("Recipe Saved! 📖");
      router.push('/saved');
    }
  };

  return (
    <div>

      {!recipeData && (
        <button
          onClick={handleGenerate}
          disabled={loading || !ingredients}
          className="w-full bg-black text-white font-bold py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
        >
          {loading ? "Chef is thinking... 👨‍🍳" : "Generate Recipe 🍳"}
        </button>
      )}

      {recipeData && (
        <div className="mt-8 bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="bg-orange-50 p-4 border-b border-orange-100">
            <h3 className="text-xl font-bold text-orange-900">{recipeData.title}</h3>
            <p className="text-sm text-orange-700 mt-1">{recipeData.description}</p>
          </div>

          {recipeData.missing_ingredients?.length > 0 && (
            <div className="bg-yellow-50 p-3 text-sm text-yellow-800 border-b border-yellow-100 flex gap-2 items-start">
              <ShoppingCart size={16} className="mt-0.5" />
              <div>
                <span className="font-semibold">You might need to buy: </span>
                {recipeData.missing_ingredients.join(", ")}
              </div>
            </div>
          )}

          <div className="p-6 prose prose-sm prose-slate max-w-none">
            <ReactMarkdown>{recipeData.markdown}</ReactMarkdown>
          </div>

          <div className="flex border-t divide-x">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 py-4 flex items-center justify-center gap-2 hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
              {loading ? "Cooking..." : "New Recipe"}
            </button>

            <button
              onClick={handleSave}
              className="flex-1 py-4 flex items-center justify-center gap-2 hover:bg-green-50 text-green-600 font-semibold transition-colors"
            >
              <Save size={20} />
              Save This
            </button>
          </div>
        </div>
      )}
    </div>
  );
}