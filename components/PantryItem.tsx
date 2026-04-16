"use client";

import { Trash2, Edit2, Check, X } from "lucide-react";
import { deletePantryItem, updatePantryItem } from "@/lib/pantry-actions";
import { useState } from "react";

interface Props {
  item: {
    id: number;
    name: string;
    quantity: string;
    expiry: string | null;
    category?: string | null;
  };
}

function getExpiryStatus(expiry: string | null): "fresh" | "warning" | "expired" | null {
  if (!expiry) return null;
  const now = new Date();
  const expDate = new Date(expiry);
  const diffDays = (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays < 0) return "expired";
  if (diffDays <= 3) return "warning";
  return "fresh";
}

function getExpiryLabel(expiry: string | null): string {
  if (!expiry) return "";
  const now = new Date();
  const expDate = new Date(expiry);
  const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return `Expired ${Math.abs(diffDays)}d ago`;
  if (diffDays === 0) return "Expires today";
  if (diffDays === 1) return "Expires tomorrow";
  if (diffDays <= 7) return `Expires in ${diffDays}d`;
  return new Date(expiry).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const EXPIRY_STYLES = {
  fresh: "bg-emerald-50 text-emerald-700 border-emerald-100",
  warning: "bg-amber-50 text-amber-700 border-amber-100",
  expired: "bg-red-50 text-red-600 border-red-100",
};

const CATEGORY_EMOJI: Record<string, string> = {
  Produce: "🥬",
  Dairy: "🥛",
  Protein: "🥩",
  Grain: "🌾",
  Beverage: "🥤",
  Snack: "🍿",
  Other: "📦",
};

export default function PantryItem({ item }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(item.name);
  const [qty, setQty] = useState(item.quantity);

  const expiryStatus = getExpiryStatus(item.expiry);
  const expiryLabel = getExpiryLabel(item.expiry);
  const categoryEmoji = item.category ? CATEGORY_EMOJI[item.category] || "📦" : null;

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
            {categoryEmoji && (
              <span className="text-xl">{categoryEmoji}</span>
            )}
            <div>
              <h3 className="font-semibold text-stone-900">{item.name}</h3>
              <p className="text-stone-400 text-sm">{item.quantity}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {expiryStatus && (
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium border ${EXPIRY_STYLES[expiryStatus]}`}
              >
                {expiryLabel}
              </span>
            )}

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