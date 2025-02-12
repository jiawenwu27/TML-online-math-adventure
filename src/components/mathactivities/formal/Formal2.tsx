interface ActivityComponentProps {
  onBack: () => void;
  onComplete?: () => void;
  answers: string[];
  isCorrect: (boolean | null)[];
  onAnswersChange: (answers: string[]) => void;
  onCorrectChange: (isCorrect: (boolean | null)[]) => void;
  onLogBehavior: (location: string, behavior: string, input: string, result: string) => void;
}

export default function Formal2({ 
  onBack, 
  onComplete, 
  answers: propAnswers, 
  isCorrect: propIsCorrect, 
  onAnswersChange, 
  onCorrectChange,
  onLogBehavior
}: ActivityComponentProps) {
  const questions = [
    { question: "67 - 29 = ?", correctAnswer: 38 },
    { question: "24 + 27 = ?", correctAnswer: 51 },
    { question: "56 - 38 = ?", correctAnswer: 18 },
  ];

  // Initialize answers and isCorrect if they're empty
  const answers = propAnswers.length ? propAnswers : Array(questions.length).fill("");
  const isCorrect = propIsCorrect.length ? propIsCorrect : Array(questions.length).fill(null);

  const handleInputChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    onAnswersChange(updatedAnswers);
  };

  const checkAnswer = async (index: number) => {
    const userAnswer = parseInt(answers[index]);
    const correct = userAnswer === questions[index].correctAnswer;

    await onLogBehavior(
      `formal2-question-${index + 1}`,
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
      "formal2",
      "click",
      "next-button-formal2",
      "complete"
    );
    
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <div className="w-full max-w-3xl text-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl mb-4 text-[#13294B]">Find the missing answers.</h2>

          {questions.map((q, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-2xl mb-4 text-[#13294B]">{q.question}</h3>
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
                className="bg-[#8CC63E] text-white px-6 py-2 rounded-lg ml-4"
              >
                Check Answer
              </button>
              {isCorrect[index] !== null && answers[index] !== "" && (
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
