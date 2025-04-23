import { CourseInfo } from "@/types/course";

export const mockCourses: CourseInfo[] = [
  {
    code: "CSE 140",
    name: "Programming Languages and Techniques",
    quarter: "Spring 2025",
    credits: 4,
    description:
      "An introduction to programming languages, focusing on paradigms and implementation.",
    prerequisites: "CSE 12 or equivalent",
    lectures: [
      {
        meeting_days: "Mon/Wed",
        start_time: "10:00 AM",
        end_time: "11:50 AM",
        location: "EH 206",
        instructor: "Dr. Alice Smith",
        lab_sections: [
          {
            meeting_days: "Fri",
            start_time: "2:00 PM",
            end_time: "3:50 PM",
            location: "EH 208",
            instructor: "TA John Doe",
          },
        ],
      },
    ],
  },
  {
    code: "CSE 101",
    name: "Software Construction",
    quarter: "Fall 2025",
    credits: 5,
    description: "Principles and techniques for large-scale software.",
    prerequisites: "CSE 12",
    lectures: [
      {
        meeting_days: "Tue/Thu",
        start_time: "2:00 PM",
        end_time: "3:50 PM",
        location: "ISB 121",
        instructor: "Prof. Bob Jones",
        lab_sections: [],
      },
    ],
  },
  {
    code: "MATH 1A",
    name: "Calculus I",
    quarter: "Summer 2025",
    credits: 4,
    description: "Differential calculus of one variable.",
    prerequisites: "None",
    lectures: [
      {
        meeting_days: "Mon/Wed/Fri",
        start_time: "9:00 AM",
        end_time: "9:50 AM",
        location: "Kresge 100",
        instructor: "Dr. Carol Lee",
        lab_sections: [],
      },
    ],
  },
];
