"use client";

import React, { useEffect, useState } from "react";
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { CourseList } from "./components/CourseList";
import { MultiYearPlanner } from "./components/MultiYearPlanner";
import { useSchedule } from "@/context/ScheduleContext";
// import { mockCourses } from "@/data/mockCourses";
import { className, plan } from "@/types/api";
import { usePinnedCourses } from "../tab-1/hooks/usePinnedCourses";
import { useCourses } from "../tab-1/hooks/useCourses";

export default function PlannerIndexPage() {
  const { addCourse } = useSchedule();
  const [courses, setCourses] = useState<className[]>([]);
  const [pinned, setPinned] = useState<className[]>([]);
  const [activeCourse, setActiveCourse] = useState<className | null>(null);
  const [plan, setPlan] = useState<plan>({});
  const [isDragging, setIsDragging] = useState(false);
  const { fetchPinnedCourses } = usePinnedCourses();
  const { fetchCourses } = useCourses();
  const { fetchSchedule } = useSchedule();
  useEffect(() => {
    (async () => {
      const p = await fetchPinnedCourses();
      const c = await fetchCourses();
      // remove duplicates within c
      const uniqueCourses = Array.from(
        new Map(c.map((course) => [`${course.subject}-${course.catalog_nbr}`, course])).values()
      );

      // remove pinned courses from c
      const coursesWithoutPinned = uniqueCourses.filter(
        (course) =>
          !p.some(
            (pinnedCourse) =>
              pinnedCourse.subject === course.subject &&
              pinnedCourse.catalog_nbr === course.catalog_nbr
          )
      );
      setPinned(p);
      setCourses(coursesWithoutPinned);
      (async () => {
      const c = await fetchSchedule();
      setPlan(c);
    })();
    })()
    console.log("pinned: ", pinned);
    console.log("courses: ", courses);
  }, []);

  function handleDragStart(event: DragStartEvent) {
    setIsDragging(true);
    const draggedId = String(event.active.id);
    console.log("courses: ", courses);
    let course = pinned.find(
      (c) => `${c.subject}-${c.catalog_nbr}` === draggedId
    );
    if (!course) {
      course = courses.find((c) => `${c.subject}-${c.catalog_nbr}` === draggedId);
    }
    setActiveCourse(course ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setIsDragging(false);
    if (event.over && activeCourse) {
      const quarterId = String(event.over.id);
      await addCourse(activeCourse.catalog_nbr, activeCourse.subject, activeCourse.title, quarterId);
    }
    (async () => {
      const c = await fetchSchedule();
      setPlan(c);
    })();
    setActiveCourse(null);
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={async(e) => {handleDragEnd(e)}}>
      <div className="flex h-full">
        <CourseList courses={courses} pinned={pinned} disableScroll={isDragging} />

        <MultiYearPlanner plan={plan} setPlan = {setPlan}/>
      </div>

      <DragOverlay>
        {activeCourse ? (
          <div className="bg-blue-100 rounded-md p-2 text-xs shadow-lg z-50 pointer-events-none">
            <div className="font-semibold truncate">
              {activeCourse.subject} {activeCourse.catalog_nbr} —{" "}
              {activeCourse.title}
            </div>
            {/* <div className="text-[10px] text-gray-700 truncate">
              {activeCourse.meeting_days} {activeCourse.start_time}–
              {activeCourse.end_time}
            </div> */}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
