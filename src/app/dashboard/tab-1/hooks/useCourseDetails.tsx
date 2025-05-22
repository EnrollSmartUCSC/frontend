import { useMemo } from "react";
import { ClassData } from "@/types/api";

export function useCourseDetails(
  selected: ClassData | null,
  quarter: string
) {
  const details = useMemo(async () => {
    if (!selected) return [];
    // return sections.filter(
    //   (s) =>
    //     s.subject === selected.subject && s.catalog_nbr === selected.catalog_nbr
    // );

    const selectedSubject = selected.subject;
    const selectedCatalogNbr = selected.catalog_nbr;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/classData?quarter=${quarter}&subject=${selectedSubject}&class=${selectedCatalogNbr}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();


    return data;
    
  }, [selected, quarter]);

  return details;
}
