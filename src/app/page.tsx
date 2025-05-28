"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "#EFFCFF" }} // Light blue background
    >
      {/* Background Shapes */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        {/* Polygon 1 - Yellow Triangle */}
        <div
          style={{
            position: "absolute",
            width: "265px",
            height: "214px",
            left: "1478.56px",
            top: "17px",
            background:
              "linear-gradient(89.4deg, rgba(251, 231, 10, 0.46) 15.78%, rgba(239, 252, 255, 0.46) 87.49%)",
            borderRadius: "14px",
            transform: "rotate(61.78deg)",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", // Makes it triangular
          }}
        ></div>

        {/* Polygon 2 - Green Triangle */}
        <div
          style={{
            position: "absolute",
            width: "155.97px",
            height: "123.98px",
            left: "896.55px",
            top: "744.24px",
            background:
              "linear-gradient(89.4deg, rgba(93, 204, 32, 0.46) 15.78%, rgba(239, 252, 255, 0.46) 87.49%)",
            borderRadius: "9px",
            transform: "rotate(147.65deg)",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", // Makes it triangular
          }}
        ></div>

        {/* Polygon 3 - Blue Triangle */}
        <div
          style={{
            position: "absolute",
            width: "223.64px",
            height: "114.79px",
            left: "170px",
            top: "740px",
            background:
              "linear-gradient(89.4deg, rgba(57, 184, 219, 0.46) 15.78%, rgba(239, 252, 255, 0.46) 87.49%)",
            borderRadius: "9px",
            transform: "rotate(64.13deg)",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", // Makes it triangular
          }}
        ></div>

        {/* Vector 2 - Blue section */}
        <div
          style={{
            position: "absolute",
            width: "872px",
            height: "90.59px",
            left: "1048px",
            top: "909px",
            background: "#0D60AD",
          }}
        ></div>

        {/* Vector 3 - Gradient overlay */}
        <div
          style={{
            position: "absolute",
            width: "971px",
            height: "332.42px",
            left: "1072.5px",
            top: "802.08px",
            background:
              "linear-gradient(180deg, rgba(123, 197, 217, 0.56) 0%, rgba(13, 96, 173, 0) 64.25%)",
          }}
        ></div>

        {/* Rectangle 687 - Green/Blue gradient rectangle */}
        <div
          style={{
            position: "absolute",
            width: "507px",
            height: "544px",
            left: "1257px",
            top: "481px",
            background: "linear-gradient(90deg, #60CF1B 0%, #4F9ADF 57.33%)",
            borderRadius: "26px",
          }}
        ></div>

        {/* Ellipse 139 - Large blue circle */}
        <div
          style={{
            position: "absolute",
            width: "771px",
            height: "771px",
            left: "1396px",
            top: "241px",
            background:
              "linear-gradient(194.02deg, #39B8DB 8.08%, #267BCA 93.09%)",
            borderRadius: "50%",
            boxShadow: "-27px 0px 68.2px rgba(13, 96, 173, 0.09)",
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-8">
          <div className="absolute" style={{ top: "280px", left: "186px" }}>
            <h1
              className="font-jetbrains font-extrabold text-gray-900"
              style={{
                width: "883px",
                fontSize: "64px",
                letterSpacing: "0%",
                lineHeight: "1.0",
                marginBottom: "40px",
                whiteSpace: "nowrap",
              }}
            >
              Welcome to EnrollSmart!
            </h1>

            <p
              className="font-inter font-light"
              style={{
                width: "948px",
                fontSize: "18px",
                lineHeight: "145%",
                letterSpacing: "0.02em",
                color: "#999999",
                marginBottom: "32px",
              }}
            >
              Enroll Smart is a simple solution to enrollment problems at UCSC.
              Students can use it as a one stop solution to enrollment problems
              where they can plan their degree, check the requirements on course
              catalog, check offerings of class and check review by previous
              students. During the peak enrollment season, students can even
              sign up for updates for open spots in high-demand class.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => router.push("/signup")}
                className="px-8 py-4 font-jetbrains font-semibold text-white rounded-lg 
                         hover:opacity-90 hover:cursor-pointer transition-opacity duration-200 
                         shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                style={{ backgroundColor: "#0D60AD" }}
              >
                Sign Up
              </button>

              <button
                onClick={() => router.push("/login")}
                className="px-8 py-4 font-jetbrains font-semibold rounded-lg 
                         hover:opacity-90 hover:cursor-pointer transition-opacity duration-200 
                         shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: "#F0EDED",
                  color: "#39B8DB",
                }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
