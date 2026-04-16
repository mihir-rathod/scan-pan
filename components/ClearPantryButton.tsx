"use client";

import { Trash } from "lucide-react";
import { clearAllPantryItems } from "@/lib/pantry-actions";
import { useState } from "react";

export default function ClearPantryButton() {
  const [loading, setLoading] = useState(false);

  const handleClearAll = async () => {
    if (!confirm("⚠️ Are you sure you want to delete ALL items? This cannot be undone.")) return;

    setLoading(true);
    try {
      await clearAllPantryItems();
    } catch (e) {
      console.error(e);
      alert("Failed to clear pantry");
    }
    setLoading(false);
  };

  return (
    <button
      id="clear-pantry-btn"
      onClick={handleClearAll}
      disabled={loading}
      className="text-red-400 text-sm font-medium flex items-center gap-1.5 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors"
    >
      <Trash size={13} />
      {loading ? "Clearing..." : "Clear All"}
    </button>
  );
}