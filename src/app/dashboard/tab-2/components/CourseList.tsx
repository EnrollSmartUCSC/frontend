import React from "react";
import {  className } from "@/types/api";
// import { SearchPanel } from "../../tab-1/components/SearchPanel";
// import { useCourseSearch } from "../../tab-1/hooks/useCourseSearch";
import { DraggableCourseItem } from "./DraggableCourseItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import Input from "antd/es/input/Input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  courses: className[];
  pinned: className[];
  // disableScroll?: boolean;
}

export function CourseList({ courses, pinned }: Props) {
    // const { query, setQuery, filtered } = useCourseSearch(sections);
    const [searchAll, setSearchAll] = React.useState(false);
    const [filteredCourses, setFiltered] = React.useState<className[]>([]);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    setFiltered(courses);
  }, [courses]);

  // function toggleSearchAll() {
  //   setSearchAll((prev) => !prev);
  // }
  

  function onQueryChange(q: string) {
    setQuery(q);
    if (q.trim() === "") {
      setFiltered(courses);
      return;
    }
    const trimmedQuery = q.trim().toLowerCase();
    const results = courses.filter((course) => 
      course.subject.toLowerCase().includes(trimmedQuery) ||
      course.catalog_nbr.toLowerCase().includes(trimmedQuery) ||
      course.title.toLowerCase().includes(trimmedQuery) ||
      (course.subject.toLowerCase() + course.catalog_nbr.toLowerCase()).includes(trimmedQuery) ||
      (course.subject.toLowerCase() + " " + course.catalog_nbr.toLowerCase()).includes(trimmedQuery)
    );


    setFiltered(results);
  }

  return (
  <div className="w-80 border-r border-gray-200 bg-white flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Available Courses</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchAll(!searchAll)}
            className="text-blue-600 hover:text-blue-700"
          >
            {searchAll ? "Hide Search" : "Search"}
          </Button>
        </div>

        {searchAll && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for classes..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 overflow-y-auto p-2">
        <div className="p-4 space-y-2">
          {/* Pinned Courses */}
          {pinned.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Pinned Courses</h3>
              {pinned.map((course) => (
                <div key={`pinned-${course.subject}-${course.catalog_nbr}`} className="mb-2">
                  <DraggableCourseItem course={course} />
                </div>
              ))}
            </div>
          )}

          {/* All Courses */}
          {filteredCourses.length > 0 ? (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">All Courses</h3>
              {filteredCourses.map((course) => (
                <div key={`${course.subject}-${course.catalog_nbr}`} className="mb-2">
                  <DraggableCourseItem course={course} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No courses available</p>
            </div>
          )}

          {filteredCourses.length === 0 && pinned.length === 0 && query && (
            <div className="text-center py-8 text-gray-500">
              <p>No courses found matching &quot;{query}&quot;</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
