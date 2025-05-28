import { ClassData } from "@/types/api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3010/api/v1";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || res.statusText);
  }
  return res.json() as Promise<T>;
}

export function fetchClassData(
  subject: string,
  catalog_nbr: string,
  quarter: string
): Promise<ClassData[]> {
  const params = new URLSearchParams({ subject, class: catalog_nbr, quarter });
  return fetch(`${API_BASE}/classData?${params}`).then((r) =>
    handleResponse<ClassData[]>(r)
  );
}
