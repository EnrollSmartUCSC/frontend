/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React from "react";
import { ClassData } from "@/types/api";
import { CourseTable } from "./CourseTable";
import { CourseDetailsProps } from "@/types/api";
import { useCourseInfo } from "../hooks/useCourseInfo";
import { usePinnedCourses } from "../hooks/usePinnedCourses";
import { useRMPRatings } from "../hooks/useRMPRatings";

interface Props {
  course: ClassData | null;
  sections: ClassData[];
  // isPinned: boolean;
  onTogglePin: () => void;
  quarter?: string;
}

export function CourseDetails({
  course,
  sections,
  // isPinned,
  onTogglePin,
  // quarter
}: Props) {
  if (!course) return <p className="text-gray-500">Select a course.</p>;
  const [courseInfo, setCourseInfo] = React.useState<CourseDetailsProps | null>(null);
  // const [sections, setSections] = React.useState<ClassData[]>([]);
  const { pinCourse, unpinCourse, isPinned } = usePinnedCourses();
  const [pinned, setpinned] = React.useState(false);
  const [ratings, setRatings] = React.useState<{ [key: string]: string }>({});

async function checkPinned() {
      if (!course) return;
      const pinned = await isPinned(course);
      setpinned(pinned);
    }

  React.useEffect(() => {
    async function fetchCourseDetails() {
      if (!course) return;
      const data = await useCourseInfo({
        title: course.title,
        catalog_nbr: course.catalog_nbr,
        subject: course.subject,});
      setCourseInfo(data);
    }

    async function fetchRMPRatings() {
      const data = await useRMPRatings(sections);
      setRatings(data);
    }

    // async function fetchSections() {
    //   if (!course) return;
    //   const response = await fetch(`/api/sections?courseId=${course.id}&quarter=${quarter}`);
    //   const data = await response.json();
    //   setSections(data);
    // }
    checkPinned();
    fetchCourseDetails();
    fetchRMPRatings();
  }, [course, sections]);

  async function pin(course: ClassData) {
    await pinCourse(course);
    await checkPinned();
    onTogglePin();
  }

  async function unpin(course: ClassData) {
    await unpinCourse(course);
    await checkPinned();
    onTogglePin();
  }

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

      <div className="mt-4">
        <h3 className="text-xl font-bold">Rate My Professor Ratings:</h3>
        <ul className="space-y-2">
          {sections.flatMap((sec) =>
            sec.instructors
              .filter((ins) => ins.name.toLowerCase() !== "staff") // Filter out "Staff"
              .map((ins) => (
                <li key={`${ins.name}-${sec.catalog_nbr}`} className="p-2 border rounded">
                  <strong>{ins.name}:</strong> {ratings[`${ins.name}-${sec.catalog_nbr}`] || "Fetching ratings..."}
                </li>
              ))
          )}
        </ul>
      </div>

      <div className="mt-auto">
        <button
          onClick={pinned ? () => unpin(course) : () => pin(course)}
          className="px-4 py-2 rounded hover:cursor-pointer"
          style={{ backgroundColor: "#FDC700", color: "#003C6C" }}
        >
          {pinned ? "Unpin Course" : "Pin Course"}
        </button>
      </div>
    </div>
  );
}
