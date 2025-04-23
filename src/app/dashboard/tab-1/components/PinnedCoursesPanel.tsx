import React from "react";
import { CourseInfo } from "@/types/course";

interface Props {
  pinned: CourseInfo[];
  onSelect: (c: CourseInfo) => void;
  selectedCourse: CourseInfo | null;
}

export function PinnedCoursesPanel({
  pinned,
  onSelect,
  selectedCourse,
}: Props) {
  return (
    <div className="flex flex-col w-1/5 pr-4 h-full border-r-2 border-gray-500 mr-4">
      <h2 className="text-xl mb-4">Pinned Courses</h2>
      <div className="flex-1 overflow-y-auto border rounded p-2">
        {pinned.length > 0 ? (
          <ul className="space-y-2">
            {pinned.map((c) => {
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
          <p className="text-gray-500">No pinned courses.</p>
        )}
      </div>
    </div>
  );
}
