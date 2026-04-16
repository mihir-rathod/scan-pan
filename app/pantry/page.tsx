import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import PantryItem from "@/components/PantryItem";
import ClearPantryButton from "@/components/ClearPantryButton";
import AddItemButton from "@/components/AddItemButton";
import ExpiryBanner from "@/components/ExpiryBanner";
import { Search } from "lucide-react";

export default async function PantryPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const { rows: items } = await db.query(
    "SELECT * FROM pantry_items WHERE user_id = $1 ORDER BY created_at DESC",
    [session.user.id]
  );

  // Compute items expiring within 3 days
  const now = new Date();
  const expiringItems = items?.filter((item: any) => {
    if (!item.expiry) return false;
    const expDate = new Date(item.expiry);
    const diffDays = (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 3 && diffDays >= 0;
  }) || [];

  const expiredItems = items?.filter((item: any) => {
    if (!item.expiry) return false;
    const expDate = new Date(item.expiry);
    return expDate.getTime() < now.getTime();
  }) || [];

  return (
    <div className="min-h-screen bg-surface p-4 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 animate-slide-down">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">My Pantry</h1>
          <span className="text-sm text-stone-400">
            {items?.length || 0} item{items?.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          {items && items.length > 0 && <ClearPantryButton />}
        </div>
      </div>

      {/* Expiry Banner */}
      {(expiringItems.length > 0 || expiredItems.length > 0) && (
        <ExpiryBanner expiringCount={expiringItems.length} expiredCount={expiredItems.length} />
      )}

      {/* Items List */}
      <div className="grid gap-3 mt-4">
        {items?.map((item: any, i: number) => (
          <div key={item.id} className={`animate-slide-up delay-${Math.min(i + 1, 6)}`}>
            <PantryItem item={item} />
          </div>
        ))}

        {items?.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <span className="text-6xl block mb-4 animate-float">🧺</span>
            <p className="text-stone-400 font-medium">Your pantry is empty</p>
            <p className="text-sm text-stone-300 mt-1">
              Scan a receipt or tap + to add items
            </p>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <AddItemButton />
    </div>
  );
}