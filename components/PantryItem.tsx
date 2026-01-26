"use client";

import { Trash2, Edit2, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  item: {
    id: number;
    name: string;
    quantity: string;
    expiry: string | null;
  };
}

export default function PantryItem({ item }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);


  const [name, setName] = useState(item.name);
  const [qty, setQty] = useState(item.quantity);


  const handleDelete = async () => {
    if (!confirm("Delete this item?")) return;
    setIsDeleting(true);
    const { error } = await supabase.from('pantry_items').delete().eq('id', item.id);
    if (!error) router.refresh();
  };


  const handleSave = async () => {

    const { error } = await supabase
      .from('pantry_items')
      .update({ name: name, quantity: qty }) // Update fields
      .eq('id', item.id);

    if (!error) {
      setIsEditing(false);
      router.refresh();
    } else {
      alert("Failed to update");
    }
  };

  return (
    <div className={`p-4 bg-white border rounded-xl shadow-sm transition-all ${isDeleting ? 'opacity-0' : 'opacity-100'}`}>


      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="border p-2 rounded text-lg font-semibold w-full"
            placeholder="Item Name"
          />
          <div className="flex gap-2">
            <input
              value={qty}
              onChange={e => setQty(e.target.value)}
              className="border p-2 rounded text-sm w-1/2"
              placeholder="Quantity"
            />
            {/* Save Button */}
            <button onClick={handleSave} className="bg-green-100 text-green-700 p-2 rounded flex-1 flex justify-center items-center">
              <Check size={18} />
            </button>
            {/* Cancel Button */}
            <button onClick={() => setIsEditing(false)} className="bg-gray-100 text-gray-600 p-2 rounded flex-1 flex justify-center items-center">
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (


        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-gray-500 text-sm">{item.quantity}</p>
          </div>

          <div className="flex items-center gap-2">
            {item.expiry && (
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mr-1">
                {item.expiry}
              </span>
            )}

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full"
            >
              <Edit2 size={18} />
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}