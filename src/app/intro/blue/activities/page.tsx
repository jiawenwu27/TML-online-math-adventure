"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";
import { Amplify } from 'aws-amplify';
import outputs from '../../../../../amplify_outputs.json';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../../../amplify/data/resource';


import Formal1 from "@/components/mathactivities/formal/Formal1";
import Formal2 from "@/components/mathactivities/formal/Formal2";
import Formal3 from "@/components/mathactivities/formal/Formal3";
import Formal4 from "@/components/mathactivities/formal/Formal4";
import Formal5 from "@/components/mathactivities/formal/Formal5";

import Word1 from "@/components/mathactivities/word/Word1";
import Word2 from "@/components/mathactivities/word/Word2";
import Word3 from "@/components/mathactivities/word/Word3";
import Word4 from "@/components/mathactivities/word/Word4";
import Word5 from "@/components/mathactivities/word/Word5";

import Games1 from "@/components/mathactivities/games/Games1";
import Games2 from "@/components/mathactivities/games/Games2";
import Games3 from "@/components/mathactivities/games/Games3";
import Games4 from "@/components/mathactivities/games/Games4";
import Games5 from "@/components/mathactivities/games/Games5";

interface Square {
  value: string | null;
  question: string;
  answer: number;
  attempted?: boolean;
}

interface ListAnswers {
  totalAmount: string;
  hasEnoughBudget: boolean | null;
  changeAmount: string;
  shopperRole: 'parent' | 'child' | null;
  cashierRole: 'parent' | 'child' | null;
}

// Base props shared by all activities
interface BaseActivityProps {
  onBack: () => void;
  onComplete?: () => void;
}

// Props for standard activities (Formal and Word)
interface StandardActivityProps extends BaseActivityProps {
  answers: string[];
  isCorrect: (boolean | null)[];
  onAnswersChange: (answers: string[]) => void;
  onCorrectChange: (isCorrect: (boolean | null)[]) => void;
  onLogBehavior: (location: string, behavior: string, input: string, result: string) => void;
}

// Specific Game Activity Props
interface Games1Props extends BaseActivityProps {
  savedAnswers: number[];
  onSaveAnswers: (answers: number[]) => void;
  onTrackBehavior: (behavior: UserBehavior) => void;
}

interface Games2Props extends BaseActivityProps {
  savedAnswers?: {
    currentSquare: number | null;
    question: string;
    correctAnswer: number;
    currentPlayer: 'parent' | 'child';
    userInput: string;
    board: Square[];
    playerSymbol: 'cross' | 'circle' | null;
    childSymbol: 'cross' | 'circle' | null;
    gameComplete: boolean;
  };
  onSaveAnswers: (answers: {
    currentSquare: number | null;
    question: string;
    correctAnswer: number;
    currentPlayer: 'parent' | 'child';
    userInput: string;
    board: Square[];
    playerSymbol: 'cross' | 'circle' | null;
    childSymbol: 'cross' | 'circle' | null;
    gameComplete: boolean;
  }) => void;
  onTrackBehavior: (behavior: UserBehavior) => void;
}

interface Games3Props extends BaseActivityProps {
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
  onTrackBehavior: (behavior: UserBehavior) => void;
}

interface Games4Props extends BaseActivityProps {
  savedAnswers?: {
    answers: Record<number, ListAnswers>;
    gameComplete: boolean;
    currentList?: number;
    messages?: Record<string, string>;
  };
  onSaveAnswers: (answers: {
    answers: Record<number, ListAnswers>;
    gameComplete: boolean;
  }) => void;
  onTrackBehavior: (behavior: UserBehavior) => void;
}

