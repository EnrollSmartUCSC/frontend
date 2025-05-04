import React from "react";
import { ClassData } from "@/types/api";

interface Props {
  courses: ClassData[];
  onSelect: (course: ClassData) => void;
}

export function CourseList({ courses, onSelect }: Props) {
  return (
    <div className="flex flex-col w-1/4 pr-4 h-full">
      <h2 className="text-xl font-bold mb-4">Available Courses</h2>
      <ul className="overflow-y-auto space-y-2">
        {courses.map((course) => {
          const key = `${course.subject}:${course.catalog_nbr}:${course.class_section}`;
          return (
            <li
              key={key}
              className="p-2 border rounded cursor-pointer hover:bg-gray-100"
              onClick={() => onSelect(course)}
            >
              <span className="font-semibold">
                {course.subject} {course.catalog_nbr}
              </span>{" "}
              - {course.title}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
