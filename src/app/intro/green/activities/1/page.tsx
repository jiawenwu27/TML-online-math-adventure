"use client";

import { useState } from "react";
import HoverBoxSelectable from "@/components/HoverBoxSelectable";
import { activitySets } from "@/app/data/activitySets";
import ProgressBar from "@/components/ProgressBar";
import { useRouter } from "next/navigation";

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

interface GameState {
  board: Square[];
  playerSymbol: "cross" | "circle" | null;
  childSymbol: "cross" | "circle" | null;
  gameComplete: boolean;
  message: string;
}

interface BaseGameProps {
  onBack: () => void;
  onComplete?: () => void;
  savedAnswers?: any; // Allow flexibility for different saved states
  onSaveAnswers?: (answers: any) => void;
}

export default function ActivitySelection() {
  const [currentSet, setCurrentSet] = useState(0);
  const [selections, setSelections] = useState<Array<string | null>>(Array(5).fill(null));
  const [showQuestion, setShowQuestion] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const router = useRouter();

  // States for formal, word, and game activities
  const [formalAnswers, setFormalAnswers] = useState<string[][]>(Array(5).fill([]).map(() => Array(3).fill("")));
  const [formalCorrect, setFormalCorrect] = useState<(boolean | null)[][]>(Array(5).fill([]).map(() => Array(3).fill(null)));
  const [wordAnswers, setWordAnswers] = useState<string[][]>(Array(5).fill([]).map(() => Array(3).fill("")));
  const [wordCorrect, setWordCorrect] = useState<(boolean | null)[][]>(Array(5).fill([]).map(() => Array(3).fill(null)));
  const [gameAnswers, setGameAnswers] = useState<any[]>(Array(5).fill([]));

  const handleActivitySelect = (activityType: string) => {
    const newSelections = [...selections];
    newSelections[currentSet] = activityType;
    setSelections(newSelections);
  };

  const handleNext = () => {
    if (!selections[currentSet]) {
      alert("Please choose one activity to continue!");
      return;
    }
    setShowQuestion(true);
    setActiveQuestion(currentSet);
  };

  const handleActivityComplete = () => {
    if (activeQuestion !== null && activeQuestion < 4) {
      setCurrentSet(activeQuestion + 1);
      setShowQuestion(false);
      setActiveQuestion(null);
    } else {
      router.push("/final");
    }
  };

  const handleRevisit = (index: number) => {
    if (selections[index] !== null) {
      setCurrentSet(index);
      setActiveQuestion(index);
      setShowQuestion(true);
    }
  };

  const renderActivity = (setIndex: number) => {
    const activityType = selections[setIndex];
    if (!activityType) return null;

    const components = {
      formal: [Formal1, Formal2, Formal3, Formal4, Formal5],
      word: [Word1, Word2, Word3, Word4, Word5],
    };

    if (activityType === "game") {
      if (setIndex === 2) {
        return (
          <Games3
            onBack={() => {
              setShowQuestion(false);
              setActiveQuestion(null);
            }}
            onComplete={handleActivityComplete}
            savedAnswers={gameAnswers[setIndex]}
            onSaveAnswers={(answers) => {
              const newGameAnswers = [...gameAnswers];
              newGameAnswers[setIndex] = answers;
              setGameAnswers(newGameAnswers);
            }}
          />
        );
      }

      const OtherGameComponent = [Games1, Games2, Games3, Games4, Games5][setIndex] as React.ComponentType<BaseGameProps>;
      return (
        <OtherGameComponent
          onBack={() => {
            setShowQuestion(false);
            setActiveQuestion(null);
          }}
          onComplete={handleActivityComplete}
          savedAnswers={gameAnswers[setIndex]}
          onSaveAnswers={(answers) => {
            const newGameAnswers = [...gameAnswers];
            newGameAnswers[setIndex] = answers;
            setGameAnswers(newGameAnswers);
          }}
        />
      );
    }

    const Component = components[activityType as keyof typeof components][setIndex];
    return (
      <Component
        onBack={() => {
          setShowQuestion(false);
          setActiveQuestion(null);
        }}
        onComplete={handleActivityComplete}
        answers={activityType === "formal" ? formalAnswers[setIndex] : wordAnswers[setIndex]}
        isCorrect={activityType === "formal" ? formalCorrect[setIndex] : wordCorrect[setIndex]}
        onAnswersChange={(newAnswers: string[]) => {
          if (activityType === "formal") {
            const newFormalAnswers = [...formalAnswers];
            newFormalAnswers[setIndex] = newAnswers;
            setFormalAnswers(newFormalAnswers);
          } else {
            const newWordAnswers = [...wordAnswers];
            newWordAnswers[setIndex] = newAnswers;
            setWordAnswers(newWordAnswers);
          }
        }}
        onCorrectChange={(newCorrect: (boolean | null)[]) => {
          if (activityType === "formal") {
            const newFormalCorrect = [...formalCorrect];
            newFormalCorrect[setIndex] = newCorrect;
            setFormalCorrect(newFormalCorrect);
          } else {
            const newWordCorrect = [...wordCorrect];
            newWordCorrect[setIndex] = newCorrect;
            setWordCorrect(newWordCorrect);
          }
        }}
      />
    );
  };

  if (showQuestion && activeQuestion !== null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 mt-4">
        <ProgressBar
          totalSteps={5}
          currentStep={currentSet + 1}
          completedSteps={selections.filter(Boolean).length}
          onStepClick={handleRevisit}
          selections={selections}
        />
        {renderActivity(activeQuestion)}
      </div>
    );
  }

  const currentActivitySet = activitySets[currentSet];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 mt-4">
      <ProgressBar
        totalSteps={5}
        currentStep={currentSet + 1}
        completedSteps={selections.filter(Boolean).length}
        onStepClick={handleRevisit}
        selections={selections}
      />

      <div className="w-full max-w-3xl text-center mb-8">
        <h2 className="text-2xl text-[#13294B] mb-6">
          Choose the math activity you want to work on by clicking that box and click <span className="font-bold text-[#FF5F05]">NEXT</span>
        </h2>

        <div className="flex flex-wrap gap-8 justify-center mb-8 w-full">
          <HoverBoxSelectable
            title="Formal Math Questions"
            backgroundColor="#8CC63E"
            content={currentActivitySet.formal.content}
            contentFontSize="1.5rem"
            isSelected={selections[currentSet] === "formal"}
            onSelect={() => handleActivitySelect("formal")}
            disabled={false}
          />

          <HoverBoxSelectable
            title="Math Word Problems"
            backgroundColor="#FFCC00"
            image={currentActivitySet.word.image}
            content={currentActivitySet.word.content}
            contentFontSize="1.2rem"
            contentAlign="left"
            isSelected={selections[currentSet] === "word"}
            onSelect={() => handleActivitySelect("word")}
            disabled={false}
          />

          <HoverBoxSelectable
            title="Interactive Math Game"
            backgroundColor="#CC0001"
            image={currentActivitySet.game.image}
            isWide={true}
            isSelected={selections[currentSet] === "game"}
            onSelect={() => handleActivitySelect("game")}
            disabled={false}
          />
        </div>

        <button
          onClick={handleNext}
          className="bg-[#FF5F05] text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-[#F07249] text-2xl"
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
