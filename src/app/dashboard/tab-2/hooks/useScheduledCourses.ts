import { useState } from "react";
import { ClassData } from "@/types/api";

export function useScheduledCourses() {
  const [scheduled, setScheduled] = useState<ClassData[]>([]);

  function addCourse(course: ClassData) {
    const key = `${course.subject}:${course.catalog_nbr}:${course.class_section}`;
    setScheduled((prev) =>
      prev.some(
        (c) => `${c.subject}:${c.catalog_nbr}:${c.class_section}` === key
      )
        ? prev
        : [...prev, course]
    );
  }

  return { scheduled, addCourse };
}
