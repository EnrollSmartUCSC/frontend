"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login placeholder");
  };

  const handleGoogleLogin = () => {
    console.log("Login Google Auth placeholder");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome Back to EnrollSmart!</h1>

      {/* Google Signup */}
      <button
        onClick={handleGoogleLogin}
        className="flex items-center gap-2 mb-4 px-10 py-2 border rounded
          hover:bg-gray-100 hover:cursor-pointer
          shadow-md active:shadow-sm"
        style={{ borderColor: "#000" }}
      >
        Continue with Google
      </button>

      <h2 className="text-sm mb-4">or</h2>

      {/* Email Signup */}
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
        Don't have an account?{" "}
        <button
          onClick={() => router.push("/signup")}
          className="text-blue-500 hover:cursor-pointer hover:underline"
        >
          Sign up Here
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
