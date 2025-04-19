"use client";

import React, { useState, useEffect } from "react";

export default function Tab1() {
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
        <h1 className="text-2xl font-bold">Course Search</h1>
      </header>

      {/* Left Panel (Class Search and Info) */}
      <main className="flex flex-1 p-4">
        <div className="flex flex-col justify-between w-1/4 pr-4">
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
            Basic proof of concept for course search. Currently debounces to
            console.log on typing something in the search box (Right Click
            -&gt;Inspect -&gt; Console)
          </div>
        </div>
      </main>
    </div>
  );
}
