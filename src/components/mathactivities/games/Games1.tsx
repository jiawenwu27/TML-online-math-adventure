import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ActivityComponentProps {
  onBack: () => void;
  onComplete?: () => void;
  savedAnswers?: number[];
  onSaveAnswers: (answers: number[]) => void;
}

export default function Games1({ 
  onBack, 
  onComplete, 
  savedAnswers = [],
  onSaveAnswers 
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

  useEffect(() => {
    if (savedAnswers?.length === 3) {
      setSelectedNumbers(savedAnswers);
      checkCode(savedAnswers, true);
    }
  }, []);

  const handleIconClick = (value: number) => {
    if (selectedNumbers.length < 3) {
      const newNumbers = [...selectedNumbers, value];
      setSelectedNumbers(newNumbers);
      onSaveAnswers(newNumbers);
    }
  };

  const checkCode = (numbers: number[], isInitial: boolean = false) => {
    const correctCode = [51, 94, 38];
    
    if (numbers.length !== 3) {
      setMessage('Please select 3 numbers!');
      return;
    }

    const isCorrect = numbers.every((num, index) => num === correctCode[index]);
    
    if (isCorrect) {
      setMessage('Congratulations! You unlocked the door! 🎉');
      setIsComplete(true);
      if (onSaveAnswers) onSaveAnswers(numbers);
    } else {
      setMessage('Wrong code! Try again! 🔒');
      if (!isInitial) {
        setSelectedNumbers([]);
      }
    }
  };

  const handleNext = () => {
    if (!isComplete) {
      alert("Please solve the problem correctly before moving on!");
      return;
    }
    if (onComplete) {
      onComplete();
    }
  };

  const handleReset = () => {
    setSelectedNumbers([]);
    onSaveAnswers([]);
    setMessage('');
    setIsComplete(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <div className="w-full max-w-3xl relative">
        <img 
          src="/img/game1-doggiedecor.png" 
          alt="Decorative doggie" 
          className="absolute -bottom-[0.5rem] -left-[3rem] w-[20rem] h-auto z-10"
        />
        
        <div className="bg-white p-8 rounded-lg shadow-lg relative">
          <div className="mb-6">
          <img src="/img/game1-doggieheader.png" alt="Help Doggie Unlock the Door" className="mx-auto mb-4" />
          </div>

          <p className="text-xl mb-6 text-center text-black-700">
            Doggie forgot the passcode to the house, but he left himself some helpful clues! 
            Solve the following math problems to uncover the code for Doggie.
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

          <div className="mb-6">
            <h3 className="text-3xl text-center mb-6 font-bold text-[#2C3F70]">Selected Code</h3>
            <div className="flex gap-4 justify-center">
              {[0, 1, 2].map((index) => (
                <div key={index} className="w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl">
                  {selectedNumbers[index] || '?'}
                </div>
              ))}
            </div>
          </div>

          {message && (
            <div className={`mb-6 text-center text-lg ${
              message.includes('Congratulations') ? 'text-green-600' : 'text-red-600'
            }`}>
              {message}
            </div>
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