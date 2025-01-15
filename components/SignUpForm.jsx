"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const Router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const resExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const {user} = await resExists.json();

      if(user) {
        setError("User already exists.");
        return;
      }

      const res = await fetch("api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        Router.push("/");
      } else {
        console.log("Sign up failed.");
      }
    } catch (error) {
      console.log("Error signing up:", error);
    }
  };

  console.log("Name: ", name);

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <main className="w-full max-w-md fade-in-form-right">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                type="text"
                id="name"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your name"
              />
            </div>
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
              Sign Up
            </button>
            {/* LOGIN */}
            <div className="text-end mt-5">
              <Link
                href="/"
                className="text-sm underline text-gray-700 hover:text-yellow-500 transition-all duration-300"
              >
                Already have an account?
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
