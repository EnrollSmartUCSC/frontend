"use client";

import React from "react";
import { useMockCourses } from "./tests/useMockCourses";
import { useCourseSearch } from "./hooks/useCourseSearch";
import { useCourseDetails } from "./hooks/useCourseDetails";
import { usePinnedCourses } from "./hooks/usePinnedCourses";
import { SearchPanel } from "./components/SearchPanel";
import { PinnedCoursesPanel } from "./components/PinnedCoursesPanel";
import { CourseDetails } from "./components/CourseDetails";
import { ClassData } from "@/types/api";

export default function Tab1Page() {
  const sections = useMockCourses();
  const { query, setQuery, filtered } = useCourseSearch(sections);
  const [selected, setSelected] = React.useState<ClassData | null>(null);
  const details = useCourseDetails(sections, selected);
  const { pinned, togglePin, isPinned } = usePinnedCourses();

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
          onSelect={setSelected}
        />

        <CourseDetails
          course={selected}
          sections={details}
          isPinned={isPinned(selected)}
          onTogglePin={() => togglePin(selected)}
        />
      </main>
    </div>
  );
}
