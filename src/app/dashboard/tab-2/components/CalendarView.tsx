// src/app/dashboard/tab-2/components/CalendarView.tsx
import React, { useMemo } from "react";
import { ClassData } from "@/types/api";

interface Props {
  scheduled: ClassData[];
}

function parseHour(time: string): number {
  const [hms, meridiem] = time.split(" ");
  let [h, m] = hms.split(":").map(Number);
  if (meridiem === "PM" && h < 12) h += 12;
  if (meridiem === "AM" && h === 12) h = 0;
  return h + m / 60;
}

const DAY_MAP: Record<string, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
};

export function CalendarView({ scheduled }: Props) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = useMemo(() => Array.from({ length: 13 }, (_, i) => 8 + i), []); // 8am–8pm

  const headerHeight = 40;
  const hourHeight = 60;

  return (
    <div className="flex-1 overflow-auto">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `80px repeat(${days.length}, minmax(0,1fr))`,
          gridTemplateRows: `40px repeat(${hours.length}, minmax(60px,auto))`,
        }}
      >
        {/* Day headers */}
        {days.map((day, i) => (
          <div
            key={day}
            className="border-b border-r flex items-center justify-center font-semibold"
            style={{ gridRow: 1, gridColumn: i + 2 }}
          >
            {day}
          </div>
        ))}

        {/* Time labels */}
        {hours.map((hr, i) => (
          <div
            key={hr}
            className="border-b border-r relative z-10"
            style={{ gridRow: i + 2, gridColumn: 1 }}
          >
            {hr < 12
              ? `${hr}:00 AM`
              : hr === 12
              ? `12:00 PM`
              : `${hr - 12}:00 PM`}
          </div>
        ))}

        {/* Grid lines */}
        {days.map((_, c) =>
          hours.map((_, r) => (
            <div
              key={`${c}-${r}`}
              className="border-b border-r relative z-20"
              style={{ gridRow: r + 2, gridColumn: c + 2 }}
            />
          ))
        )}

        {/* Course blocks */}
        {scheduled.map((course, idx) => {
          const start = parseHour(course.start_time);
          const end = parseHour(course.end_time);
          const rowStart = Math.floor(start - 8) + 2;
          const rowEnd = Math.ceil(end - 8) + 2;

          return (
            <React.Fragment key={idx}>
              {course.meeting_days.split("/").map((abbr) => {
                const day = DAY_MAP[abbr];
                const col = days.indexOf(day) + 2;
                if (col < 2) return null;

                return (
                  <div
                    key={`${idx}-${abbr}`}
                    className="bg-blue-200 rounded p-1 text-xs overflow-hidden"
                    style={{
                      gridColumnStart: col,
                      gridColumnEnd: col + 1,
                      gridRowStart: rowStart,
                      gridRowEnd: rowEnd,
                    }}
                  >
                    <div className="font-semibold truncate">
                      {course.subject} {course.catalog_nbr}
                    </div>
                    <div className="truncate">
                      {course.component} ({course.class_section})
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
