"use client";

import React from "react";
import { useScheduledCourses } from "./hooks/useScheduledCourses";
import { CourseList } from "./components/CourseList";
import { CalendarView } from "./components/CalendarView";
import { mockCourses } from "../tab-1/tests/mockCourses";
import { ClassData } from "@/types/api";

export default function Tab2Page() {
  const { scheduled, addCourse } = useScheduledCourses();
  const available: ClassData[] = mockCourses;

  return (
    <div className="flex flex-col h-screen">
      <header className="px-4 py-2 border-b">
        <h1 className="text-2xl font-bold">Schedule Planner</h1>
      </header>

      <main className="flex flex-1 p-4 overflow-hidden">
        <CourseList courses={available} onSelect={addCourse} />
        <CalendarView scheduled={scheduled} />
      </main>
    </div>
  );
}
