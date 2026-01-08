"use client";

import { useState, ChangeEvent } from "react";
import { Camera, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ScanPage() {

    const router = useRouter();

    const [image, setImage] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);

    const handleCapture = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLoading(true);
            
            const url = URL.createObjectURL(file);
            setImage(url);
            setLoading(false);
        }
    };

    const handleAnalyze = async () => {
        if (!image) return;

        alert("Sending to AI... (API not connected yet)");
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-6 pt-12 pb-24">
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Add Receipt 🧾</h1>
        <p className="text-gray-500">Snap a photo or upload to update your pantry.</p>
      </div>
      {/* The Upload Box */}
      <div className="relative w-full max-w-sm aspect-[3/4] bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300 overflow-hidden shadow-sm hover:bg-gray-50 transition-colors">
        
        {/* If image exists, show it. If not, show the 'Tap to Snap' prompt */}
        {image ? (
          <>
             {/* Preview Image */}
             <img src={image} alt="Receipt Preview" className="w-full h-full object-cover" />
             
             {/* 'Retake' Button overlay */}
             <button 
               onClick={() => setImage(null)}
               className="absolute top-4 right-4 bg-white/80 p-2 rounded-full shadow-md text-gray-700 hover:bg-white"
             >
               ✕
             </button>
          </>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
            <div className="bg-white p-6 rounded-full shadow-sm mb-4">
              <Camera size={40} className="text-blue-500" />
            </div>
            <span className="font-semibold text-lg text-gray-700">Tap to Snap</span>
            <span className="text-sm text-gray-400 mt-2">or upload file</span>
            
            {/* Hidden Input field */}
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" // Forces rear camera on mobile
              className="hidden" 
              onChange={handleCapture}
            />
          </label>
        )}
      </div>
      {/* Action Buttons */}
      <div className="mt-8 w-full max-w-sm flex gap-4">
        <Link href="/pantry" className="flex-1 py-4 text-center rounded-2xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
          Cancel
        </Link>
        
        <button 
          onClick={handleAnalyze}
          disabled={!image || loading}
          className={`flex-1 py-4 text-center rounded-2xl font-bold shadow-lg transition-all ${
            image 
              ? "bg-blue-600 text-white hover:bg-blue-700 hover:transform hover:scale-[1.02]" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
          }`}
        >
          {loading ? "Processing..." : "Analyze"}
        </button>
      </div>
    </div>
  );
}