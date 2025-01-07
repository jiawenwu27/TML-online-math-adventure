"use client";

export default function FinalPage() {
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
      {/* Decorative Figures */}
      <img
        src="/img/figure-bg-1.png"
        alt="Decorative Figure 1"
        className="absolute top-8 left-8 w-240 h-auto opacity-80"
      />
      <img
        src="/img/figure-bg-2.png"
        alt="Decorative Figure 2"
        className="absolute bottom-8 right-8 w-240 h-auto opacity-80"
      />

      {/* Logo Video */}
      <video
        src="/img/TML_Logo_movie.mp4"
        autoPlay
        loop
        muted
        className="w-[12%]"
      />

      {/* Main Content */}
      <div className="text-center flex flex-col items-center">
        <h1
          className="text-8xl font-extrabold text-[#5178C9] mb-6"
          style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
        >
          You Did It!
        </h1>

        <h2 className="text-4xl font-bold text-[#3358A3] mb-8">
          Thank you for participating in our math adventure.
        </h2>

        <p className="text-2xl text-gray-700">
          You can close this window now and return to zoom to tell the researcher.
        </p>

        {/* Celebration Animation/Image */}
        {/* <div className="mt-8">
          <img
            src="/img/celebration-final.png"
            alt="Celebration"
            className="w-48 h-auto animate-bounce opacity-90"
          />
        </div> */}
      </div>

      {/* Footer Image */}
      <div className="w-full flex justify-center items-end">
        <img
          src="/img/math-child-pic.png"
          alt="Math Child"
          className="w-[35%] h-auto"
        />
      </div>
    </div>
  );
}
