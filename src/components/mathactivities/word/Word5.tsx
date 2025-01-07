import { useState } from "react";

interface ActivityComponentProps {
  onBack: () => void;
  onComplete?: () => void;
}

export default function Word5({ onBack, onComplete }: ActivityComponentProps) {
  const [answers, setAnswers] = useState<string[]>(["", "", "", "", ""]);
  const [incorrectIndices, setIncorrectIndices] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const story = {
    question: `One sunny day, Max, Ruby, Leo, and Mia went on a hot air balloon ride over the magical Land of Numbers. Suddenly, the worried Number King appeared. "Help! The mischievous dragon Minus Max has stolen our numbers! To save the kingdom, you must solve his math challenges." The friends eagerly agreed and set off.

The dragon's riddle read: "I hid 245 numbers in the first cave, 376 in the second, and 189 in the third. How many numbers are there in total?" "[___]" Ruby shouted, and they collected the stolen numbers.

The friends found a locked cave and a chest with this question:
"There are 500 numbers in the chest. I spent 243 on supplies and 115 on snacks. How many are left?"
"[___] numbers! Let's unlock the cave," said Leo, and they retrieved more numbers.

The Number King had one final task: "With [___] numbers from the caves and [___] numbers left from the chest, I'll give you brave adventurers 528 numbers as a gift, how many numbers do I have now?"
"[___]!" Mia cheered as the kingdom lit up with numbers.`,
    correctAnswers: ["810", "142", "810", "142", "424"],
  };

  const handleInput = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    console.log("Input Updated:", index, value, newAnswers);
    setAnswers(newAnswers);
  };  

  const checkAnswers = () => {
    const incorrect = answers.reduce<number[]>((acc, answer, index) => {
      if (answer !== story.correctAnswers[index]) {
        acc.push(index); // Add index of incorrect answer
      }
      return acc;
    }, []);
    console.log("Answers:", answers);
    console.log("Incorrect Indices:", incorrect);
    setIncorrectIndices(incorrect);
    setIsCorrect(incorrect.length === 0); // True if all answers are correct
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-[#FF5F05] rounded-lg">
      <div className="w-full max-w-4xl">
        <div className="bg-white p-8 rounded-lg shadow-lg border-4 border-yellow-400">
          {/* Header Section with Images */}
          <div className="flex justify-center items-center mb-6">
            <img
              src="/img/word5-numberkingdom.png"
              alt="Number Kingdom"
              className="w-90 h-auto mr-4"
            />
            <img
              src="/img/word5-adventure.png"
              alt="Adventure"
              className="w-90 h-auto"
            />
          </div>

          {/* Story Section */}
          <div className="mb-8 relative">
            <img
              src="/img/word5-dragon.png"
              alt="Dragon"
              className="absolute -right-[1rem] -bottom-[1rem] w-40 h-auto transform rotate-10"
            />

            <div className="story-text text-lg leading-relaxed space-y-4 mb-6">
              {story.question.split("\n\n").map((paragraph, i) => (
                <p key={`paragraph-${i}`} className="relative z-10">
                  {paragraph.split("[___]").map((text, j, array) => {
                    // Calculate the total blanks that came before this paragraph
                    const previousBlanks = story.question
                      .split("\n\n")
                      .slice(0, i)
                      .reduce((acc, para) => acc + (para.match(/\[___\]/g) || []).length, 0);
                    
                    // Current blank index is previous blanks + current position
                    const currentIndex = previousBlanks + j;

                    return (
                      <span key={`text-${i}-${j}`}>
                        {text}
                        {j < array.length - 1 && (
                          <span className="inline-block">
                            <input
                              type="number"
                              value={answers[currentIndex]}
                              onChange={(e) =>
                                handleInput(currentIndex, e.target.value)
                              }
                              className={`w-24 mx-2 text-center border-2 rounded-md ${
                                incorrectIndices.includes(currentIndex)
                                  ? "border-red-500 bg-red-50"
                                  : "border-blue-400"
                              } focus:border-blue-600 outline-none`}
                            />
                          </span>
                        )}
                      </span>
                    );
                  })}
                </p>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={checkAnswers}
                className="bg-[#8CC63E] text-white text-xl px-8 py-3 rounded-lg hover:bg-[#7BB32E] transform transition hover:scale-105"
              >
                Check Answers
              </button>

              {isCorrect && onComplete && (
                <button
                  onClick={onComplete}
                  className="bg-[#FF5F05] text-white text-xl px-8 py-3 rounded-lg hover:bg-[#EE5500] transform transition hover:scale-105"
                >
                  All Done! Let’s Celebrate!
                </button>
              )}
            </div>

            {/* Feedback Message */}
            {isCorrect !== null && (
              <div
                className={`mt-4 text-xl text-center ${
                  isCorrect ? "text-green-600" : "text-red-600"
                }`}
              >
                {isCorrect ? (
                  <span>
                    <b className="text-green-700">Amazing!</b> You've saved the{" "}
                    <span className="text-yellow-500">Number Kingdom</span>! 🎉
                  </span>
                ) : (
                  <span>
                    <b className="text-red-700">Keep trying</b>, brave adventurers! 💫
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
