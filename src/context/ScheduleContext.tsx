"use client";
import React, { createContext, useState, ReactNode } from "react";
import { className, plan } from "@/types/api";
import { auth } from "@/app/utils/firebase"; // Adjust the import based on your project structure
interface ScheduleContextType {
  scheduledByQuarter: Record<string, className[]>;
  addCourse: (quarterId: string, course: className) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [scheduledByQuarter, setScheduledByQuarter] = useState<
    Record<string, className[]>
  >({});

  function addCourse(quarterId: string, course: className) {
    setScheduledByQuarter((prev) => {
      const list = prev[quarterId] || [];
      const key = `${course.subject}:${course.catalog_nbr}:${course.title}`;
      if (
        list.some(
          (c) => `${c.subject}:${c.catalog_nbr}:${c.title}` === key
        )
      ) {
        return prev;
      }
      return { ...prev, [quarterId]: [...list, course] };
    });
  }

  return (
    <ScheduleContext.Provider value={{ scheduledByQuarter, addCourse }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  async function fetchSchedule(): Promise<plan> {
    const token = await auth.currentUser?.getIdToken() || '';
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/planner`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch schedule");
  }
  const data = await res.json();
  return data
}

async function addCourse(catalog_nbr: string, subject: string, title: string, quarter: string): Promise<void> {
  const token = await auth.currentUser?.getIdToken() || '';
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/planner`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      catalog_nbr,
      subject,
      title,
      quarter,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to add course");
  }
}

async function removeCourse(catalog_nbr: string, subject: string, quarter: string): Promise<void> {
  const token = await auth.currentUser?.getIdToken() || '';
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/planner`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      catalog_nbr,
      subject,
      quarter,
    }),
  });


  if (!res.ok) {
    throw new Error("Failed to remove course");
  }
}

return {
    fetchSchedule,
    addCourse,
    removeCourse,
}
}
