import { useState } from "react";

interface ActivityComponentProps {
  onBack: () => void;
  onComplete?: () => void;
  answers: string[];
  isCorrect: (boolean | null)[];
  onAnswersChange: (answers: string[]) => void;
  onCorrectChange: (isCorrect: (boolean | null)[]) => void;
  onLogBehavior: (location: string, behavior: string, input: string, result: string) => void;
}

export default function Word1({ 
  onBack,
  onComplete,
  answers: propAnswers,
  isCorrect: propIsCorrect,
  onAnswersChange,
  onCorrectChange,
  onLogBehavior
}: ActivityComponentProps) {
  const questions = [
    {
      question: "Sally baked 24 cookies for the party tonight. Katy brought 27 cookies. How many cookies do they have altogether for the party?",
      correctAnswer: 51,
      image: "/img/word1-cookies.png",
    },
    {
      question: "Anna read 56 books this month. John read 38 books. How many books did they read altogether?",
      correctAnswer: 94,
      image: "/img/word1-books.png",
    },
    {
      question: "The pet store had 67 cats. 29 cats were adopted. How many cats are left at the pet store?",
      correctAnswer: 38,
      image: "/img/word1-cats.png",
    },
  ];

  // Initialize answers with empty strings and isCorrect with null if they're empty
  const answers = propAnswers.length ? propAnswers : Array(questions.length).fill("");
  const isCorrect = propIsCorrect.length ? propIsCorrect : Array(questions.length).fill(null);

  const handleInputChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    onAnswersChange(updatedAnswers);

    // Log each complete input value
    if (value) {
      onLogBehavior(
        `word1-question-${index + 1}`,
        "input",
        `user-input:${value}`,
        "in-progress"
      );
    }
  };

  const checkAnswer = async (index: number) => {
    const userAnswer = parseInt(answers[index]);
    const correct = userAnswer === questions[index].correctAnswer;

    await onLogBehavior(
      `word1-question-${index + 1}`,
      "click",
      `check-answer-button:${userAnswer}`,
      correct ? "correct" : "incorrect"
    );

    const updatedIsCorrect = [...isCorrect];
    updatedIsCorrect[index] = correct;
    onCorrectChange(updatedIsCorrect);
  };

  const handleNext = async () => {
    if (isCorrect.some((result) => result !== true)) {
      alert("Please solve all the problems correctly before moving on!");
      return;
    }

    await onLogBehavior(
      "word1",
      "click",
      "next-button-word1",
      "complete"
    );
    
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <div className="w-full max-w-3xl text-left">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl mb-10 text-center text-[#13294B]">Read and answer each question.</h2>

          {questions.map((q, index) => (
            <div key={index} className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xl text-[#13294B] flex-1">{q.question}</p>
                <img
                  src={q.image}
                  alt={`Question ${index + 1}`}
                  className="w-auto h-[6rem] rounded-lg ml-4"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  value={answers[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  className="border-2 border-gray-300 rounded-lg px-4 py-2 text-xl mb-2"
                  placeholder="Enter your answer"
                  style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                />
                <button
                  onClick={() => checkAnswer(index)}
                  className="bg-[#8CC63E] text-white text-xl px-6 py-2 rounded-lg ml-4"
                >
                  Check Answer
                </button>
              </div>
              {isCorrect[index] !== null && (
                <div
                  className={`mt-2 text-sls ${
                    isCorrect[index] ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isCorrect[index] ? "Correct!" : "Try again!"}
                </div>
              )}
            </div>
          ))}

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="bg-[#FF5F05] text-white px-6 py-2 rounded-lg mt-4"
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}
