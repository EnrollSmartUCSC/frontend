"use client";

// import { signIn } from "next-auth/react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../login/login.module.css";

type SignupProps = {
  switchToLogin: () => void;
};

export default function Signup({ switchToLogin }: SignupProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailSignup = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          router.push("/dashboard");
        } else {
          alert(data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred. Please try again.");
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
    onAuthStateChanged(auth, async (user) => {
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
          Welcome to EnrollSmart!
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
          onClick={handleEmailSignup}
          className={`font-jetbrains text-white ${styles.continueButton}`}
        >
          Continue
        </button>

        <p className={`font-jetbrains ${styles.signupText}`}>
          Already have an account?{" "}
          <button onClick={switchToLogin} className={styles.signupLink}>
            Log In Here
          </button>
        </p>
      </div>
    </div>
  );
}
