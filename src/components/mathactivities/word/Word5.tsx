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

export default function Word5({ 
  onBack, 
  onComplete, 
  answers: propAnswers,
  isCorrect: propIsCorrect,
  onAnswersChange,
  onCorrectChange,
  onLogBehavior 
}: ActivityComponentProps) {
  const story = {
    sections: [
      {
        title: "",
        text: "One sunny day, Max, Ruby, Leo, and Mia went on a hot air balloon ride over the magical Land of Numbers. Suddenly, the worried Number King appeared. \"Help! The mischievous dragon Minus Max has stolen all our numbers! To save the kingdom, you must solve his math challenges.\" The friends eagerly agreed and set off."
      },
      {
        title: "First Riddle: Cave of Numbers",
        text: "The dragon's riddle read: \"I hid 147 numbers in the first cave, 176 in the second cave. But then, a sneaky goblin took away 245 numbers! How many numbers remain?\" \n\"[___]\" Ruby shouted, and they collected the stolen numbers."
      },
      {
        title: "Second Riddle: The Towering Gate",
        text: "Pressing onward, they reached a towering castle gate with another puzzle inscribed on it: \"Inside this gate are 260 numbers, but 87 vanished into thin air, 78 dropped into the eternal fire. How many remain behind the gate?\" \nMax confidently announced \"[___]\" to unlock the gate, and they collected the stolen numbers."
      },
      {
        title: "Third Riddle: The Sparkling Fountain",
        text: "Deeper in the castle, the group discovered a sparkling fountain. A nearby note read: \"I placed 225 numbers in this fountain. Then, 69 were taken by a mischievous squirrel. Luckily, a kind fairy added 78 more numbers to the fountain. How many are left in the fountain?\"\n\"[___] numbers!\" Mia figured it out, and they claimed more stolen numbers."
      },
      {
        title: "",
        text: "Suddenly, the Number King appeared, thrilled to see so many numbers restored. He asked: \"You've collected numbers from the three caves, the castle gate, and the fountain. How many have you saved in total?\"\nMia, Max, Ruby, and Leo combined their results:\n\"[___]!\" they announced."
      },
      {
        title: "",
        text: "A dazzling rainbow of digits burst into the sky. The Number King cheered, “Thanks to your clever math, our kingdom is safe and whole again!” With that, the mischievous dragon Minus Max flew off, defeated by the power of teamwork and problem-solving."
      }
    ],
    correctAnswers: ["78", "95", "234", "407"],
    hints: [
      "Add the numbers in both caves, then subtract the numbers taken by the goblin.",
      "Start with 260. Take away 87 first, then subtract 78 more.",
      "Begin with 225. Take away 69 first, then add back 78",
      "Add your answers: the result of the caves (+) the result of the gate (+) the result of the fountain."
    ]
  };

  // Add state for showing hints and tracking attempts
  const [showHints, setShowHints] = useState<boolean[]>(Array(4).fill(false));
  const [hasAttempted, setHasAttempted] = useState<boolean[]>(Array(4).fill(false));

  // Initialize answers with empty strings and isCorrect with null if they're empty
  const answers = propAnswers.length ? propAnswers : Array(4).fill("");
  const isCorrect = propIsCorrect.length ? propIsCorrect : Array(4).fill(null);

  const handleInput = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    onAnswersChange(newAnswers);
  };

  const toggleHint = async (index: number) => {
    const newShowHints = [...showHints];
    newShowHints[index] = !newShowHints[index];
    setShowHints(newShowHints);

    await onLogBehavior(
      `word5-blank-${index + 1}`,
      "click",
      `hint-button:${newShowHints[index] ? 'show' : 'hide'}`,
      "hint-interaction"
    );
  };

  const checkAnswers = async () => {
    const incorrect = answers.reduce<number[]>((acc, answer, index) => {
      if (answer !== story.correctAnswers[index]) {
        acc.push(index);
      }
      return acc;
    }, []);

    // Mark all attempted answers
    const newHasAttempted = answers.map((answer, index) => 
      answer !== "" || hasAttempted[index]
    );
    setHasAttempted(newHasAttempted);

    await onLogBehavior(
      "word5-story",
      "click",
      `check-answers-button:${answers.join(',')}`,
      incorrect.length === 0 ? "all-correct" : `incorrect-indices:${incorrect.join(',')}`
    );

    const newIsCorrect = answers.map((answer, index) => 
      answer === story.correctAnswers[index]
    );
    onCorrectChange(newIsCorrect);
  };

  const handleComplete = async () => {
    if (isCorrect.some(result => !result)) {
      return;
    }

    await onLogBehavior(
      "word5",
      "click",
      "next-button-word5",
      "complete"
    );

    if (onComplete) {
      onComplete();
    }
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
              className="absolute -right-[1rem] -bottom-[0.5rem] w-40 h-auto transform rotate-10"
            />

            <div className="story-text text-lg leading-relaxed space-y-8 mb-6">
              {story.sections.map((section, i) => (
                <div key={`section-${i}`} className="relative z-10">
                  {section.title && (
                    <h3 className="text-xl font-bold text-[#13294B] mb-3">
                      {section.title}
                    </h3>
                  )}
                  {section.text.split("\n").map((paragraph, j) => (
                    <p key={`paragraph-${i}-${j}`} className="mb-4">
                      {paragraph.split("[___]").map((text, k, array) => {
                        // Calculate blank index based on the current section's blank
                        const currentIndex = story.sections
                          .slice(0, i)
                          .reduce((acc, sec) => 
                            acc + (sec.text.match(/\[___\]/g) || []).length, 0
                          );

                        return (
                          <span key={`text-${i}-${j}-${k}`}>
                            {text}
                            {k < array.length - 1 && (
                              <span className="inline-block relative">
                                <input
                                  type="number"
                                  value={answers[currentIndex]}
                                  onChange={(e) => handleInput(currentIndex, e.target.value)}
                                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                  style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                                  className={`w-24 mx-2 text-center border-2 rounded-md ${
                                    hasAttempted[currentIndex] && !isCorrect[currentIndex]
                                      ? "border-red-500 bg-red-50"
                                      : "border-blue-400"
                                  } focus:border-blue-600 outline-none`}
                                />
                                {/* Show hint button after first incorrect attempt */}
                                {hasAttempted[currentIndex] && isCorrect[currentIndex] === false && (
                                  <div className="inline-block ml-2">
                                    <button
                                      onClick={() => toggleHint(currentIndex)}
                                      className="bg-[#13294B] text-white px-3 py-1 rounded-lg text-sm"
                                    >
                                      {showHints[currentIndex] ? 'Hide Hint' : 'Show Hint'}
                                    </button>
                                    {showHints[currentIndex] && (
                                      <div className="absolute left-0 mt-2 text-[#13294B] bg-blue-100 p-3 rounded-lg z-20 w-[30rem]">
                                        💡 {story.hints[currentIndex]}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </span>
                            )}
                          </span>
                        );
                      })}
                    </p>
                  ))}
                  {/* Add extra margin space only if the current section's hint is shown */}
                  {i < story.sections.length - 1 && // Only check for non-last sections
                    showHints[story.sections
                      .slice(0, i + 1)              // Include current section
                      .reduce((acc, sec) => 
                        acc + (sec.text.match(/\[___\]/g) || []).length, 0
                      ) - 1] && (                   // Check the current section's blank
                      <div className="h-20"></div>  // Add space that will push the next section down
                  )}
                </div>
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

              {!isCorrect.includes(false) && isCorrect.includes(true) && onComplete && (
                <button
                  onClick={handleComplete}
                  className="bg-[#FF5F05] text-white text-xl px-8 py-3 rounded-lg hover:bg-[#EE5500] transform transition hover:scale-105"
                >
                  All Done! Let's Celebrate!
                </button>
              )}
            </div>

            {/* Feedback Message */}
            {isCorrect.includes(true) && (
              <div
                className={`mt-4 text-xl text-center ${
                  !isCorrect.includes(false) ? "text-green-600" : "text-red-600"
                }`}
              >
                {!isCorrect.includes(false) ? (
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
