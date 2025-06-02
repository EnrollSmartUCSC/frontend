"use client";

import React from "react";
// import { useSchedule } from "@/context/ScheduleContext";
import { plan } from "@/types/api";
import QuarterPlannerPage from "./quarter";
import { ScrollArea } from "@/components/ui/scroll-area";

// Currently hardcoded years, ideally the user
// Should be able to add or delete years
const YEARS = [2024, 2025, 2026, 2027, 2028] as const;
const SEASONS = ["Winter", "Spring", "Summer", "Fall"] as const;

export function MultiYearPlanner({plan, setPlan}: {plan: plan, setPlan: (plan: plan) => void}) {
  // const router = useRouter();

  return (
    <ScrollArea className="flex-1 h-screen w-4/5 overflow-y-auto overflow-x-hidden">
      <h1 className="text-3xl font-bold mb-6">4-Year Planner</h1>
      <table className="table-fixed w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Year</th>
            {SEASONS.map((s) => (
              <th key={s} className="border px-4 py-2 text-center">
                {s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {YEARS.map((year) => (
            <tr key={year} className="h-64">
              <td className="border px-4 py-2 font-semibold">{year}</td>
              {SEASONS.map((season) => (
                <QuarterPlannerPage key={`${season} ${year}`} season={season} year={year} plan={plan} setPlan={setPlan}/>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}
