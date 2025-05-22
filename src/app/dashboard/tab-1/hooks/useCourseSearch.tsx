import { useState, useMemo } from "react";
import { ClassData } from "@/types/api";

export function useCourseSearch(sections: ClassData[]) {
  const [query, setQuery] = useState("");

  const uniqueCourses = useMemo(() => {
    const map = new Map<string, ClassData>();
    for (const s of sections) {
      const key = `${s.subject}:${s.catalog_nbr}`;
      if (!map.has(key)) map.set(key, s);
    }
    return Array.from(map.values());
  }, [sections]);


  const filtered = useMemo(() => {
    if (!query.trim()) return uniqueCourses;
    const q = query.trim().toLowerCase();
    return uniqueCourses.filter(
      (c) =>
        c.subject.toLowerCase().includes(q) ||
        c.catalog_nbr.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        (c.subject.toLowerCase() + c.catalog_nbr.toLowerCase()).includes(q) ||
        (c.subject.toLowerCase() + " " + c.catalog_nbr.toLowerCase()).includes(q)
    );
  }, [query, uniqueCourses]);

  return { query, setQuery, filtered };
}
