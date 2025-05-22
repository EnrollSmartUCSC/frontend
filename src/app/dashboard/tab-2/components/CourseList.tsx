import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { ClassData } from "@/types/api";

interface Props {
  courses: ClassData[];
  disableScroll?: boolean;
}

export function CourseList({ courses, disableScroll }: Props) {
  return (
    <aside
      className={
        "w-1/4 border-r p-4 " +
        (disableScroll ? "overflow-hidden" : "overflow-auto")
      }
    >
      <h2 className="text-xl font-bold mb-4">Available Courses</h2>
      <ul className="space-y-2">
        {courses.map((course) => {
          const id = `${course.subject}-${course.catalog_nbr}-${course.class_section}`;
          const { attributes, listeners, setNodeRef, transform, isDragging } =
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useDraggable({ id });
          const style = transform
            ? {
                transform: `translate3d(${transform.x}px,${transform.y}px,0)`,
                zIndex: 9999,
              }
            : undefined;

          return (
            <li
              key={id}
              ref={setNodeRef}
              style={style}
              {...listeners}
              {...attributes}
              className={
                "p-2 border rounded bg-white cursor-grab " +
                (isDragging ? "opacity-75" : "hover:bg-gray-50")
              }
            >
              <div className="font-semibold truncate">
                {course.subject} {course.catalog_nbr} — {course.title}
              </div>
              <div className="text-[10px] text-gray-600 truncate">
                {course.meeting_days} {course.start_time}–{course.end_time}
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
