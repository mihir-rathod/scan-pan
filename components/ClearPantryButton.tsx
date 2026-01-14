"use client";

import { Trash } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ClearPantryButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClearAll = async () => {
    if (!confirm("⚠️ Are you sure you want to delete ALL items? This cannot be undone.")) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('pantry_items')
      .delete()
      .neq('id', 0);

    if (error) {
      console.error(error);
      alert("Failed to clear pantry");
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleClearAll}
      disabled={loading}
      className="text-red-500 text-sm font-medium flex items-center gap-1 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
    >
      <Trash size={14} />
      {loading ? "Clearing..." : "Clear All"}
    </button>
  );
}