"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { RefreshCw, Save, ShoppingCart, ChefHat } from "lucide-react";
import { saveRecipe } from "@/lib/recipe-actions";
import { useRouter } from "next/navigation";

export default function GenerateRecipeButton({ ingredients }: { ingredients: string }) {
  const [recipeData, setRecipeData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    setRecipeData(null);
    setSaved(false);

    try {
      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    try {
      await saveRecipe({
        title: recipeData.title,
        description: recipeData.description,
        instructions: recipeData.instructions,
        all_ingredients: recipeData.all_ingredients,
      });
      setSaved(true);
      setTimeout(() => router.push("/saved"), 800);
    } catch (e) {
      console.error(e);
      alert("Failed to save.");
    }
  };

  return (
    <div>
      {!recipeData && (
        <button
          id="generate-recipe-btn"
          onClick={handleGenerate}
          disabled={loading || !ingredients}
          className="w-full py-4 rounded-2xl font-semibold shadow-md transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed gradient-brand text-white hover:shadow-lg hover:-translate-y-0.5 disabled:hover:translate-y-0"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <ChefHat size={22} className="animate-[cooking_0.8s_ease-in-out_infinite]" />
              Chef is cooking...
            </span>
          ) : (
            "Generate Recipe 🍳"
          )}
        </button>
      )}

      {recipeData && (
        <div className="mt-4 bg-white rounded-2xl shadow-md border border-stone-100 overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="gradient-card p-5 border-b border-brand-100">
            <h3 className="text-xl font-bold text-stone-900">{recipeData.title}</h3>
            <p className="text-sm text-stone-500 mt-1">{recipeData.description}</p>
          </div>

          {/* Ingredients */}
          {recipeData.all_ingredients?.length > 0 && (
            <div className="p-5 border-b border-stone-100">
              <h4 className="font-semibold text-stone-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                <ShoppingCart size={16} className="text-brand-500" /> Ingredients
              </h4>
              <ul className="grid gap-1.5">
                {recipeData.all_ingredients.map((item: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-stone-600"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions */}
          <div className="p-5 prose prose-sm prose-stone max-w-none">
            <ReactMarkdown>{recipeData.instructions}</ReactMarkdown>
          </div>

          {/* Actions */}
          <div className="flex border-t border-stone-100">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 py-4 flex items-center justify-center gap-2 hover:bg-stone-50 text-stone-500 transition-colors font-medium"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
              {loading ? "Cooking..." : "New Recipe"}
            </button>

            <div className="w-px bg-stone-100" />

            <button
              onClick={handleSave}
              disabled={saved}
              className={`flex-1 py-4 flex items-center justify-center gap-2 font-semibold transition-all ${
                saved
                  ? "bg-emerald-50 text-emerald-600"
                  : "hover:bg-emerald-50 text-emerald-600"
              }`}
            >
              {saved ? (
                <>✓ Saved!</>
              ) : (
                <>
                  <Save size={18} /> Save This
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}