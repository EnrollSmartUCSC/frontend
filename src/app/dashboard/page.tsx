"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardMain() {
  const router = useRouter();
  useEffect(() => {
    // This effect runs once when the component mounts
    router.push("/dashboard/tab-1");
    console.log("Dashboard component mounted");
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen">
    </div>
  );
}
