// import { auth } from "@/app/lib/firebase";

import { auth } from "@/app/utils/firebase";
import { watchlistClass } from "@/types/api";

export async function getwatchlistData(watchlist: watchlistClass[] | null, quarter: string, trackingEnabled: boolean) {
  if (!watchlist || watchlist.length === 0) return [];

  const classData = await Promise.all(
    watchlist.map(async (course: { subject: string; catalog_nbr: string; }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/classData?quarter=${quarter}&subject=${course.subject}&class=${course.catalog_nbr}`
      );
      const data = await response.json();


      if (response.status === 404) {
        // console.log(`No course details found for ${course.subject} ${course.catalog_nbr} in quarter ${quarter}.`);
        return {
          subject: course.subject,
          catalog_nbr: course.catalog_nbr,
          title: "No course details found",
          instructor: ["N/A"],
          enrolled: [0],
          status: "Not offered",
          credits: 0,
          capacity: [0],
          isTracking: trackingEnabled,
        };
        }
      // console.log(`Fetched class data for ${course.subject} ${course.catalog_nbr} in quarter ${quarter}:`, data);
      if (!response.ok) {
        console.warn(`Failed to fetch class data for ${course.subject} ${course.catalog_nbr} in quarter ${quarter}.`);
        return null;
      }
      

      const classInfo = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/courseInfo?course_code=${course.subject.toLowerCase()}-${course.catalog_nbr.toLowerCase()}`
      );
      // if (!classInfo.ok) {
      //   throw new Error("Network response was not ok");
      // }
      const classDetails = await classInfo.json();
      if (classInfo.status === 404) {
        return {
          subject: course.subject,
          catalog_nbr: course.catalog_nbr,
          title: "No course details found",
          instructor: ["N/A"],
          enrolled: [0],
          status: "Not offered",
          credits: 0,
          capacity: [0],
          isTracking: trackingEnabled,
        }
      }

      const instructors: string[] = [];
      for (const section of data) {
        for (const instructor of section.instructors) {
          if (instructor.name) {
            instructors.push(instructor.name);
          }
        }
      }

      const uniqueInstructors = Array.from(new Set(instructors));

      const isOpen = data.some((section: { enrl_status: string; }) => section.enrl_status === "Open") ? "Open" : "Closed";
      
      const isWaitlisted = data.some((section: { enrl_status: string; }) => section.enrl_status === "Wait List") ? "Waitlist" : isOpen;

    const enrolled = data.map((section: { enrl_total: number }) => section.enrl_total);
    const capacity = data.map((section: { enrl_capacity: number }) => section.enrl_capacity);
      return {
        subject: data[0].subject,
        catalog_nbr: data[0].catalog_nbr,
        title: data[0].title,
        instructor: uniqueInstructors.join(" — "),
        enrolled: enrolled,
        capacity: capacity,
        credits: classDetails.credits || 0,
        status: isWaitlisted == "Waitlist" ? "Waitlist" : isOpen == "Open" ? "Open" : "Closed",
        waitlist: isWaitlisted === "Waitlist" ? data.map((section: { waitlist_total: number; }) => section.waitlist_total) : undefined,
        isTracking: trackingEnabled,
      };
    })
  );

  return classData.filter((data) => data !== null);
}

export async function getTrackingStatus() {
  const token = await auth.currentUser?.getIdToken() || '';
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/trackingStatus`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data.trackingEnabled;
}

export async function handleTracking(enabled: boolean) {
  const token = await auth.currentUser?.getIdToken() || '';
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/track`,
    {
      method: enabled ? "POST" : "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ enabled }),
    }
  );
  
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
}

export async function changeQuarter(quarter: string) {
  const token = await auth.currentUser?.getIdToken() || '';
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/tracking/quarter`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ quarter }),
    }
  );
  
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
}

export async function getTrackingQuarter() {
  const token = await auth.currentUser?.getIdToken() || '';
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/tracking/quarter`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }
  );
  
  if (!response.ok) {
    console.warn("Network response was not ok");
    return "2025 Fall Quarter"; // Default quarter if the request fails
  }
  
  const data = await response.json();
  return data.trackingQuarter;
}