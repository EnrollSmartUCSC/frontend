import { useState, useEffect } from "react";
import { ClassData } from "@/types/api";

export function useCourses() {
  const [sections, setSections] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError(null);

      // Spring lecture timeslots don't show up
      // I assume because it's too late in Spring qtr & API no longer displays data?
      let testqtr_fall = "2025 Fall Quarter";
      let testqtr_spring = "2025 Spring Quarter";

      try {
        // CSE courses only -- testing
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}${
            process.env.NEXT_PUBLIC_BACKEND_PORT
          }/api/v1/classData?quarter=${encodeURIComponent(
            testqtr_fall
          )}&subject=CSE&class=`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setSections(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setSections([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  return { sections, loading, error };
}
