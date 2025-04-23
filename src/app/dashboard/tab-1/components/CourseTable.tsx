import React from "react";
import { CourseInfo } from "@/types/course";

interface Props {
  course: CourseInfo;
}

export function CourseTable({ course }: Props) {
  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr>
          <th className="border px-2 py-1">Type</th>
          <th className="border px-2 py-1">Days</th>
          <th className="border px-2 py-1">Time</th>
          <th className="border px-2 py-1">Location</th>
          <th className="border px-2 py-1">Instructor</th>
        </tr>
      </thead>
      <tbody>
        {course.lectures.map((lec, i) => (
          <React.Fragment key={i}>
            <tr className="hover:bg-gray-50">
              <td className="border px-2 py-1">Lecture</td>
              <td className="border px-2 py-1">{lec.meeting_days}</td>
              <td className="border px-2 py-1">
                {lec.start_time}—{lec.end_time}
              </td>
              <td className="border px-2 py-1">{lec.location}</td>
              <td className="border px-2 py-1">{lec.instructor}</td>
            </tr>
            {lec.lab_sections.map((lab, j) => (
              <tr key={j} className="bg-gray-50 hover:bg-gray-100">
                <td className="border px-2 py-1">Lab</td>
                <td className="border px-2 py-1">{lab.meeting_days}</td>
                <td className="border px-2 py-1">
                  {lab.start_time}—{lab.end_time}
                </td>
                <td className="border px-2 py-1">{lab.location}</td>
                <td className="border px-2 py-1">{lab.instructor}</td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}
