"use client";

import { Trash2, Edit2, Check, X } from "lucide-react";
import { deletePantryItem, updatePantryItem } from "@/lib/pantry-actions";
import { useState } from "react";

interface Props {
  item: {
    id: number;
    name: string;
    quantity: string;
    category?: string | null;
  };
}

export default function PantryItem({ item }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(item.name);
  const [qty, setQty] = useState(item.quantity);

  const handleDelete = async () => {
    if (!confirm("Delete this item?")) return;
    setIsDeleting(true);
    await deletePantryItem(item.id);
  };

  const handleSave = async () => {
    await updatePantryItem(item.id, name, qty);
    setIsEditing(false);
  };

  return (
    <div
      className={`p-4 bg-white border border-stone-100 rounded-2xl shadow-sm card-interactive transition-all ${
        isDeleting ? "opacity-0 scale-95" : "opacity-100"
      }`}
    >
      {isEditing ? (
        <div className="flex flex-col gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-stone-200 p-2.5 rounded-xl text-base font-semibold w-full focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
            placeholder="Item Name"
          />
          <div className="flex gap-2">
            <input
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="border border-stone-200 p-2.5 rounded-xl text-sm w-1/2 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              placeholder="Quantity"
            />
            <button
              onClick={handleSave}
              className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl flex-1 flex justify-center items-center hover:bg-emerald-100 transition-colors"
            >
              <Check size={18} />
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setName(item.name);
                setQty(item.quantity);
              }}
              className="bg-stone-100 text-stone-500 p-2.5 rounded-xl flex-1 flex justify-center items-center hover:bg-stone-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-semibold text-stone-900">{item.name}</h3>
              <p className="text-stone-400 text-sm">{item.quantity}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-stone-300 hover:text-brand-500 hover:bg-brand-50 rounded-full transition-colors"
            >
              <Edit2 size={16} />
            </button>

            <button
              onClick={handleDelete}
              className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}