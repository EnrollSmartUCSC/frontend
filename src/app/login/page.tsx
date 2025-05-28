"use client";

import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (res) => {
        if (res.user) {
          router.push("/dashboard");
        }
      })
      .catch((error) => {
        console.error("Error signing in with email and password:", error);
      });
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    // Add any additional scopes you need here
    // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    // end of scopes
    // language by user
    auth.useDeviceLanguage();
    // redirect so user can select account
    signInWithPopup(auth, provider).then(async (res) => {
      if (res.user) {
        router.push("/dashboard");
      }
    });
    // set cookies to the token can be access by the code block below
  };

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in, you can access user information here
        router.push("/dashboard");
      }
    });
  }, [router]);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "#EFFCFF" }}
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
        {/* Yellow Triangle */}
        <div
          style={{
            position: "absolute",
            width: "200px",
            height: "160px",
            right: "100px",
            top: "50px",
            background:
              "linear-gradient(89.4deg, rgba(251, 231, 10, 0.46) 15.78%, rgba(239, 252, 255, 0.46) 87.49%)",
            borderRadius: "14px",
            transform: "rotate(45deg)",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          }}
        ></div>

        {/* Green Triangle */}
        <div
          style={{
            position: "absolute",
            width: "180px",
            height: "140px",
            left: "150px",
            bottom: "100px",
            background:
              "linear-gradient(89.4deg, rgba(93, 204, 32, 0.46) 15.78%, rgba(239, 252, 255, 0.46) 87.49%)",
            borderRadius: "9px",
            transform: "rotate(-30deg)",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          }}
        ></div>

        {/* Blue Triangle */}
        <div
          style={{
            position: "absolute",
            width: "160px",
            height: "120px",
            right: "200px",
            bottom: "150px",
            background:
              "linear-gradient(89.4deg, rgba(57, 184, 219, 0.46) 15.78%, rgba(239, 252, 255, 0.46) 87.49%)",
            borderRadius: "9px",
            transform: "rotate(120deg)",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          }}
        ></div>

        {/* Large Blue Circle */}
        <div
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            left: "-100px",
            top: "200px",
            background:
              "linear-gradient(194.02deg, #39B8DB 8.08%, #267BCA 93.09%)",
            borderRadius: "50%",
            boxShadow: "27px 0px 68.2px rgba(13, 96, 173, 0.09)",
          }}
        ></div>

        {/* Green Rectangle */}
        <div
          style={{
            position: "absolute",
            width: "250px",
            height: "300px",
            left: "50px",
            top: "150px",
            background: "linear-gradient(90deg, #60CF1B 0%, #4F9ADF 57.33%)",
            borderRadius: "20px",
          }}
        ></div>
      </div>

      {/* Main Content (hardcoded, really terrible to work with, going to change) */}
      <div className="relative z-10">
        {/* Rectangle 688 - Main grouping box */}
        <div
          style={{
            position: "absolute",
            width: "556px",
            height: "623px",
            left: "629px",
            top: "228px",
            transform: "translateY(-50px)",
            background: "#EFFCFF",
            boxShadow: "0px 4px 20.5px 6px rgba(50, 136, 202, 0.16)",
            borderRadius: "10px",
          }}
        />

        {/* Welcome to EnrollSmart! */}
        <h1
          className="font-jetbrains"
          style={{
            position: "absolute",
            width: "414px",
            height: "40px",
            left: "700px",
            top: "271px",
            transform: "translateY(-50px)",
            fontStyle: "normal",
            fontWeight: "800",
            fontSize: "24px",
            lineHeight: "40px",
            color: "#000000",
          }}
        >
          Welcome Back to EnrollSmart!
        </h1>

        {/* Rectangle 689 - Google Login Box */}
        <button
          onClick={() => signInWithGoogle()}
          className="flex items-center justify-center gap-3
                     hover:bg-gray-50 hover:cursor-pointer transition-colors duration-200"
          style={{
            position: "absolute",
            width: "465px",
            height: "78px",
            left: "670px",
            top: "337px",
            transform: "translateY(-50px)",
            background: "#EFFCFF",
            border: "1px solid #34A8D7",
            borderRadius: "14px",
            boxSizing: "border-box",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>

          <span
            className="font-jetbrains"
            style={{
              fontStyle: "normal",
              fontWeight: "400",
              fontSize: "24px",
              lineHeight: "32px",
              color: "#000000",
            }}
          >
            Continue with Google
          </span>
        </button>

        {/* or */}
        <div
          className="font-jetbrains"
          style={{
            position: "absolute",
            width: "36px",
            height: "40px",
            left: "885px",
            top: "435px",
            transform: "translateY(-50px)",
            fontStyle: "normal",
            fontWeight: "400",
            fontSize: "30px",
            lineHeight: "40px",
            color: "#000000",
          }}
        >
          or
        </div>

        {/* Rectangle 690 - Email Field */}
        <input
          type="email"
          placeholder="Email"
          className="font-jetbrains focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            position: "absolute",
            width: "465px",
            height: "78px",
            left: "670px",
            top: "500px",
            transform: "translateY(-50px)",
            background: "#EFFCFF",
            border: "1px solid #849BA4",
            borderRadius: "14px",
            boxSizing: "border-box",
            paddingLeft: "17px",
            paddingRight: "17px",
            fontStyle: "normal",
            fontWeight: "400",
            fontSize: "24px",
            lineHeight: "32px",
            color: "#999999",
          }}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />

        {/* Rectangle 691 - Password Field */}
        <input
          type="password"
          placeholder="Password"
          className="font-jetbrains focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            position: "absolute",
            width: "465px",
            height: "78px",
            left: "670px",
            top: "598px",
            transform: "translateY(-50px)",
            background: "#EFFCFF",
            border: "1px solid #849BA4",
            borderRadius: "14px",
            boxSizing: "border-box",
            paddingLeft: "17px",
            paddingRight: "17px",
            fontStyle: "normal",
            fontWeight: "400",
            fontSize: "24px",
            lineHeight: "32px",
            color: "#999999",
          }}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />

        {/* Rectangle 692 - Continue Button */}
        <button
          type="submit"
          className="font-jetbrains text-white
                     hover:opacity-90 hover:cursor-pointer transition-opacity duration-200"
          style={{
            position: "absolute",
            width: "465px",
            height: "78px",
            left: "670px",
            top: "696px",
            transform: "translateY(-50px)",
            background: "#0D60AD",
            borderRadius: "14px",
            border: "none",
            fontStyle: "normal",
            fontWeight: "400",
            fontSize: "24px",
            lineHeight: "32px",
          }}
          onClick={handleEmailLogin}
        >
          Continue
        </button>

        {/* Already have an account? Log In Here */}
        <p
          className="font-jetbrains"
          style={{
            position: "absolute",
            width: "432px",
            height: "26px",
            left: "687px",
            top: "800px",
            transform: "translateY(-50px)",
            fontStyle: "normal",
            fontWeight: "400",
            fontSize: "20px",
            lineHeight: "26px",
            color: "#000000",
          }}
        >
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="hover:cursor-pointer hover:underline"
            style={{ color: "#0D60AD" }}
          >
            Sign Up Here
          </button>
        </p>
      </div>
    </div>
  );
}
