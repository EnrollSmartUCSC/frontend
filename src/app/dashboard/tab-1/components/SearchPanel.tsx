import React from "react";
import { CourseSummary } from "@/types/course";

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  results: CourseSummary[];
  onSelect: (s: CourseSummary) => void;
  selectedCourse: CourseSummary | null;
}

export function SearchPanel({
  query,
  onQueryChange,
  results,
  onSelect,
  selectedCourse,
}: Props) {
  return (
    <div className="flex flex-col w-1/4 pr-4 h-full">
      <input
        type="text"
        placeholder="Search for Classes"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-500"
      />
      <div className="flex-1 overflow-y-auto border rounded p-2">
        {results.length > 0 ? (
          <ul className="space-y-2">
            {results.map((c) => {
              const isSelected =
                selectedCourse?.code === c.code &&
                selectedCourse?.quarter === c.quarter;
              return (
                <li
                  key={c.code + c.quarter}
                  className={
                    `p-2 rounded cursor-pointer ` +
                    (isSelected ? "bg-gray-200" : "hover:bg-gray-100")
                  }
                  onClick={() => onSelect(c)}
                >
                  <span className="font-semibold">{c.code}</span> — {c.name}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500">No courses match your search.</p>
        )}
      </div>
    </div>
  );
}
