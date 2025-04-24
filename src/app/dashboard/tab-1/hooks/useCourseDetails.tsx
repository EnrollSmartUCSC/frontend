import { useMemo } from "react";
import { ClassData } from "@/types/api";

export function useCourseDetails(
  sections: ClassData[],
  selected: ClassData | null
) {
  const details = useMemo(() => {
    if (!selected) return [];
    return sections.filter(
      (s) =>
        s.subject === selected.subject && s.catalog_nbr === selected.catalog_nbr
    );
  }, [sections, selected]);

  return details;
}
