"use client";

import { useRouter, useSearchParams } from "next/navigation";
import HoverBox from "@/components/HoverBox";

export default function BlueIntro() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const order = searchParams.get('order') || '';
console.log(order);
  // Function to determine which types of problems are in the sequence
  const getProblemTypes = () => {
    const uniqueTypes = new Set(order.split(''));
    return {
      hasFormal: uniqueTypes.has('1'),
      hasWord: uniqueTypes.has('2'),
      hasGame: uniqueTypes.has('3'),
      count: uniqueTypes.size
    };
  };

  const { hasFormal, hasWord, hasGame, count } = getProblemTypes();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl text-center mb-8">
        <h1 className="text-5xl font-bold text-[#13294B] mb-4">What's in store?</h1>
        <p className="text-xl mb-6">
          {count === 1 
            ? "You'll explore five sets of math problems like this:"
            : `You'll explore five sets of math problems, each containing one of these ${count} types of challenges:`
          }
        </p>

        {/* Math Boxes Section */}
        <div className="flex flex-wrap gap-8 justify-center mb-8 w-full">
          {/* Only show boxes for problem types that appear in the sequence */}
          {hasFormal && (
            <HoverBox
              title="Formal Math Questions"
              backgroundColor="#8CC63E"
              content={<span>29 + 36 =</span>}
              contentFontSize="2.5rem"
              contentAlign="center"
            />
          )}

          {hasWord && (
            <HoverBox
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
            />
          )}

          {hasGame && (
            <HoverBox
              title="Interactive Math Game"
              backgroundColor="#CC0001"
              image="/img/box-tictactoe.png"
              isWide={true}
            />
          )}
        </div>

        {/* Instructions Section */}
        <h3 className="text-3xl text-[#13294B] font-bold mb-4">Instructions</h3>
        <ol className="list-decimal list-inside text-left text-xl mb-8">
          <li>On the next page, you'll see the first set of problems.</li>
          <li>Solve the problems that appears and click <span className="font-bold">NEXT</span>.</li>
          <li>Repeat for five total sets of problems.</li>
          <li>You have <span className="font-bold">15 minutes</span> to complete your math adventure!</li>
        </ol>

        {/* Button to Start the Adventure */}
        <button
          onClick={() => router.push("/intro/blue/activities")}
          className="bg-[#FF5F05] text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-[#F07249] text-2xl"
        >
          Let the adventure begin!
        </button>
      </div>
    </div>
  );
}