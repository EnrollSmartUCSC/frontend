"use client";

import React, { useState, useEffect } from "react";

export default function DashboardMain() {
  const [query, setQuery] = useState("");

  // Placeholder for class search query
  // Prints to the console since we don't have backend yet
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query) console.log("Search query:", query);
    }, 250);
    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 py-2 border-b">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>

      {/* Left Panel (Class Search and Info) */}
      <main className="flex flex-1 p-4">
        <div className="flex flex-col justify-between w-1/2 pr-4">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search for Classes"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-2 text-center border border-gray-300 rounded
                focus:outline-none focus:ring-1 focus:ring-yellow-500"
            />
          </div>

          <div className="text-gray-700">
            Basic proof of concept for the dashboard. A sidebar-focused approach
            might not be the best design since it might cause too much going
            back and forth between tabs. At the same time, this might not be
            adequate space. We could display course details (as seen on the
            course catalog) in this bottom area, but the potential space issue
            is still there.
          </div>
        </div>

        {/* Right Panel: Calendar View */}
        <div className="w-2/3 border rounded p-4 flex items-center justify-center">
          <p className="text-gray-500">Calendar view goes here</p>
        </div>
      </main>
    </div>
  );
}
