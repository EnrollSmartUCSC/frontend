import React from "react";
import {  className } from "@/types/api";
// import { SearchPanel } from "../../tab-1/components/SearchPanel";
// import { useCourseSearch } from "../../tab-1/hooks/useCourseSearch";
import { DraggableCourseItem } from "./DraggableCourseItem";
import { useCourses } from "../../tab-1/hooks/useCourses";

interface Props {
  courses: className[];
  disableScroll?: boolean;
}

export function CourseList({ courses, disableScroll }: Props) {
    const [sections, setSections] = React.useState<className[]>([]);
    // const { query, setQuery, filtered } = useCourseSearch(sections);
    const [searchAll, setSearchAll] = React.useState(false);
    const { fetchCourses } = useCourses();

  React.useEffect(() => {
    (async () => {
      const c = await fetchCourses();
      // remove duplicates based on subject, and catalog_nbr
      const uniqueCourses = Array.from(
        new Map(c.map((item) => [`${item.subject}-${item.catalog_nbr}`, item])).values()
      );
      setSections(uniqueCourses);
    })()
  });

  function toggleSearchAll() {
    setSearchAll((prev) => !prev);
  }

  return (
    <aside
      className={
        "w-1/4 border-r p-4 " +
        (disableScroll ? "overflow-hidden" : "overflow-auto")
      }
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold mb-4">Available Courses</h2>
        <button
          onClick={toggleSearchAll}
          className="text-sm text-blue-500 hover:underline"
        >
          {searchAll ? "Hide Search" : "Search All Courses"}
        </button>
      </div>
      <ul className="space-y-2">
        {courses.map((course) => (
          <DraggableCourseItem key={`${course.subject}-${course.catalog_nbr}`} course={course} />
        ))}
        <hr />
        {sections.filter((section) => (courses.map(c => `${c.subject}-${c.catalog_nbr}`).includes(`${section.subject}-${section.catalog_nbr}`) ? false : true))
          .map((section) => (
            <DraggableCourseItem key={`${section.subject}-${section.catalog_nbr}`} course={section} />
          ))}
      </ul>
    </aside>
  );
}
