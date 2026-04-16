"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { RefreshCw, Save, ShoppingCart, ChefHat, Lock, Unlock } from "lucide-react";
import { saveRecipe } from "@/lib/recipe-actions";
import { useRouter } from "next/navigation";

export default function GenerateRecipeButton({ ingredients }: { ingredients: string }) {
  const [recipeData, setRecipeData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [strictMode, setStrictMode] = useState(true);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    setRecipeData(null);
    setSaved(false);

    try {
      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, strictMode }),
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
      {/* Strict / Flexible Toggle */}
      <div className="mb-5">
        <button
          id="recipe-mode-toggle"
          onClick={() => setStrictMode(!strictMode)}
          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
            strictMode
              ? "bg-brand-50 border-brand-200"
              : "bg-violet-50 border-violet-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {strictMode ? (
              <div className="p-2 bg-brand-100 rounded-xl">
                <Lock size={18} className="text-brand-600" />
              </div>
            ) : (
              <div className="p-2 bg-violet-100 rounded-xl">
                <Unlock size={18} className="text-violet-600" />
              </div>
            )}
            <div className="text-left">
              <p className={`font-semibold text-sm ${strictMode ? "text-brand-800" : "text-violet-800"}`}>
                {strictMode ? "Pantry Only" : "Open Suggestions"}
              </p>
              <p className="text-xs text-stone-400 mt-0.5">
                {strictMode
                  ? "Use only what's in your pantry"
                  : "May suggest 1–2 extra ingredients to buy"}
              </p>
            </div>
          </div>

          {/* Toggle switch */}
          <div
            className={`relative w-11 h-6 rounded-full transition-colors ${
              strictMode ? "bg-brand-400" : "bg-violet-400"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                strictMode ? "left-0.5" : "left-[22px]"
              }`}
            />
          </div>
        </button>
      </div>

      {/* Generate Button */}
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

      {/* Recipe Card */}
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
                {recipeData.all_ingredients.map((item: string, i: number) => {
                  const needToBuy = item.toLowerCase().includes("(need to buy)");
                  return (
                    <li
                      key={i}
                      className={`flex items-center gap-2 text-sm ${
                        needToBuy ? "text-violet-600 font-medium" : "text-stone-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          needToBuy ? "bg-violet-400" : "bg-brand-400"
                        }`}
                      />
                      {item}
                    </li>
                  );
                })}
              </ul>
              {!strictMode && recipeData.all_ingredients.some((item: string) =>
                item.toLowerCase().includes("(need to buy)")
              ) && (
                <p className="text-xs text-violet-400 mt-3 flex items-center gap-1">
                  <Unlock size={11} /> Purple items need to be purchased
                </p>
              )}
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