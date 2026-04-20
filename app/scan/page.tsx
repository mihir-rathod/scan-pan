"use client";

import { useState, ChangeEvent } from "react";
import { Camera, Check, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addPantryItems } from "@/lib/pantry-actions";

interface ScannedItem {
  name: string;
  quantity: string;
  expiry: string;
  category?: string;
  selected: boolean;
}

export default function ScanPage() {
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);

  const handleCapture = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setScannedItems([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const compressImage = (dataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Max dimensions for OCR (1600px is usually plenty)
        const MAX_DIM = 1600;
        if (width > height && width > MAX_DIM) {
          height *= MAX_DIM / width;
          width = MAX_DIM;
        } else if (height > MAX_DIM) {
          width *= MAX_DIM / height;
          height = MAX_DIM;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        // 0.7 quality is a good balance for OCR
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = (err) => reject(err);
    });
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    setScannedItems([]);

    try {
      // 1. Compress image first
      const compressedImage = await compressImage(image);

      // 2. Send to API
      const apiResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: compressedImage }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || "Failed to analyze receipt");
      }

      const result = await apiResponse.json();

      if (result.data && Array.isArray(result.data)) {
        setScannedItems(
          result.data.map((item: any) => ({
            ...item,
            selected: true,
          }))
        );
      } else {
        alert("The AI couldn't find items in this photo. Try a clearer close-up of the receipt.");
      }
    } catch (error: any) {
      console.error("Analysis error:", error);
      alert(error.message || "Something went wrong analyzing the receipt.");
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (index: number) => {
    setScannedItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const updateItemField = (index: number, field: keyof ScannedItem, value: string) => {
    setScannedItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddToPantry = async () => {
    const selectedItems = scannedItems.filter((item) => item.selected);
    if (selectedItems.length === 0) return;

    setSaving(true);
    try {
      await addPantryItems(selectedItems);
      router.push("/pantry");
      router.refresh();
    } catch (err) {
      console.error("DB error:", err);
      alert("Failed to save items.");
    } finally {
      setSaving(false);
    }
  };

  const selectedCount = scannedItems.filter((i) => i.selected).length;

  return (
    <div className="min-h-screen bg-surface p-4 pb-24">
      {/* Header */}
      <div className="text-center mb-6 animate-slide-down">
        <h1 className="text-2xl font-bold text-stone-900">Scan Receipt</h1>
        <p className="text-stone-400 text-sm mt-1">
          Snap a photo to auto-fill your pantry
        </p>
      </div>

      {/* Upload Area */}
      {scannedItems.length === 0 && (
        <div className="animate-scale-in">
          <div className="relative w-full max-w-sm mx-auto aspect-[3/4] bg-white rounded-3xl border-2 border-dashed border-stone-200 overflow-hidden shadow-sm">
            {image ? (
              <>
                <img
                  src={image}
                  alt="Receipt Preview"
                  className="w-full h-full object-cover"
                />
                {/* Scan overlay animation */}
                {loading && (
                  <div className="scan-overlay absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg">
                      <Loader2 size={20} className="animate-spin text-brand-500" />
                      <span className="font-medium text-stone-700">
                        Scanning receipt...
                      </span>
                    </div>
                  </div>
                )}
                {/* Retake button */}
                {!loading && (
                  <button
                    onClick={() => {
                      setImage(null);
                      setScannedItems([]);
                    }}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md text-stone-600 hover:bg-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-stone-50 transition-colors">
                <div className="p-5 rounded-full bg-brand-50 mb-4">
                  <Camera size={36} className="text-brand-500" />
                </div>
                <span className="font-semibold text-stone-700">Tap to Snap</span>
                <span className="text-sm text-stone-400 mt-1">
                  or upload a receipt photo
                </span>
                <input
                  id="receipt-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCapture}
                />
              </label>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 w-full max-w-sm mx-auto flex gap-3">
            <Link
              href="/pantry"
              className="flex-1 py-3.5 text-center rounded-2xl font-semibold bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors"
            >
              Cancel
            </Link>

            <button
              id="analyze-receipt-btn"
              onClick={handleAnalyze}
              disabled={!image || loading}
              className={`flex-1 py-3.5 text-center rounded-2xl font-semibold shadow-md transition-all btn-press ${
                image && !loading
                  ? "gradient-brand text-white hover:shadow-lg hover:-translate-y-0.5"
                  : "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
              }`}
            >
              {loading ? "Scanning..." : "Analyze"}
            </button>
          </div>
        </div>
      )}

      {/* Review Step: Scanned Items */}
      {scannedItems.length > 0 && (
        <div className="max-w-sm mx-auto animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-stone-900">
              Found {scannedItems.length} items
            </h2>
            <button
              onClick={() => {
                setScannedItems([]);
                setImage(null);
              }}
              className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
            >
              Scan Again
            </button>
          </div>

          <div className="grid gap-2">
            {scannedItems.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  item.selected
                    ? "bg-white border-brand-200 shadow-sm"
                    : "bg-stone-50 border-stone-100 opacity-50"
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleItem(i)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    item.selected
                      ? "bg-brand-500 border-brand-500 text-white"
                      : "border-stone-300"
                  }`}
                >
                  {item.selected && <Check size={14} strokeWidth={3} />}
                </button>

                {/* Editable name */}
                <input
                  value={item.name}
                  onChange={(e) => updateItemField(i, "name", e.target.value)}
                  className="flex-1 bg-transparent font-medium text-stone-800 focus:outline-none focus:bg-brand-50 rounded-lg px-1 -mx-1 transition-colors"
                />

                {/* Quantity */}
                <input
                  value={item.quantity}
                  onChange={(e) => updateItemField(i, "quantity", e.target.value)}
                  className="w-20 text-right text-sm text-stone-500 bg-transparent focus:outline-none focus:bg-brand-50 rounded-lg px-1 transition-colors"
                />
              </div>
            ))}
          </div>

          {/* Add to pantry button */}
          <button
            id="add-scanned-items-btn"
            onClick={handleAddToPantry}
            disabled={selectedCount === 0 || saving}
            className="w-full mt-6 py-3.5 rounded-2xl font-semibold gradient-brand text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all btn-press disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding...
              </span>
            ) : (
              `Add ${selectedCount} Item${selectedCount !== 1 ? "s" : ""} to Pantry`
            )}
          </button>
        </div>
      )}
    </div>
  );
}