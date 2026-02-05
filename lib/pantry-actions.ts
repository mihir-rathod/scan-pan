"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function deletePantryItem(id: number) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.query("DELETE FROM pantry_items WHERE id = $1 AND user_id = $2", [id, session.user.id]);
    revalidatePath("/pantry");
}

export async function updatePantryItem(id: number, name: string, quantity: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.query(
        "UPDATE pantry_items SET name = $1, quantity = $2 WHERE id = $3 AND user_id = $4",
        [name, quantity, id, session.user.id]
    );
    revalidatePath("/pantry");
}

export async function clearAllPantryItems() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.query("DELETE FROM pantry_items WHERE user_id = $1", [session.user.id]);
    revalidatePath("/pantry");
}

export async function addPantryItems(items: any[]) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Construct the INSERT statement for multiple rows
    // Postgres doesn't have a simple "insert array of objects" like Supabase, so we loop or build a complex query.
    // Looping is safer/easier for small batches.

    for (const item of items) {
        // Clean up fields if needed or validation
        await db.query(
            "INSERT INTO pantry_items (user_id, name, quantity, expiry) VALUES ($1, $2, $3, $4)",
            [session.user.id, item.name, item.quantity, item.expiry]
        );
    }
    revalidatePath("/pantry");
}
