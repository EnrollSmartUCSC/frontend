// import Image from "next/image";
{
  /* no images yet, but will include logo soon */
}
"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 items-center text-center">
        <h1 className="text-4xl font-bold">Welcome to EnrollSmart!</h1>

        <p className="text-lg text-gray-700">
          Enroll Smart is a simple solution to enrollment problems at UCSC.
          Students can use it as a one stop solution to enrollment problems
          where they can plan their degree, check the requirements and course
          catalog, check offerings of class and check review by previous
          students. During the peak enrollment season, students can even sign up
          for updates for open spots in high-demand class.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/signup")}
            className="px-6 py-3 bg-blue-500 text-white rounded
              hover:bg-blue-600 hover:cursor-pointer"
          >
            Sign Up
          </button>

          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 bg-gray-500 text-white rounded 
              hover:bg-gray-600 hover:cursor-pointer"
          >
            Login
          </button>
        </div>
      </main>
    </div>
  );
}
