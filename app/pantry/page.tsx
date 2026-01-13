import { supabase } from "@/lib/supabase";
import PantryItem from "@/components/PantryItem";
import ClearPantryButton from "@/components/ClearPantryButton";

interface PantryItem {
    id: number;
    name: string;
    quantity: string;
    expiry: string | null;
}

export default async function PantryPage() {

    // Fetch data from Supabase
    const { data : items, error } = await supabase.from('pantry_items').select('*');

    if (error) {
        return <div className="p-4 text-red-500"> Error loading pantry: {error.message}</div>
    }
    return (
        <div className="p-4 pb-24"> {/* extra padding for bottom nav */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">My Pantry 🍎</h1>
                    <span className="text-sm text-gray-500">{items?.length || 0} items</span>
                </div>
                {/* Only show button if there are items */}
                {items && items.length > 0 && <ClearPantryButton />}
            </div>
            
            <div className="grid gap-4">
                {items?.map((item: any) => (
                    <PantryItem key={item.id} item = {item} />
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