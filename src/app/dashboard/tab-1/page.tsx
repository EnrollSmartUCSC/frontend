"use client";

import React, { useState, useEffect, useMemo } from "react";

/*
  Placeholder interface for testing purposes

  In practice we should only prefetch the course codes and names,
  then fetch from the backend when a course is selected

  Also need to work on displaying courses with multiple sections:
    - Multiple lecture time slots
    - Lab sections tied to a lecture time slot
    - Multiple generic (non-assigned) lab sections
  So will need to change the type of some of these fields
*/
interface CourseInfo {
  code: string;
  name: string;
  quarter: string;
  description: string;
  credits: number;
  prerequisites: string;
  meeting_days: string;
  start_time: string;
  end_time: string;
  location: string;
  instructor: string;
}

export default function Tab1() {
  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [pinnedCourses, setPinnedCourses] = useState<CourseInfo[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseInfo | null>(null);

  // Will replace with fetch of real data
  // Current mock data at bottom of this file
  useEffect(() => {
    setCourses(mockCourses);
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
  const normalize = (s: string) => s.replace(/\s+/g, "").toUpperCase();
  const filtered = useMemo(() => {
    if (!query.trim()) return courses;
    const q = normalize(query);
    return courses.filter((c) => {
      const codeKey = normalize(c.code);
      const nameKey = normalize(c.name);
      if (codeKey.includes(q)) return true;
      const alpha = codeKey.match(/^[A-Z]+/)?.[0] || "";
      if (alpha.startsWith(q)) return true;
      if (nameKey.includes(q)) return true;
      return false;
    });
  }, [query, courses]);

  const handlePinUnpin = () => {
    if (!selectedCourse) return;
    const exists = pinnedCourses.some(
      (course) =>
        course.code === selectedCourse.code &&
        course.quarter === selectedCourse.quarter
    );
    if (exists) {
      setPinnedCourses(
        pinnedCourses.filter(
          (course) =>
            !(
              course.code === selectedCourse.code &&
              course.quarter === selectedCourse.quarter
            )
        )
      );
    } else {
      setPinnedCourses([...pinnedCourses, selectedCourse]);
    }
  };

  const isPinned = selectedCourse
    ? pinnedCourses.some(
        (course) =>
          course.code === selectedCourse.code &&
          course.quarter === selectedCourse.quarter
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
          <h2 className="text-xl mb-4">My Pinned Courses</h2>
          <div className="flex-1 overflow-y-auto border rounded p-2">
            {pinnedCourses.length > 0 ? (
              <ul className="space-y-2">
                {pinnedCourses.map((c) => (
                  <li
                    key={c.code + c.quarter}
                    className="p-2 rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => setSelectedCourse(c)}
                  >
                    {c.code} — {c.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No pinned courses.</p>
            )}
          </div>
        </div>

        {/* Search + Filtered Courses Panel */}
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
                {filtered.map((course) => (
                  <li
                    key={course.code + course.quarter}
                    className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                      selectedCourse === course ? "bg-gray-200" : ""
                    }`}
                    onClick={() => setSelectedCourse(course)}
                  >
                    {course.code} — {course.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No courses match your search.</p>
            )}
          </div>
        </div>

        {/* Course Detail Display */}
        <div className="flex-1 ml-4 border rounded p-4 flex flex-col overflow-auto">
          {selectedCourse ? (
            <>
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  {selectedCourse.code}: {selectedCourse.name} (
                  {selectedCourse.credits} Credits)
                </h2>
                <p className="text-xl mb-2"> {selectedCourse.description}</p>
                <p>
                  <strong>Quarter:</strong> {selectedCourse.quarter}
                </p>
                <p>
                  <strong>Prerequisites:</strong>{" "}
                  {selectedCourse.prerequisites || "None"}
                </p>
                <p>
                  <strong>Meeting Days:</strong> {selectedCourse.meeting_days}
                </p>
                <p>
                  <strong>Time:</strong> {selectedCourse.start_time} —{" "}
                  {selectedCourse.end_time}
                </p>
                <p>
                  <strong>Location:</strong> {selectedCourse.location}
                </p>
                <p>
                  <strong>Instructor:</strong> {selectedCourse.instructor}
                </p>
              </div>

              <div className="mt-auto">
                <button
                  onClick={handlePinUnpin}
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

// Generated by ChatGPT
const mockCourses: CourseInfo[] = [
  {
    code: "CSE 140",
    name: "Programming Languages and Techniques",
    quarter: "Spring 2025",
    credits: 4,
    description:
      "An introduction to programming languages, focusing on paradigms and implementation.",
    prerequisites: "CSE 12 or equivalent",
    meeting_days: "Mon/Wed",
    start_time: "10:00 AM",
    end_time: "11:50 AM",
    location: "EH 206",
    instructor: "Dr. Alice Smith",
  },
  {
    code: "CSE 101",
    name: "Software Construction",
    quarter: "Fall 2025",
    credits: 5,
    description:
      "Principles and techniques for construction of large-scale software.",
    prerequisites: "CSE 12",
    meeting_days: "Tue/Thu",
    start_time: "2:00 PM",
    end_time: "3:50 PM",
    location: "ISB 121",
    instructor: "Prof. Bob Jones",
  },
  {
    code: "MATH 1A",
    name: "Calculus I",
    quarter: "Summer 2025",
    credits: 4,
    description: "Differential calculus of one variable.",
    prerequisites: "None",
    meeting_days: "Mon/Wed/Fri",
    start_time: "9:00 AM",
    end_time: "9:50 AM",
    location: "Kresge 100",
    instructor: "Dr. Carol Lee",
  },
  {
    code: "CSE 190",
    name: "Software Engineering",
    quarter: "Winter 2025",
    credits: 4,
    description: "Team-based software development project course.",
    prerequisites: "CSE 101",
    meeting_days: "Mon/Wed/Fri",
    start_time: "1:00 PM",
    end_time: "1:50 PM",
    location: "PCYNH 336",
    instructor: "Dr. Daniel Kim",
  },
  {
    code: "PHYS 5A",
    name: "Mechanics and Wave Motion",
    quarter: "Fall 2025",
    credits: 5,
    description: "Introduction to classical mechanics and wave motion.",
    prerequisites: "PHYS 2A",
    meeting_days: "Tue/Thu",
    start_time: "11:00 AM",
    end_time: "12:20 PM",
    location: "Science & Engineering 2, Room 120",
    instructor: "Prof. Emily Zhang",
  },
  {
    code: "MUS 21A",
    name: "History of Western Music I",
    quarter: "Spring 2025",
    credits: 3,
    description: "Survey of Western music from antiquity through the Baroque.",
    prerequisites: "None",
    meeting_days: "Tue/Thu",
    start_time: "3:00 PM",
    end_time: "4:20 PM",
    location: "Music 428",
    instructor: "Dr. Frank Rivera",
  },
  {
    code: "CSE 101L",
    name: "Software Construction Lab",
    quarter: "Fall 2025",
    credits: 1,
    description: "Laboratory for CSE 101.",
    prerequisites: "CSE 101",
    meeting_days: "Fri",
    start_time: "2:00 PM",
    end_time: "4:50 PM",
    location: "ISB 123",
    instructor: "Ms. Grace Lee",
  },
  {
    code: "ART 10A",
    name: "Drawing I",
    quarter: "Winter 2025",
    credits: 3,
    description: "Fundamentals of drawing techniques and composition.",
    prerequisites: "None",
    meeting_days: "Mon/Wed",
    start_time: "5:00 PM",
    end_time: "6:20 PM",
    location: "Arts 2, Studio 1",
    instructor: "Prof. Hannah Park",
  },
  {
    code: "CSE 12",
    name: "Data Structures and Programming",
    quarter: "Winter 2025",
    credits: 4,
    description: "Algorithms, data structures, and programming techniques.",
    prerequisites: "CSE 8A",
    meeting_days: "Tue/Thu",
    start_time: "8:00 AM",
    end_time: "9:50 AM",
    location: "STEIN 123",
    instructor: "Dr. Ian Michaels",
  },
  {
    code: "MATH 19B",
    name: "Calculus II",
    quarter: "Spring 2025",
    credits: 4,
    description: "Integral calculus and infinite series.",
    prerequisites: "MATH 19A",
    meeting_days: "Mon/Wed/Fri",
    start_time: "11:00 AM",
    end_time: "11:50 AM",
    location: "Kresge 101",
    instructor: "Prof. Julia Nguyen",
  },
  {
    code: "PHYS 5C",
    name: "Electricity and Magnetism",
    quarter: "Summer 2025",
    credits: 5,
    description:
      "Electric and magnetic fields, circuits, and Maxwell’s equations.",
    prerequisites: "PHYS 5B",
    meeting_days: "Tue/Thu",
    start_time: "12:30 PM",
    end_time: "1:50 PM",
    location: "Science 1, Room 220",
    instructor: "Dr. Kevin Ramirez",
  },
  {
    code: "CSE 150",
    name: "Functional Programming",
    quarter: "Fall 2025",
    credits: 4,
    description: "Principles of functional programming languages.",
    prerequisites: "CSE 140",
    meeting_days: "Mon/Wed",
    start_time: "3:00 PM",
    end_time: "4:50 PM",
    location: "CSE 214",
    instructor: "Dr. Laura Singh",
  },
  {
    code: "ENGL 1A",
    name: "Writing and Critical Thinking",
    quarter: "Winter 2025",
    credits: 4,
    description: "Expository writing and analytical thinking.",
    prerequisites: "None",
    meeting_days: "Tue/Thu",
    start_time: "1:00 PM",
    end_time: "2:20 PM",
    location: "Humanities 220",
    instructor: "Prof. Martin Green",
  },
  {
    code: "HIST 17B",
    name: "California History",
    quarter: "Spring 2025",
    credits: 4,
    description:
      "Survey of California history from pre-contact to the present.",
    prerequisites: "None",
    meeting_days: "Mon/Wed",
    start_time: "2:00 PM",
    end_time: "3:50 PM",
    location: "McHenry Library, Rm 105",
    instructor: "Dr. Natalie Cho",
  },
  {
    code: "BIOE 20A",
    name: "Introduction to Biomedical Engineering",
    quarter: "Summer 2025",
    credits: 3,
    description: "Fundamentals of biomedical engineering and design.",
    prerequisites: "None",
    meeting_days: "Mon/Wed/Fri",
    start_time: "10:00 AM",
    end_time: "10:50 AM",
    location: "Baskin Engr 150",
    instructor: "Dr. Oscar Nunez",
  },
  {
    code: "PSYC 1",
    name: "Introduction to Psychology",
    quarter: "Fall 2025",
    credits: 4,
    description: "Basic concepts and methods in psychology.",
    prerequisites: "None",
    meeting_days: "Tue/Thu",
    start_time: "9:00 AM",
    end_time: "10:20 AM",
    location: "Social Sciences 100",
    instructor: "Prof. Patricia Lopez",
  },
  {
    code: "ART 25A",
    name: "Painting I",
    quarter: "Winter 2025",
    credits: 3,
    description: "Fundamentals of painting with acrylics and oils.",
    prerequisites: "None",
    meeting_days: "Mon/Wed",
    start_time: "6:00 PM",
    end_time: "8:50 PM",
    location: "Arts 3, Studio 2",
    instructor: "Dr. Quincy Hall",
  },
];
