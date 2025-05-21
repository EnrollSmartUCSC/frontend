"use client";

// import { signIn } from "next-auth/react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth } from "../utils/firebase"; 
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailSignup = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
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
    })
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
  }
  
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, you can access user information here
        router.push("/dashboard");
      }});
  }, [router]); 

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome to EnrollSmart!</h1>

      {/* Google Signup */}
      <button
        onClick={() => (signInWithGoogle())}
        className="flex items-center gap-2 mb-4 px-10 py-2 border rounded
                   hover:bg-gray-100 hover:cursor-pointer
                   shadow-md active:shadow-sm"
        style={{ borderColor: "#000" }}
      >
        {/* TODO: add Google logo */}
        Continue with Google
      </button>

      <h2 className="text-sm mb-4">or</h2>

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
          type="submit"
          className="px-4 py-2 text-white rounded
                     hover:bg-gray hover:cursor-pointer
                     shadow-md active:shadow-sm"
          style={{ backgroundColor: "#FDC700", color: "#003C6C" }}
          onClick={handleEmailSignup}
        >
          Continue
        </button>
      <p className="mt-4">
        Already have an account?{" "}
        <button
          onClick={() => router.push("/login")}
          className="text-blue-500 hover:cursor-pointer hover:underline"
        >
          Log In Here
        </button>
      </p>


      <button
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
      </button>
    </div>
  );
}
