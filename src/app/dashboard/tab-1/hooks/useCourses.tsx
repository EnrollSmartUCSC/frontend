import { ClassData } from "@/types/api";

export function useCourses() {

  async function fetchCourses() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/courses`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    return data as ClassData[];
  }

  return {
    fetchCourses,
  };
}
