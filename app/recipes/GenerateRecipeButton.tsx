"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  RefreshCw, Save, ShoppingCart, ChefHat, Lock, Unlock,
  MessageCircle, X, Send, Loader2,
} from "lucide-react";
import { saveRecipe } from "@/lib/recipe-actions";
import { useRouter } from "next/navigation";

// ── Filter Definitions ────────────────────────────────────────────────────────
const CUISINE_FILTERS = [
  { label: "🇮🇳 Indian", value: "Indian" },
  { label: "🇺🇸 American", value: "American" },
  { label: "🇮🇹 Italian", value: "Italian" },
  { label: "🇲🇽 Mexican", value: "Mexican" },
  { label: "🌊 Mediterranean", value: "Mediterranean" },
  { label: "🇯🇵 Japanese", value: "Japanese" },
  { label: "🇰🇷 Korean", value: "Korean" },
  { label: "🇻🇳 Vietnamese", value: "Vietnamese" },
  { label: "🇨🇳 Chinese", value: "Chinese" },
];

const DIET_FILTERS = [
  { label: "🥗 Vegetarian", value: "Vegetarian" },
  { label: "🌱 Vegan", value: "Vegan" },
  { label: "🍗 Non-Veg", value: "Non-Vegetarian" },
  { label: "🥚 Eggetarian", value: "Eggetarian" },
  { label: "☪️ Halal", value: "Halal" },
];

interface Message {
  role: "user" | "model";
  text: string;
}

