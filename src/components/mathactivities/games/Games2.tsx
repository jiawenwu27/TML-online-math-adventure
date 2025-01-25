import { useState, useEffect } from "react";

interface Square {
  value: string | null;
  question: string;
  answer: number;
  attempted?: boolean;
}

interface ActivityComponentProps {
  onBack: () => void;
  onComplete?: () => void;
  savedAnswers: number[];
  onSaveAnswers: (answers: number[]) => void;
  onLogBehavior: (location: string, behavior: string, input: string, result: string) => void;
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
  onSaveAnswers,
  onLogBehavior
}: ActivityComponentProps) {
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

  const convertArrayToGameState = (answers: number[]): GameState => {
    const defaultState: GameState = {
      board: initialBoard,
      playerSymbol: null,
      childSymbol: null,
      currentPlayer: 'child',
      selectedSquare: null,
      answer: '',
      message: '',
      gameComplete: false
    };

    if (!answers || answers.length === 0) return defaultState;

    return {
      playerSymbol: answers[0] === 1 ? 'cross' : 'circle',
      childSymbol: answers[0] === 1 ? 'circle' : 'cross',
      currentPlayer: answers[1] === 1 ? 'parent' : 'child',
      board: initialBoard.map((square, index) => ({
        ...square,
        value: answers[index + 2] === 0 ? null : 
               answers[index + 2] === 1 ? 'cross' : 'circle'
      })),
      selectedSquare: null,
      answer: '',
      message: '',
      gameComplete: answers.slice(2).some(val => val !== 0)
    };
  };

  const convertGameStateToArray = (state: GameState): number[] => {
    return [
      state.playerSymbol === 'cross' ? 1 : 2,
      state.currentPlayer === 'parent' ? 1 : 2,
      ...state.board.map(square => 
        square.value === null ? 0 : 
        square.value === 'cross' ? 1 : 2
      )
    ];
  };

  const [gameState, setGameState] = useState<GameState>(
    convertArrayToGameState(savedAnswers)
  );

  useEffect(() => {
    const arrayState = convertGameStateToArray(gameState);
    onSaveAnswers(arrayState);
  }, [gameState]);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(current => ({
      ...current,
      ...updates
    }));
  };

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

  const handleSquareClick = async (index: number) => {
    if (gameState.board[index].value || gameState.gameComplete) return;
    
    await onLogBehavior(
      "games2",
      "click",
      `select-square:${index}`,
      `question:${gameState.board[index].question}`
    );

    updateGameState({
      selectedSquare: index,
      answer: '',
      message: ''
    });
  };

  const handleAnswerSubmit = async () => {
    if (gameState.selectedSquare === null) return;

    const currentSquare = gameState.board[gameState.selectedSquare];
    const userAnswer = parseInt(gameState.answer);
    const isCorrect = userAnswer === currentSquare.answer;

    await onLogBehavior(
      "games2",
      "click",
      `submit-answer:square-${gameState.selectedSquare}:${userAnswer}`,
      `${isCorrect ? "correct" : "incorrect"}:player-${gameState.currentPlayer}`
    );

    if (isCorrect) {
      const newBoard = [...gameState.board];
      newBoard[gameState.selectedSquare] = {
        ...currentSquare,
        value: gameState.currentPlayer === 'parent' ? gameState.playerSymbol : gameState.childSymbol,
        attempted: true
      };
      updateGameState({
        board: newBoard,
        gameComplete: false
      });

      const winner = checkWinner(newBoard);
      if (winner) {
        const winMessage = `${gameState.currentPlayer === 'parent' ? 'Parent' : 'Child'}! High Five! You're the Tic Tac Toe Champion!`;
        updateGameState({
          message: winMessage,
          gameComplete: true
        });
        await onLogBehavior(
          "games2",
          "game-complete",
          `winner:${gameState.currentPlayer}`,
          winMessage
        );
      } else {
        updateGameState({
          currentPlayer: gameState.currentPlayer === 'parent' ? 'child' : 'parent'
        });
      }
    } else {
      updateGameState({
        message: 'Wrong answer! Turn goes to the other player.'
      });
      updateGameState({
        currentPlayer: gameState.currentPlayer === 'parent' ? 'child' : 'parent'
      });
    }
    updateGameState({
      selectedSquare: null,
      answer: ''
    });
  };

  const handleSymbolSelect = async (playerChoice: 'cross' | 'circle') => {
    await onLogBehavior(
      "games2",
      "click",
      `select-symbol:${playerChoice}`,
      `child-selected:${playerChoice}`
    );

    updateGameState({
      playerSymbol: playerChoice === 'cross' ? 'circle' : 'cross',
      childSymbol: playerChoice
    });
  };

  if (!gameState.playerSymbol) {
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
                updateGameState({
                  playerSymbol: 'cross',
                  childSymbol: 'circle'
                });
              }}
              className="w-24 h-24 flex items-center justify-center"
            >
              <img src="/img/game2-circle.png" alt="O" className="w-auto h-40" />
            </button>
            <button
              onClick={() => {
                updateGameState({
                  playerSymbol: 'circle',
                  childSymbol: 'cross'
                });
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
              gameState.currentPlayer === 'parent' ? 'bg-red-100' : ''
            }`}
          >
            <p className="text-2xl font-bold mb-4">Parent's symbol:</p>
            <img
              src={`/img/game2-${gameState.playerSymbol}.png`}
              alt="Parent Symbol"
              className="w-16 h-auto mx-auto"
            />
          </div>
          <div
            className={`p-4 rounded-lg ${
              gameState.currentPlayer === 'child' ? 'bg-red-100' : ''
            }`}
          >
            <p className="text-2xl font-bold mb-4">Child's symbol:</p>
            <img
              src={`/img/game2-${gameState.childSymbol}.png`}
              alt="Child Symbol"
              className="w-16 h-auto mx-auto"
            />
          </div>
        </div>
        <p className="text-2xl mb-6 text-bold text-[#13294B]"  style={{ fontFamily: "Chalkduster, fantasy" }}>
          Current Turn: {gameState.currentPlayer === 'parent' ? 'Parent' : 'Child'}
        </p>
        <div className="grid grid-cols-3 gap-2 max-w-[600px] mx-auto mb-6">
          {gameState.board.map((square, i) => (
            <button
              key={i}
              className={`w-full h-32 border-2 flex items-center justify-center text-2xl ${
                gameState.selectedSquare === i ? 'bg-yellow-100' : 'bg-gray-100'
              }`}
              onClick={() => handleSquareClick(i)}
              disabled={square.value !== null || gameState.gameComplete}
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
        {gameState.selectedSquare !== null && (
          <div className="mb-6">
            <input
              type="number"
              value={gameState.answer}
              onChange={(e) => updateGameState({ answer: e.target.value })}
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              className="border-2 border-gray-300 rounded-lg px-4 py-2 mr-4"
              placeholder="Enter your answer"
              style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
            />
            <button
              onClick={handleAnswerSubmit}
              className="bg-[#FF5F05] text-white px-6 py-2 rounded-lg"
            >
              Submit Answer
            </button>
          </div>
        )}
        {gameState.message && (
          <div className="text-xl font-bold mb-6">{gameState.message}</div>
        )}
        {gameState.gameComplete && (
          <button
            onClick={async () => {
              await onLogBehavior(
                "games2",
                "game-complete",
                "next-button-games2",
                "complete"
              );
              if (onComplete) {
                onComplete();
              }
            }}
            className="bg-[#FF5F05] text-2xl text-white px-6 py-2 rounded-lg"
          >
            NEXT
          </button>
        )}
      </div>
    </div>
  );
}
