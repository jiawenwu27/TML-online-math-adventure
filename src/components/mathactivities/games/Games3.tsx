import { useState } from "react";
import "@/styles/arrowbutton.css";

interface Games3Props {
  onBack: () => void;
  onComplete?: () => void;
  savedAnswers?: {
    solvedPaths: number[];
    wrongCells: number[];
    currentCell: number;
    isComplete: boolean;
  };
  onSaveAnswers: (answers: {
    solvedPaths: number[];
    wrongCells: number[];
    currentCell: number;
    isComplete: boolean;
  }) => void;
}

interface Cell {
  id: number;
  type: "question" | "answer" | "empty" | "castle";
  content?: string;
  possibleanswerid?: number[];
  answer?: number[];
  next?: number[];
  direction?: "right" | "left" | "top" | "bottom" | "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export default function Games3({
  onBack,
  onComplete,
  savedAnswers,
  onSaveAnswers,
}: Games3Props) {
  const [currentCell, setCurrentCell] = useState(savedAnswers?.currentCell ?? 0);
  const [solvedPaths, setSolvedPaths] = useState<number[]>(savedAnswers?.solvedPaths ?? []);
  const [wrongCells, setWrongCells] = useState<number[]>(savedAnswers?.wrongCells ?? []);
  const [message, setMessage] = useState("");
  const [isComplete, setIsComplete] = useState<boolean>(savedAnswers?.isComplete ?? false);

  const grid: Cell[] = [
      // Row 1
      { id: 0, type: "question", content: "48 + 36 + 22 + 19", possibleanswerid: [1, 5, 6], answer: [6], next: [2, 10, 12] },
      { id: 1, type: "answer", content: "127", direction: "right"},
      { id: 2, type: "question", content: "32 + 45 + 22 + 38", possibleanswerid: [3, 7], answer: [3], next: [4, 12] },
      { id: 3, type: "answer", content: "137", direction: "right" },
      { id: 4, type: "question", content: "37 + 62 + 45 + 24", possibleanswerid: [3, 8, 9], answer: [9], next: [2, 12, 14] },
  
      // Row 2
      { id: 5, type: "answer", content: "118", direction: "bottom" },
      { id: 6, type: "answer", content: "125" , direction: "bottom-right"},
      { id: 7, type: "answer", content: "30", direction: "bottom" },
      { id: 8, type: "answer", content: "25", direction: "bottom-left" },
      { id: 9, type: "answer", content: "168", direction: "bottom" },
  
      // Row 3
      { id: 10, type: "question", content: "43 + 57 + 12 + 28", possibleanswerid: [11, 15], answer: [], next: [12, 20] },
      { id: 11, type: "answer", content: "32", direction: "right" },
      { id: 12, type: "question", content: "175 - 34 - 62 - 59", possibleanswerid: [16, 17, 18], answer: [16], next: [20, 22, 24] },
      { id: 13, type: "answer", content: "15", direction: "left" },
      { id: 14, type: "question", content: "83 + 27 + 12 + 58", possibleanswerid: [13, 19], answer: [19], next: [12, 24] },
  
      // Row 4
      { id: 15, type: "answer", content: "143", direction: "bottom" },
      { id: 16, type: "answer", content: "20", direction: "bottom-left" },
      { id: 17, type: "answer", content: "23", direction: "bottom" },
      { id: 18, type: "answer", content: "19", direction: "bottom-right" },
      { id: 19, type: "answer", content: "180", direction: "bottom" },
  
      // Row 5
      { id: 20, type: "question", content: "82 + 15 + 23 + 37", possibleanswerid: [21, 25, 26], answer: [21], next: [22, 30, 32] },
      { id: 21, type: "answer", content: "157", direction: "right" },
      { id: 22, type: "question", content: "125 - 48 - 36 - 24", possibleanswerid: [21, 27, 23], answer: [27], next: [20, 32, 24] },
      { id: 23, type: "answer", content: "21", direction: "left" },
      { id: 24, type: "question", content: "53 + 27 + 86 + 13", possibleanswerid: [23, 28, 29], answer: [29], next: [22, 32, 34] },
  
      // Row 6
      { id: 25, type: "answer", content: "137", direction: "bottom" },
      { id: 26, type: "answer", content: "149", direction: "bottom-right" },
      { id: 27, type: "answer", content: "17", direction: "bottom" },
      { id: 28, type: "answer", content: "152", direction: "bottom-left" },
      { id: 29, type: "answer", content: "179", direction: "bottom" },
  
      // Row 7
      { id: 30, type: "question", content: "173 - 67 - 22 - 28", possibleanswerid: [25, 31], answer: [], next: [20, 32] },
      { id: 31, type: "answer", content: "56", direction: "right" },
      { id: 32, type: "question", content: "67 + 54 + 29 + 11", possibleanswerid: [27, 33], answer: [33], next: [22, 34] },
      { id: 33, type: "answer", content: "161", direction: "right" },
      { id: 34, type: "castle", content: "🏰" }, // Castle at the end
    ];
  

  const handleAnswerClick = (id: number) => {
    const current = grid[currentCell];

    if (current.possibleanswerid?.includes(id)) {
      if (current.answer?.includes(id)) {
        // Correct answer
        const newSolvedPaths = [...solvedPaths, currentCell, id];
        setSolvedPaths(newSolvedPaths);
        const nextCellIndex = current.possibleanswerid.indexOf(id);
        const nextCell = current.next ? current.next[nextCellIndex] : null;

        // Check if the next cell is the castle (id: 34)
        if (nextCell === 34) {
          setMessage("Congratulations!");
          setIsComplete(true);
          setCurrentCell(nextCell);
          // Save the completed state
          onSaveAnswers({
            solvedPaths: newSolvedPaths,
            wrongCells,
            currentCell: nextCell,
            isComplete: true,
          });
        } else if (nextCell !== null) {
          setCurrentCell(nextCell);
          setMessage("Correct! Proceed to the next question.");
          // Save the current state
          onSaveAnswers({
            solvedPaths: newSolvedPaths,
            wrongCells,
            currentCell: nextCell,
            isComplete: false,
          });
        }
      } else {
        // Wrong answer
        const newWrongCells = [...wrongCells, id];
        setWrongCells(newWrongCells);
        setMessage("Wrong path! Try again.");
        // Save the wrong attempt
        onSaveAnswers({
          solvedPaths,
          wrongCells: newWrongCells,
          currentCell,
          isComplete: false,
        });
        console.log(isComplete);
      }
    }
  };

  const renderGrid = () => (
    <div className="grid grid-cols-5 gap-4">
      {grid.map((cell) => {
        const isActive = cell.id === currentCell;
        const isWrong = wrongCells.includes(cell.id);
        const isSolved = solvedPaths.includes(cell.id);

        return (
          <div
            key={cell.id}
            className={`relative p-4 text-center rounded-lg border-2 ${
              cell.type === "castle"
                ? "bg-yellow-300"
                : isActive
                ? "bg-yellow-100"
                : isWrong
                ? "bg-red-100 border-red-500"
                : isSolved
                ? "bg-green-100 border-green-500"
                : "bg-gray-100"
            }`}
          >
            {/* Character Image for Active Cell */}
            {cell.id === currentCell && (
              <img
                src="/img/game3-character.png"
                alt="Character"
                className="absolute -top-[2rem] left-1/2 transform -translate-x-1/2 w-11"
              />
            )}

            {/* Castle Cell */}
            {cell.type === "castle" ? (
              <img src="/img/game3-castle.png" alt="Castle" className="w-[6.5rem] mx-auto" />

              /* Answer Cells with Directional Arrows */
            ) : cell.type === "answer" ? (
              <button
                onClick={() => handleAnswerClick(cell.id)}
                className={`arrow-button arrow-${cell.direction} ${
                  isWrong ? "wrong" : isSolved ? "active" : ""
                }`}
              >
                {cell.content}
              </button>

              /* Question Cells */
            ) : (
              <p className="text-2xl text-start">{cell.content}</p>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        <h1
          className="text-4xl mb-6 font-bold text-[#13294B] text-center"
          style={{ fontFamily: "Chalkduster, fantasy" }}
        >
          Castle Quest: Solve & Conquer!
        </h1>

        <p className="text-xl mb-6 text-center">
          Take turns solving the puzzle! Each correct answer brings you closer to the castle—work together to complete the journey!
        </p>

        {renderGrid()}

        <div className="mt-6 text-center">
          <p
            className={`text-lg ${
              message.includes("Congratulations")
                ? "text-green-600"
                : message.includes("Correct")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>

          {isComplete && (
            <div className="mt-6 flex flex-col items-center">
              <div className="text-2xl text-green-600 mb-4">
                🎉 Amazing work! You've successfully reached the castle! 🏰
              </div>
              <button
                onClick={onComplete}
                className="bg-[#FF5F05] text-2xl text-white px-6 py-2 rounded-lg"
              >
                NEXT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


