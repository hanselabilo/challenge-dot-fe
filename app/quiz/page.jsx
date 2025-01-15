"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Quiz() {
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900); 
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [result, setResult] = useState({ correct: 0, incorrect: 0, total: 0 });

  const decodeHTML = (html) => {
    const text = document.createElement("textarea");
    text.innerHTML = html;
    return text.value;
  };

  //FETCH DATA
  useEffect(() => {
    const savedState = localStorage.getItem("quizState");
    if (savedState) {
      const {
        questions,
        currentQuestion,
        selectedOptions,
        timeLeft,
        quizCompleted,
        result,
      } = JSON.parse(savedState);
      setQuestions(questions);
      setCurrentQuestion(currentQuestion);
      setSelectedOptions(selectedOptions);
      setAnsweredCount(selectedOptions.filter((opt) => opt !== null).length);
      setTimeLeft(timeLeft);
      setQuizCompleted(quizCompleted);
      setResult(result);
    } else {
      fetch(
        "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.results) {
            const formattedQuestions = data.results.map((q) => ({
              ...q,
              options: shuffleOptions([
                q.correct_answer,
                ...q.incorrect_answers,
              ]),
            }));
            setQuestions(formattedQuestions);
            setSelectedOptions(Array(formattedQuestions.length).fill(null));
          }
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, []);

  // ACAK PILGAN
  const shuffleOptions = (options) => options.sort(() => Math.random() - 0.5);

  // QUIZ STATE
  useEffect(() => {
    if (questions.length > 0 && !quizCompleted) {
      localStorage.setItem(
        "quizState",
        JSON.stringify({
          questions,
          currentQuestion,
          selectedOptions,
          timeLeft,
          quizCompleted,
          result,
        })
      );
    }
  }, [
    questions,
    currentQuestion,
    selectedOptions,
    timeLeft,
    quizCompleted,
    result,
  ]);

  // PILGAN
  const handleOptionSelect = (index) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[currentQuestion] = index;
    setSelectedOptions(updatedOptions);
    if (selectedOptions[currentQuestion] === null) {
      setAnsweredCount(answeredCount + 1);
    }
  };

  // SUBMIT QUIZ
  const handleSubmit = () => {
    const answeredQuestions = selectedOptions.filter(
      (selected) => selected !== null
    ).length;

    const correct = selectedOptions.reduce((total, selected, index) => {
      if (
        selected !== null &&
        questions[index].options[selected] === questions[index].correct_answer
      ) {
        return total + 1;
      }
      return total;
    }, 0);

    const incorrect = answeredQuestions - correct;

    setResult({ correct, incorrect, total: answeredQuestions });
    setQuizCompleted(true);
    localStorage.setItem(
      "quizResult",
      JSON.stringify({ correct, incorrect, total: answeredQuestions })
    );
  };

  // TIMER
  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, quizCompleted]);

  // TIME FORMAT
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // HASIL
  if (quizCompleted) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 fade-in-main">
        <h1 className="text-3xl font-bold text-white">Quiz Completed!</h1>
        <h3 className="text-white font-bold text-2xl mb-4">
          This is your result:
        </h3>
        <div className="text-lg text-white mb-6 text-center">
          <p>Answered Questions: {result.total}</p>
          <p>Correct Answers: {result.correct}</p>
          <p>Incorrect Answers: {result.incorrect}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              localStorage.removeItem("quizState");
              localStorage.removeItem("quizResult");

              router.push("/dashboard");
            }}
            className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-all duration-300 font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // LOADING FETCH
  if (questions.length === 0) {
    return (
      <div className="text-white text-5xl flex justify-center items-center font-bold min-h-screen">
        Loading questions...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center p-6">
      <header className="mb-6 w-full flex justify-between items-center bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold">Quiz</h1>
        <div className="text-right">
          <p className="text-gray-600 font-bold text-base sm:text-lg">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <p className="text-gray-600 text-sm sm:text-base">
            Answered: {answeredCount}
          </p>
          <p className="text-red-500 font-semibold text-sm sm:text-base">
            Time Left: {formatTime(timeLeft)}
          </p>
        </div>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          {decodeHTML(questions[currentQuestion].question)}
        </h2>
        <div className="space-y-4">
          {questions[currentQuestion].options.map((option, index) => (
            <div
              key={index}
              className={`p-3 border rounded-lg cursor-pointer ${
                selectedOptions[currentQuestion] === index
                  ? "bg-yellow-100 border-yellow-500"
                  : "bg-white border-gray-300"
              }`}
              onClick={() => handleOptionSelect(index)}
            >
              {decodeHTML(option)}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-6">
          {currentQuestion > 0 ? (
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all duration-300"
            >
              Previous
            </button>
          ) : (
            <div></div> // SPACER
          )}
          <button
            onClick={
              currentQuestion < questions.length - 1
                ? () => setCurrentQuestion(currentQuestion + 1)
                : handleSubmit
            }
            className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-all duration-300"
          >
            {currentQuestion < questions.length - 1 ? "Next" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
