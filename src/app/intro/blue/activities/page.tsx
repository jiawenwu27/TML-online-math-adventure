"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";

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

// Define interfaces for different activity types
interface BaseActivityProps {
  onBack: () => void;
  onComplete?: () => void;
}

export interface StandardActivityProps extends BaseActivityProps {
  answers: string[];
  isCorrect: (boolean | null)[];
  onAnswersChange: (newAnswers: string[]) => void;
  onCorrectChange: (newCorrect: (boolean | null)[]) => void;
}

export interface GameActivityProps extends BaseActivityProps {
  savedAnswers: any;
  onSaveAnswers: (answers: any) => void;
}

// Remove the union type
export type ActivityComponentProps = StandardActivityProps;

// Update component types
type StandardComponent = React.ComponentType<StandardActivityProps>;
type GameComponent = React.ComponentType<GameActivityProps>;

const formalComponents: StandardComponent[] = [Formal1, Formal2, Formal3, Formal4, Formal5];
const wordComponents: StandardComponent[] = [Word1, Word2, Word3, Word4, Word5];
const gameComponents: GameComponent[] = [Games1, Games2, Games3, Games4, Games5];

export default function BlueActivities() {
  const router = useRouter();
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

  const [currentSet, setCurrentSet] = useState(0);

  // States for saving answers
  const [formalAnswers, setFormalAnswers] = useState<string[][]>(Array(5).fill([]).map(() => Array(3).fill("")));
  const [formalCorrect, setFormalCorrect] = useState<(boolean | null)[][]>(Array(5).fill([]).map(() => Array(3).fill(null)));
  const [wordAnswers, setWordAnswers] = useState<string[][]>(Array(5).fill([]).map(() => Array(3).fill("")));
  const [wordCorrect, setWordCorrect] = useState<(boolean | null)[][]>(Array(5).fill([]).map(() => Array(3).fill(null)));
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

  const handleActivityComplete = () => {
    if (currentSet < 4) {
      setCurrentSet(currentSet + 1);
    } else {
      router.push("/final");
    }
  };

  const handleRevisit = (index: number) => {
    setCurrentSet(index);
  };

  const renderActivity = (setIndex: number) => {
    const activityType = activitySequence[setIndex];

    if (activityType === "game") {
      const GameComponent = gameComponents[setIndex];
      return <GameComponent
        onBack={() => handleRevisit(Math.max(0, setIndex - 1))}
        onComplete={handleActivityComplete || (() => {})}
        savedAnswers={gameAnswers[setIndex] || []}
        onSaveAnswers={(answers: any) => {
          const newGameAnswers = [...gameAnswers];
          newGameAnswers[setIndex] = answers;
          setGameAnswers(newGameAnswers);
        }}
      />;
    }

    const Component = activityType === "word" ? wordComponents[setIndex] : formalComponents[setIndex];
    return <Component
      onBack={() => handleRevisit(Math.max(0, setIndex - 1))}
      onComplete={handleActivityComplete}
      answers={activityType === "word" ? wordAnswers[setIndex] : formalAnswers[setIndex]}
      isCorrect={activityType === "word" ? wordCorrect[setIndex] : formalCorrect[setIndex]}
      onAnswersChange={(newAnswers) => {
        if (activityType === "word") {
          const newWordAnswers = [...wordAnswers];
          newWordAnswers[setIndex] = newAnswers;
          setWordAnswers(newWordAnswers);
        } else {
          const newFormalAnswers = [...formalAnswers];
          newFormalAnswers[setIndex] = newAnswers;
          setFormalAnswers(newFormalAnswers);
        }
      }}
      onCorrectChange={(newCorrect) => {
        if (activityType === "word") {
          const newWordCorrect = [...wordCorrect];
          newWordCorrect[setIndex] = newCorrect;
          setWordCorrect(newWordCorrect);
        } else {
          const newFormalCorrect = [...formalCorrect];
          newFormalCorrect[setIndex] = newCorrect;
          setFormalCorrect(newFormalCorrect);
        }
      }}
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
      />
      {renderActivity(currentSet)}
    </div>
  );
}
