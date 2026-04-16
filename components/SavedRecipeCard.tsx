"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Trash2, ShoppingCart, ChevronDown } from "lucide-react";
import { deleteRecipe } from "@/lib/recipe-actions";

interface Recipe {
  id: number;
  title: string;
  description?: string;
  created_at: string;
  instructions: string;
  ingredients?: any;
}

export default function SavedRecipeCard({ recipe }: { recipe: Recipe }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const ingredientsList = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : [];

  const handleDelete = async () => {
    if (!confirm("Remove this recipe from cookbook?")) return;

    setIsDeleting(true);
    try {
      await deleteRecipe(recipe.id);
    } catch (e) {
      alert("Error deleting");
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden card-interactive transition-all ${
        isDeleting ? "opacity-0 scale-95" : ""
      }`}
    >
      {/* Header */}
      <div className="gradient-card p-4 border-b border-brand-100 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-stone-900">{recipe.title}</h3>
          {recipe.description && (
            <p className="text-sm text-stone-500 mt-0.5">{recipe.description}</p>
          )}
          <p className="text-xs text-stone-400 mt-1.5">
            Saved {new Date(recipe.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Ingredients */}
      {ingredientsList.length > 0 && (
        <details className="group border-b border-stone-100">
          <summary className="p-4 cursor-pointer font-medium text-stone-600 hover:bg-stone-50 flex items-center justify-between select-none text-sm">
            <span className="flex items-center gap-2">
              <ShoppingCart size={15} className="text-brand-500" />
              {ingredientsList.length} Ingredients
            </span>
            <ChevronDown
              size={16}
              className="text-stone-400 transition-transform group-open:rotate-180"
            />
          </summary>
          <div className="px-4 pb-4">
            <ul className="grid gap-1">
              {ingredientsList.map((item: string, i: number) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-stone-600"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-300 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </details>
      )}

      {/* Instructions */}
      <details className="group">
        <summary className="p-4 cursor-pointer font-medium text-brand-600 hover:bg-stone-50 flex items-center justify-between select-none text-sm">
          <span>View Instructions</span>
          <ChevronDown
            size={16}
            className="text-stone-400 transition-transform group-open:rotate-180"
          />
        </summary>
        <div className="px-4 pb-4 prose prose-sm prose-stone max-w-none border-t border-stone-50">
          <ReactMarkdown>{recipe.instructions}</ReactMarkdown>
        </div>
      </details>
    </div>
  );
}