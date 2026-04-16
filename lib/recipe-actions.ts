"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function saveRecipe(recipe: any) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.query(`
    INSERT INTO saved_recipes (user_id, title, description, instructions, ingredients)
    VALUES ($1, $2, $3, $4, $5)
  `, [
        session.user.id,
        recipe.title,
        recipe.description,
        recipe.instructions,
        JSON.stringify(recipe.all_ingredients) // Store array as JSONB
    ]);

    revalidatePath("/saved");
}

export async function deleteRecipe(id: number) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.query("DELETE FROM saved_recipes WHERE id = $1 AND user_id = $2", [id, session.user.id]);
    revalidatePath("/saved");
}

export async function clearAllRecipes() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.query("DELETE FROM saved_recipes WHERE user_id = $1", [session.user.id]);
    revalidatePath("/saved");
    // Also revalidate pantry for the Profile counts
    revalidatePath("/profile");
}
