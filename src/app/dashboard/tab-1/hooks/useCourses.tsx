import { useState, useEffect } from "react";
import { ClassData } from "@/types/api";

export function useCourses() {
  const [sections, setSections] = useState<ClassData[]>([]);

  useEffect(() => {
    async function fetchCourses() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/courses`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSections(data);
    }

    fetchCourses();
  }, []);

  return sections;
}
