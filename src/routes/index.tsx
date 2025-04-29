import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useEffect } from "react";

import Video from "../assets/video/spinwinvideo.mp4"; // Import your video file

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: (search) => {
    // Validate the search parameters if needed
    return {
      type: search.type,
    };
  },
});

function Index() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { type } = Route.useSearch();

  // Auto-play the video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Auto-play failed:", error);
      });
    }
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Fullscreen video optimized for 1080x1920 kiosk */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted
        playsInline
      >
        {/* Replace with your actual video path */}
        <source src={Video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay gradient to ensure button visibility */}
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>

      {/* Button to redirect to spin wheel */}
      <Link
        to="/spinthewheel"
        search={{ type }} // Pass the type parameter to the spin wheel route
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-[#390C1C] hover:bg-orange-700 text-white text-2xl md:text-3xl font-bold py-6 px-12 rounded-full w-3/4 max-w-2xl text-center shadow-xl transition-all duration-300 border-2 border-yellow-400 animate-pulse hover:animate-none"
      >
        <div className="flex items-center justify-center space-x-3">
          <span>TAP TO SPIN THE WHEEL</span>
          <span className="text-3xl">🎡</span>
        </div>
      </Link>

      {/* Attention-grabbing text */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-white text-xl">
        Win Amazing Prizes! ✨
      </div>
    </div>
  );
}
