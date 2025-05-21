"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { ClassData } from "@/types/api";

interface ScheduleContextType {
  scheduledByQuarter: Record<string, ClassData[]>;
  addCourse: (quarterId: string, course: ClassData) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [scheduledByQuarter, setScheduledByQuarter] = useState<
    Record<string, ClassData[]>
  >({});

  function addCourse(quarterId: string, course: ClassData) {
    setScheduledByQuarter((prev) => {
      const list = prev[quarterId] || [];
      const key = `${course.subject}:${course.catalog_nbr}:${course.class_section}`;
      if (
        list.some(
          (c) => `${c.subject}:${c.catalog_nbr}:${c.class_section}` === key
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
  const ctx = useContext(ScheduleContext);
  if (!ctx) throw new Error("useSchedule must be used within ScheduleProvider");
  return ctx;
}
