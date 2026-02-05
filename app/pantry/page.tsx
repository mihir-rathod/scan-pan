import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import PantryItem from "@/components/PantryItem";
import ClearPantryButton from "@/components/ClearPantryButton";

export default async function PantryPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    const { rows: items } = await db.query(
        "SELECT * FROM pantry_items WHERE user_id = $1 ORDER BY created_at DESC",
        [session.user.id]
    );

    return (
        <div className="p-4 pb-24">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">My Pantry 🍎</h1>
                    <span className="text-sm text-gray-500">{items?.length || 0} items</span>
                </div>
                <div className="flex gap-2 items-center">
                    {items && items.length > 0 && <ClearPantryButton />}
                </div>
            </div>

            <div className="grid gap-4">
                {items?.map((item: any) => (
                    <PantryItem key={item.id} item={item} />
                ))}

                {items?.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                        <p>Your pantry is empty.</p>
                        <p className="text-sm"> Scan a receipt to add items!</p>
                    </div>
                )}
            </div>
        </div>
    );
}