import React from "react";
import { ClassData } from "@/types/api";

interface Props {
  pinned: ClassData[];
  selected: ClassData | null;
  onSelect: (c: ClassData) => void;
}

export function PinnedCoursesPanel({ pinned, selected, onSelect }: Props) {
  return (
    <div className="flex flex-col w-1/5 pr-4 h-full border-r-2 border-gray-500 mr-4">
      <h2 className="text-xl mb-4 text-[#333333]">Pinned Courses</h2>
      <div className="flex-1 overflow-y-auto border rounded p-2">
        {pinned.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-start pt-8">
            <img src="/no_pinned.svg" alt="No pinned courses" className="w-11 h-11 mb-2" />
            
            <p className="text-[#999999]">No pinned courses.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {pinned.map((c) => {
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
                    (isSel ? "bg-gray-200" : "hover:bg-gray-100")
                  }
                >
                  {c.subject} {c.catalog_nbr} — {c.title}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
