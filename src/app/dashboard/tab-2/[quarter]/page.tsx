"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useSchedule } from "@/context/ScheduleContext";
import { QuarterCourseList } from "./components/QuarterCourseList";
import { QuarterCourseSchedule } from "./components/QuarterCourseSchedule";
import { className, plan } from "@/types/api";

export default function QuarterPlannerPage() {
  const params = useParams();
  let quarter = params.quarter;
  if (Array.isArray(quarter)) quarter = quarter[0];
  if (!quarter) return <div className="p-4 text-red-500">Invalid quarter</div>;

  // Pulls scheduled courses for this quarter from context
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { fetchSchedule } = useSchedule();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [plan , setPlan] = React.useState<plan>({});


  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    (async () => {
      const c = await fetchSchedule();
      setPlan(c);
    })();
  }, [fetchSchedule]);
  const scheduled: className[] = plan[quarter] || [];

  return (
     <div className="flex h-full">
    <div className="flex-1 h-full overflow-y-auto p-6">
      <QuarterCourseList courses={scheduled} />
    </div>
    <QuarterCourseSchedule scheduled={scheduled} />
  </div>
  );
}
