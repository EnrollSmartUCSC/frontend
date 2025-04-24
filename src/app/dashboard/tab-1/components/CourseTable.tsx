import React from "react";
import { ClassData } from "@/types/api";

interface Props {
  sections: ClassData[];
}

export function CourseTable({ sections }: Props) {
  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr>
          <th className="border px-2 py-1">Type</th>
          <th className="border px-2 py-1">Days</th>
          <th className="border px-2 py-1">Time</th>
          <th className="border px-2 py-1">Location</th>
          <th className="border px-2 py-1">Instructor(s)</th>
        </tr>
      </thead>
      <tbody>
        {sections.map((sec, i) => (
          <tr
            key={`${sec.subject}:${sec.catalog_nbr}:${sec.class_section}:${i}`}
            className="hover:bg-gray-50"
          >
            <td className="border px-2 py-1">{sec.component}</td>
            <td className="border px-2 py-1">{sec.meeting_days}</td>
            <td className="border px-2 py-1">
              {sec.start_time}—{sec.end_time}
            </td>
            <td className="border px-2 py-1">{sec.location}</td>
            <td className="border px-2 py-1">
              {sec.instructors.map((ins) => ins.name).join(", ")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
