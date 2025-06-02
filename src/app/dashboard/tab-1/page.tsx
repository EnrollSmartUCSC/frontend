"use client";

import React from "react";
import { useCourses } from "./hooks/useCourses";
// import { useMockCourses } from "./tests/useMockCourses";
import { useCourseSearch } from "./hooks/useCourseSearch";
import { fetchCourseDetails } from "./hooks/useCourseDetails";
import { usePinnedCourses } from "./hooks/usePinnedCourses";
import { SearchPanel } from "./components/SearchPanel";
import { PinnedCoursesPanel } from "./components/PinnedCoursesPanel";
import { CourseDetails } from "./components/CourseDetails";
import { ClassData } from "@/types/api";

export default function Tab1Page() {
  const { fetchCourses } = useCourses();
  const [sections, setSections] = React.useState<ClassData[]>([]);
  const { query, setQuery, filtered } = useCourseSearch(sections);
  const [selected, setSelected] = React.useState<ClassData | null>(null);
  const [details, setDetails] = React.useState<ClassData[]>([]);
  const [instructors, setInstructors] = React.useState<any[]|null>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [quarter] = React.useState("2025 Fall Quarter");
  const [pinned, setPinned] = React.useState<ClassData[]>([]);
  const { fetchPinnedCourses } = usePinnedCourses();

  React.useEffect(() => {
    setInstructors(null);
    // setDetails([]);
    // if (!selected) return;
    async function fetchDetails() {
      const courseDetails = await fetchCourseDetails(selected, quarter);
      setDetails(courseDetails);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const profs: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      courseDetails.forEach((section: any) => {
        const data = {
          subject: section.subject,
          catalog_nbr: section.catalog_nbr,
          section: section.class_section,
          professor: {
            cruzid: section.instructors[0]?.cruzid || "",
            name: section.instructors[0]?.name || "Staff",
          }
       }
        profs.push(data);
      });
      setInstructors(profs);
    }

    async function getPinned() {
      setPinned(await fetchPinnedCourses());
    }
    async function courses() {
      const c = await fetchCourses();
      setSections(c);
    }

    // async function checkPinned() {
    //     const pinnedStatus = await isPinned(selected);
    //     setPin(pinnedStatus);
    // }
    courses();
    getPinned();
    fetchDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[selected]);

  function handleSelect(course: ClassData) {
    setInstructors(null);
    setSelected(course);
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="px-4 py-2 border-b">
        <h1 className="text-2xl font-bold">Course Search</h1>
      </header>

      <main className="flex flex-1 p-4 overflow-hidden">
        <PinnedCoursesPanel
          pinned={pinned}
          selected={selected}
          onSelect={setSelected}
        />

        <SearchPanel
          query={query}
          onQueryChange={setQuery}
          results={filtered}
          selected={selected}
          onSelect={handleSelect}
        />

        <CourseDetails
          course={selected}
          sections={details}
          instructors={instructors}
          // isPinned={pin}
          onTogglePin={async () => {
            const updated = await fetchPinnedCourses();
            setPinned(updated);
          }}
          quarter={quarter}
        />
      </main>
    </div>
  );
}
