"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { CourseList } from "./components/CourseList";
import { MultiYearPlanner } from "./components/MultiYearPlanner";
import { useSchedule } from "@/context/ScheduleContext";
import { mockCourses } from "@/data/mockCourses";
import { ClassData } from "@/types/api";

export default function PlannerIndexPage() {
  const { addCourse } = useSchedule();
  const [activeCourse, setActiveCourse] = useState<ClassData | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleDragStart(event: DragStartEvent) {
    setIsDragging(true);
    const draggedId = String(event.active.id);
    const course = mockCourses.find(
      (c) => `${c.subject}-${c.catalog_nbr}-${c.class_section}` === draggedId
    );
    setActiveCourse(course ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setIsDragging(false);
    if (event.over && activeCourse) {
      const quarterId = String(event.over.id);
      addCourse(quarterId, activeCourse);
    }
    setActiveCourse(null);
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-full">
        <CourseList courses={mockCourses} disableScroll={isDragging} />

        <MultiYearPlanner />
      </div>

      <DragOverlay>
        {activeCourse ? (
          <div className="bg-blue-100 rounded-md p-2 text-xs shadow-lg z-50 pointer-events-none">
            <div className="font-semibold truncate">
              {activeCourse.subject} {activeCourse.catalog_nbr} —{" "}
              {activeCourse.title}
            </div>
            <div className="text-[10px] text-gray-700 truncate">
              {activeCourse.meeting_days} {activeCourse.start_time}–
              {activeCourse.end_time}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
