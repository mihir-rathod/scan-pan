"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Trash2, ShoppingCart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Recipe {
  id: number;
  title: string;
  created_at: string;
  instructions: string;
  missing_ingredients?: any;
}

export default function SavedRecipeCard({ recipe }: { recipe: Recipe }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const missing = Array.isArray(recipe.missing_ingredients) 
    ? recipe.missing_ingredients 
    : [];

  const handleDelete = async () => {
    if(!confirm("Remove this recipe from cookbook?")) return;
    
    setIsDeleting(true);
    const { error } = await supabase.from('saved_recipes').delete().eq('id', recipe.id);
    
    if (error) {
        alert("Error deleting");
        setIsDeleting(false);
    } else {
        router.refresh();
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

        {missing.length > 0 && (
             <div className="bg-yellow-50 p-3 text-xs text-yellow-800 border-b border-yellow-100 flex gap-2 items-start">
                 <ShoppingCart size={14} className="mt-0.5 shrink-0" />
                 <div>
                     <span className="font-bold">Shopping List: </span>
                     {missing.join(", ")}
                 </div>
             </div>
        )}

        <details className="group">
            <summary className="p-4 cursor-pointer font-medium text-blue-600 hover:bg-gray-50 flex items-center justify-between select-none">
                <span>View Instructions</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-0 prose prose-sm max-w-none border-t border-gray-100 bg-gray-50/50">
                <ReactMarkdown>{recipe.instructions}</ReactMarkdown>
            </div>
        </details>
    </div>
  );
}