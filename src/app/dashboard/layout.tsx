"use client";

import Link from "next/link";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            Course Search
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

          {/* User sign out (will need to clear session auth in backend) */}
          <Link
            href="/"
            onClick={() => {
              console.log("User signing out");
              // backend sign out
            }}
            className="mt-auto block text-center py-2 rounded
              hover:cursor-pointer hover:bg-gray-300"
          >
            Sign Out
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p8">{children}</main>
    </div>
  );
}
