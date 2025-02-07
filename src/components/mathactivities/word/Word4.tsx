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

export default function Word4({ 
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
      question: "Fill in the blanks to complete the subtraction problem:",
      correctAnswers: ["7", "5", "7"],
      hint: "Focus on the place values (ones, tens, hundreds) and borrow if needed. Look carefully at the final difference (680) and use it as a guide:\n\n- The ones digit of the top number minus the ones digit of the middle number must give 0.\n- The tens digit of the top number (after any borrowing) minus the tens digit of the middle number must give 8.\n- Finally, check the hundreds place to be sure everything adds up to 680!"
    },
    {
      question: "One basket contains 242 apples, and another basket contains some bananas. If 76 bananas are taken out of the banana basket, then the number of bananas left is 155 fewer than the number of apples. How many bananas were originally in the banana basket?",
      correctAnswer: 163,
      image: "/img/word4-fruits.png",
      hint: "Remember that after removing 76 bananas, the bananas left are 155 fewer than the apples (242). Try setting up an equation like \"Bananas left + 155 = Apples\" and add back the 76 that were taken out to find the original number of bananas."
    },
    {
      question: "Eugene's farm has 133 chickens and 46 cows. The total number of cows and sheep they have is 141 more than the number of chickens. How many sheep are on Eugene's farm?",
      correctAnswer: 228,
      image: "/img/word4-farm.png",
      hint: "You know the total of cows + sheep is 141 more than the number of chickens (133). Try forming an equation such as \"cows + sheep = chickens + 141,\" and then solve for the sheep."
    },
  ];

  // Add state for showing hints and tracking attempts
  const [showHints, setShowHints] = useState<boolean[]>(Array(3).fill(false));
  const [hasAttempted, setHasAttempted] = useState<boolean[]>(Array(3).fill(false));

  // Initialize answers with empty strings and isCorrect with null if they're empty
  const answers = propAnswers.length ? propAnswers : Array(5).fill(""); // 5 total answers needed
  const isCorrect = propIsCorrect.length ? propIsCorrect : Array(3).fill(null); // 3 questions total

  const handleFirstQuestionInput = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    onAnswersChange(newAnswers);
  };

  const checkFirstQuestion = async () => {
    const correct = answers.slice(0, 3).every(
      (answer, index) => answer === questions[0].correctAnswers?.[index]
    );
    
    // Mark first question as attempted
    const newHasAttempted = [...hasAttempted];
    newHasAttempted[0] = true;
    setHasAttempted(newHasAttempted);

    await onLogBehavior(
      "word4-first-question",
      "click",
      `check-answer-button:${answers.slice(0, 3).join(',')}`,
      correct ? "correct" : "incorrect"
    );

    const updatedIsCorrect = [...isCorrect];
    updatedIsCorrect[0] = correct;
    onCorrectChange(updatedIsCorrect);
  };

  const handleWordProblemInput = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index + 3] = value; // offset by 3 to account for first question's answers
    onAnswersChange(newAnswers);
  };

  const checkWordProblem = async (index: number) => {
    const questionIndex = index + 1;
    const userAnswer = parseInt(answers[index + 3]);
    const correct = userAnswer === questions[questionIndex].correctAnswer;

    // Mark question as attempted
    const newHasAttempted = [...hasAttempted];
    newHasAttempted[questionIndex] = true;
    setHasAttempted(newHasAttempted);

    await onLogBehavior(
      `word4-question-${questionIndex}`,
      "click",
      `check-answer-button:${userAnswer}`,
      correct ? "correct" : "incorrect"
    );

    const updatedIsCorrect = [...isCorrect];
    updatedIsCorrect[questionIndex] = correct;
    onCorrectChange(updatedIsCorrect);
  };

  const toggleHint = async (index: number) => {
    const newShowHints = [...showHints];
    newShowHints[index] = !newShowHints[index];
    setShowHints(newShowHints);

    await onLogBehavior(
      `word4-question-${index + 1}`,
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
      "word4",
      "click",
      "next-button-word4",
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
          <h2 className="text-2xl mb-10 text-center text-[#13294B]">Read and solve each math problem.</h2>

          <div className="mb-8">
            <p className="text-xl text-[#13294B] mb-4">{questions[0].question}</p>
            
            {/* Only show hint button after first incorrect attempt */}
            {hasAttempted[0] && isCorrect[0] === false && (
              <div className="mb-4">
                <button
                  onClick={() => toggleHint(0)}
                  className="bg-[#13294B] text-white px-4 py-1 rounded-lg text-sm mr-2"
                >
                  {showHints[0] ? 'Hide Hint' : 'Show Hint'}
                </button>
                {showHints[0] && (
                  <div className="mt-2 text-[#13294B] bg-blue-100 p-3 rounded-lg whitespace-pre-line">
                    💡 {questions[0].hint}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-center mb-6">
              <div className="grid grid-cols-3 gap-2 text-3xl">
                <input
                  type="text"
                  maxLength={1}
                  value={answers[0]}
                  onChange={(e) => handleFirstQuestionInput(0, e.target.value)}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  className="w-16 h-16 border-2 border-gray-300 rounded text-center"
                  style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                />
                <div className="w-16 h-16 border-2 border-gray-300 rounded flex items-center justify-center">3</div>
                <div className="w-16 h-16 border-2 border-gray-300 rounded flex items-center justify-center">7</div>
                
                <div className="col-span-3 flex items-center justify-end">
                  <div className="text-3xl mr-[3rem]">−</div>
                  <input
                    type="text"
                    maxLength={1}
                    value={answers[1]}
                    onChange={(e) => handleFirstQuestionInput(1, e.target.value)}
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    className="w-16 h-16 border-2 border-gray-300 rounded text-center mr-2"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                  />
                  <input
                    type="text"
                    maxLength={1}
                    value={answers[2]}
                    onChange={(e) => handleFirstQuestionInput(2, e.target.value)}
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    className="w-16 h-16 border-2 border-gray-300 rounded text-center mr-2"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                  />
                </div>

                <div className="col-span-3 border-b-4 border-black my-2"></div>

                <div className="w-16 h-16 border-2 border-gray-300 rounded flex items-center justify-center">6</div>
                <div className="w-16 h-16 border-2 border-gray-300 rounded flex items-center justify-center">8</div>
                <div className="w-16 h-16 border-2 border-gray-300 rounded flex items-center justify-center">0</div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={checkFirstQuestion}
                className="bg-[#8CC63E] text-white text-xl px-6 py-2 rounded-lg"
              >
                Check Answer
              </button>
            </div>
            {isCorrect[0] !== null && (
              <div
                className={`mt-2 text-lg text-center ${
                  isCorrect[0] ? "text-green-600" : "text-red-600"
                }`}
              >
                {isCorrect[0] ? "Correct!" : "Try again!"}
              </div>
            )}
          </div>

          {questions.slice(1).map((q, index) => (
            <div key={index} className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-xl text-[#13294B] mb-2">
                    {q.question}
                  </p>
                  
                  {/* Only show hint button after first incorrect attempt */}
                  {hasAttempted[index + 1] && isCorrect[index + 1] === false && (
                    <div className="mb-4">
                      <button
                        onClick={() => toggleHint(index + 1)}
                        className="bg-[#13294B] text-white px-4 py-1 rounded-lg text-sm mr-2"
                      >
                        {showHints[index + 1] ? 'Hide Hint' : 'Show Hint'}
                      </button>
                      {showHints[index + 1] && (
                        <div className="mt-2 text-[#13294B] bg-blue-100 p-3 rounded-lg">
                          💡 {q.hint}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <img
                  src={q.image}
                  alt={`Question ${index + 2}`}
                  className="w-auto h-[13rem] rounded-lg ml-4"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  value={answers[index + 3]}
                  onChange={(e) => handleWordProblemInput(index, e.target.value)}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  className="border-2 border-gray-300 rounded-lg px-4 py-2 text-xl mb-2"
                  placeholder="Enter your answer"
                  style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                />
                <button
                  onClick={() => checkWordProblem(index)}
                  className="bg-[#8CC63E] text-white text-xl px-6 py-2 rounded-lg ml-4"
                >
                  Check Answer
                </button>
              </div>
              {isCorrect[index + 1] !== null && (
                <div
                  className={`mt-2 text-lg ${
                    isCorrect[index + 1] ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isCorrect[index + 1] ? "Correct!" : "Try again!"}
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