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

// Base props shared by all activities
interface BaseActivityProps {
  onBack: () => void;
  onComplete?: () => void;
  onLogBehavior: (location: string, behavior: string, input: string, result: string) => void;
}

// Props for standard activities (Formal and Word)
interface StandardActivityProps extends BaseActivityProps {
  answers: string[];
  isCorrect: (boolean | null)[];
  onAnswersChange: (answers: string[]) => void;
  onCorrectChange: (isCorrect: (boolean | null)[]) => void;
}

// Specific Game Activity Props
interface Games1Props extends BaseActivityProps {
  savedAnswers: number[];
  onSaveAnswers: (answers: number[]) => void;
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
}

interface Games4Props extends BaseActivityProps {
  savedAnswers?: {
    answers: Record<number, ListAnswers>;
    messages: Record<string, string>;
    currentList: number;
    gameComplete: boolean;
  };
  onSaveAnswers: (answers: {
    answers: Record<number, ListAnswers>;
    messages: Record<string, string>;
    currentList: number;
    gameComplete: boolean;
  }) => void;
}

interface Games5Props extends BaseActivityProps {
  savedAnswers: number[];
  onSaveAnswers: (answers: number[]) => void;
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

  const handleActivityComplete = async () => {
    try {
      await logBehavior(
        `activity-${currentSet+1}-complete`,
        "click",
        "NA",
        currentSet < 4 ? `from-${currentSet+1}-to-next-activity` : "redirect-to-final"
      );
      
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
    if (index <= currentSet) {
      try {
        await logBehavior(
          "progress-bar",
          "click",
          `revisit-${index+1}`,
          `moved-to-activity-${index+1}`
        );
        setCurrentSet(index);
      } catch (error) {
        console.error("Error during revisit:", error);
      }
    }
  };

  const handleAnswerChange = async (newAnswers: string[], activityType: string, setIndex: number) => {
    try {
      await logBehavior(
        `activity-${setIndex+1}`,
        "input",
        JSON.stringify(newAnswers),
        activityType
      );

      if (activityType === "word") {
        const newWordAnswers = { ...wordAnswers };
        newWordAnswers[setIndex] = newAnswers;
        setWordAnswers(newWordAnswers);
      } else {
        const newFormalAnswers = { ...formalAnswers };
        newFormalAnswers[setIndex] = newAnswers;
        setFormalAnswers(newFormalAnswers);
      }
    } catch (error) {
      console.error("Error logging answer change:", error);
    }
  };

  const handleGameAnswerSave = async (answers: any, setIndex: number) => {
    try {
      await logBehavior(
        `activity-${setIndex+1}`,
        "input",
        JSON.stringify(answers),
        "game"
      );

      const newGameAnswers = [...gameAnswers];
      newGameAnswers[setIndex] = answers;
      setGameAnswers(newGameAnswers);
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
        onLogBehavior={logBehavior}
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
      onCorrectChange={(newCorrect) => {
        if (activityType === "word") {
          const newWordCorrect = { ...wordCorrect };
          newWordCorrect[setIndex] = newCorrect;
          setWordCorrect(newWordCorrect);
        } else {
          const newFormalCorrect = { ...formalCorrect };
          newFormalCorrect[setIndex] = newCorrect;
          setFormalCorrect(newFormalCorrect);
        }
      }}
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
        disabledSteps={Array(5).fill(false).map((_, index) => index > currentSet)}
      />
      {renderActivity(currentSet)}
    </div>
  );
}
