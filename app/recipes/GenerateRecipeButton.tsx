"use client";

import { useState } from "react";

export default function GenerateRecipeButton({ ingredients }: { ingredients: string }) {
  const [recipe, setRecipe] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setRecipe(""); // Clear old recipe
    
    try {
      const response = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });
      
      const data = await response.json();
      
      if (data.recipe) {
        setRecipe(data.recipe);
      } else {
        alert("Failed to get a recipe. Try again!");
      }
    } catch (e) {
      console.error(e);
      alert("Error generating recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleGenerate}
        disabled={loading || !ingredients}
        className="w-full bg-black text-white font-bold py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
      >
        {loading ? "Thinking..." : "Generate Recipe 🍳"}
      </button>

      {recipe && (
        <div className="mt-8 p-6 bg-white border rounded-xl shadow-sm prose">
          <h3 className="text-xl font-bold mb-2">Result:</h3>
          <pre className="whitespace-pre-wrap font-sans text-gray-700">{recipe}</pre>
        </div>
      )}
    </div>
  );
}