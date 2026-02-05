import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import GenerateRecipeButton from "./GenerateRecipeButton";
import { redirect } from "next/navigation";

export default async function RecipesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { rows: items } = await db.query(
    "SELECT name FROM pantry_items WHERE user_id = $1",
    [session.user.id]
  );

  // Convert array of objects to simple string list: "Eggs, Milk, Bread"
  const ingredients = items?.map((i: any) => i.name).join(", ") || "";

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-4">Chef's Suggestions 👨‍🍳</h1>

      <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-6">
        <h2 className="font-semibold text-orange-800 mb-2">Based on your pantry:</h2>
        <p className="text-gray-600 text-sm">
          {ingredients ? ingredients : "Your pantry is empty! Add items to generate recipes."}
        </p>
      </div>

      <GenerateRecipeButton ingredients={ingredients} />
    </div>
  );
}