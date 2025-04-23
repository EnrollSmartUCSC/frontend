import { useState } from "react";
import { CourseInfo } from "@/types/course";

export function usePinnedCourses() {
  const [pinned, setPinned] = useState<CourseInfo[]>([]);

  function togglePin(course: CourseInfo | null) {
    if (!course) return;
    setPinned((prev) => {
      const exists = prev.some(
        (c) => c.code === course.code && c.quarter === course.quarter
      );
      return exists
        ? prev.filter(
            (c) => !(c.code === course.code && c.quarter === course.quarter)
          )
        : [...prev, course];
    });
  }

  function isPinned(course: CourseInfo | null) {
    if (!course) return false;
    return pinned.some(
      (c) => c.code === course.code && c.quarter === course.quarter
    );
  }

  return { pinned, togglePin, isPinned };
}
