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

type LoginProps = {
  switchToSignup: () => void;
};

export default function Login({ switchToSignup }: LoginProps) {
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
    <div className={styles.mainRect}>
      <div className={styles.mainRectInner}>
        <h1 className={`font-jetbrains ${styles.welcomeText}`}>
          Welcome Back to EnrollSmart!
        </h1>

        <button onClick={signInWithGoogle} className={styles.googleLogin}>
          <img
            src="/google.svg"
            alt="Google Logo"
            width={20}
            height={20}
            className="mr-2 inline-block"
          />
          <span className="font-jetbrains">Continue with Google</span>
        </button>

        <div className={styles.orText}>― or ―</div>

        <input
          type="email"
          placeholder="Email"
          className={`font-jetbrains ${styles.emailField}`}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className={`font-jetbrains ${styles.passwordField}`}
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
          Don’t have an account?{" "}
          <button onClick={switchToSignup} className={styles.signupLink}>
            Sign Up Here
          </button>
        </p>
      </div>
    </div>
  );
}
