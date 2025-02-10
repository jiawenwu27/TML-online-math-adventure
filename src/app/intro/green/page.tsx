"use client";

import { useRouter } from "next/navigation";
import HoverBox from "@/components/HoverBox";
import { useState, useEffect } from "react";
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../../amplify/data/resource';
const client = generateClient<Schema>();

export default function GreenIntro() {
  const router = useRouter();
  const [userID, setUserID] = useState("");

  useEffect(() => {
    // Get userID from localStorage when component mounts
    const storedUserID = localStorage.getItem("userID");
    if (storedUserID) {
      setUserID(storedUserID);
    }
  }, []);

  // Add logBehavior function
  const logBehavior = async (location: string, behavior: string, input: string, result: string) => {
    try {
      await client.models.Storage.create({
        userId: userID,
        location: location,
        behavior: behavior as 'input' | 'click',
        input: input,
        result: result,
        timestamp: new Date().toISOString(),
      });
      console.log("Logged behavior successfully");
    } catch (error) {
      console.error("Error logging behavior:", error);
    }
  };

  // Modified button click handler
  const handleStartClick = async () => {
    await logBehavior(
      "green-intro-start-button",
      "click",
      "NA",
      "redirect-to-green-activities"
    );
    router.push("/intro/green/activities/1");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* New Section: What's in Store */}
      <div className="w-full max-w-3xl text-center mb-8">
        <h1 className="text-5xl font-bold text-[#13294B] mb-4">What’s in store?</h1>
        
        {/* Instructions Section */}
        <h3 className="text-3xl text-[#13294B] font-bold mb-4">Instructions</h3>
        <ol className="list-decimal list-inside text-left text-xl mb-8">
          <li>On the next page, you'll see three types of problems like below.</li>
          <li>Pick one type to solve and click <span className="font-bold text-[#FF5F05]">NEXT</span>.</li>
          <li>Solve the problems that appears.</li>
          <li>Repeat for a total of <span className="font-bold text-[#FF5F05]">five sets</span> of problems.</li>
          <li>If you get stuck, use the <span className="font-bold text-[#FF5F05]">progress bar</span> to skip or revisit questions.</li>
          <li>You have <span className="font-bold text-[#FF5F05]">15 minutes</span> to complete your math adventure!</li>
        </ol>
        
        <p className="text-xl font-bold text-[#13294B] mb-6">
          You'll explore five sets of math problems, each containing three
          different types of challenges you can choose from:
        </p>

        {/* Math Boxes Section */}
        <div className="flex flex-wrap gap-8 justify-center mb-8 w-full">
          {/* Box 1 - Centered content */}
          <HoverBox
            title="Formal Math Questions"
            backgroundColor="#8CC63E"
            content={<span>29 + 36 =</span>}
            contentFontSize="2.5rem"
            contentAlign="center"
          />

          {/* Box 2 - Left-aligned content */}
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

          {/* Box 3 - Wide box with only image */}
          <HoverBox
            title="Interactive Math Game"
            backgroundColor="#CC0001"
            image="/img/box-tictactoe.png"
            isWide={true}
          />
        </div>

        {/* Button to Start the Adventure */}
        <button
          onClick={handleStartClick}
          className="bg-[#FF5F05] text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-[#F07249] text-2xl"
        >
          Let the adventure begin!
        </button>
      </div>
    </div>
  );
}

