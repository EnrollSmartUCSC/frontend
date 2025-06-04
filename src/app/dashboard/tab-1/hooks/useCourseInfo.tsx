
import { CourseDetailsProps } from "@/types/api";

export async function useCourseInfo(course: {title: string, catalog_nbr: string, subject: string}): Promise<CourseDetailsProps> {
   const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/courseInfo?course_code=${course.subject.toLowerCase()}-${course.catalog_nbr.toLowerCase()}`
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function useCourseInstructors(sections: any[]): Promise<any[]> {
  const rmpResults = []

  for (const section of sections) {
    if (section.professor.name === "Staff") {
      rmpResults.push({
        professor: section.professor.name,
        subject: section.subject,
        catalog_nbr: section.catalog_nbr,
        section: section.section,
        rating: null,
      });
      continue; // Skip if the professor is "Staff"
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/professor-rating?teacher_name=${section.professor.name}&class_code=${section.subject}${section.catalog_nbr}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    if (data.message == "No professor found") {
      rmpResults.push({
        professor: section.professor.name,
        subject: section.subject,
        catalog_nbr: section.catalog_nbr,
        section: section.section,
        rating: null,
      });
    rmpResults.push(data);
    } else {
      const rating = data.message.split(": ")[1];
      rmpResults.push({
        professor: section.professor.name,
        subject: section.subject,
        catalog_nbr: section.catalog_nbr,
        section: section.section,
        rating: rating ? parseFloat(rating) : null,
      });
    }
  }
  return rmpResults;
}