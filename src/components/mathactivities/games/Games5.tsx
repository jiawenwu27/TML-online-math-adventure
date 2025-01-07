import { useState } from "react";

interface Games5Props {
  onBack: () => void;
  onComplete?: () => void;
}

interface Cell {
  id: number;
  allowInput: boolean;
  refNumber?: number;
  answer?: number;
}

interface PuzzleData {
  across: { [key: string]: { equation: string } };
  down: { [key: string]: { equation: string } };
}

export default function Games5({ onBack, onComplete }: Games5Props) {
  const puzzleData: PuzzleData = {
    across: {
      '1': { equation: '763 - 244 - 267' },
      '3': { equation: '194 - 16 - 52 - 29' },
      '8': { equation: '678 - 40 - 81' },
      '10': { equation: '823 - 125 - 41 - 275' },
      '11': { equation: '78 - 27 - 14' }
    },
    down: {
      '2': { equation: '139 + 283 + 97' },
      '4': { equation: '834 + 107 - 203' },
      '5': { equation: '458 - 67 + 152' },
      '6': { equation: '89 + 64 - 138' },
      '7': { equation: '295 + 427 + 156' },
      '9': { equation: '953 - 204 - 165 - 47' }
    }
  };

  const gridCells: Cell[] = [
    // Row 1
    { id: 0, allowInput: true, refNumber: 1, answer: 2 },
    { id: 1, allowInput: true, refNumber: 2, answer: 5 },
    { id: 2, allowInput: true, answer: 2 },
    { id: 3, allowInput: false },
    { id: 4, allowInput: true, refNumber: 3, answer: 9 },
    { id: 5, allowInput: true, refNumber: 4, answer: 7 },
    // Row 2
    { id: 6, allowInput: false },
    { id: 7, allowInput: true, answer: 1 },
    { id: 8, allowInput: false },
    { id: 9, allowInput: false },
    { id: 10, allowInput: false },
    { id: 11, allowInput: true, answer: 3 },
    // Row 3
    { id: 12, allowInput: true, refNumber: 5, answer: 5 },
    { id: 13, allowInput: true, answer: 9 },
    { id: 14, allowInput: true, refNumber: 6, answer: 1 },
    { id: 15, allowInput: false },
    { id: 16, allowInput: true, refNumber: 7, answer: 8 },
    { id: 17, allowInput: true, answer: 8 },
    // Row 4
    { id: 18, allowInput: true, answer: 4 },
    { id: 19, allowInput: false },
    { id: 20, allowInput: true, refNumber: 8, answer: 5 },
    { id: 21, allowInput: true, refNumber: 9, answer: 5 },
    { id: 22, allowInput: true, answer: 7 },
    { id: 23, allowInput: false },
    // Row 5
    { id: 24, allowInput: true, answer: 3 },
    { id: 25, allowInput: false },
    { id: 26, allowInput: false },
    { id: 27, allowInput: true, refNumber: 10, answer: 3 },
    { id: 28, allowInput: true, answer: 8 },
    { id: 29, allowInput: true, answer: 2 },
    // Row 6
    { id: 30, allowInput: false },
    { id: 31, allowInput: false },
    { id: 32, allowInput: true, refNumber: 11, answer: 3 },
    { id: 33, allowInput: true, answer: 7 },
    { id: 34, allowInput: false },
    { id: 35, allowInput: false },
  ];

  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [gameComplete, setGameComplete] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [highlightedClue, setHighlightedClue] = useState<string | null>(null);
  const [incorrectCells, setIncorrectCells] = useState<Set<number>>(new Set());
  const [emptyCells, setEmptyCells] = useState<Set<number>>(new Set());
  const [correctCells, setCorrectCells] = useState<Set<number>>(new Set());

  const handleInputChange = (cellId: number, value: string) => {
    if (value.length > 1) return;
    if (value !== "" && !/^[0-9]$/.test(value)) return;

    setIncorrectCells(new Set());
    setEmptyCells(new Set());
    setCorrectCells(new Set());

    setUserAnswers((prev) => ({
      ...prev,
      [cellId]: value,
    }));
  };

  const handleRefClick = (refNumber: number) => {
    setHighlightedClue(refNumber.toString());
  };

  const checkAnswers = () => {
    let allCorrect = true;
    const newIncorrectCells = new Set<number>();
    const newEmptyCells = new Set<number>();
    const newCorrectCells = new Set<number>();

    gridCells.forEach((cell) => {
      if (cell.allowInput && cell.answer !== undefined) {
        const userAnswer = userAnswers[cell.id];
        
        if (!userAnswer) {
          newEmptyCells.add(cell.id);
          allCorrect = false;
        } else if (parseInt(userAnswer) !== cell.answer) {
          newIncorrectCells.add(cell.id);
          allCorrect = false;
        } else {
          newCorrectCells.add(cell.id);
        }
      }
    });

    setIncorrectCells(newIncorrectCells);
    setEmptyCells(newEmptyCells);
    setCorrectCells(newCorrectCells);

    if (allCorrect) {
      setMessage("Congratulations! You've completed the crossword!");
      setGameComplete(true);
    } else {
      setMessage("Some answers are incorrect. Keep trying!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8">

      <div className="w-full max-w-4xl text-center">
        <h1
          className="text-6xl mb-6 font-bold text-[#13294B]"
          style={{ fontFamily: "Chalkduster, fantasy" }}
        >
          MATH CROSSWORD!
        </h1>

        <p className="text-2xl mb-8 text-gray-600">
          Solve the math crossword by filling in the answers. <br />
          Click on the clue numbers to see the equations for the corresponding words!
        </p>

        <div className="flex justify-center gap-8 mb-8">
          <div className="text-left bg-[#F2F9FF] p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4 text-[#13294B]">Across:</h3>
            {Object.entries(puzzleData.across).map(([num, { equation }]) => (
              <div
                key={`across-${num}`}
                className={`text-xl mb-2 cursor-pointer ${
                  highlightedClue === num ? "bg-[#6482AD] text-white font-bold px-2 rounded" : ""
                }`}
              >
                {num}. {equation}
              </div>
            ))}
          </div>
          <div className="text-left bg-[#F2F9FF] p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4 text-[#13294B]">Down:</h3>
            {Object.entries(puzzleData.down).map(([num, { equation }]) => (
              <div
                key={`down-${num}`}
                className={`text-xl mb-2 cursor-pointer ${
                  highlightedClue === num ? "bg-[#6482AD] text-white font-bold px-2 rounded" : ""
                }`}
              >
                {num}. {equation}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-6 gap-1 max-w-[600px] mx-auto mb-6">
          {gridCells.map((cell) => (
            <div
              key={cell.id}
              className={`relative w-24 h-24 ${
                cell.allowInput
                  ? `bg-white border-2 border-gray-300 ${
                      incorrectCells.has(cell.id)
                        ? "bg-[#FFC5C5]"
                        : emptyCells.has(cell.id)
                        ? "bg-[#FFFED3]"
                        : correctCells.has(cell.id)
                        ? "bg-[#C3E2C2]"
                        : ""
                    }`
                  : "bg-black"
              }`}
            >
              {cell.allowInput && (
                <>
                  {cell.refNumber && (
                    <span
                      onClick={() => handleRefClick(cell.refNumber!)}
                      className="absolute top-1 left-1 text-lg font-bold bg-gray-200 px-1 rounded cursor-pointer"
                    >
                      {cell.refNumber}
                    </span>
                  )}
                  <input
                    type="text"
                    maxLength={1}
                    className="w-full h-full text-center text-4xl bg-transparent outline-none"
                    value={userAnswers[cell.id] || ""}
                    onChange={(e) => handleInputChange(cell.id, e.target.value)}
                  />
                </>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={checkAnswers}
          className="bg-[#987D9A] text-white px-6 py-2 rounded-lg text-xl mb-4"
        >
          Check Answers
        </button>

        {message && (
          <div className="text-xl font-bold mb-6 text-[#13294B]">{message}</div>
        )}

        {gameComplete && (
          <button
            onClick={onComplete}
            className="bg-[#FF5F05] text-2xl text-white px-6 py-2 rounded-lg"
          >
            NEXT
          </button>
        )}
      </div>
    </div>
  );
}