import { useState } from "react";

interface ActivityComponentProps {
  onBack: () => void;
  onComplete?: () => void;
  answers: string[];
  isCorrect: (boolean | null)[];
  onAnswersChange: (answers: string[]) => void;
  onCorrectChange: (isCorrect: (boolean | null)[]) => void;
}

export default function Word3({ 
  onBack, 
  onComplete,
  answers,
  isCorrect,
  onAnswersChange,
  onCorrectChange
}: ActivityComponentProps) {
  const questions = [
    {
      question: (
        <>
          Emma is hosting a big picnic party in the park, and she’s buying snacks for her friends: She picks up 27 cookies for dessert. Next, she grabs 26 sandwiches for lunch. Then, she gets 41 juice boxes to keep everyone refreshed. Finally, she adds 39 apples for a healthy treat.{" "}
          <b>How many snacks did Emma bring to her picnic in total?</b> Can you count them all before the picnic starts?
        </>
      ),
      correctAnswer: 133,
      image: "/img/word3-snacks.png",
    },
    {
      question: (
        <>
          Sarah finds $145 in her treasure chest and decides to use it for a fun shopping spree! She spends $23 on a pirate’s map to find even more treasure. Then, she uses $57 to buy a shiny new telescope. Finally, she spends $46 on a magical compass.{" "}
          <b>How much treasure money does Sarah have left after her exciting adventure?</b> Can you figure it out before she sails away?
        </>
      ),
      correctAnswer: 19,
      image: "/img/word3-treasure.png",
    },
    {
      question: (
        <>
          A magical library in the forest is collecting books to fill its shelves! Four generous animals bring their favorite stories to donate: Alex the Alligator brings 55 books about rivers and swamps. Bailey the Bunny hops in with 26 books full of carrot recipes. Casey the Cat arrives with 33 books about adventures with mice. Dylan the Deer gallops over with 62 books about the great outdoors.{" "}
          <b>How many books did the library receive altogether?</b> Can you help the librarian count them?
        </>
      ),
      correctAnswer: 176,
      image: "/img/word3-animalsbooks.png",
    },
  ];

  const handleInputChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    onAnswersChange(updatedAnswers);
  };

  const checkAnswer = (index: number) => {
    const userAnswer = parseInt(answers[index]);
    const correct = userAnswer === questions[index].correctAnswer;

    const updatedIsCorrect = [...isCorrect];
    updatedIsCorrect[index] = correct;
    onCorrectChange(updatedIsCorrect);
  };

  const handleNext = () => {
    if (isCorrect.some((result) => result !== true)) {
      alert("Please solve all the problems correctly before moving on!");
      return;
    }
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
                  className="w-auto h-[14rem] rounded-lg ml-4"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  value={answers[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="border-2 border-gray-300 rounded-lg px-4 py-2 text-xl mb-2"
                  placeholder="Enter your answer"
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
                  className={`mt-2 text-lg ${
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
