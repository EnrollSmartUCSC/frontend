"use client";

import React, { useEffect } from "react";
import { auth } from "../utils/firebase";
import { useRouter } from "next/navigation";
import { ScheduleProvider } from "@/context/ScheduleContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) {
      // User is not signed in, redirect to login page
      router.push("/login");
    } else {
      // User is signed in, you can access user information here
      const user = auth.currentUser;
      user?.getIdToken().then(async (token) => {
        console.log("User token:", token);
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/google-signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      })

      console.log("User is signed in:", user);
    }
  }, [router]);

  const signOut = async () => {
    auth.signOut().then(() => {
      // Sign-out successful.
      console.log("Sign-out successful.");
      router.push("/login");
    });
  }

  return (
    <ScheduleProvider>
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

            {/* <button
              onClick={() => router.push("/dashboard/tab-3")}
              className="block text-center py-2 rounded
              hover:cursor-pointer hover:bg-gray-300"
            >
              Tab 3
            </button> */}

            <button
              onClick={() => {
              signOut();
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
    </ScheduleProvider>
    
  );
}
