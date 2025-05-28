import { useState, useEffect } from "react";
import { ClassData } from "@/types/api";

export function useCourseDetails(selected: ClassData | null, quarter: string) {
  const [details, setDetails] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      if (!selected) {
        setDetails([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const selectedSubject = selected.subject;
        const selectedCatalogNbr = selected.catalog_nbr;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/classData?quarter=${quarter}&subject=${selectedSubject}&class=${selectedCatalogNbr}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setDetails([]);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [selected, quarter]);

  return { details, loading, error };
}
