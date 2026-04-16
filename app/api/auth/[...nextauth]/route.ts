import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { z } from "zod";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const results = await db.query("SELECT * FROM users WHERE email = $1", [credentials.email]);
                const user = results.rows[0];

                if (!user) return null;

                const passwordsMatch = await bcrypt.compare(credentials.password, user.password_hash);

                if (passwordsMatch) {
                    // Return user object, ensuring ID is a string for NextAuth
                    return {
                        id: String(user.id),
                        name: user.name,
                        email: user.email,
                    };
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async session({ session, token }: any) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        }
    },
    session: { strategy: "jwt" as const },
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: '/login', // Custom Login Page
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
