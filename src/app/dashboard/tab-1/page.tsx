"use client";

import React from "react";
import { useCourseSearch } from "./hooks/useCourseSearch";
import { usePinnedCourses } from "./hooks/usePinnedCourses";
import { PinnedCoursesPanel } from "./components/PinnedCoursesPanel";
import { SearchPanel } from "./components/SearchPanel";
import { CourseDetails } from "./components/CourseDetails";

export default function Tab1Page() {
  const { query, setQuery, filtered, selectedCourse, handleSelect } =
    useCourseSearch();
  const { pinned, togglePin, isPinned } = usePinnedCourses();

  return (
    <div className="flex flex-col h-screen">
      <header className="px-4 py-2 border-b">
        <h1 className="text-2xl font-bold">Course Search</h1>
      </header>

      <main className="flex flex-1 p-4 overflow-hidden">
        <PinnedCoursesPanel
          pinned={pinned}
          selectedCourse={selectedCourse}
          onSelect={handleSelect}
        />

        <SearchPanel
          query={query}
          onQueryChange={setQuery}
          results={filtered}
          selectedCourse={selectedCourse}
          onSelect={handleSelect}
        />

        <CourseDetails
          course={selectedCourse}
          isPinned={isPinned(selectedCourse)}
          onTogglePin={() => togglePin(selectedCourse)}
        />
      </main>
    </div>
  );
}
