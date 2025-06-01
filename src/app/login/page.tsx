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
import styles from "./login.module.css";

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
      <div className={styles.shapesContainer}>
        <div className={styles.yellowTriangle} />
        <div className={styles.greenTriangle} />
        <div className={styles.blueTriangle} />
        <div className={styles.largeCircle} />
      </div>

      <div className="relative z-10">
        <div className={styles.mainRect} />
        <h1 className={`font-jetbrains ${styles.welcomeText}`}>
          Welcome Back to EnrollSmart!
        </h1>

        <button
          onClick={() => signInWithGoogle()}
          className={styles.googleLogin}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04
                 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23
                 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99
                 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43
                 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97
                 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6
                 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="font-jetbrains text-[24px] font-jetbrains">
            Continue with Google
          </span>
        </button>

        <div className={styles.orText}>or</div>

        <input
          type="email"
          placeholder="Email"
          className={`font-jetbrains focus:outline-none focus:ring-2 focus:ring-blue-500 ${styles.emailField}`}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className={`font-jetbrains focus:outline-none focus:ring-2 focus:ring-blue-500 ${styles.passwordField}`}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />

        <button
          type="submit"
          onClick={handleEmailLogin}
          className={`font-jetbrains text-white ${styles.continueButton}`}
        >
          Continue
        </button>

        <p className={`font-jetbrains ${styles.signupText}`}>
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className={styles.signupLink}
          >
            Sign Up Here
          </button>
        </p>
      </div>
    </div>
  );
}
