"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { LogIn, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Welcome!</h1>
                <p className="text-gray-600">
                  Signed in as{" "}
                  <span className="font-semibold text-blue-600">
                    {session.user?.email}
                  </span>
                </p>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                <LogOut size={20} />
                Sign out
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 w-full sm:w-auto"
              >
                <LayoutDashboard size={20} />
                Go to Todo Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to TodoApp
          </h1>
          <p className="text-gray-600 mt-2">
            Please sign in to access your todo list
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => signIn("auth0")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <LogIn size={20} />
            Sign in with Auth0
          </button>

          <div className="text-center text-sm text-gray-500">
            Secure authentication powered by Auth0
          </div>
        </div>
      </div>
    </div>
  );
}
