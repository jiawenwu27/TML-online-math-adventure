"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [magicCode, setMagicCode] = useState(""); // Capture the code input
  const router = useRouter();

  // Function to handle button click
  const handleRedirect = () => {
    if (magicCode.toLowerCase() === "green") {
      localStorage.setItem("magicCode", magicCode.toLowerCase());
      router.push("/intro/green");
    } else if (magicCode.toLowerCase().startsWith("blue")) {
      localStorage.setItem("magicCode", magicCode.toLowerCase());
      router.push(`/intro/blue?order=${magicCode.slice(4)}`);
    } else {
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
      <header className="text-center mb-6">
        <h1
          className="text-6xl font-extrabold text-[#5178C9]"
          style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
        >
          Let’s Do Math Together!
        </h1>
        <h2 className="text-2xl font-bold text-[#3358A3] mt-6">
          Welcome to our Fun Family Math Adventure!
        </h2>
      </header>

      {/* Introductory Section */}
      <div className="text-center mb-6">
        <p className="text-lg font-medium text-gray-700">
          Hi there! Today, you’ll be solving fun math problems together with
          your mom or dad. We’re excited to see how well you work as a team!
        </p>
      </div>

      {/* Magic Code Prompt */}
      <div className="text-center mb-6">
      <h3 className="text-2xl font-semibold text-[#003DA5] mb-6">
        Before we begin, we need the {" "}
        <span className="animate-highlight">
           magic code 
        </span>{" "}
          given by the researcher to get started.
      </h3>
        <p className="text-gray-700 text-sm mb-6">
          This helps us show you the right math problems!
        </p>
        <p className="text-gray-700 text-sm">
          <em>
            If you don’t remember the code, check the Zoom chat or your
            mom/dad’s phone for a text message from the researcher.
          </em>
        </p>
      </div>

      {/* Code Input and Button */}
      <div className="flex flex-col items-center w-[90%] max-w-md">
        <label
          htmlFor="magic-code"
          className="text-lg font-semibold text-gray-700 mb-2"
        >
          Enter your magic code here:
        </label>
        <input
          type="text"
          value={magicCode}
          onChange={(e) => setMagicCode(e.target.value)}
          placeholder="Enter code here"
          className="w-full p-3 rounded-md border-2 border-[#003DA5] focus:outline-none focus:ring focus:ring-[#5178C9]"
        />
        <button 
          onClick={handleRedirect}
          className="mt-4 bg-[#003DA5] text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-[#3358A3]">
          Start My Math Adventure
        </button>
        <p className="text-sm text-gray-500 mt-2">
          No code yet? Check Zoom chat or phone messages!
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