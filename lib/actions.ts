"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function registerUser(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (!email || !password) {
        console.error("REGISTRATION_FAILURE: Missing email or password");
        return { error: "Missing fields" };
    }

    try {
        console.log("REGISTRATION_ATTEMPT:", email);
        
        // Hash password with bcryptjs
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3)",
            [email, hashedPassword, name]
        );
        
        console.log("REGISTRATION_SUCCESS:", email);
    } catch (e: any) {
        console.error("REGISTRATION_ERROR:", e.message);
        if (e.code === '23505') { // Postgres error for "Unique constraint violation"
            return { error: "User already exists" };
        }
        return { error: "Server connection failed. Please try again later." };
    }

    redirect("/login");
}
