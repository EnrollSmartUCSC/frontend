"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-gray-100 p-6 border-r flex flex-col">
        <nav className="flex flex-col flex-1 gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="block text-3xl px-4 py-2 rounded
              hover:cursor-pointer hover:bg-gray-300"
          >
            EnrollSmart
          </button>

          <button
            onClick={() => router.push("/dashboard/tab-1")}
            className="block text-center py-2 rounded
              hover:cursor-pointer hover:bg-gray-300"
          >
            Course Search
          </button>

          <button
            onClick={() => router.push("/dashboard/tab-2")}
            className="block text-center py-2 rounded
              hover:cursor-pointer hover:bg-gray-300"
          >
            Planner
          </button>

          <button
            onClick={() => router.push("/dashboard/tab-3")}
            className="block text-center py-2 rounded
              hover:cursor-pointer hover:bg-gray-300"
          >
            Tab 3
          </button>

          <button
            onClick={() => {
              console.log("User signing out");
              router.push("/");
            }}
            className="mt-auto block text-center py-2 rounded
              hover:cursor-pointer hover:bg-gray-300"
          >
            Sign Out
          </button>
        </nav>
      </aside>

      <main className="flex-1 p8">{children}</main>
    </div>
  );
}
