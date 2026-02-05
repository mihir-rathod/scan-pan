"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Trash2, ShoppingCart } from "lucide-react";
import { deleteRecipe } from "@/lib/recipe-actions";

interface Recipe {
    id: number;
    title: string;
    created_at: string;
    instructions: string;
    ingredients?: any;
}

export default function SavedRecipeCard({ recipe }: { recipe: Recipe }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const missing = Array.isArray(recipe.ingredients)
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
        <div className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all ${isDeleting ? 'opacity-50' : ''}`}>
            <div className="p-4 bg-orange-50 border-b border-orange-100 flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-orange-900">{recipe.title}</h3>
                    <p className="text-xs text-orange-600 mt-1">
                        Saved on {new Date(recipe.created_at).toLocaleDateString()}
                    </p>
                </div>
                <button
                    onClick={handleDelete}
                    className="text-orange-300 hover:text-red-500 transition-colors"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            <details className="group border-b border-gray-100">
                <summary className="p-4 cursor-pointer font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between select-none">
                    <span className="flex items-center gap-2">
                        <ShoppingCart size={16} />
                        Ingredients ({missing.length})
                    </span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <ul className="p-4 pt-0 list-disc list-inside bg-gray-50/30 text-sm text-gray-700 space-y-1">
                    {missing.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            </details>

            <details className="group">
                <summary className="p-4 cursor-pointer font-medium text-blue-600 hover:bg-gray-50 flex items-center justify-between select-none">
                    <span>View Instructions</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 prose prose-sm prose-slate max-w-none border-t border-gray-100 bg-gray-50/50">
                    <ReactMarkdown>{recipe.instructions}</ReactMarkdown>
                </div>
            </details>
        </div>
    );
}