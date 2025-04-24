import { useState, useEffect } from "react";
import { ClassData } from "@/types/api";
import { mockCourses } from "./mockCourses";

export function useMockCourses() {
  const [sections, setSections] = useState<ClassData[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => setSections(mockCourses), 200);
    return () => clearTimeout(timeout);
  }, []);

  return sections;
}
