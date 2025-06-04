import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { className } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";
import { GripVertical } from "lucide-react";

interface DraggableCourseItemProps {
  course: className;
}

export function DraggableCourseItem({ course }: DraggableCourseItemProps) {
  const id = `${course.subject}-${course.catalog_nbr}`;
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  const style: React.CSSProperties | undefined = transform
    ? {
       transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
     <Card
      ref={setNodeRef}
      style={style}
      className={`
        cursor-grab active:cursor-grabbing transition-all duration-200 
        hover:shadow-md hover:scale-[1.02] group
        ${isDragging ? "opacity-50 shadow-lg scale-105" : "opacity-100"}
      `}
      {...listeners}
      {...attributes}
    >
      <CardContent className="p-3">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-base text-gray-900">
                  {course.subject} {course.catalog_nbr}
                </span>
              </div>
              {/* {isPinned && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />} */}
            </div>

            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{course.title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
