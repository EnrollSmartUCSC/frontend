"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";


export default function Login() {
  const handleEmailLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: implement email/password login via your backend or NextAuth credentials
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome Back to EnrollSmart!</h1>

      {/* Google Login */}
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
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
      <form className="flex flex-col gap-4 w-80" onSubmit={handleEmailLogin}>
        <input
          type="email"
          placeholder="Email"
          className="px-3 py-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="px-3 py-2 border rounded"
          required
        />
        
        <button
          type="submit"
          className="px-4 py-2 text-white rounded
                     hover:bg-gray hover:cursor-pointer
                     shadow-md active:shadow-sm"
          style={{ backgroundColor: "#FDC700", color: "#003C6C" }}
        >
          Continue
        </button>
      </form>

      <p className="mt-4">
        Don’t have an account?{" "}
        <Link href="/signup" className="text-blue-500 hover:underline">
          Sign Up Here
        </Link>
      </p>

      <Link href="/" className="absolute top-4 left-4">
        &lt;- Back to Homepage
      </Link>

      <Link href="/dashboard" className="absolute top-4 right-4">
        -&gt; Go to Dashboard
      </Link>
    </div>
  );
}
