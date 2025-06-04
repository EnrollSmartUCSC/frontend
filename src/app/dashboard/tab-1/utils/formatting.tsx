export function normalize(s: string): string {
  return s.replace(/\s+/g, "").toLowerCase();
}

export function filterCourses(
  courses: Array<{ code: string; name: string; quarter: string }>,
  query: string
) {
  const q = normalize(query);
  return courses.filter((c) => {
    const codeKey = normalize(c.code);
    const nameKey = normalize(c.name);
    if (codeKey.includes(q)) return true;
    const alpha = codeKey.match(/^[a-z]+/)?.[0] || "";
    if (alpha.startsWith(q)) return true;
    if (nameKey.includes(q)) return true;
    return false;
  });
}
