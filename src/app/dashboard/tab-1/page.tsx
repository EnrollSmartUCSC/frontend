"use client";

import React, { useState, useEffect, useMemo } from "react";

// Lab sections: attached to a lecture timeslot
// Alternatively, may not exist at all
interface LabInfo {
  meeting_days: string;
  start_time: string;
  end_time: string;
  location: string;
  instructor: string;
}

interface LectureInfo {
  meeting_days: string;
  start_time: string;
  end_time: string;
  location: string;
  instructor: string;
  lab_sections: LabInfo[];
}

// Course summary:
//  ~ What is prefetched and displayed in the search results component
//  ~ Every field that's NOT included here will be fetched on demand
type CourseSummary = {
  code: string;
  name: string;
  quarter: string;
};

// Full course details:
//  ~ What is displayed in the course details component
//  ~ Displayed after clicking on an individual course in search results
//  ~ These fields are what will be fetched on demand
type CourseInfo = CourseSummary & {
  description: string;
  prerequisites: string;
  credits: number;
  lectures: LectureInfo[];
};

export default function Tab1() {
  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [pinnedCourses, setPinnedCourses] = useState<CourseInfo[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseInfo | null>(null);

  useEffect(() => {
    setCourses(
      mockCourses.map(({ code, name, quarter }) => ({ code, name, quarter }))
    );
  }, []);

  /* 
    Locally filtering course searches. While *in* the course search tab, 
    this shouldn't be computationally expensive since it's memoized

    However, when switching tabs in the sidebar I'm pretty sure it'll free the cache.
    In the future I'll look into keeping this tab mounted if we stick to the course prefetching approach
    
    Search patterns and criteria:
    ~ Full code (CSE115A)
    ~ Prefix (such as CSE) generates all CSE classes
    ~ Suffix (such as 115A) generates all classes ending in 115A
    ~ Course name (Introduction to Software Engineering) or substrings

    Ignores:
    ~ Case (cse115a === CSE115A)
    ~ Whitespace (CSE115A === CSE 115A)
  */
  const normalize = (s: string) => s.replace(/\s+/g, "").toLowerCase();
  const filtered = useMemo(() => {
    if (!query.trim()) return courses;
    const q = normalize(query);
    return courses.filter((c) => {
      const codeKey = normalize(c.code);
      const nameKey = normalize(c.name);
      if (codeKey.includes(q)) return true;
      const alpha = codeKey.match(/^[a-z]+/)?.[0] || "";
      if (alpha.startsWith(q)) return true;
      if (nameKey.includes(q)) return true;
      return false;
    });
  }, [query, courses]);

  // Select a course and load details from mock
  // Note:
  //   After we have actual implementation to read from an endpoint,
  //   This will instead fetch course details as a request to the backend
  const handleSelect = (summary: CourseSummary) => {
    const course = mockCourses.find(
      (c) => c.code === summary.code && c.quarter === summary.quarter
    );
    setSelectedCourse(course ?? null);
  };

  // Pin / unpin logic
  const togglePin = () => {
    if (!selectedCourse) return;
    const exists = pinnedCourses.some(
      (c) =>
        c.code === selectedCourse.code && c.quarter === selectedCourse.quarter
    );
    if (exists) {
      setPinnedCourses(
        pinnedCourses.filter(
          (c) =>
            !(
              c.code === selectedCourse.code &&
              c.quarter === selectedCourse.quarter
            )
        )
      );
    } else {
      setPinnedCourses([...pinnedCourses, selectedCourse]);
    }
  };

  const isPinned = selectedCourse
    ? pinnedCourses.some(
        (c) =>
          c.code === selectedCourse.code && c.quarter === selectedCourse.quarter
      )
    : false;

  return (
    <div className="flex flex-col h-screen">
      <header className="px-4 py-2 border-b">
        <h1 className="text-2xl font-bold">Course Search</h1>
      </header>

      <main className="flex flex-1 p-4 overflow-hidden">
        {/* Pinned Courses Panel */}
        <div className="flex flex-col w-1/5 pr-4 h-full border-r-2 border-gray-500 mr-4">
          <h2 className="text-xl mb-4">Pinned Courses</h2>
          <div className="flex-1 overflow-y-auto border rounded p-2">
            {pinnedCourses.length > 0 ? (
              <ul className="space-y-2">
                {pinnedCourses.map((c) => (
                  <li
                    key={c.code + c.quarter}
                    className="p-2 rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => setSelectedCourse(c)}
                  >
                    <span className="font-semibold">{c.code}</span> — {c.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No pinned courses.</p>
            )}
          </div>
        </div>

        {/* Search Panel */}
        <div className="flex flex-col w-1/4 pr-4 h-full">
          <input
            type="text"
            placeholder="Search for Classes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-500"
          />
          <div className="flex-1 overflow-y-auto border rounded p-2">
            {filtered.length > 0 ? (
              <ul className="space-y-2">
                {filtered.map((c) => (
                  <li
                    key={c.code + c.quarter}
                    className="p-2 rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSelect(c)}
                  >
                    <span className="font-semibold">{c.code}</span> — {c.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No courses match your search.</p>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="flex-1 ml-4 border rounded p-4 flex flex-col overflow-auto">
          {selectedCourse ? (
            <>
              <div className="mb-4">
                <h2 className="text-2xl font-semibold">
                  {selectedCourse.code}: {selectedCourse.name} (
                  {selectedCourse.credits} Credits)
                </h2>

                <p className="mt-2">{selectedCourse.description}</p>

                <p className="mt-2">
                  <strong>Prerequisites:</strong>{" "}
                  {selectedCourse.prerequisites || "None"}
                </p>
              </div>

              <h3 className="text-lg font-bold mb-2">Section Details</h3>
              <p className="italic mb-2">Quarter: {selectedCourse.quarter}</p>

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
                  {selectedCourse.lectures.map((lec, i) => (
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
                          <td className="border px-2 py-1">
                            {lab.meeting_days}
                          </td>
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

              <div className="mt-auto">
                <button
                  onClick={togglePin}
                  className="px-4 py-2 rounded hover:cursor-pointer"
                  style={{ backgroundColor: "#FDC700", color: "#003C6C" }}
                >
                  {isPinned ? "Unpin Course" : "Pin Course"}
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Select a course to view details.</p>
          )}
        </div>
      </main>
    </div>
  );
}

// GPT-generated mock data
const mockCourses: CourseInfo[] = [
  {
    code: "CSE 140",
    name: "Programming Languages and Techniques",
    quarter: "Spring 2025",
    credits: 4,
    description:
      "An introduction to programming languages, focusing on paradigms and implementation.",
    prerequisites: "CSE 12 or equivalent",
    lectures: [
      {
        meeting_days: "Mon/Wed",
        start_time: "10:00 AM",
        end_time: "11:50 AM",
        location: "EH 206",
        instructor: "Dr. Alice Smith",
        lab_sections: [
          {
            meeting_days: "Fri",
            start_time: "2:00 PM",
            end_time: "3:50 PM",
            location: "EH 208",
            instructor: "TA John Doe",
          },
        ],
      },
    ],
  },
  {
    code: "CSE 101",
    name: "Software Construction",
    quarter: "Fall 2025",
    credits: 5,
    description: "Principles and techniques for large-scale software.",
    prerequisites: "CSE 12",
    lectures: [
      {
        meeting_days: "Tue/Thu",
        start_time: "2:00 PM",
        end_time: "3:50 PM",
        location: "ISB 121",
        instructor: "Prof. Bob Jones",
        lab_sections: [],
      },
    ],
  },
  {
    code: "MATH 1A",
    name: "Calculus I",
    quarter: "Summer 2025",
    credits: 4,
    description: "Differential calculus of one variable.",
    prerequisites: "None",
    lectures: [
      {
        meeting_days: "Mon/Wed/Fri",
        start_time: "9:00 AM",
        end_time: "9:50 AM",
        location: "Kresge 100",
        instructor: "Dr. Carol Lee",
        lab_sections: [],
      },
    ],
  },
];
