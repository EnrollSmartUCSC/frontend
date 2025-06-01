/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React from "react";
import { ClassData } from "@/types/api";
import { CourseTable } from "./CourseTable";
import { CourseDetailsProps } from "@/types/api";
import { useCourseInfo, useCourseInstructors } from "../hooks/useCourseInfo";
import { usePinnedCourses } from "../hooks/usePinnedCourses";
import { Progress, Space } from "antd";
import type { ProgressProps } from 'antd';
import { Flex } from "antd";
import { Typography } from "antd";

const { Text } = Typography;
interface Props {
  course: ClassData | null;
  sections: ClassData[];
  instructors: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  // isPinned: boolean;
  onTogglePin: () => void;
  quarter?: string;
}

const colors: ProgressProps['strokeColor'] = {
  '0%': '#ff5802',
  "50%": '#ffe58f',
  '100%': '#5dd068',
};


export function CourseDetails({
  course,
  sections,
  // isPinned,
  instructors,
  onTogglePin,
  // quarter
}: Props) {
  if (!course) return <p className="text-gray-500">Select a course.</p>;
  const [courseInfo, setCourseInfo] = React.useState<CourseDetailsProps | null>(null);
  // const [sections, setSections] = React.useState<ClassData[]>([]);
  const { pinCourse, unpinCourse, isPinned } = usePinnedCourses();
  const [pinned, setpinned] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rmp, setRMP] = React.useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any

async function checkPinned() {
      if (!course) return;
      const pinned = await isPinned(course);
      setpinned(pinned);
    }

  React.useEffect(() => {
    setRMP([]);
    setCourseInfo(null);
    if (!course) return;
    async function fetchCourseDetails() {
      if (!course) return;
      const data = await useCourseInfo({
        title: course.title,
        catalog_nbr: course.catalog_nbr,
        subject: course.subject,});
      setCourseInfo(data);
    }

    async function fetchRMP() {
      if (!course) return;
      const data = await useCourseInstructors(instructors);
      setRMP(data);
    }
    // async function fetchSections() {
    //   if (!course) return;
    //   const response = await fetch(`/api/sections?courseId=${course.id}&quarter=${quarter}`);
    //   const data = await response.json();
    //   setSections(data);
    // }
    checkPinned();
    fetchCourseDetails();
    fetchRMP();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course, instructors]);

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
      <Space direction="horizontal" className="mt-4 flex-wrap justify-evenly">
        {rmp.length > 0 ? (
          rmp.map((i) => {
            console.log(i);
      if (i.rating === null || i.professor === "Staff") {
          return (
            <Flex key={i.section} className="flex-col items-center mt-4 justify-start">
              <Progress type="dashboard" strokeColor={colors} />
              <Text strong>{i.professor}</Text>
              <Text type="secondary">No rating available</Text>
            </Flex>
          );
      }
            const key = `${i.section}`;
       return(
       <Flex key={key} className="flex-col items-center mt-4 justify-start">
          <Progress type="dashboard" percent={parseFloat(((i.rating/5)*100).toFixed(2))} strokeColor={colors} />
          <Text strong>{i.professor}</Text>
          <Text strong>{`${i.subject} ${i.catalog_nbr}- ${i.section} `}</Text>
        </Flex>)
      })) : <></>}
      </Space>

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
