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

export default function Word2({ 
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
      question: "Judy was watching a new TV series that had 58 episodes. She already watched 29 episodes. How many more did she need to watch?",
      correctAnswer: 29,
      image: "/img/word2-TV.png",
      hint: "To find how many are left, subtract 29 from 58. The difference tells you how many episodes Judy still needs to watch."
    },
    {
      question: "Lucy planted 25 flowers in one row and 35 flowers in another row. Later, she planted 48 more flowers in a third row. How many flowers did Lucy plant in total?",
      correctAnswer: 108,
      image: "/img/word2-flowers.png",
      hint: "First row + Second row + Third row = Total number of flowers."
    },
    {
      question: "The zoo had 67 tickets available for a school trip. A class of 34 students bought tickets, and another group of 26 teachers bought tickets. How many tickets are left?",
      correctAnswer: 7,
      image: "/img/word2-zoo.png",
      hint: "Add the number of tickets used by the students (34) and the teachers (26). Then, subtract that total from the original 67 tickets to find out how many are left."
    },
  ];

  // Add state for showing hints and tracking attempts
  const [showHints, setShowHints] = useState<boolean[]>(Array(questions.length).fill(false));
  const [hasAttempted, setHasAttempted] = useState<boolean[]>(Array(questions.length).fill(false));

  // Initialize answers with empty strings and isCorrect with null if they're empty
  const answers = propAnswers.length ? propAnswers : Array(questions.length).fill("");
  const isCorrect = propIsCorrect.length ? propIsCorrect : Array(questions.length).fill(null);

  const handleInputChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    onAnswersChange(updatedAnswers);

    if (value) {
      onLogBehavior(
        `word2-question-${index + 1}`,
        "input",
        `user-input:${value}`,
        "in-progress"
      );
    }
  };

  const checkAnswer = async (index: number) => {
    const userAnswer = parseInt(answers[index]);
    const correct = userAnswer === questions[index].correctAnswer;

    // Mark question as attempted
    const newHasAttempted = [...hasAttempted];
    newHasAttempted[index] = true;
    setHasAttempted(newHasAttempted);

    await onLogBehavior(
      `word2-question-${index + 1}`,
      "click",
      `check-answer-button:${userAnswer}`,
      correct ? "correct" : "incorrect"
    );

    const updatedIsCorrect = [...isCorrect];
    updatedIsCorrect[index] = correct;
    onCorrectChange(updatedIsCorrect);
  };

  const toggleHint = async (index: number) => {
    const newShowHints = [...showHints];
    newShowHints[index] = !newShowHints[index];
    setShowHints(newShowHints);

    await onLogBehavior(
      `word2-question-${index + 1}`,
      "click",
      `hint-button:${newShowHints[index] ? 'show' : 'hide'}`,
      "hint-interaction"
    );
  };

  const handleNext = async () => {
    if (isCorrect.some((result) => result !== true)) {
      alert("Please solve all the problems correctly before moving on!");
      return;
    }

    await onLogBehavior(
      "word2",
      "click",
      "next-button-word2",
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
                  className="w-auto h-[8rem] rounded-lg ml-4"
                />
              </div>

              {/* Only show hint button after first incorrect attempt */}
              {hasAttempted[index] && isCorrect[index] === false && (
                <div className="mb-4">
                  <button
                    onClick={() => toggleHint(index)}
                    className="bg-[#13294B] text-white px-4 py-1 rounded-lg text-sm mr-2"
                  >
                    {showHints[index] ? 'Hide Hint' : 'Show Hint'}
                  </button>
                  {showHints[index] && (
                    <div className="mt-2 text-[#13294B] bg-blue-100 p-3 rounded-lg">
                      💡 {q.hint}
                    </div>
                  )}
                </div>
              )}

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
                  className={`mt-2 text-xl ${
                    isCorrect[index] ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isCorrect[index] ? "Correct!" : "Try again!"}
                </div>
              )}
            </div>
          ))}

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
