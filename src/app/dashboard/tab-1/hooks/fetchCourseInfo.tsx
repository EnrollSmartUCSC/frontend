import { CourseDetailsProps } from "@/types/api";

export async function fetchCourseInfo(course: {
  title: string;
  catalog_nbr: string;
  subject: string;
}): Promise<CourseDetailsProps> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${
      process.env.NEXT_PUBLIC_BACKEND_PORT
    }/api/v1/courseInfo?course_code=${course.subject.toLowerCase()}-${course.catalog_nbr.toLowerCase()}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();

  return {
    catalog_nbr: data.course_code,
    prerequisites: data.prerequisites,
    description: data.description,
    credits: data.credits,
  };
}
