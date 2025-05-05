"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useSchedule } from "@/context/ScheduleContext";
import { QuarterCourseList } from "./components/QuarterCourseList";
import { QuarterCourseSchedule } from "./components/QuarterCourseSchedule";
import { ClassData } from "@/types/api";

export default function QuarterPlannerPage() {
  const params = useParams();
  let quarter = params.quarter;
  if (Array.isArray(quarter)) quarter = quarter[0];
  if (!quarter) return <div className="p-4 text-red-500">Invalid quarter</div>;

  // Pulls scheduled courses for this quarter from context
  const { scheduledByQuarter } = useSchedule();
  const scheduled: ClassData[] = scheduledByQuarter[quarter] || [];

  return (
    <div className="flex h-full">
      <QuarterCourseList courses={scheduled} />
      <QuarterCourseSchedule scheduled={scheduled} />
    </div>
  );
}
