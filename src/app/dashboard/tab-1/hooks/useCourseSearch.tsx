import { useState, useEffect, useMemo } from "react";
import { CourseSummary, CourseInfo } from "@/types/course";
import { mockCourses } from "../mockCourses";
import { filterCourses } from "../utils/formatting";

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

export function useCourseSearch() {
  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseInfo | null>(null);

  useEffect(() => {
    setCourses(
      mockCourses.map(({ code, name, quarter }) => ({ code, name, quarter }))
    );
  }, []);

  const filtered = useMemo(
    () => (query.trim() ? filterCourses(courses, query) : courses),
    [query, courses]
  );

  function handleSelect(summary: CourseSummary) {
    const full = mockCourses.find(
      (c) => c.code === summary.code && c.quarter === summary.quarter
    )!;
    setSelectedCourse(full);
  }

  return { query, setQuery, filtered, selectedCourse, handleSelect };
}
