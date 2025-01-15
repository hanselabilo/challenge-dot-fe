import { useRouter } from "next/navigation";

export default function CardList({ title, description }) {
  const router = useRouter();

  const handleNavigate = () => {
    localStorage.setItem("quizInProgress", JSON.stringify({ title, description }));
    router.push("/quiz");
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white transform transition-transform duration-300 hover:scale-105 w-full">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-700 mb-4">{description}</p>
      <button
        onClick={handleNavigate}
        className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-3 px-7 sm:py-2 sm:px-5 rounded-lg text-lg hover:from-yellow-500 hover:to-yellow-700 transition-colors duration-300"
      >
        Start Quiz
      </button>
    </div>
  );
}
