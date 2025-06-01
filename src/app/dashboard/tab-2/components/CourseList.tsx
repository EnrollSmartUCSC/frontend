import React from "react";
import {  className } from "@/types/api";
// import { SearchPanel } from "../../tab-1/components/SearchPanel";
// import { useCourseSearch } from "../../tab-1/hooks/useCourseSearch";
import { DraggableCourseItem } from "./DraggableCourseItem";

interface Props {
  courses: className[];
  pinned: className[];
  // disableScroll?: boolean;
}

export function CourseList({ courses, pinned }: Props) {
    // const { query, setQuery, filtered } = useCourseSearch(sections);
    const [searchAll, setSearchAll] = React.useState(false);
    const [filtered, setFiltered] = React.useState<className[]>([]);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    setFiltered(courses);
  }, [courses]);

  function toggleSearchAll() {
    setSearchAll((prev) => !prev);
  }

  function onQueryChange(q: string) {
    setQuery(q.trim().toLowerCase());
    if (q.trim() === "") {
      setFiltered(courses);
      return;
    }
    const results = courses.filter((course) => 
      course.subject.toLowerCase().includes(query) ||
      course.catalog_nbr.toLowerCase().includes(query) ||
      course.title.toLowerCase().includes(query) ||
      (course.subject.toLowerCase() + course.catalog_nbr.toLowerCase()).includes(query) ||
      (course.subject.toLowerCase() + " " + course.catalog_nbr.toLowerCase()).includes(query)
    );
    console.log("Filtered results: ", results);
    setFiltered(results);
  }

  return (
    <aside
      className={
        "w-1/4 border-r p-4 overflow-auto"
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
      {searchAll && (
        <input
        type="text"
        placeholder="Search for Classes"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      )}
      <ul className="space-y-2">
        {pinned.filter((section) => (courses.map(c => `${c.subject}-${c.catalog_nbr}`).includes(`${section.subject}-${section.catalog_nbr}`) ? false : true))
          .map((section) => (
            <DraggableCourseItem key={`${section.subject}-${section.catalog_nbr}`} course={section} />
          ))}
        <hr />
        {!searchAll ? courses.map((course) => (
          <DraggableCourseItem key={`${course.subject}-${course.catalog_nbr}`} course={course} />
        )) : filtered.map((course) => (
          <DraggableCourseItem key={`${course.subject}-${course.catalog_nbr}`} course={course} />
        ))}
      </ul>
    </aside>
  );
}
