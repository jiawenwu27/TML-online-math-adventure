"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../../amplify/data/resource'
const client = generateClient<Schema>()

Amplify.configure(outputs);


export default function Home() {
  const [magicCode, setMagicCode] = useState("");
  const [userID, setUserID] = useState("");
  const router = useRouter();

  // Function to log user behavior
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
      console.log(userID)
      console.log("Logged behavior successfully");
    } catch (error) {
      console.error("Error logging behavior:", error);
    }
  };

  // Remove logging from input handlers
  const handleMagicCodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMagicCode(e.target.value);
  };

  const handleUserIDInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserID(e.target.value);
  };

  // Modified redirect handler with multiple logging calls
  const handleRedirect = async () => {
    let result = "wrong-code";
    
    // Log the participant ID input
    await logBehavior(
      "user-id-input",
      "input",
      userID,
      "NA"
    );

    // Log the magic code input
    await logBehavior(
      "magic-code-input",
      "input",
      magicCode,
      "NA"
    );
    
    if (magicCode.toLowerCase() === "green") {
      result = "redirect-to-green";
      localStorage.setItem("magicCode", magicCode.toLowerCase());
      localStorage.setItem("userID", userID);
      await logBehavior(
        "home-start-button",
        "click",
        "NA",
        result
      );
      router.push("/intro/green");
    } else if (magicCode.toLowerCase().startsWith("blue")) {
      result = "redirect-to-blue";
      localStorage.setItem("magicCode", magicCode.toLowerCase());
      localStorage.setItem("userID", userID);
      await logBehavior(
        "home-start-button",
        "click",
        "NA",
        result
      );
      router.push(`/intro/blue?order=${magicCode.slice(4)}`);
    } else {
      await logBehavior(
        "home-start-button",
        "click",
        "NA",
        result
      );
      alert("Invalid code! Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-between p-8 relative"
      style={{
        backgroundImage: "url('/img/grid-bg.png')",
        backgroundSize: "contain",
        backgroundPosition: "center",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Video */}
      <video
        src="/img/TML_Logo_movie.mp4"
        autoPlay
        loop
        muted
        className="w-[8%] "
      />

      {/* Heading */}
      <header className="text-center mb-2">
        <h1
          className="text-6xl font-extrabold text-[#5178C9]"
          style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
        >
          Let's Do Math Together!
        </h1>
      </header>

      {/* Magic Code Prompt */}
      <div className="text-center">
      <h3 className="text-2xl font-semibold text-[#003DA5]">
        Before we begin, we need the {" "}
        <span className="animate-highlight">
           magic code 
        </span>{" "}
          given by the researcher to get started.
      </h3>

      </div>

      {/* Code Input and Button */}
      <div className="flex flex-col items-center w-[90%] max-w-md">
        <label
          htmlFor="user-id"
          className="text-lg font-semibold text-gray-700 mb-2"
        >
          Enter your Participant ID:
        </label>
        <input
          type="text"
          value={userID}
          onChange={handleUserIDInput}
          placeholder="Enter Participant ID"
          className="w-full p-3 mb-4 rounded-md border-2 border-[#003DA5] focus:outline-none focus:ring focus:ring-[#5178C9]"
        />

        <label
          htmlFor="magic-code"
          className="text-lg font-semibold text-gray-700 mb-2 mt-2"
        >
          Enter your magic code here:
        </label>
        <input
          type="text"
          value={magicCode}
          onChange={handleMagicCodeInput}
          placeholder="Enter code here"
          className="w-full p-3 rounded-md border-2 border-[#003DA5] focus:outline-none focus:ring focus:ring-[#5178C9]"
        />
        <button 
          onClick={handleRedirect}
          className="mt-4 bg-[#003DA5] text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-[#3358A3] mt-8">
          Start My Math Adventure
        </button>
        <p className="text-sm text-gray-500 mt-6">
          No code yet? Check Zoom chat!
        </p>
      </div>

      {/* Footer Image */}
      <div className="w-full flex justify-center items-end h-full">
        <img
          src="/img/math-child-pic.png"
          alt="Math Child"
          className="w-[15%] h-auto"
        />
      </div>
    </div>
  );
}