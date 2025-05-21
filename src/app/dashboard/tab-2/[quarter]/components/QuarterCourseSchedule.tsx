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

// 8AM to 9PM
const START_TIME = 8;
const END_TIME = 22;
export function QuarterCourseSchedule({ scheduled }: Props) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = useMemo(
    () => Array.from({ length: END_TIME - START_TIME }, (_, i) => 8 + i),
    []
  );

  return (
    <div className="flex-1 overflow-auto">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `80px repeat(${days.length}, 1fr)`,
          gridTemplateRows: `40px repeat(${hours.length}, 60px)`,
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
        {hours.map((hr, i) => {
          const label =
            hr < 12
              ? `${hr}:00 AM`
              : hr === 12
              ? `12:00 PM`
              : `${hr - 12}:00 PM`;
          return (
            <div
              key={hr}
              className="border-b border-r flex items-center justify-end pr-2 text-sm text-gray-600"
              style={{ gridRow: i + 2, gridColumn: 1 }}
            >
              {label}
            </div>
          );
        })}

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
          const rowStart = Math.floor(start - 8) + 1;
          const rowEnd = Math.ceil(end - 8) + 1;

          return (
            <React.Fragment key={idx}>
              {course.meeting_days.split("/").map((abbr) => {
                const day = DAY_MAP[abbr];
                const col = days.indexOf(day) + 2;
                if (col < 2) return null;

                return (
                  <div
                    key={`${idx}-${abbr}`}
                    className="bg-blue-200 rounded-md p-2 text-xs shadow overflow-hidden"
                    style={{
                      gridColumnStart: col,
                      gridColumnEnd: col + 1,
                      gridRowStart: rowStart,
                      gridRowEnd: rowEnd,
                    }}
                  >
                    <div className="font-semibold truncate">
                      {course.subject} {course.catalog_nbr} — {course.title}
                    </div>
                    <div className="text-[10px] text-gray-700">
                      {course.meeting_days} {course.start_time}–
                      {course.end_time}
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
