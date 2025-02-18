"use client";

import { useState,useEffect } from "react";
import HoverBoxSelectable from "@/components/HoverBoxSelectable";
import { activitySets } from "@/app/data/activitySets";
import ProgressBar from "@/components/ProgressBar";
import { useRouter } from "next/navigation";
import { Amplify } from 'aws-amplify';
import outputs from '../../../../../../amplify_outputs.json';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../../../../amplify/data/resource';

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

interface UserBehavior {
  timestamp: string;
  location: string;
  behavior: string;
  input: string;
  result: string;
}

interface ActivityComponentProps {
  onBack: () => void;
  onComplete?: () => void;
  answers: string[];
  isCorrect: (boolean | null)[];
  onAnswersChange: (newAnswers: string[]) => void;
  onCorrectChange: (newCorrect: (boolean | null)[]) => void;
  onLogBehavior: (location: string, behavior: string, input: string, result: string) => void;
}

interface Games1Props {
  onBack: () => void;
  onComplete?: () => void;
  savedAnswers?: any;
  onSaveAnswers: (answers: any) => void;
  onTrackBehavior: (behavior: UserBehavior) => void;
}

interface Games2Props {
  onBack: () => void;
  onComplete?: () => void;
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
  onSaveAnswers: (answers: any) => void;
  onTrackBehavior: (behavior: UserBehavior) => void;
}

interface Games3Props {
  onBack: () => void;
  onComplete?: () => void;
  savedAnswers?: {
    solvedPaths: number[];
    wrongCells: number[];
    currentCell: number;
    isComplete: boolean;
  };
  onSaveAnswers: (answers: any) => void;
  onTrackBehavior: (behavior: UserBehavior) => void;
}

interface Games4Props {
  onBack: () => void;
  onComplete?: () => void;
  savedAnswers?: any;
  onSaveAnswers: (answers: any) => void;
  onTrackBehavior: (behavior: UserBehavior) => void;
}

interface Games5Props {
  onBack: () => void;
  onComplete?: () => void;
  savedAnswers?: any;
  onSaveAnswers: (answers: any) => void;
  onTrackBehavior: (behavior: UserBehavior) => void;
}

interface BaseGameProps {
  onBack: () => void;
  onComplete?: () => void;
  savedAnswers?: any; // Allow flexibility for different saved states
  onSaveAnswers?: (answers: any) => void;
  onTrackBehavior: (behavior: UserBehavior) => void;
}

const client = generateClient<Schema>();
Amplify.configure(outputs);

// Add queue item interface
interface QueueItem {
  type: 'behavior' | 'answer' | 'game-complete';
  data: UserBehavior | {
    answers: string[];
    activityType: string;
    setIndex: number;
    location: string;
  } | {
    location: string;
    timestamp: string;
    behavior: string;
    input: string;
    result: string;
  };
}

