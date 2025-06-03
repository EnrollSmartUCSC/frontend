"use client";

import { useState } from "react";
import Login from "./login/login";
import Signup from "./signup/signup";

export default function LandingPage() {
   // Defaults to signup
   // Change to ("login"); if you want login to be the default mode
  const [mode, setMode] = useState<"login" | "signup">("signup");

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#EFFCFF]"
      style={{
        backgroundImage: "url('/LandingPage.svg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full h-full flex items-center">
        <div className="container mx-auto px-8 flex flex-col lg:flex-row items-center justify-between">
          <div className="w-full lg:w-1/2 text-left mb-12 lg:mb-0">
            <h1
              className="font-jetbrains font-extrabold text-gray-900"
              style={{
                fontSize: "64px",
                lineHeight: "1.0",
                marginBottom: "1rem",
              }}
            >
              Welcome to EnrollSmart!
            </h1>
            <p
              className="font-inter font-light text-[#999999]"
              style={{
                fontSize: "18px",
                lineHeight: "1.45",
                letterSpacing: "0.02em",
                maxWidth: "700px",
              }}
            >
              Enroll Smart is a simple solution to enrollment problems at UCSC.
              Students can use it as a one‐stop solution to enrollment problems
              where they can plan their degree, check the requirements on course
              catalog, check offerings of classes, and read reviews by previous
              students. During peak enrollment season, students can even sign up
              for updates about open spots in high‐demand classes.
            </p>
          </div>
          <div className="w-full lg:w-1/3">
            {mode === "login" ? (
              <Login switchToSignup={() => setMode("signup")} />
            ) : (
              <Signup switchToLogin={() => setMode("login")} />
            )}
          </div>
        </div>
        </div>
    </div>
  );
}
