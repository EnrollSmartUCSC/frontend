import { ClassData } from "@/types/api";
import { auth } from "@/app/utils/firebase";

export function usePinnedCourses() {
  async function fetchPinnedCourses() {
    let token = '';
    const user = auth.currentUser;
    if (user) {
      token = await user.getIdToken();
    }
    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/pin`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch pinned courses");
    }

    const data = await res.json();
    return data as ClassData[];
  }

  async function pinCourse(course: ClassData | null) {
    if (!course) return;
    const subject = course.subject;
    const catalogNbr = course.catalog_nbr;
    let token = '';
    const user = auth.currentUser;
    if (user) {
      token = await user.getIdToken();
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/pin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ subject, catalog_nbr: catalogNbr, title: course.title }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to pin course");
    }

    // const data = await res.json();
    // console.log("Pin course response:", data);
  }

  async function unpinCourse(course: ClassData | null) {
    if (!course) return;
    const subject = course.subject;
    const catalogNbr = course.catalog_nbr;
    let token = '';
    const user = auth.currentUser;
    if (user) {
      token = await user.getIdToken();
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/unpin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ subject, catalog_nbr: catalogNbr }),
      }
    );
    if (!res.ok) {
      throw new Error("Failed to unpin course");
    }
  }

  async function isPinned(course: ClassData | null) {
    if (!course) return false;
    // return pinned.some(
    //   (c) =>
    //     c.subject === course.subject && c.catalog_nbr === course.catalog_nbr
    // );
    const subject = course.subject;
    const catalogNbr = course.catalog_nbr;
    const token = await auth.currentUser?.getIdToken() || '';
    // console.log(token);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/pin`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    const result = data.some(
      (c: ClassData) =>
        c.subject === subject && c.catalog_nbr === catalogNbr
    );
    return result;
  }

  return { pinCourse, isPinned, fetchPinnedCourses, unpinCourse };
}
