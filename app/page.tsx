import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If logged in, go straight to the app (Pantry)
  if (session) {
    redirect("/pantry");
  }

  // Otherwise, show Landing Page
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white p-6 text-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <span className="text-6xl">🍳</span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900">
            ScanPan
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Your AI Kitchen Assistant. <br /> Scan receipts, track pantry, cook better.
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-8">
          <Link
            href="/login"
            className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-2xl text-white bg-black hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Log In <ArrowRight className="ml-2 w-5 h-5" />
          </Link>

          <Link
            href="/register"
            className="w-full flex items-center justify-center px-8 py-4 border-2 border-black text-lg font-medium rounded-2xl text-black bg-transparent hover:bg-gray-50 transition-all"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