interface Games5Props extends BaseActivityProps {
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

// Add this interface after other interfaces
interface UserBehavior {
  timestamp: string;
  location: string;
  behavior: string;
  input: string;
  result: string;
}

// Type definitions for components
type StandardComponent = React.FC<StandardActivityProps>;
type Games1Component = React.FC<Games1Props>;
type Games2Component = React.FC<Games2Props>;
type Games3Component = React.FC<Games3Props>;
type Games4Component = React.FC<Games4Props>;
type Games5Component = React.FC<Games5Props>;

// Update component arrays with proper typing
const formalComponents: StandardComponent[] = [Formal1, Formal2, Formal3, Formal4, Formal5];
const wordComponents: StandardComponent[] = [Word1, Word2, Word3, Word4, Word5];
const gameComponents = [
  Games1 as Games1Component,
  Games2 as Games2Component,
  Games3 as Games3Component,
  Games4 as Games4Component,
  Games5 as Games5Component
];

const client = generateClient<Schema>();
Amplify.configure(outputs);

// Add new interface for queue items
interface QueueItem {
  type: 'behavior' | 'answer' | 'game-complete';  // Add all possible types
  data: UserBehavior | {
    answers: string[];
    activityType: string;
    setIndex: number;
  } | {
    location: string;
    timestamp: string;
    behavior: string;
    input: string;
    result: string;
  };
}

export default function BlueActivities() {
  const router = useRouter();
  const [userID, setUserID] = useState("");
  const [order, setOrder] = useState("11111"); // default order

  useEffect(() => {
    const magicCode = localStorage.getItem("magicCode");
    if (magicCode) {
      if (magicCode.startsWith("blue")) {
        // Extract order from green code
        const blueOrder = magicCode.slice(4);
        setOrder(blueOrder);
      } 
    }
  }, []);

  useEffect(() => {
    const storedUserID = localStorage.getItem("userID");
    if (storedUserID) {
      setUserID(storedUserID);
    }
  }, []);

  const [currentSet, setCurrentSet] = useState(0);

  // States for saving answers
  const [wordAnswers, setWordAnswers] = useState<Record<number, string[]>>({});
  const [wordCorrect, setWordCorrect] = useState<Record<number, (boolean | null)[]>>({});
  const [formalAnswers, setFormalAnswers] = useState<Record<number, string[]>>({});
  const [formalCorrect, setFormalCorrect] = useState<Record<number, (boolean | null)[]>>({});
  const [gameAnswers, setGameAnswers] = useState<any[]>(Array(5).fill(null));

  // Add this state with your other states
  const [userBehaviors, setUserBehaviors] = useState<UserBehavior[]>([]);

  // Add these states at the top of the component
  const [dataQueue, setDataQueue] = useState<QueueItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  

  // Add this state near your other state declarations
  const [completedQuestions, setCompletedQuestions] = useState<boolean[]>(Array(5).fill(false));

  // Convert order string into activity sequence
  const activitySequence = order.split("").map((num) => {
    switch (num) {
      case "1":
        return "formal";
      case "2":
        return "word";
      case "3":
        return "game";
      default:
        return "formal";
    }
  });

  const logBehavior = async (location: string, behavior: string, input: string, result: string) => {
    try {
      await client.models.Storage.create({
        userId: userID,
        location: location,
        behavior: behavior as any,
        input: input,
        result: result,
        timestamp: new Date().toISOString(),
      });
      console.log("Logged behavior successfully");
    } catch (error) {
      console.error("Error logging behavior:", error);
    }
  };

  // Add useEffect to load saved answers from localStorage
  useEffect(() => {
    const loadSavedAnswers = () => {
      const savedWordAnswers = localStorage.getItem('blueWordAnswers');
      const savedWordCorrect = localStorage.getItem('blueWordCorrect');
      const savedFormalAnswers = localStorage.getItem('blueFormalAnswers');
      const savedFormalCorrect = localStorage.getItem('blueFormalCorrect');
      const savedGameAnswers = localStorage.getItem('blueGameAnswers');
      const savedCompletedQuestions = localStorage.getItem('blueCompletedQuestions');

      if (savedWordAnswers) setWordAnswers(JSON.parse(savedWordAnswers));
      if (savedWordCorrect) setWordCorrect(JSON.parse(savedWordCorrect));
      if (savedFormalAnswers) setFormalAnswers(JSON.parse(savedFormalAnswers));
      if (savedFormalCorrect) setFormalCorrect(JSON.parse(savedFormalCorrect));
      if (savedGameAnswers) setGameAnswers(JSON.parse(savedGameAnswers));
      if (savedCompletedQuestions) setCompletedQuestions(JSON.parse(savedCompletedQuestions));
    };

    loadSavedAnswers();
  }, []);

  const handleActivityComplete = async () => {
    try {
      const activityType = activitySequence[currentSet];
      await logBehavior(
        `${activityType}-${currentSet + 1}-complete`,
        "click",
        "NA",
        currentSet < 4 ? `from-${activityType}-${currentSet + 1}-to-next-activity` : "redirect-to-final"
      );
      
      // Update completed questions
      setCompletedQuestions(prev => {
        const newCompleted = [...prev];
        newCompleted[currentSet] = true;
        localStorage.setItem('blueCompletedQuestions', JSON.stringify(newCompleted));
        return newCompleted;
      });
      
      if (currentSet < 4) {
        setCurrentSet(currentSet + 1);
      } else {
        router.push("/final");
      }
    } catch (error) {
      console.error("Error during activity completion:", error);
    }
  };

  // Only allow visiting completed sets or the current set
  const handleRevisit = async (index: number) => {
    try {
      const activityType = activitySequence[index];
      await logBehavior(
        "progress-bar",
        "click",
        `visit-${activityType}-${index + 1}`,
        `moved-to-${activityType}-${index + 1}`
      );
      setCurrentSet(index);
    } catch (error) {
      console.error("Error during revisit:", error);
    }
  };

  // Process queue whenever a new item is added
  useEffect(() => {
    const processQueueItem = async () => {
      if (dataQueue.length > 0 && !isProcessing) {
        setIsProcessing(true);
        const item = dataQueue[0];
        let response = null;

        try {
          if (item.type === 'behavior') {
            const behavior = item.data as UserBehavior;
            response = await client.models.Storage.create({
              userId: userID,
              location: behavior.location,
              behavior: behavior.behavior as any,
              input: behavior.input,
              result: behavior.result,
              timestamp: behavior.timestamp,
            });
          } else {
            const answerData = item.data as { answers: string[], activityType: string, setIndex: number, location: string };
            response = await client.models.Storage.create({
              userId: userID,
              location: answerData.location,
              behavior: 'input' as any,
              input: JSON.stringify(answerData.answers),
              result: answerData.activityType,
              timestamp: new Date().toISOString(),
            });
          }

          // Only remove from queue if we got a response from DynamoDB
          if (response) {
            console.log("Successfully saved to DynamoDB:", response);
            setDataQueue(prev => prev.slice(1));
          } else {
            throw new Error("No response from DynamoDB");
          }

        } catch (error) {
          console.error("Error saving to DynamoDB:", error);
          // Store failed item in localStorage
          const failedItems = JSON.parse(localStorage.getItem('failedQueueItems') || '[]');
          failedItems.push(item);
          localStorage.setItem('failedQueueItems', JSON.stringify(failedItems));
        } finally {
          setIsProcessing(false);
        }
      }
    };

    processQueueItem();
  }, [dataQueue, isProcessing, userID]);

  // Modified handleBehaviorTracking to wait for queue update
  const handleBehaviorTracking = async (behavior: UserBehavior, setIndex: number) => {
    const activityType = activitySequence[setIndex];
    const location = `${activityType}-${setIndex + 1}`;
    const modifiedBehavior = {
      ...behavior,
      location
    };
    
    await new Promise<void>(resolve => {
      setDataQueue(prev => {
        const newItem: QueueItem = {
          type: 'behavior',
          data: modifiedBehavior
        };
        return [...prev, newItem];
      });
      resolve();
    });
  };

  // Modify handleAnswerChange to save to localStorage
  const handleAnswerChange = async (newAnswers: string[], activityType: string, setIndex: number) => {
    await new Promise<void>(resolve => {
      setDataQueue(prev => {
        const newItem: QueueItem = {
          type: 'answer',
          data: { 
            answers: newAnswers, 
            activityType, 
            setIndex,
            location: `${activityType}-${setIndex + 1}`
          }
        };
        return [...prev, newItem];
      });
      resolve();
    });

    if (activityType === "word") {
      const newWordAnswers = { ...wordAnswers };
      newWordAnswers[setIndex] = newAnswers;
      setWordAnswers(newWordAnswers);
      localStorage.setItem('blueWordAnswers', JSON.stringify(newWordAnswers));
    } else {
      const newFormalAnswers = { ...formalAnswers };
      newFormalAnswers[setIndex] = newAnswers;
      setFormalAnswers(newFormalAnswers);
      localStorage.setItem('blueFormalAnswers', JSON.stringify(newFormalAnswers));
    }
  };

  // Modify the part where correctness is updated
  const handleCorrectChange = (newCorrect: (boolean | null)[], activityType: string, setIndex: number) => {
    if (activityType === "word") {
      const newWordCorrect = { ...wordCorrect };
      newWordCorrect[setIndex] = newCorrect;
      setWordCorrect(newWordCorrect);
      localStorage.setItem('blueWordCorrect', JSON.stringify(newWordCorrect));
    } else {
      const newFormalCorrect = { ...formalCorrect };
      newFormalCorrect[setIndex] = newCorrect;
      setFormalCorrect(newFormalCorrect);
      localStorage.setItem('blueFormalCorrect', JSON.stringify(newFormalCorrect));
    }
  };

  // Modify handleGameAnswerSave to save to localStorage
  const handleGameAnswerSave = async (answers: any, setIndex: number) => {
    try {
      const activityType = activitySequence[setIndex];
      await logBehavior(
        `${activityType}-${setIndex + 1}`,
        "input",
        JSON.stringify(answers),
        "game"
      );
      const newGameAnswers = [...gameAnswers];
      newGameAnswers[setIndex] = answers;
      setGameAnswers(newGameAnswers);
      localStorage.setItem('blueGameAnswers', JSON.stringify(newGameAnswers));
    } catch (error) {
      console.error("Error logging game answer:", error);
    }
  };

  const renderActivity = (setIndex: number) => {
    const activityType = activitySequence[setIndex];

    if (activityType === "game") {
      const GameComponent = gameComponents[setIndex];
      return <GameComponent
        onBack={() => handleRevisit(Math.max(0, setIndex - 1))}
        onComplete={handleActivityComplete}
        savedAnswers={gameAnswers[setIndex] || []}
        onSaveAnswers={(answers: any) => handleGameAnswerSave(answers, setIndex)}
        onTrackBehavior={(behavior: UserBehavior) => handleBehaviorTracking(behavior, setIndex)}
      />;
    }

    const Component = activityType === "word" ? wordComponents[setIndex] : formalComponents[setIndex];
    return <Component
      onBack={() => handleRevisit(Math.max(0, setIndex - 1))}
      onComplete={handleActivityComplete}
      answers={activityType === "word" 
        ? (wordAnswers[setIndex] || [])
        : (formalAnswers[setIndex] || [])}
      isCorrect={activityType === "word"
        ? (wordCorrect[setIndex] || [])
        : (formalCorrect[setIndex] || [])}
      onAnswersChange={(newAnswers) => handleAnswerChange(newAnswers, activityType, setIndex)}
      onCorrectChange={(newCorrect) => handleCorrectChange(newCorrect, activityType, setIndex)}
      onLogBehavior={logBehavior}
    />;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 mt-4">
      <ProgressBar
        totalSteps={5}
        currentStep={currentSet + 1}
        completedSteps={currentSet}
        onStepClick={handleRevisit}
        selections={activitySequence}
        disabledSteps={Array(5).fill(false)}
        completedQuestions={completedQuestions}
      />
      {renderActivity(currentSet)}
    </div>
  );
}
