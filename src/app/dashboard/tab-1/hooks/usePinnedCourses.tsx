import { useState } from "react";
import { ClassData } from "@/types/api";

export function usePinnedCourses() {
  const [pinned, setPinned] = useState<ClassData[]>([]);

  function togglePin(course: ClassData | null) {
    if (!course) return;
    const key = `${course.subject}:${course.catalog_nbr}`;
    setPinned((prev) => {
      if (prev.some((c) => `${c.subject}:${c.catalog_nbr}` === key)) {
        return prev.filter((c) => `${c.subject}:${c.catalog_nbr}` !== key);
      } else {
        return [...prev, course];
      }
    });
  }

  function isPinned(course: ClassData | null) {
    if (!course) return false;
    return pinned.some(
      (c) =>
        c.subject === course.subject && c.catalog_nbr === course.catalog_nbr
    );
  }

  return { pinned, togglePin, isPinned };
}
