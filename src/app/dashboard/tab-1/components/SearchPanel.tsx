import React from "react";
import { ClassData } from "@/types/api";

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  results: ClassData[];
  selected: ClassData | null;
  onSelect: (c: ClassData) => void;
}

export function SearchPanel({
  query,
  onQueryChange,
  results,
  selected,
  onSelect,
}: Props) {
  return (
    <div className="flex flex-col w-1/4 pr-4 h-full">
      <input
        type="text"
        placeholder="Search for Classes"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      <div className="flex-1 overflow-y-auto border rounded p-2">
        {results.length === 0 ? (
          <p className="text-gray-500">No courses match.</p>
        ) : (
          <ul className="space-y-2">
            {results.map((c) => {
              const key = `${c.subject}:${c.catalog_nbr}`;
              const selKey = selected
                ? `${selected.subject}:${selected.catalog_nbr}`
                : null;
              const isSel = key === selKey;
              return (
                <li
                  key={key}
                  onClick={() => onSelect(c)}
                  className={
                    `p-2 rounded cursor-pointer ` +
                    (isSel ? "bg-[#D7F1F8]" : "hover:bg-[#D7F1F8] hover:opacity-80")
                  }
                >
                  <span className="font-semibold">
                    {c.subject} {c.catalog_nbr}
                  </span>{" "}
                  — {c.title}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
