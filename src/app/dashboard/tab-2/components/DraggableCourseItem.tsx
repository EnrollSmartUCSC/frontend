import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { className } from "@/types/api";

interface DraggableCourseItemProps {
  course: className;
}

export function DraggableCourseItem({ course }: DraggableCourseItemProps) {
  const id = `${course.subject}-${course.catalog_nbr}`;
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  const style: React.CSSProperties | undefined = transform
    ? {
        transform: `translate3d(${transform.x}px,${transform.y}px,0)`,
        zIndex: 9999,
        position: "absolute", // necessary for z-index to take effect
        pointerEvents: "none", // optional for smoother dragging UX
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
    </li>
  );
}