export default function GenerateRecipeButton({ ingredients }: { ingredients: string }) {
  const [recipeData, setRecipeData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [strictMode, setStrictMode] = useState(true);
  const router = useRouter();

  // Filter state
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [dietFilter, setDietFilter] = useState("");

  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Track if we've mounted so we don't overwrite session state with initial nulls
  const [isMounted, setIsMounted] = useState(false);

  // Restore state from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("scanpan-recipe-session");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.recipeData) setRecipeData(parsed.recipeData);
        if (parsed.messages) setMessages(parsed.messages);
        if (parsed.cuisineFilter) setCuisineFilter(parsed.cuisineFilter);
        if (parsed.dietFilter) setDietFilter(parsed.dietFilter);
        if (parsed.strictMode !== undefined) setStrictMode(parsed.strictMode);
      }
    } catch (e) {
      console.warn("Failed to load recipe session", e);
    }
    setIsMounted(true);
  }, []);

  // Save state to sessionStorage when it changes
  useEffect(() => {
    if (!isMounted) return; // Prevent overwriting with initial state
    try {
      const sessionState = {
        recipeData,
        messages,
        cuisineFilter,
        dietFilter,
        strictMode
      };
      sessionStorage.setItem("scanpan-recipe-session", JSON.stringify(sessionState));
    } catch (e) {
      console.warn("Failed to save recipe session", e);
    }
  }, [isMounted, recipeData, messages, cuisineFilter, dietFilter, strictMode]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatOpen]);

  // Reset chat when a new recipe is generated
  const handleGenerate = async (
    overrideFilters?: { cuisine?: string; diet?: string }
  ) => {
    const activeCuisine = overrideFilters && overrideFilters.cuisine !== undefined ? overrideFilters.cuisine : cuisineFilter;
    const activeDiet = overrideFilters && overrideFilters.diet !== undefined ? overrideFilters.diet : dietFilter;

    setLoading(true);
    setRecipeData(null);
    setSaved(false);
    setMessages([]);
    setChatOpen(false);

    try {
      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ingredients, 
          strictMode, 
          cuisineFilter: activeCuisine, 
          dietFilter: activeDiet 
        }),
      });

      const data = await response.json();

      if (data.recipe) {
        setRecipeData(data.recipe);
      } else {
        alert(data.error || "Failed. Try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Error generating recipe");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await saveRecipe({
        title: recipeData.title,
        description: recipeData.description,
        instructions: recipeData.instructions,
        all_ingredients: recipeData.all_ingredients,
      });
      setSaved(true);
      setTimeout(() => router.push("/saved"), 800);
    } catch (e) {
      console.error(e);
      alert("Failed to save.");
    }
  };

  const handleSendChat = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed || chatLoading) return;

    const userMessage: Message = { role: "user", text: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          recipeContext: recipeData,
          ingredients,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
        
        // If the chat returned a revised recipe, apply it to the main UI
        if (data.updatedRecipe) {
          setRecipeData(data.updatedRecipe);
          
          // Optional: Add a small system message into the chat that the recipe was updated
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              { role: "model", text: "✨ I've updated the recipe on your screen with those changes!" }
            ]);
          }, 600);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "model", text: "Sorry, I couldn't get a response. Please try again." },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div>
      {/* ── Cuisine Filters ─────────────────────────────────────────────── */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2 px-1">
          Cuisine
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CUISINE_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                const newValue = cuisineFilter === f.value ? "" : f.value;
                setCuisineFilter(newValue);
                if (recipeData) {
                  handleGenerate({ cuisine: newValue });
                }
              }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                cuisineFilter === f.value
                  ? "gradient-brand text-white border-transparent shadow-sm"
                  : "bg-white text-stone-600 border-stone-200 hover:border-brand-300 hover:text-brand-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Diet Filters ─────────────────────────────────────────────────── */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2 px-1">
          Dietary
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {DIET_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                const newValue = dietFilter === f.value ? "" : f.value;
                setDietFilter(newValue);
                if (recipeData) {
                  handleGenerate({ diet: newValue });
                }
              }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                dietFilter === f.value
                  ? "gradient-brand text-white border-transparent shadow-sm"
                  : "bg-white text-stone-600 border-stone-200 hover:border-brand-300 hover:text-brand-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Strict / Flexible Toggle ─────────────────────────────────────── */}
      <div className="mb-5">
        <button
          id="recipe-mode-toggle"
          onClick={() => setStrictMode(!strictMode)}
          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
            strictMode
              ? "bg-brand-50 border-brand-200"
              : "bg-violet-50 border-violet-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {strictMode ? (
              <div className="p-2 bg-brand-100 rounded-xl">
                <Lock size={18} className="text-brand-600" />
              </div>
            ) : (
              <div className="p-2 bg-violet-100 rounded-xl">
                <Unlock size={18} className="text-violet-600" />
              </div>
            )}
            <div className="text-left">
              <p className={`font-semibold text-sm ${strictMode ? "text-brand-800" : "text-violet-800"}`}>
                {strictMode ? "Pantry Only" : "Open Suggestions"}
              </p>
              <p className="text-xs text-stone-400 mt-0.5">
                {strictMode
                  ? "Use only what's in your pantry"
                  : "May suggest 1–2 extra ingredients to buy"}
              </p>
            </div>
          </div>
          {/* Toggle switch */}
          <div
            className={`relative w-11 h-6 rounded-full transition-colors ${
              strictMode ? "bg-brand-400" : "bg-violet-400"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                strictMode ? "left-0.5" : "left-[22px]"
              }`}
            />
          </div>
        </button>
      </div>

      {/* ── Generate Button ──────────────────────────────────────────────── */}
      {!recipeData && (
        <button
          id="generate-recipe-btn"
          onClick={() => handleGenerate()}
          disabled={loading || !ingredients}
          className="w-full py-4 rounded-2xl font-semibold shadow-md transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed gradient-brand text-white hover:shadow-lg hover:-translate-y-0.5 disabled:hover:translate-y-0"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <ChefHat size={22} className="animate-[cooking_0.8s_ease-in-out_infinite]" />
              Chef is cooking...
            </span>
          ) : (
            `Generate Recipe 🍳${cuisineFilter ? ` · ${cuisineFilter}` : ""}${dietFilter ? ` · ${dietFilter}` : ""}`
          )}
        </button>
      )}

      {/* ── Recipe Card ──────────────────────────────────────────────────── */}
      {recipeData && (
        <div className="mt-4 bg-white rounded-2xl shadow-md border border-stone-100 overflow-hidden animate-scale-in">
          {/* Active Filters badge */}
          {(cuisineFilter || dietFilter) && (
            <div className="flex gap-2 px-5 pt-4 flex-wrap">
              {cuisineFilter && (
                <span className="px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full border border-brand-100">
                  {CUISINE_FILTERS.find((f) => f.value === cuisineFilter)?.label}
                </span>
              )}
              {dietFilter && (
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
                  {DIET_FILTERS.find((f) => f.value === dietFilter)?.label}
                </span>
              )}
            </div>
          )}

          {/* Header */}
          <div className="gradient-card p-5 border-b border-brand-100 mt-2">
            <h3 className="text-xl font-bold text-stone-900">{recipeData.title}</h3>
            <p className="text-sm text-stone-500 mt-1">{recipeData.description}</p>
          </div>

          {/* Ingredients */}
          {recipeData.all_ingredients?.length > 0 && (
            <div className="p-5 border-b border-stone-100">
              <h4 className="font-semibold text-stone-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                <ShoppingCart size={16} className="text-brand-500" /> Ingredients
              </h4>
              <ul className="grid gap-1.5">
                {recipeData.all_ingredients.map((item: string, i: number) => {
                  const needToBuy = item.toLowerCase().includes("(need to buy)");
                  return (
                    <li
                      key={i}
                      className={`flex items-center gap-2 text-sm ${
                        needToBuy ? "text-violet-600 font-medium" : "text-stone-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          needToBuy ? "bg-violet-400" : "bg-brand-400"
                        }`}
                      />
                      {item}
                    </li>
                  );
                })}
              </ul>
              {!strictMode &&
                recipeData.all_ingredients.some((item: string) =>
                  item.toLowerCase().includes("(need to buy)")
                ) && (
                  <p className="text-xs text-violet-400 mt-3 flex items-center gap-1">
                    <Unlock size={11} /> Purple items need to be purchased
                  </p>
                )}
            </div>
          )}

          {/* Instructions */}
          <div className="p-5 prose prose-sm prose-stone max-w-none border-b border-stone-100">
            <ReactMarkdown>{recipeData.instructions}</ReactMarkdown>
          </div>

          {/* Actions */}
          <div className="flex border-b border-stone-100">
            <button
              onClick={() => handleGenerate()}
              disabled={loading}
              className="flex-1 py-4 flex items-center justify-center gap-2 hover:bg-stone-50 text-stone-500 transition-colors font-medium"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              {loading ? "Cooking..." : "New Recipe"}
            </button>

            <div className="w-px bg-stone-100" />

            <button
              onClick={handleSave}
              disabled={saved}
              className={`flex-1 py-4 flex items-center justify-center gap-2 font-semibold transition-all ${
                saved ? "bg-emerald-50 text-emerald-600" : "hover:bg-emerald-50 text-emerald-600"
              }`}
            >
              {saved ? <>✓ Saved!</> : <><Save size={18} /> Save This</>}
            </button>
          </div>

          {/* Chat with Chef Button */}
          <button
            onClick={() => setChatOpen(true)}
            className="w-full py-3.5 flex items-center justify-center gap-2.5 text-brand-600 font-semibold hover:bg-brand-50 transition-colors text-sm"
          >
            <MessageCircle size={18} />
            Chat with Chef AI
          </button>
        </div>
      )}

      {/* ── Chat Bottom Sheet ─────────────────────────────────────────────── */}
      {chatOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setChatOpen(false);
          }}
        >
          <div className="w-full max-w-lg bg-white rounded-t-3xl shadow-elevated flex flex-col animate-slide-up"
            style={{ height: "80dvh" }}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="p-2 gradient-brand rounded-xl">
                  <ChefHat size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-stone-900 text-sm">Chef AI</p>
                  <p className="text-xs text-stone-400 truncate max-w-[200px]">
                    {recipeData?.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {/* Welcome message */}
              {messages.length === 0 && (
                <div className="flex gap-2.5 animate-fade-in">
                  <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ChefHat size={14} className="text-white" />
                  </div>
                  <div className="bg-stone-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                    <p className="text-sm text-stone-700">
                      Hi! I'm Chef AI 👋 I know everything about the <strong>{recipeData?.title}</strong> recipe we just created. Ask me anything — substitutions, tips, variations, or how to make it for a specific diet!
                    </p>
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 animate-fade-in ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {msg.role === "model" && (
                    <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChefHat size={14} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm ${
                      msg.role === "user"
                        ? "gradient-brand text-white rounded-tr-sm"
                        : "bg-stone-100 text-stone-700 rounded-tl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {chatLoading && (
                <div className="flex gap-2.5 animate-fade-in">
                  <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center flex-shrink-0">
                    <ChefHat size={14} className="text-white" />
                  </div>
                  <div className="bg-stone-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1 items-center">
                      <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-stone-100 flex gap-2 items-end">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChat();
                  }
                }}
                placeholder="Ask Chef AI anything..."
                className="flex-1 border border-stone-200 rounded-2xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all resize-none"
                disabled={chatLoading}
              />
              <button
                onClick={handleSendChat}
                disabled={!chatInput.trim() || chatLoading}
                className="p-3 gradient-brand text-white rounded-2xl disabled:opacity-40 transition-all hover:-translate-y-0.5 btn-press flex-shrink-0"
              >
                {chatLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}