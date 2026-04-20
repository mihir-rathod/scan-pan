import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log("AUTH_FAILURE: Missing credentials");
                    return null;
                }

                try {
                    const results = await db.query("SELECT * FROM users WHERE email = $1", [credentials.email]);
                    const user = results.rows[0];

                    if (!user) {
                        console.log("AUTH_FAILURE: User not found", credentials.email);
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(credentials.password, user.password_hash);

                    if (passwordsMatch) {
                        console.log("AUTH_SUCCESS:", credentials.email);
                        return {
                            id: String(user.id),
                            name: user.name,
                            email: user.email,
                        };
                    } else {
                        console.log("AUTH_FAILURE: Password mismatch", credentials.email);
                        return null;
                    }
                } catch (error: any) {
                    console.error("AUTH_ERROR during authorize callback:", error.message);
                    return null;
                }
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
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    pages: {
        signIn: '/login',
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
