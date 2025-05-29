import React from "react";
import { className } from "@/types/api";

interface Props {
  courses: className[];
}

export function QuarterCourseList({ courses }: Props) {
  return (
    <aside className="w-1/4 border-r p-4 overflow-auto">
      <h2 className="text-xl font-bold mb-4">This Quarter’s Courses</h2>
      <ul className="space-y-2">
        {courses.length > 0 ? (
          courses.map((course) => {
            const key = `${course.subject}-${course.catalog_nbr}-${course.title}`;
            return (
              <li
                key={key}
                className="p-2 border rounded flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold">
                    {course.subject} {course.catalog_nbr}
                  </span>{" "}
                  — {course.title}
                </div>
              </li>
            );
          })
        ) : (
          <li className="text-gray-500">No courses added.</li>
        )}
      </ul>
    </aside>
  );
}
