import { useState, useEffect } from 'react';
import Image from 'next/image';
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
  savedAnswers: number[];
  onSaveAnswers: (answers: number[]) => void;
  onTrackBehavior: (behavior: UserBehavior) => void;
}

export default function Games1({ 
  onBack, 
  onComplete, 
  savedAnswers = [],
  onSaveAnswers,
  onTrackBehavior
}: ActivityComponentProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>(savedAnswers);
  const [mathProblems] = useState([
    { problem: '24 + 27', answer: 51 },
    { problem: '56 + 38', answer: 94 },
    { problem: '67 - 29', answer: 38 }
  ]);

  const icons = [
    { id: 'clock', value: 51, icon: '⏰' },
    { id: 'alien', value: 53, icon: '👽' },
    { id: 'balloon', value: 36, icon: '🎈' },
    { id: 'basketball', value: 47, icon: '🏀' },
    { id: 'books', value: 94, icon: '📚' },
    { id: 'banana', value: 46, icon: '🍌' },
    { id: 'shuttlecock', value: 84, icon: '🏸' },
    { id: 'rabbit', value: 38, icon: '🐰' },
    { id: 'butterfly', value: 41, icon: '🦋' }
  ];

  const [message, setMessage] = useState<string>('');
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTreasure, setShowTreasure] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (savedAnswers?.length === 3) {
      setSelectedNumbers(savedAnswers);
      checkCode(savedAnswers, true);
    }
  }, []);

  const trackBehavior = (behavior: string, input: string, result: string) => {
    onTrackBehavior({
      timestamp: new Date().toISOString(),
      location: "",
      behavior,
      input,
      result
    });
  };

  const handleIconClick = async (value: number) => {
    if (selectedNumbers.length < 3 && !selectedNumbers.includes(value)) {
      const newNumbers = [...selectedNumbers, value];
      trackBehavior(
        "click",
        `select-number:${value}`,
        `selected-sequence:${newNumbers.join(',')}`
      );
      setSelectedNumbers(newNumbers);
      onSaveAnswers(newNumbers);
    }
  };

  const checkCode = async (numbers: number[], isInitial: boolean = false) => {
    const correctCode = [51, 94, 38];
    
    if (numbers.length !== 3) {
      setMessage('Please press 3 buttons!');
      return;
    }

    const isCorrect = correctCode.every(num => numbers.includes(num));
    
    trackBehavior(
      "click",
      `check-code:${numbers.join(',')}`,
      isCorrect ? "correct" : "incorrect"
    );

    if (isCorrect) {
      setMessage('Congratulations! You helped Doggie unlock the box! 🎉');
      setIsComplete(true);
      setShowConfetti(true);
      setTimeout(() => {
        setShowTreasure(true);
      }, 1000);
      if (onSaveAnswers) onSaveAnswers(numbers);
    } else {
      setMessage('Work together on the unlocking tips--each correct answer will show you which button to press! 🔒');
      if (!isInitial) {
        setSelectedNumbers([]);
      }
    }
  };

  const handleNext = async () => {
    if (!isComplete) {
      alert("Please solve the problem correctly before moving on!");
      return;
    }

    trackBehavior(
      "click",
      "next-button-games1",
      "complete"
    );

    if (onComplete) {
      onComplete();
    }
  };

  const handleReset = async () => {
    trackBehavior(
      "click",
      "reset-button",
      "reset-game"
    );
    
    setSelectedNumbers([]);
    onSaveAnswers([]);
    setMessage('');
    setIsComplete(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
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

      <div className="w-full max-w-3xl relative">
        <img 
          src="/img/game1-doggiedecor.png" 
          alt="Decorative doggie" 
          className="absolute -bottom-[0.5rem] -left-[3rem] w-[15rem] h-auto z-10"
        />
        
        <div className="bg-white p-8 rounded-lg shadow-lg relative">
          <div className="mb-6">
          <img src="/img/game1-doggieheader.png" alt="Help Doggie Unlock the Door" className="mx-auto mb-4" />
          </div>

          <p className="text-xl mb-6 text-black-700">
            Doggie was roaming the backyard when he spotted something sparkling under a shady old tree—a mysterious box secured by a strange lock.
            <br/>Curious and excited, he wagged his tail and gave the lock a quick sniff. 
            <br/>"I wonder what's inside," Doggie thought. 
            <br/>
            <br/>Now, it's up to you to help him crack the lock's secret code and uncover the surprise hidden within!
          </p>

          <div className="mb-8">
            <h3 className="text-3xl mb-4 text-center font-bold text-[#2C3F70]">Unlocking Tips</h3>
            <div className="text-center text-2xl font-medium">
            {mathProblems.map((problem, index) => (
              <div key={index} className="mb-2">
                {problem.problem} = ___
              </div>
            ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex flex-wrap justify-center text-2xl font-medium gap-x-6 gap-y-4">
              {icons.map((item, i) => (
                <div key={i} className="flex items-center">
                  <span>{item.icon}</span> = <span className="ml-2">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-[400px] mx-auto mb-8">
            {icons.map((item, i) => (
              <button
                key={i}
                onClick={() => handleIconClick(item.value)}
                className={`w-24 h-24 text-6xl rounded-lg hover:bg-yellow-100 
                  ${selectedNumbers.includes(item.value) ? 'bg-blue-100' : 'bg-gray-100'}`}
              >
                {item.icon}
              </button>
            ))}
          </div>

          <div className="relative mb-8 flex flex-col items-center">
            <AnimatePresence>
              {showTreasure && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="absolute z-50 transform -translate-y-full mb-4"
                >
                  <motion.div
                    animate={{ 
                      boxShadow: [
                        "0 0 20px #ffd700",
                        "0 0 60px #ffd700",
                        "0 0 20px #ffd700"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="bg-yellow-100 p-8 rounded-lg text-center"
                  >
                    <img 
                      src="/img/game1-goldenbone.png" 
                      alt="Golden Bone" 
                      className="w-40 h-auto mx-auto mb-4 object-contain"
                    />
                    <p className="text-2xl font-bold text-yellow-800">
                      Wow! A Golden Bone!
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              animate={isComplete ? {
                boxShadow: [
                  "0 0 10px rgba(255, 215, 0, 0.5)",
                  "0 0 20px rgba(255, 215, 0, 0.7)",
                  "0 0 10px rgba(255, 215, 0, 0.5)"
                ]
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex justify-center"
            >
              <img 
                src={isComplete ? "/img/game1-treasurebox-open.png" : "/img/game1-treasurebox-close.png"}
                alt="Treasure Box" 
                className="w-64 h-auto"
              />
            </motion.div>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 text-center text-lg ${
                message.includes('Congratulations') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message}
            </motion.div>
          )}

          <div className="flex justify-center gap-4">
            <button
              onClick={handleReset}
              className="bg-[#CC0001] text-white px-6 py-2 rounded-lg"
            >
              Reset
            </button>
            <button
              onClick={() => checkCode(selectedNumbers)}
              className="bg-[#FF5F05] text-white px-6 py-2 rounded-lg"
            >
              Try Code
            </button>
            {isComplete && (
              <button
                onClick={handleNext}
                className="bg-[#13294B] text-white px-6 py-2 rounded-lg"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}