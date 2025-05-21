import React from "react";
import { ClassData } from "@/types/api";
import { CourseTable } from "./CourseTable";

interface Props {
  course: ClassData | null;
  sections: ClassData[];
  isPinned: boolean;
  onTogglePin: () => void;
}

export function CourseDetails({
  course,
  sections,
  isPinned,
  onTogglePin,
}: Props) {
  if (!course) return <p className="text-gray-500">Select a course.</p>;

  return (
    <div className="flex-1 ml-4 border rounded p-4 flex flex-col overflow-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">
          {course.subject} {course.catalog_nbr} — {course.title_lon}
        </h2>
        <p className="mt-2">
          <strong>Credits:</strong> {course.credits}
        </p>
        <p className="mt-2">{course.description}</p>
        <p className="mt-2">
          <strong>Prerequisites:</strong> {course.prerequisites}
        </p>
      </div>

      <CourseTable sections={sections} />

      <div className="mt-auto">
        <button
          onClick={onTogglePin}
          className="px-4 py-2 rounded hover:cursor-pointer"
          style={{ backgroundColor: "#FDC700", color: "#003C6C" }}
        >
          {isPinned ? "Unpin Course" : "Pin Course"}
        </button>
      </div>
    </div>
  );
}
