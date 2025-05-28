/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React from "react";
import { ClassData } from "@/types/api";
import { CourseTable } from "./CourseTable";
import { CourseDetailsProps } from "@/types/api";
import { fetchCourseInfo } from "../hooks/fetchCourseInfo";

interface Props {
  course: ClassData | null;
  sections: ClassData[];
  isPinned: boolean;
  onTogglePin: () => void;
  loading?: boolean;
  error?: string | null;
}

export function CourseDetails({
  course,
  sections,
  isPinned,
  onTogglePin,
  loading = false,
  error = null,
}: Props) {
  if (!course) return <p className="text-gray-500">Select a course.</p>;
  const [courseInfo, setCourseInfo] = React.useState<CourseDetailsProps | null>(
    null
  );

  React.useEffect(() => {
    async function fetchCourseDetails() {
      if (!course) return;
      const data = await fetchCourseInfo({
        title: course.title,
        catalog_nbr: course.catalog_nbr,
        subject: course.subject,
      });
      setCourseInfo(data);
    }

    fetchCourseDetails();
  }, [course]);

  return (
    <div className="flex-1 ml-4 border rounded p-4 flex flex-col overflow-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">
          {course.subject} {course.catalog_nbr} — {course.title}
        </h2>
        <p className="mt-2">
          <strong>Description:</strong> {courseInfo?.description}
        </p>
        <p className="mt-2">
          <strong>Credits:</strong> {courseInfo?.credits}
        </p>
        <p className="mt-2">{}</p>
        <p className="mt-2">
          <strong>Prerequisites:</strong> {courseInfo?.prerequisites}
        </p>
      </div>

      <CourseTable sections={sections} />

      <div className="mt-auto">
        <button
          onClick={onTogglePin}
          className="px-4 py-2 rounded hover:cursor-pointer"
          style={{ backgroundColor: "#FDC700", color: "#003C6C" }}
        >
          {isPinned ? "Unpin Course" : "Pin Course"}
        </button>
      </div>
    </div>
  );
}
