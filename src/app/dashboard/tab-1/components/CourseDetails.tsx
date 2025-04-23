import React from "react";
import { CourseInfo } from "@/types/course";
import { CourseTable } from "./CourseTable";

interface Props {
  course: CourseInfo | null;
  isPinned: boolean;
  onTogglePin: () => void;
}

export function CourseDetails({ course, isPinned, onTogglePin }: Props) {
  if (!course) {
    return <p className="text-gray-500">Select a course to view details.</p>;
  }

  return (
    <div className="flex-1 ml-4 border rounded p-4 flex flex-col overflow-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">
          {course.code}: {course.name} ({course.credits} Credits)
        </h2>
        <p className="mt-2">{course.description}</p>
        <p className="mt-2">
          <strong>Prerequisites:</strong> {course.prerequisites || "None"}
        </p>
      </div>

      <h3 className="text-lg font-bold mb-2">Section Details</h3>
      <p className="italic mb-2">Quarter: {course.quarter}</p>
      <CourseTable course={course} />

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
