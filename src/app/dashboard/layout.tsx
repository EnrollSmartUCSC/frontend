"use client";

import Link from "next/link";
import React from "react";
import { auth } from "../utils/firebase";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  const signOut = async () => {
    auth.signOut().then(() => {
      // Sign-out successful.
      console.log("Sign-out successful.");
      router.push("/login");
    });
  }
  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-gray-100 p-6 border-r flex flex-col">
        <nav className="flex flex-col flex-1 gap-4">
          <Link
            href="/dashboard"
            className="block text-3xl px-4 py-2 rounded
                       hover:cursor-pointer hover:bg-gray-300"
          >
            EnrollSmart
          </Link>

          <Link
            href="/dashboard/tab-1"
            className="block text-center py-2 rounded
                       hover:cursor-pointer hover:bg-gray-300"
          >
            Tab1
          </Link>
          <Link
            href="/dashboard/tab-2"
            className="block text-center py-2 rounded
                       hover:cursor-pointer hover:bg-gray-300"
          >
            Tab2
          </Link>
          <Link
            href="/dashboard/tab-3"
            className="block text-center py-2 rounded
                       hover:cursor-pointer hover:bg-gray-300"
          >
            Tab3
          </Link>

          {/* Real Sign Out button */}
          <button
            onClick={() => signOut()}
            className="mt-auto block text-center py-2 rounded
                       hover:cursor-pointer hover:bg-gray-300"
          >
            Sign Out
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
