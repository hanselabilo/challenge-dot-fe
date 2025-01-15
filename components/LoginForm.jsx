"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const res = await signIn('credentials', {
        email, password, redirect: false
      });

      if(res.error) {
        setError("Invalid User");
        return;
      }

      router.replace("dashboard");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <main className="w-full max-w-md fade-in-form-left">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your password"
              />
            </div>
            {/* ERROR */}
            {error && (
              <div className="rounded-md my-2">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}
            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-all duration-300"
            >
              Login
            </button>
          </form>
          <div className="text-end mt-5">
            <Link
              href="/signup"
              className="text-sm underline text-gray-700 hover:text-yellow-500 transition-all duration-300"
            >
              Don't have an account?
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
