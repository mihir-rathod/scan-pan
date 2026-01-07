import { supabase } from "@/lib/supabase";

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
                <h1 className="text-2xl font-bold">My Pantry 🍎</h1>
                <span className="text-sm text-gray-500">{items?.length || 0} items</span>
            </div>
            
            <div className="grid gap-4">
                {items?.map((item: PantryItem) => (
                    <div key={item.id} className="flex justify-between items-center p-4 bg-white border rounded-xl shadow-sm">
                        <div>
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <p className="text-gray-500 text-sm">{item.quantity}</p>
                        </div>

                        <div className="text-right">
                            {/*Visual cue for expiry if it exists */}
                            {item.expiry && (
                                <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                                    Exp: {item.expiry}
                                </span>
                            )}
                        </div>
                    </div>
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