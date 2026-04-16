"use client";

import { clearAllRecipes } from "@/lib/recipe-actions";
import { useState } from "react";
import { Trash } from "lucide-react";

export default function ClearRecipesButton() {
    const [loading, setLoading] = useState(false);

    const handleClearAll = async () => {
        if (!confirm("⚠️ Are you sure you want to delete ALL recipes? This cannot be undone.")) return;

        setLoading(true);
        try {
            await clearAllRecipes();
        } catch (e) {
            console.error(e);
            alert("Failed to clear recipes");
        }
        setLoading(false);
    };

    return (
        <button
            id="clear-recipes-btn"
            onClick={handleClearAll}
            disabled={loading}
            className="text-red-400 text-sm font-medium flex items-center gap-1.5 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors"
        >
            <Trash size={13} />
            {loading ? "Clearing..." : "Clear All"}
        </button>
    );
}