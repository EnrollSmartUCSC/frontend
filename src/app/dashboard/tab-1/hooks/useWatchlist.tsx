import { auth } from "@/app/utils/firebase";
import { ClassData, watchlistClass } from "@/types/api";

export async function getwatchlist() {
  const token = await auth.currentUser?.getIdToken() || '';

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/watchlist`,
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

  return data;
}

export async function addToWatchlist(course: ClassData, quarter: string) {
  const token = await auth.currentUser?.getIdToken() || '';

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/watchlist`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(
        { subject: course.subject, catalog_nbr: course.catalog_nbr, quarter: quarter }
      ),
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  console.log("Add to watchlist response:", data);

  return data; 
}

export async function removeFromWatchlist(course: watchlistClass) {
  const token = await auth.currentUser?.getIdToken() || '';

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/watchlist`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(
        { subject: course.subject, catalog_nbr: course.catalog_nbr }
      ),
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();

  return data;
}