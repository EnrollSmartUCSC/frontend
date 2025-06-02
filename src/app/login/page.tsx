"use client";

import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";


export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const handleEmailLogin = () => {
    signInWithEmailAndPassword(auth, email, password).then(async (res) => {
      if (res.user) {
        router.push("/dashboard");
      }
    }).catch((error) => {
      console.error("Error signing in with email and password:", error);
    });
  }

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
  }

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in, you can access user information here
        router.push("/dashboard");
      }
    });
  }, [router])

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome Back to EnrollSmart!</h1>

      {/* Google Login */}
      <button
        onClick={() => signInWithGoogle()}
        className="flex items-center gap-2 mb-4 px-10 py-2 border rounded
                   hover:bg-gray-100 hover:cursor-pointer
                   shadow-md active:shadow-sm"
        style={{ borderColor: "#000" }}
      >
        {/* TODO: add Google logo */}
        Continue with Google
      </button>

      <h2 className="text-sm mb-4">or</h2>

      {/* Email Login */}
      {/* Email Signup */}
        <input
          type="email"
          placeholder="Email"
          className="px-3 py-2 border rounded"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="px-3 py-2 border rounded"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />

        <button
          className="px-4 py-2 text-white rounded
                     hover:bg-gray hover:cursor-pointer
                     shadow-md active:shadow-sm"
          style={{ backgroundColor: "#FDC700", color: "#003C6C" }}
          onClick={handleEmailLogin}
        >
          Sign In
        </button>

      <p className="mt-4">
        Don&apost have an account?{" "}
        <button
          onClick={() => router.push("/signup")}
          className="text-blue-500 hover:cursor-pointer hover:underline"
        >
          Sign up Here
        </button>
      </p>

      {/* <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 hover:cursor-pointer"
      >
        &lt;- Back to Homepage (placeholder)
      </button>

      <button
        onClick={() => router.push("/dashboard")}
        className="absolute top-4 right-4 hover:cursor-pointer"
      >
        -&gt; Go to dashboard (placeholder for testing)
      </button> */}
    </div>
  );
}
