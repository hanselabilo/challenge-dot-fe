"use client";
import CardList from "@components/CardList";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  // SAVE USER
  if (session?.user?.name) {
    localStorage.setItem("username", session.user.name);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center py-5 px-4 mx-4 border-b-2 border-b-yellow-white fade-in-header">
        <h1 className="text-5xl font-bold">
          <span className="text-yellow-500">Hello! </span>
          {session?.user?.name}
        </h1>
        <button
          onClick={() => {
            signOut();
            localStorage.removeItem("username"); 
          }}
          className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600 transition-all duration-300"
        >
          Logout
        </button>
      </header>
      <main className="flex flex-grow justify-center items-center fade-in-main">
        <div className="text-center w-3/4 h-3/4">
          <h2 className="text-3xl font-semibold mb-4 text-white">
            Ready to take the quiz?
          </h2>
          <div className="flex justify-center w-full">
            <CardList
              title="General Knowledge Quiz"
              description="You have 15 minutes to complete all the questions"
              target="/quiz/1"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
