import { useState } from "react";

interface ActivityComponentProps {
  onBack: () => void;
  onComplete?: () => void;
}

export default function Formal5({ onBack, onComplete }: ActivityComponentProps) {
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Values for each animal (can be determined by solving the system of equations)
  // Fox + 245 = 147 + 176 → Fox = 78
  // Tiger + Fox = 260 - 87 → Tiger + 78 = 173 → Tiger = 95
  // Cat + 69 = 225 + Fox → Cat + 69 = 225 + 78 → Cat = 234
  // Penguin + 23 = 138 → Penguin = 115
  // Final equation: Tiger + Cat - Penguin = ? → 95 + 234 - 115 = 214

  const correctAnswer = 214;

  const handleInputChange = (value: string) => {
    setAnswer(value);
  };

  const checkAnswer = () => {
    const userAnswer = parseInt(answer);
    const correct = userAnswer === correctAnswer;
    setIsCorrect(correct);
  };

  const handleNext = () => {
    if (!isCorrect) {
      alert("Please solve the problem correctly before moving on!");
      return;
    }
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <div className="w-full max-w-3xl text-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl mb-6 text-[#13294B] flex items-center justify-center">
          Find the value of the
          <img src="/img/formal5-questionmark.png" alt="Question Mark" className="w-12 h-12 rounded-full ml-2" />
        </h2>

          <div className="space-y-4 mb-8">
            {/* Equation 1 */}
            <div className="flex items-center justify-start text-3xl">
              <img src="/img/formal5-fox.png" alt="Fox" className="w-20 h-20 rounded-full" />
              <span className="mx-2">+ 245 = 147 + 176</span>
            </div>

            {/* Equation 2 */}
            <div className="flex items-center justify-start text-3xl">
              <img src="/img/formal5-tiger.png" alt="Tiger" className="w-20 h-20 rounded-full" />
              <span className="mx-2">+</span>
              <img src="/img/formal5-fox.png" alt="Fox" className="w-20 h-20 rounded-full" />
              <span className="mx-2">= 260 - 87</span>
            </div>

            {/* Equation 3 */}
            <div className="flex items-center justify-start text-3xl">
              <img src="/img/formal5-cat.png" alt="Cat" className="w-20 h-20 rounded-full" />
              <span className="mx-2">+ 69 = 225 +</span>
              <img src="/img/formal5-fox.png" alt="Fox" className="w-20 h-20 rounded-full" />
            </div>

            {/* Equation 4 */}
            <div className="flex items-center justify-start text-3xl">
              <img src="/img/formal5-penguin.png" alt="Penguin" className="w-20 h-20 rounded-full" />
              <span className="mx-2">+ 23 = 138</span>
            </div>

            {/* Final Equation */}
            <div className="flex items-center justify-start text-3xl mt-8">
              <img src="/img/formal5-tiger.png" alt="Tiger" className="w-20 h-20 rounded-full" />
              <span className="mx-2">+</span>
              <img src="/img/formal5-cat.png" alt="Cat" className="w-20 h-20 rounded-full" />
              <span className="mx-2">-</span>
              <img src="/img/formal5-penguin.png" alt="Penguin" className="w-20 h-20 rounded-full" />
              <span className="mx-2">=</span>
              <img src="/img/formal5-questionmark.png" alt="Question Mark" className="w-20 h-20 rounded-full" />
            </div>
          </div>

          <div className="mt-8">
            <input
              type="number"
              value={answer}
              onChange={(e) => handleInputChange(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-4 py-2 text-xl mb-2"
              placeholder="Enter your answer"
            />
            <button
              onClick={checkAnswer}
              className="bg-[#8CC63E] text-white px-6 py-2 rounded-lg ml-4"
            >
              Check Answer
            </button>
            {isCorrect !== null && (
              <div
                className={`mt-2 text-lg ${
                  isCorrect ? "text-green-600" : "text-red-600"
                }`}
              >
                {isCorrect ? "Correct!" : "Try again!"}
              </div>
            )}
          </div>

          <button
            onClick={handleNext}
            className="bg-[#FF5F05] text-white px-6 py-2 rounded-lg mt-6"
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}
