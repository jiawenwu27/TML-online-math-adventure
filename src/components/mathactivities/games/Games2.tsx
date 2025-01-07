import { useState, useEffect } from "react";

interface ActivityComponentProps {
  onBack: () => void;
  onComplete?: () => void;
  savedAnswers?: GameState;
  onSaveAnswers: (answers: GameState) => void;
}

interface Square {
  value: string | null;
  question: string;
  answer: number;
  attempted?: boolean;
}

interface GameState {
  board: Square[];
  playerSymbol: 'cross' | 'circle' | null;
  childSymbol: 'cross' | 'circle' | null;
  currentPlayer: 'parent' | 'child';
  selectedSquare: number | null;
  answer: string;
  message: string;
  gameComplete: boolean;
}

export default function Games2({ 
  onBack, 
  onComplete, 
  savedAnswers, 
  onSaveAnswers 
}: ActivityComponentProps) {
  const [playerSymbol, setPlayerSymbol] = useState<'cross' | 'circle' | null>(
    savedAnswers?.playerSymbol ?? null
  );
  const [childSymbol, setChildSymbol] = useState<'cross' | 'circle' | null>(
    savedAnswers?.childSymbol ?? null
  );
  const [currentPlayer, setCurrentPlayer] = useState<'parent' | 'child'>(
    savedAnswers?.currentPlayer ?? 'child'
  );
  const [selectedSquare, setSelectedSquare] = useState<number | null>(
    savedAnswers?.selectedSquare ?? null
  );
  const [answer, setAnswer] = useState<string>(
    savedAnswers?.answer ?? ''
  );
  const [message, setMessage] = useState<string>(
    savedAnswers?.message ?? ''
  );
  const [gameComplete, setGameComplete] = useState(
    savedAnswers?.gameComplete ?? false
  );

  const initialBoard: Square[] = [
    { value: null, question: '58 - 29 = ?', answer: 29 },
    { value: null, question: '52 + 14 + 26 = ?', answer: 92 },
    { value: null, question: '75 - 22 - 45 = ?', answer: 8 },
    { value: null, question: '17 + 23 + 46 = ?', answer: 86 },
    { value: null, question: '67 - 34 - 26 = ?', answer: 7 },
    { value: null, question: '96 - 38 = ?', answer: 58 },
    { value: null, question: '86 - 23 - 35 = ?', answer: 28 },
    { value: null, question: '67 - 18 = ?', answer: 49 },
    { value: null, question: '25 + 35 + 48 = ?', answer: 108 }
  ];

  const [board, setBoard] = useState<Square[]>(
    savedAnswers?.board ?? initialBoard
  );

  useEffect(() => {
    onSaveAnswers({
      board,
      playerSymbol,
      childSymbol,
      currentPlayer,
      selectedSquare,
      answer,
      message,
      gameComplete
    });
  }, [board, playerSymbol, childSymbol, currentPlayer, selectedSquare, answer, message, gameComplete]);

  const checkWinner = (squares: Square[]): string | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (
        squares[a].value &&
        squares[a].value === squares[b].value &&
        squares[a].value === squares[c].value
      ) {
        return squares[a].value;
      }
    }
    return null;
  };

  const handleSquareClick = (index: number) => {
    if (board[index].value || gameComplete) return;
    setSelectedSquare(index);
    setAnswer('');
    setMessage('');
  };

  const handleAnswerSubmit = () => {
    if (selectedSquare === null) return;

    const currentSquare = board[selectedSquare];
    if (parseInt(answer) === currentSquare.answer) {
      const newBoard = [...board];
      newBoard[selectedSquare] = {
        ...currentSquare,
        value: currentPlayer === 'parent' ? playerSymbol : childSymbol,
        attempted: true
      };
      setBoard(newBoard);

      const winner = checkWinner(newBoard);
      if (winner) {
        setMessage(`${currentPlayer === 'parent' ? 'Parent' : 'Child'}! High Five! You're the Tic Tac Toe Champion!`);
        setGameComplete(true);
      } else {
        setCurrentPlayer(currentPlayer === 'parent' ? 'child' : 'parent');
      }
    } else {
      setMessage('Wrong answer! Turn goes to the other player.');
      setCurrentPlayer(currentPlayer === 'parent' ? 'child' : 'parent');
    }
    setSelectedSquare(null);
    setAnswer('');
  };

  if (!playerSymbol) {
    return (
      <div className="min-h-screen flex flex-col items-center p-8">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1
            className="text-4xl mb-6 font-bold text-[#13294B]"
            style={{ fontFamily: "Chalkduster, fantasy" }}
          >
            MATH TIC-TAC-TOE!
          </h1>
          <h2 className="text-2xl mb-[4rem]">
            Child, choose your symbol and your mom/dad's will be autodetermined:
          </h2>
          <div className="flex justify-center gap-8 mb-[4rem]">
            <button
              onClick={() => {
                setPlayerSymbol('cross');
                setChildSymbol('circle');
              }}
              className="w-24 h-24 flex items-center justify-center"
            >
              <img src="/img/game2-circle.png" alt="O" className="w-auto h-40" />
            </button>
            <button
              onClick={() => {
                setPlayerSymbol('circle');
                setChildSymbol('cross');
              }}
              className="w-24 h-24 flex items-center justify-center"
            >
              <img src="/img/game2-cross.png" alt="X" className="w-auto h-40" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <div className="w-full max-w-3xl text-center">
        <h1
          className="text-6xl mb-6 font-bold text-[#13294B]"
          style={{ fontFamily: "Chalkduster, fantasy" }}
        >
          MATH TIC-TAC-TOE!
        </h1>
        <div className="flex justify-around mb-6">
          <div
            className={`p-4 rounded-lg ${
              currentPlayer === 'parent' ? 'bg-red-100' : ''
            }`}
          >
            <p className="text-2xl font-bold mb-4">Parent's symbol:</p>
            <img
              src={`/img/game2-${playerSymbol}.png`}
              alt="Parent Symbol"
              className="w-16 h-auto mx-auto"
            />
          </div>
          <div
            className={`p-4 rounded-lg ${
              currentPlayer === 'child' ? 'bg-red-100' : ''
            }`}
          >
            <p className="text-2xl font-bold mb-4">Child's symbol:</p>
            <img
              src={`/img/game2-${childSymbol}.png`}
              alt="Child Symbol"
              className="w-16 h-auto mx-auto"
            />
          </div>
        </div>
        <p className="text-2xl mb-6 text-bold text-[#13294B]"  style={{ fontFamily: "Chalkduster, fantasy" }}>
          Current Turn: {currentPlayer === 'parent' ? 'Parent' : 'Child'}
        </p>
        <div className="grid grid-cols-3 gap-2 max-w-[600px] mx-auto mb-6">
          {board.map((square, i) => (
            <button
              key={i}
              className={`w-full h-32 border-2 flex items-center justify-center text-2xl ${
                selectedSquare === i ? 'bg-yellow-100' : 'bg-gray-100'
              }`}
              onClick={() => handleSquareClick(i)}
              disabled={square.value !== null || gameComplete}
            >
              {square.value ? (
                <img
                  src={`/img/game2-${square.value}.png`}
                  alt={square.value}
                  className="w-auto h-[7rem]"
                />
              ) : (
                <span className="text-xl p-2">{square.question}</span>
              )}
            </button>
          ))}
        </div>
        {selectedSquare !== null && (
          <div className="mb-6">
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-4 py-2 mr-4"
              placeholder="Enter your answer"
            />
            <button
              onClick={handleAnswerSubmit}
              className="bg-[#FF5F05] text-white px-6 py-2 rounded-lg"
            >
              Submit Answer
            </button>
          </div>
        )}
        {message && (
          <div className="text-xl font-bold mb-6">{message}</div>
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
