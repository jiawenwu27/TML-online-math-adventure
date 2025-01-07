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
  onComplete: () => void;
}

interface StandardActivityProps extends BaseActivityProps {
  answers: string[];
  isCorrect: (boolean | null)[];
  onAnswersChange: (newAnswers: string[]) => void;
  onCorrectChange: (newCorrect: (boolean | null)[]) => void;
  savedAnswers?: number[];
  onSaveAnswers?: (answers: number[]) => void;
}

// Use StandardActivityProps as the unified type
type ActivityComponentProps = StandardActivityProps;

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
  const [gameAnswers, setGameAnswers] = useState<number[][]>(Array(5).fill([]));

  // Define activity components
  const formalComponents = [Formal1, Formal2, Formal3, Formal4, Formal5];
  const wordComponents = [Word1, Word2, Word3, Word4, Word5];
  const gameComponents = [Games1, Games2, Games3, Games4, Games5];

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
    let Component;

    // Determine the appropriate component
    switch (activityType) {
      case "formal":
        Component = formalComponents[setIndex];
        break;
      case "word":
        Component = wordComponents[setIndex];
        break;
      case "game":
        Component = gameComponents[setIndex];
        break;
      default:
        Component = formalComponents[setIndex];
    }

    const commonProps: ActivityComponentProps = {
      onBack: () => handleRevisit(Math.max(0, setIndex - 1)),
      onComplete: handleActivityComplete,
      answers: activityType === "formal" ? formalAnswers[setIndex] : activityType === "word" ? wordAnswers[setIndex] : [],
      isCorrect: activityType === "formal" ? formalCorrect[setIndex] : activityType === "word" ? wordCorrect[setIndex] : [],
      onAnswersChange: (newAnswers: string[]) => {
        if (activityType === "formal") {
          const newFormalAnswers = [...formalAnswers];
          newFormalAnswers[setIndex] = newAnswers;
          setFormalAnswers(newFormalAnswers);
        } else if (activityType === "word") {
          const newWordAnswers = [...wordAnswers];
          newWordAnswers[setIndex] = newAnswers;
          setWordAnswers(newWordAnswers);
        }
      },
      onCorrectChange: (newCorrect: (boolean | null)[]) => {
        if (activityType === "formal") {
          const newFormalCorrect = [...formalCorrect];
          newFormalCorrect[setIndex] = newCorrect;
          setFormalCorrect(newFormalCorrect);
        } else if (activityType === "word") {
          const newWordCorrect = [...wordCorrect];
          newWordCorrect[setIndex] = newCorrect;
          setWordCorrect(newWordCorrect);
        }
      },
      savedAnswers: activityType === "game" ? gameAnswers[setIndex] : undefined,
      onSaveAnswers: activityType === "game"
        ? (answers: number[]) => {
            const newGameAnswers = [...gameAnswers];
            newGameAnswers[setIndex] = answers;
            setGameAnswers(newGameAnswers);
          }
        : undefined,
    };

    return <Component {...commonProps} />;
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
