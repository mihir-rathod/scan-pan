"use client";

import { Plus, X, Check } from "lucide-react";
import { useState } from "react";
import { addSinglePantryItem } from "@/lib/pantry-actions";

export default function AddItemButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiry, setExpiry] = useState("");
  const [category, setCategory] = useState("");

  const CATEGORIES = ["Produce", "Dairy", "Protein", "Grain", "Beverage", "Snack", "Other"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await addSinglePantryItem({
        name: name.trim(),
        quantity: quantity.trim() || "1",
        expiry: expiry || null,
        category: category || null,
      });
      // Reset form
      setName("");
      setQuantity("");
      setExpiry("");
      setCategory("");
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        id="add-item-fab"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full gradient-brand text-white shadow-lg hover:shadow-xl flex items-center justify-center btn-press transition-all hover:-translate-y-0.5"
        style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          {/* Slide-up modal */}
          <div className="w-full max-w-lg bg-white rounded-t-3xl p-6 pb-24 animate-slide-up shadow-elevated">
            {/* Handle bar */}
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 bg-stone-200 rounded-full" />
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-stone-900">Add Item</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1.5">
                  Item Name *
                </label>
                <input
                  id="add-item-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl p-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all"
                  placeholder="e.g. Organic Milk"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1.5">
                    Quantity
                  </label>
                  <input
                    id="add-item-quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full border border-stone-200 rounded-xl p-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all"
                    placeholder="e.g. 1 gal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1.5">
                    Expiry Date
                  </label>
                  <input
                    id="add-item-expiry"
                    type="date"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full border border-stone-200 rounded-xl p-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Category pills */}
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(category === cat ? "" : cat)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        category === cat
                          ? "gradient-brand text-white shadow-sm"
                          : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="add-item-submit"
                type="submit"
                disabled={loading || !name.trim()}
                className="flex items-center justify-center gap-2 gradient-brand text-white font-semibold py-3.5 rounded-xl mt-2 hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg btn-press disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Adding...
                  </span>
                ) : (
                  <>
                    <Check size={18} /> Add to Pantry
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
