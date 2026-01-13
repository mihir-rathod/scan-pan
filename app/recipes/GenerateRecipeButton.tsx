"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function GenerateRecipeButton({ ingredients }: { ingredients: string }) {
  const [recipe, setRecipe] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setRecipe(""); 
    
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
        <div className="mt-8 p-6 bg-white border rounded-xl shadow-sm">
          <h3 className="text-xl font-bold mb-4 border-b pb-2">Chef's Suggestion:</h3>
          
          <div className="prose prose-sm prose-slate max-w-none">
             <ReactMarkdown>{recipe}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}