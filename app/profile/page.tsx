import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton"; // Resusing the button logic, but we might style it differently
import { User, Mail, Calendar, ChefHat, ShoppingBasket } from "lucide-react";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    // Parallel data fetching for speed
    const userPromise = db.query("SELECT * FROM users WHERE id = $1", [session.user.id]);
    const pantryCountPromise = db.query("SELECT COUNT(*) FROM pantry_items WHERE user_id = $1", [session.user.id]);
    const recipeCountPromise = db.query("SELECT COUNT(*) FROM saved_recipes WHERE user_id = $1", [session.user.id]);

    const [userRes, pantryRes, recipeRes] = await Promise.all([
        userPromise,
        pantryCountPromise,
        recipeCountPromise
    ]);

    const user = userRes.rows[0];
    const pantryCount = pantryRes.rows[0].count;
    const recipeCount = recipeRes.rows[0].count;

    return (
        <div className="p-6 pb-24 min-h-screen bg-gray-50">
            <h1 className="text-2xl font-bold mb-6">My Profile 👤</h1>

            {/* User Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border mb-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4">
                    <User size={32} />
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-500 mb-4 flex items-center gap-1 text-sm">
                    <Mail size={14} /> {user.email}
                </p>

                <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={12} /> Joined {new Date(user.created_at).toLocaleDateString()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col items-center justify-center gap-2">
                    <div className="bg-blue-50 p-2 rounded-full text-blue-600">
                        <ShoppingBasket size={20} />
                    </div>
                    <span className="text-2xl font-bold">{pantryCount}</span>
                    <span className="text-xs text-gray-500">Pantry Items</span>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col items-center justify-center gap-2">
                    <div className="bg-green-50 p-2 rounded-full text-green-600">
                        <ChefHat size={20} />
                    </div>
                    <span className="text-2xl font-bold">{recipeCount}</span>
                    <span className="text-xs text-gray-500">Saved Recipes</span>
                </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                    <span className="font-medium">Settings (Coming Soon)</span>
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors">
                    <span className="font-medium text-red-500">Log Out</span>
                    <SignOutButton />
                </div>
            </div>
        </div>
    );
}
