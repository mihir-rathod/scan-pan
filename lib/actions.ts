"use server";

import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function registerUser(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (!email || !password) {
        throw new Error("Missing fields");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await db.query(
            "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3)",
            [email, hashedPassword, name]
        );
    } catch (e: any) {
        if (e.code === '23505') { // Postgres error for "Unique constraint violation"
            return { error: "User already exists" };
        }
        throw e;
    }

    redirect("/api/auth/signin");
}
