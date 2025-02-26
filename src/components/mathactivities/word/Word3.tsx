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

export default function Word3({ 
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
      question: (
        <>
          Emma is hosting a big picnic party in the park, and she's buying snacks for her friends: She picks up 34 cookies for dessert. Next, she grabs 28 sandwiches for lunch. Then, she gets 15 juice boxes to keep everyone refreshed. {" "}
          <b>How many snacks did Emma bring to her picnic in total?</b> Can you count them all before the picnic starts?
        </>
      ),
      correctAnswer: 77,
      image: "/img/word3-snacks.png",
      hint: "Think of each item group (cookies, sandwiches, juice boxes). Add all three numbers together to find the total snacks. If you're stuck, try adding two numbers first, then add the third one!"
    },
    {
      question: (
        <>
          Sarah finds $180 in her treasure chest and decides to use it for a fun shopping spree! She spends $25 on a pirate's map to find even more treasure. Then, she uses $37 to buy a shiny new telescope. {" "}
          <b>How much treasure money does Sarah have left after her exciting adventure?</b> Can you figure it out before she sails away?
        </>
      ),
      correctAnswer: 118,
      image: "/img/word3-treasure.png",
      hint: "First, add up how much Sarah spent: $25 and $37. Next, subtract that total from the $180 she started with. That difference tells you how much treasure money she has left!"
    },
    {
      question: (
        <>
          A magical library in the forest is collecting books to fill its shelves! Three generous animals bring their favorite stories to donate: Alex the Alligator brings 43 books about rivers and swamps. Bailey the Bunny hops in with 57 books full of carrot recipes. Casey the Cat arrives with 22 books about adventures with mice. {" "}
          <b>How many books did the library receive altogether?</b> Can you help the librarian count them?
        </>
      ),
      correctAnswer: 122,
      image: "/img/word3-animalsbooks.png",
      hint: "To find the total number of books, add the amounts brought by each animal: 43, 57, and 22. Combine them one step at a time, or all at once if you're comfortable with bigger sums!"
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
        `word3-question-${index + 1}`,
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
      `word3-question-${index + 1}`,
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
      `word3-question-${index + 1}`,
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
      "word3",
      "click",
      "next-button-word3",
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
                  className="w-auto h-[14rem] rounded-lg ml-4"
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
