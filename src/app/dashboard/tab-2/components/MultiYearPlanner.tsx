"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { useSchedule } from "@/context/ScheduleContext";
import { useRouter } from "next/navigation";

// Currently hardcoded years, ideally the user
// Should be able to add or delete years
const YEARS = [2024, 2025, 2026, 2027] as const;
const SEASONS = ["Winter", "Spring", "Summer", "Fall"] as const;

export function MultiYearPlanner() {
  const router = useRouter();
  const { scheduledByQuarter } = useSchedule();

  return (
    <div className="flex-1 p-6 overflow-auto">
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
              {SEASONS.map((season) => {
                const quarterId = `${season}${year}`;
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const { isOver, setNodeRef } = useDroppable({
                  id: quarterId,
                });
                const courses = scheduledByQuarter[quarterId] || [];

                return (
                  <td
                    key={quarterId}
                    ref={setNodeRef}
                    className={`border p-2 align-top relative ${
                      isOver ? "bg-green-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="space-y-2 mb-12">
                      {courses.map((c) => (
                        <div
                          key={`${c.subject}-${c.catalog_nbr}-${c.class_section}`}
                          className="bg-blue-100 rounded-md p-2 text-xs shadow-sm"
                        >
                          <div className="font-semibold truncate">
                            {c.subject} {c.catalog_nbr} — {c.title}
                          </div>
                          <div className="text-[10px] text-gray-700 truncate">
                            {c.meeting_days} {c.start_time}–{c.end_time}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        router.push(`/dashboard/tab-2/${quarterId}`)
                      }
                      className="absolute bottom-2 right-2 text-blue-600 hover:underline text-sm"
                    >
                      View
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
