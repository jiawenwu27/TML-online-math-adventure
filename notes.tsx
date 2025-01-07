"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";
import HoverBoxSelectable from "@/components/HoverBoxSelectable";
import Formal1 from "@/components/mathactivities/formal/Formal2";
import Word1 from "@/components/mathactivities/word/Word1";
import Games1 from "@/components/mathactivities/games/Games1";
import { 
  ActivityComponentProps, 
  StandardActivityProps, 
  GameActivityProps 
} from "@/app/intro/blue/activities/page";

export default function Notes({ onBack }: Partial<ActivityComponentProps>) {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const router = useRouter();

  const handleActivitySelect = (activityType: string) => {
    setSelectedActivity(activityType);
  };

  const handleNext = () => {
    if (!selectedActivity) {
      alert("Please choose one activity to continue!");
      return;
    }
    setShowQuestion(true);
  };

  // Separate props for different component types
  const standardProps: StandardActivityProps = {
    onBack: () => {},
    onComplete: () => {},
    answers: [],
    isCorrect: [],
    onAnswersChange: () => {},
    onCorrectChange: () => {},
  };

  const gameProps: GameActivityProps = {
    onBack: () => {},
    onComplete: () => {},
    savedAnswers: [],
    onSaveAnswers: () => {},
  };

  if (showQuestion) {
    switch (selectedActivity) {
      case 'formal':
        return <Formal1 {...standardProps} />;
      case 'word':
        return <Word1 {...standardProps} />;
      case 'game':
        return <Games1 {...gameProps} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl text-center mb-8">
        <h2 className="text-2xl text-[#13294B] mb-6">
          Choose the math activity you want to work on by clicking that box and click <span className="font-bold text-[#FF5F05]">NEXT</span>
        </h2>

        {/* Activity Boxes Section */}
        <div className="flex flex-wrap gap-8 justify-center mb-8 w-full">
          <HoverBoxSelectable
            title="Formal Math Questions"
            backgroundColor="#8CC63E"
            content={<span>29 + 36 =</span>}
            contentFontSize="1.5rem"
            isSelected={selectedActivity === 'formal'}
            onSelect={() => handleActivitySelect('formal')}
          />

          <HoverBoxSelectable
            title="Math Word Problems"
            backgroundColor="#FFCC00"
            image="/img/word1-cookies.png"
            content={
              <span>
                Sally baked 24 cookies for the party tonight. Katy brought 27
                cookies. How many cookies do they have altogether for the party?
              </span>
            }
            contentFontSize="1.2rem"
            contentAlign="left"
            isSelected={selectedActivity === 'word'}
            onSelect={() => handleActivitySelect('word')}
          />

          <HoverBoxSelectable
            title="Interactive Math Game"
            backgroundColor="#CC0001"
            image="/img/box-tictactoe.png"
            isWide={true}
            isSelected={selectedActivity === 'game'}
            onSelect={() => handleActivitySelect('game')}
          />
        </div>

        {/* Next Button */}
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
