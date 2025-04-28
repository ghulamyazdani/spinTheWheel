import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useEffect, useState } from "react";
import Video from "../assets/video/spinwinvideo.mp4";
import SpinWheelComponent from "../components/SpinWheel";

export const Route = createFileRoute("/spinthewheel")({
  component: SpinTheWheelPage,
});

function SpinTheWheelPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [result, setResult] = useState("");
  const [showModal, setShowModal] = useState(false);

  const segments = ["😅 Better Luck Next Time!", "🥃 Get a free shot"];
  const segmentColors = [
    "bg-gradient-to-r from-[#8C1B38] to-[#640F28]",
    "bg-gradient-to-r from-[#AA203F] to-[#8C1B38]",
  ];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Auto-play failed:", error);
      });
    }
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSpinComplete = (winningSegment: string) => {
    setResult(winningSegment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setResult("");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#390C1C] to-[#1A0107]">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#390C1C]/90 via-[#2D0915]/80 to-[#1A0107]/90 z-10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGM0LjQxOCAwIDgtMy41ODIgOC04cy0zLjU4Mi04LTgtOC04IDMuNTgyLTggOCAzLjU4MiA4IDggOHoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjxwYXRoIGQ9Ik01MSA0NGM0LjQxOCAwIDgtMy41ODIgOC04cy0zLjU4Mi04LTgtOC04IDMuNTgyLTggOCAzLjU4MiA4IDggOHoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjxwYXRoIGQ9Ik0xMiA0YzMuODY2IDAgNy0zLjEzNCA3LTdzLTMuMTM0LTctNy03LTcgMy4xMzQtNyA3IDMuMTM0IDcgNyA3eiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-10 z-0"></div>
      <video
        ref={videoRef}
        onLoadedData={() => setIsLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
        loop
        muted
        playsInline
      >
        <source src={Video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Header */}
      <div
        className={`absolute top-12 left-0 right-0 text-center z-20 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <div className="text-4xl md:text-5xl font-bold text-white mb-2">
          <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-500">
            Restroworks
          </span>
        </div>
        <div className="w-24 h-1 bg-gradient-to-r from-yellow-300 to-amber-500 mx-auto rounded-full"></div>
      </div>
      {/* Title */}
      <div
        className={`absolute top-[10%] inset-x-0 text-center z-20 transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg px-8">
          <span className="block">Spin &amp; Win</span>
          <span className="text-3xl md:text-4xl mt-2 inline-block text-yellow-300">
            Exciting Prizes!
          </span>
        </h1>
      </div>
      {/* Spin Wheel Component Area */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center z-20 pt-16`}
      >
        <SpinWheelComponent
          segments={segments}
          segmentColors={segmentColors}
          onSpinComplete={handleSpinComplete}
        />

        {/* Go Back Button */}
        <Link
          to="/"
          className="mt-16 text-white hover:text-yellow-300 transition-colors duration-300 flex items-center z-30"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Go Back
        </Link>
      </div>
      // ...existing code...
      {/* Footer text */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center z-30">
        <div className="text-yellow-300 text-xl md:text-2xl font-medium animate-pulse">
          Win Amazing Prizes!{" "}
          <span className="inline-block animate-bounce">✨</span>
        </div>
      </div>
      {/* Go Back Button at the very bottom */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <Link
          to="/"
          className="bg-gradient-to-r from-[#640F28] to-[#8C1B38] hover:from-[#8C1B38] hover:to-[#AA203F] text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Go Back
        </Link>
      </div>
      {/* Result Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all duration-500 scale-100 opacity-100">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
              {result.includes("Better Luck Next Time")
                ? "Oh snap! 😅"
                : "Congratulations! 🎉"}
            </h2>

            <div className="text-3xl font-bold my-6 text-center text-[#8C1B38]">
              {result}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={closeModal}
                className="bg-gradient-to-r from-[#640F28] to-[#8C1B38] hover:from-[#8C1B38] hover:to-[#AA203F] text-white font-bold py-3 px-8 rounded-full transition-all duration-300"
              >
                {result.includes("Better Luck Next Time")
                  ? "Try Again"
                  : "Claim Prize"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpinTheWheelPage;
