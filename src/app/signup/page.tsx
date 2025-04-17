"use client";

import Link from "next/link";

export default function Signup() {
  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup placeholder");
    // Send to backend
  };

  const handleGoogleSignup = () => {
    console.log("Signup Google Auth placeholder");
    // Send to backend
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome to EnrollSmart!</h1>

      {/* Google Signup */}
      <button
        onClick={handleGoogleSignup}
        className="flex items-center gap-2 mb-4 px-10 py-2 border rounded
          hover:bg-gray-100 hover:cursor-pointer
          shadow-md active:shadow-sm"
        style={{ borderColor: "#000" }}
      >
        {/* TODO: add google logo to button */}
        Continue with Google
      </button>

      <h2 className="text-sm mb-4">or</h2>

      {/* Email Signup */}
      {/* TODO: Restrict to UCSC Email? */}
      <form className="flex flex-col gap-4 w-80" onSubmit={handleEmailSignup}>
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

        {/* Button colors from UCSC Canvas logo */}
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
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Log In Here
        </Link>
      </p>

      <Link href="/" className="absolute top-4 left-4">
        &lt;- Back to Homepage (placeholder for testing)
      </Link>

      <Link href="/dashboard" className="absolute top-4 right-4">
        -&gt; Go to dashboard (placeholder for testing)
      </Link>
    </div>
  );
}