export default function ActivitySelection() {
  const [currentSet, setCurrentSet] = useState(0);
  const [selections, setSelections] = useState<Array<string | null>>(Array(5).fill(null));
  const [showQuestion, setShowQuestion] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const router = useRouter();
  const [userID, setUserID] = useState("");

  // Add queue states
  const [dataQueue, setDataQueue] = useState<QueueItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Add new state for completed questions
  const [completedQuestions, setCompletedQuestions] = useState<boolean[]>(Array(5).fill(false));

  // Add state to track locked selections
  const [lockedSelections, setLockedSelections] = useState<boolean[]>(Array(5).fill(false));

  // Load userID
  useEffect(() => {
    const storedUserID = localStorage.getItem("userID");
    if (storedUserID) {
      setUserID(storedUserID);
    }
  }, []);

  // Process queue
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

          if (response) {
            setDataQueue(prev => prev.slice(1));
          } else {
            throw new Error("No response from DynamoDB");
          }
        } catch (error) {
          console.error("Error saving to DynamoDB:", error);
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

  // Add useEffect to load saved answers from localStorage
  useEffect(() => {
    const loadSavedAnswers = () => {
      const savedFormalAnswers = localStorage.getItem('greenFormalAnswers');
      const savedFormalCorrect = localStorage.getItem('greenFormalCorrect');
      const savedWordAnswers = localStorage.getItem('greenWordAnswers');
      const savedWordCorrect = localStorage.getItem('greenWordCorrect');
      const savedGameAnswers = localStorage.getItem('greenGameAnswers');
      const savedCompletedQuestions = localStorage.getItem('greenCompletedQuestions');
      const savedSelections = localStorage.getItem('greenSelections');

      if (savedFormalAnswers) setFormalAnswers(JSON.parse(savedFormalAnswers));
      if (savedFormalCorrect) setFormalCorrect(JSON.parse(savedFormalCorrect));
      if (savedWordAnswers) setWordAnswers(JSON.parse(savedWordAnswers));
      if (savedWordCorrect) setWordCorrect(JSON.parse(savedWordCorrect));
      if (savedGameAnswers) setGameAnswers(JSON.parse(savedGameAnswers));
      if (savedCompletedQuestions) setCompletedQuestions(JSON.parse(savedCompletedQuestions));
      if (savedSelections) setSelections(JSON.parse(savedSelections));
    };

    loadSavedAnswers();
  }, []);

  // Add useEffect to load locked selections from localStorage
  useEffect(() => {
    const loadSavedSelections = () => {
      const savedLockedSelections = localStorage.getItem('greenLockedSelections');
      if (savedLockedSelections) {
        setLockedSelections(JSON.parse(savedLockedSelections));
      }
    };

    loadSavedSelections();
  }, []);

  // Modified handleBehaviorTracking
  const handleBehaviorTracking = async (behavior: UserBehavior, setIndex: number) => {
    const activityType = selections[setIndex];
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

    if (activityType === "formal") {
      const newFormalAnswers = [...formalAnswers];
      newFormalAnswers[setIndex] = newAnswers;
      setFormalAnswers(newFormalAnswers);
      localStorage.setItem('greenFormalAnswers', JSON.stringify(newFormalAnswers));
    } else if (activityType === "word") {
      const newWordAnswers = [...wordAnswers];
      newWordAnswers[setIndex] = newAnswers;
      setWordAnswers(newWordAnswers);
      localStorage.setItem('greenWordAnswers', JSON.stringify(newWordAnswers));
    }
  };

  // Modify handleCorrectChange to save to localStorage
  const handleCorrectChange = (newCorrect: (boolean | null)[], activityType: string, setIndex: number) => {
    if (activityType === "formal") {
      const newFormalCorrect = [...formalCorrect];
      newFormalCorrect[setIndex] = newCorrect;
      setFormalCorrect(newFormalCorrect);
      localStorage.setItem('greenFormalCorrect', JSON.stringify(newFormalCorrect));
    } else if (activityType === "word") {
      const newWordCorrect = [...wordCorrect];
      newWordCorrect[setIndex] = newCorrect;
      setWordCorrect(newWordCorrect);
      localStorage.setItem('greenWordCorrect', JSON.stringify(newWordCorrect));
    }
  };

  // States for formal, word, and game activities
  const [formalAnswers, setFormalAnswers] = useState<string[][]>(Array(5).fill([]).map(() => Array(3).fill("")));
  const [formalCorrect, setFormalCorrect] = useState<(boolean | null)[][]>(Array(5).fill([]).map(() => Array(3).fill(null)));
  const [wordAnswers, setWordAnswers] = useState<string[][]>(Array(5).fill([]).map(() => Array(3).fill("")));
  const [wordCorrect, setWordCorrect] = useState<(boolean | null)[][]>(Array(5).fill([]).map(() => Array(3).fill(null)));
  const [gameAnswers, setGameAnswers] = useState<any[]>(Array(5).fill([]));

  // Track changes for each formal activity separately
  formalCorrect.forEach((_, index) => {
    useEffect(() => {
      if (formalCorrect[index]) {
        formalCorrect[index].forEach((value, elementIndex) => {
          if (value !== null) {
            console.log(`Activity ${index + 1}, Question ${elementIndex + 1}:`);
            console.log(`Correct: ${value}`);
          }
        });
      }
    }, [formalCorrect[index]]);
  });

  // Modify handleActivitySelect to prevent selection if locked
  const handleActivitySelect = (activityType: string) => {
    if (lockedSelections[currentSet]) return; // Prevent selection if locked
    
    const newSelections = [...selections];
    newSelections[currentSet] = activityType;
    setSelections(newSelections);
    localStorage.setItem('greenSelections', JSON.stringify(newSelections));
  };

  // Modify handleNext to lock the selection when entering an activity
  const handleNext = () => {
    if (!selections[currentSet]) {
      alert("Please choose one activity to continue!");
      return;
    }
    
    // Lock the current selection
    const newLockedSelections = [...lockedSelections];
    newLockedSelections[currentSet] = true;
    setLockedSelections(newLockedSelections);
    localStorage.setItem('greenLockedSelections', JSON.stringify(newLockedSelections));
    
    setShowQuestion(true);
    setActiveQuestion(currentSet);
  };

  // Modify handleActivityComplete
  const handleActivityComplete = () => {
    if (activeQuestion !== null) {
      setCompletedQuestions(prev => {
        const newCompleted = [...prev];
        newCompleted[activeQuestion] = true;
        localStorage.setItem('greenCompletedQuestions', JSON.stringify(newCompleted));
        return newCompleted;
      });

      if (activeQuestion < 4) {
        setCurrentSet(activeQuestion + 1);
        setShowQuestion(false);
        setActiveQuestion(null);
      } else {
        // Check for incomplete questions before proceeding to final
        const incompleteQuestions = completedQuestions
          .map((completed, index) => !completed ? index + 1 : null)
          .filter((index): index is number => index !== null);

        if (incompleteQuestions.length > 0) {
          const confirmMessage = `You haven't completed Question${incompleteQuestions.length > 1 ? 's' : ''} ${incompleteQuestions.join(', ')}. Would you like to revisit ${incompleteQuestions.length > 1 ? 'them' : 'it'} before proceeding?`;
          
          if (window.confirm(confirmMessage)) {
            // Navigate to the first incomplete question
            handleRevisit(incompleteQuestions[0] - 1);
            return;
          }
        }
        
        router.push("/final");
      }
    }
  };

  const handleRevisit = (index: number) => {
    setCurrentSet(index);
    
    // If there's no selection for this index, show the selection screen
    if (selections[index] === null) {
      setShowQuestion(false);
      setActiveQuestion(null);
    } else {
      // If there's already a selection, show the activity
      setShowQuestion(true);
      setActiveQuestion(index);
    }
  };

  // Modify handleGameAnswerSave to save to localStorage
  const handleGameAnswerSave = async (answers: any, setIndex: number) => {
    try {
      const activityType = selections[setIndex];
      await new Promise<void>(resolve => {
        setDataQueue(prev => {
          const newItem: QueueItem = {
            type: 'behavior',
            data: {
              timestamp: new Date().toISOString(),
              location: `${activityType}-${setIndex + 1}`,
              behavior: "input",
              input: JSON.stringify(answers),
              result: "game"
            }
          };
          return [...prev, newItem];
        });
        resolve();
      });

      const newGameAnswers = [...gameAnswers];
      newGameAnswers[setIndex] = answers;
      setGameAnswers(newGameAnswers);
      localStorage.setItem('greenGameAnswers', JSON.stringify(newGameAnswers));
    } catch (error) {
      console.error("Error logging game answer:", error);
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
      const GameComponent = [Games1, Games2, Games3, Games4, Games5][setIndex];
      return (
        <GameComponent
          onBack={() => {
            setShowQuestion(false);
            setActiveQuestion(null);
          }}
          onComplete={handleActivityComplete}
          savedAnswers={gameAnswers[setIndex]}
          onSaveAnswers={(answers) => handleGameAnswerSave(answers, setIndex)}
          onTrackBehavior={(behavior) => handleBehaviorTracking(behavior, setIndex)}
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
        onAnswersChange={(newAnswers) => handleAnswerChange(newAnswers, activityType, setIndex)}
        onCorrectChange={(newCorrect) => {
          handleCorrectChange(newCorrect, activityType, setIndex);
        }}
        onLogBehavior={(location, behavior, input, result) => {
          const behaviorData: UserBehavior = {
            timestamp: new Date().toISOString(),
            location,
            behavior,
            input,
            result
          };
          handleBehaviorTracking(behaviorData, setIndex);
        }}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 mt-4">
      <ProgressBar
        totalSteps={5}
        currentStep={currentSet + 1}
        completedSteps={selections.filter(Boolean).length}
        onStepClick={handleRevisit}
        selections={selections}
        disabledSteps={Array(5).fill(false)} // Allow all steps to be clickable
        completedQuestions={completedQuestions}
      />

      {showQuestion && activeQuestion !== null ? (
        // Show the activity if one is selected
        renderActivity(activeQuestion)
      ) : (
        // Show the activity selection screen
        <div className="w-full max-w-3xl text-center mb-8">
          <h2 className="text-2xl text-[#13294B] mb-6">
            {lockedSelections[currentSet] 
              ? "You have already chosen an activity for this section."
              : "These are example questions to show you what to expect. Pick the math problems you want to do, then click NEXT to start!"
            }
          </h2>

          <div className="flex flex-wrap gap-8 justify-center mb-8 w-full">
            <HoverBoxSelectable
              title="Formal Math Questions"
              backgroundColor="#8CC63E"
              content={activitySets[currentSet].formal.content}
              contentFontSize="1.5rem"
              isSelected={selections[currentSet] === "formal"}
              onSelect={() => handleActivitySelect("formal")}
              disabled={lockedSelections[currentSet]}
            />

            <HoverBoxSelectable
              title="Math Word Problems"
              backgroundColor="#FFCC00"
              image={activitySets[currentSet].word.image}
              content={activitySets[currentSet].word.content}
              contentFontSize="1.2rem"
              contentAlign="left"
              isSelected={selections[currentSet] === "word"}
              onSelect={() => handleActivitySelect("word")}
              disabled={lockedSelections[currentSet]}
            />

            <HoverBoxSelectable
              title="Interactive Math Game"
              backgroundColor="#CC0001"
              image={activitySets[currentSet].game.image}
              isWide={true}
              isSelected={selections[currentSet] === "game"}
              onSelect={() => handleActivitySelect("game")}
              disabled={lockedSelections[currentSet]}
            />
          </div>

          {/* Always show NEXT button if there's a selection */}
          {selections[currentSet] && (
            <button
              onClick={handleNext}
              className="bg-[#FF5F05] text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-[#F07249] text-2xl"
            >
              NEXT
            </button>
          )}
        </div>
      )}
    </div>
  );
}
