import { ClassData } from "@/types/api";

export async function useRMPRatings(sections: ClassData[]): Promise<{ [key: string]: string }> {
  const ratings: { [key: string]: string } = {};

  for (const section of sections) {
    for (const instructor of section.instructors) {
      if (instructor.name === "Staff") {
        continue;
      }

      const key = `${instructor.name}-${section.catalog_nbr}`;
      if (!ratings[key]) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/professor-rating?teacher_name=${encodeURIComponent(
              instructor.name
            )}&class_code=${section.catalog_nbr}`
          );
          if (response.ok) {
            const data = await response.json();
            // Extracting only numeric rating
            // Regular message is something like "Average Rating for {instructor}: {rating}"
            // Seems to be the default format by the RMP API
            const numericRating = data.message.match(/(\d+(\.\d+)?)/)?.[0] || "N/A";
            ratings[key] = numericRating;
          } else {
            ratings[key] = "N/A";
          }
        } catch (error) {
          console.error("Error fetching professor rating:", error);
          ratings[key] = "Error";
        }
      }
    }
  }

  return ratings;
}