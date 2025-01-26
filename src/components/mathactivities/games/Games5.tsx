import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

interface UserBehavior {
  timestamp: string;
  location: string;
  behavior: string;
  input: string;
  result: string;
}

interface ActivityComponentProps {
  onBack: () => void;
  onComplete?: () => void;
  savedAnswers?: {
    selectedLetters: (string | null)[];
    gameComplete: boolean;
  };
  onSaveAnswers: (answers: {
    selectedLetters: (string | null)[];
    gameComplete: boolean;
  }) => void;
  onTrackBehavior: (behavior: UserBehavior) => void;
}

export default function Games5({
  onBack,
  onComplete,
  savedAnswers,
  onSaveAnswers,
  onTrackBehavior
}: ActivityComponentProps) {
  const [selectedLetters, setSelectedLetters] = useState<{ [key: number]: string }>(() => {
    if (!savedAnswers?.selectedLetters) return {};
    
    return savedAnswers.selectedLetters.reduce((acc, letter, index) => {
      if (letter) acc[index + 1] = letter;
      return acc;
    }, {} as { [key: number]: string });
  });
  const [gameComplete, setGameComplete] = useState<boolean>(savedAnswers?.gameComplete ?? false);
  const [message, setMessage] = useState<string>('');
  const [showRaccoon, setShowRaccoon] = useState(false);
  const [showSquirrel, setShowSquirrel] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const mathProblems = [
    { id: 1, problem: '763 - 244 - 267', answer: 252 }, // N
    { id: 2, problem: '139 + 283 + 97', answer: 519 }, // U
    { id: 3, problem: '194 - 16 - 52 - 29', answer: 97 }, // L
    { id: 4, problem: '834 + 107 - 203', answer: 738 }, // O
    { id: 5, problem: '458 - 67 + 152', answer: 543 }, // R
    { id: 6, problem: '89 + 64 - 138', answer: 15 }, // E
    { id: 7, problem: '295 + 427 + 156', answer: 878 }, // Q
    { id: 8, problem: '678 - 40 - 81', answer: 557 }, // A
    { id: 9, problem: '953 - 204 - 165 - 47', answer: 537 }, // I
    { id: 10, problem: '823 - 125 - 41 - 275', answer: 382 }, // S
    { id: 11, problem: '78 - 27 - 14', answer: 37 }, // C
  ];

  const letterCodes = {
    252: 'N',
    519: 'U',
    97: 'L',
    738: 'O',
    543: 'R',
    15: 'E',
    878: 'Q',
    557: 'A',
    537: 'I',
    382: 'S',
    37: 'C',
    // Distracting codes
    123: 'B',
    456: 'Y',
    789: 'T',
    321: 'G',
    654: 'H',
    987: 'M',
    147: 'K',
    258: 'W',
    369: 'P'
  };

  const firstWord = {
    boxes: [
      { id: 1, problemId: 5, correct: 'R' },
      { id: 2, problemId: 8, correct: 'A' },
      { id: 3, problemId: 11, correct: 'C' },
      { id: 4, problemId: 11, correct: 'C' },
      { id: 5, problemId: 4, correct: 'O' },
      { id: 6, problemId: 4, correct: 'O' },
      { id: 7, problemId: 1, correct: 'N' }
    ]
  };

  const secondWord = {
    boxes: [
      { id: 8, problemId: 10, correct: 'S' },
      { id: 9, problemId: 7, correct: 'Q' },
      { id: 10, problemId: 2, correct: 'U' },
      { id: 11, problemId: 9, correct: 'I' },
      { id: 12, problemId: 5, correct: 'R' },
      { id: 13, problemId: 5, correct: 'R' },
      { id: 14, problemId: 6, correct: 'E' },
      { id: 15, problemId: 3, correct: 'L' }
    ]
  };

  const trackBehavior = (behavior: string, input: string, result: string) => {
    onTrackBehavior({
      timestamp: new Date().toISOString(),
      location: "",
      behavior,
      input,
      result
    });
  };

  const handleLetterSelect = async (boxId: number, letter: string) => {
    trackBehavior(
      "select",
      `box:${boxId}`,
      `letter:${letter}`
    );

    setSelectedLetters(prev => ({
      ...prev,
      [boxId]: letter
    }));
  };

  const checkAnswers = async () => {
    let hasIncorrectAnswers = false;
    
    // Check if RACCOON is complete
    const isRaccoonComplete = firstWord.boxes.every(
      box => selectedLetters[box.id] === box.correct
    );

    // Check if SQUIRREL is complete
    const isSquirrelComplete = secondWord.boxes.every(
      box => selectedLetters[box.id] === box.correct
    );

    trackBehavior(
      "check",
      `raccoon:${isRaccoonComplete},squirrel:${isSquirrelComplete}`,
      `answers:${JSON.stringify(selectedLetters)}`
    );

    // Check for incorrect answers
    const allBoxes = [...firstWord.boxes, ...secondWord.boxes];
    allBoxes.forEach(box => {
      if (selectedLetters[box.id] && selectedLetters[box.id] !== box.correct) {
        hasIncorrectAnswers = true;
      }
    });

    if (hasIncorrectAnswers) {
      setMessage("Some answers are incorrect. Try again!");
      return;
    }

    if (isRaccoonComplete && !showRaccoon) {
      setShowRaccoon(true);
      setMessage("You found the first spy - RACCOON!");
    }

    if (isSquirrelComplete && !showSquirrel) {
      setShowSquirrel(true);
      setMessage("You found the second spy - SQUIRREL!");
    }

    if (isRaccoonComplete && isSquirrelComplete) {
      trackBehavior(
        "complete",
        "both-words-found",
        "game-complete"
      );
      setShowConfetti(true);
      setMessage("Congratulations! You've uncovered both spies—Raccoon and Squirrel—plotting against Grassland! Click 'Next' to continue.");
    }
  };

  const handleReset = async () => {
    trackBehavior(
      "click",
      "reset-button",
      "game-reset"
    );
    
    setSelectedLetters({});
    setMessage('');
    setShowRaccoon(false);
    setShowSquirrel(false);
  };

  useEffect(() => {
    // Convert object to array format
    const lettersArray = Array(15).fill(null).map((_, index) => 
      selectedLetters[index + 1] || null
    );
    
    onSaveAnswers({
      selectedLetters: lettersArray,
      gameComplete
    });
  }, [selectedLetters, gameComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center relative">
      {/* Component container with background */}
      <div 
        className="w-full flex flex-col items-center relative"
        style={{
          backgroundImage: 'url(/img/game5-background.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto'
        }}
      >
        
        {showConfetti && (
          <ReactConfetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.2}
            onConfettiComplete={() => setShowConfetti(false)}
          />
        )}

        <div className="w-full max-w-4xl bg-white/90 p-8 rounded-lg shadow-lg relative z-10 mx-4">
          {/* Top decorative frame */}
          <div className="w-full relative z-10">
            <img 
              src="/img/game5-topleafs.png" 
              alt="Decorative top frame"
              className="w-full h-auto object-contain"
            />
          </div>
          
          <h1 className="text-4xl font-bold text-center text-[#732002] mb-6">
            The Grassland Mystery
          </h1>

          <div className="bg-[#F2E8D5] p-4 rounded-lg mb-8 border-4 border-[#F2B60C] shadow-xl">
            <p className="text-xl mb-2 font-medium text-black">
              The peaceful Grassland has been attacked by the Forest Kingdom! A secret coded message
              may reveal the identities of spies living among us. Solve the math problems to find the 
              corresponding letters and unmask the infiltrators!
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#732002] mb-4">Math Problems</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mathProblems.map((problem) => (
                <div key={problem.id} 
                  className="p-2 border-2 border-[#732002] rounded-lg bg-[#F8F8F8] hover:bg-[#F0F0F0] transition-colors">
                  <span className="text-xl font-bold text-[#C38429]"> ({problem.id}):</span>
                  <span className="ml-2 font-bold text-xl">{problem.problem}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#732002] mb-4">Secret Code Dictionary</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(letterCodes).map(([number, letter]) => (
                <div key={number} 
                  className="p-2 rounded-lg text-center font-bold transform hover:scale-105 transition-transform bg-[#F5A80F]"
                >
                  <span className="text-xl text-white">{number} = {letter}</span>
                </div>
              ))}
            </div>
            <p className="text-xl text-bold mt-8 text-[#732002] font-medium text-center">
              Solve the math problems above and use this code dictionary to reveal the letters of each spy's name!
            </p>
          </div>

          {/* First Word Section */}
          <div className="mb-8 bg-[#F2E8D5] p-6 rounded-lg border-2 border-dashed border-[#732002]">
            <h2 className="text-2xl font-bold text-[#732002] mb-4">First Spy</h2>
            <div className="flex justify-center gap-4">
              {firstWord.boxes.map((box) => (
                <div key={box.id} className="relative">
                  <select
                    value={selectedLetters[box.id] || ''}
                    onChange={(e) => handleLetterSelect(box.id, e.target.value)}
                    className={`w-12 h-12 text-center text-xl border-2 border-[#452D0A] rounded-xl
                      focus:ring-4 focus:ring-[#452D0A] focus:border-[#452D0A]
                      ${selectedLetters[box.id] && selectedLetters[box.id] !== box.correct && message.includes('incorrect')
                        ? 'bg-red-100 border-red-500'
                        : ''
                      }`}
                  >
                    <option value="">?</option>
                    {Object.values(letterCodes)
                      .sort()
                      .map(letter => (
                        <option key={letter} value={letter}>{letter}</option>
                    ))}
                  </select>
                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 
                    text-sm font-bold bg-[#C38429] text-white px-2 py-1 rounded-full">
                    ({box.problemId})
                  </span>
                </div>
              ))}
            </div>
            {showRaccoon ? (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 flex flex-col items-center"
              >
                <img 
                  src="/img/game5-raccoon.png" 
                  alt="Raccoon" 
                  className="w-56 h-auto object-contain"
                />
                <p className="mt-4 text-2xl font-bold text-[#C35800]-600">
                  You found the first spy - RACCOON!
                </p>
              </motion.div>
            ) : null}
          </div>

          {/* Second Word Section */}
          <div className="mb-8 bg-[#F2E8D5] p-6 rounded-lg border-2 border-dashed border-[#732002]">
            <h2 className="text-2xl font-bold text-[#732002] mb-4">Second Spy</h2>
            <div className="flex justify-center gap-4 flex-wrap">
              {secondWord.boxes.map((box) => (
                <div key={box.id} className="relative">
                  <select
                    value={selectedLetters[box.id] || ''}
                    onChange={(e) => handleLetterSelect(box.id, e.target.value)}
                    className={`w-12 h-12 text-center text-xl border-2 border-[#452D0A] rounded-xl
                      focus:ring-2 focus:ring-[#452D0A] focus:border-[#452D0A]
                      ${selectedLetters[box.id] && selectedLetters[box.id] !== box.correct && message.includes('incorrect')
                        ? 'bg-red-100 border-red-500'
                        : ''
                      }`}
                  >
                    <option value="">?</option>
                    {Object.values(letterCodes)
                      .sort()
                      .map(letter => (
                        <option key={letter} value={letter}>{letter}</option>
                    ))}
                  </select>
                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 
                    text-sm font-bold bg-[#C38429] text-white px-2 py-1 rounded-full">
                    ({box.problemId})
                  </span>
                </div>
              ))}
            </div>
            {showSquirrel ? (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 flex flex-col items-center"
              >
                <img 
                  src="/img/game5-squirrel.png" 
                  alt="Squirrel" 
                  className="w-48 h-auto object-contain"
                />
                <p className="mt-4 text-2xl font-bold text-[#C35800]-600">
                  You found the second spy - SQUIRREL!
                </p>
              </motion.div>
            ) : null}
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-8 text-center text-xl font-bold p-4 rounded-lg ${
                message.includes('Congratulations') 
                  ? 'bg-green-100 text-green-600 border-2 border-green-600' 
                  : 'bg-blue-100 text-blue-600 border-2 border-blue-600'
              }`}
            >
              {message}
            </motion.div>
          )}

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handleReset}
              className="bg-[#CC0001] text-white px-6 py-2 rounded-lg font-bold 
                hover:bg-[#A30001] transition-colors"
            >
              Reset
            </button>
            <button
              onClick={checkAnswers}
              className="bg-[#FF5F05] text-white px-6 py-2 rounded-lg font-bold 
                hover:bg-[#D94E04] transition-colors"
            >
              Check Answers
            </button>
            {showRaccoon && showSquirrel && (
              <button
                onClick={async () => {
                  trackBehavior(
                    "game-complete",
                    "next-button-games5",
                    "complete"
                  );
                  if (onComplete) {
                    onComplete();
                  }
                }}
                className="bg-[#13294B] text-white px-6 py-2 rounded-lg font-bold 
                  hover:bg-[#0E1D35] transition-colors animate-bounce"
              >
                Next
              </button>
            )}
          </div>
        </div>
        {/* Bottom decorative frame */}
      <div className="w-full relative z-10 mt-auto">
        <img 
          src="/img/game5-bottomforest.png" 
          alt="Decorative bottom frame"
          className="w-full h-auto object-contain"
        />
      </div>
      </div>
    </div>
  );
}