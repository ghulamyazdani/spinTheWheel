import React, { useRef, useState } from "react";
import Corbi from "../assets/image/corbi.png";

interface SpinWheelProps {
  segments: string[];
  colors: string[];
  type: string;
}

// 60% Smoke, 20% Bag, 20% Luck in 10 spins
const MORNING_PERMUTATION = [
  "🚬 Free Smoke on the House",
  "🚬 Free Smoke on the House",
  "🚬 Free Smoke on the House",
  "🚬 Free Smoke on the House",
  "🚬 Free Smoke on the House",
  "🚬 Free Smoke on the House",
  "🎒 Win a Bag",
  "🎒 Win a Bag",
  "👎🏻 Better Luck Next Time!",
  "👎🏻 Better Luck Next Time!",
];

// 70% Shot, 30% Luck in 10 spins
const EVENING_PERMUTATION = [
  "🥃 Get a Quick Shot",
  "🥃 Get a Quick Shot",
  "🥃 Get a Quick Shot",
  "🥃 Get a Quick Shot",
  "🥃 Get a Quick Shot",
  "🥃 Get a Quick Shot",
  "🥃 Get a Quick Shot",
  "👎🏻 Better Luck Next Time!",
  "👎🏻 Better Luck Next Time!",
  "👎🏻 Better Luck Next Time!",
];

const SpinWheel: React.FC<SpinWheelProps> = ({ segments, colors, type }) => {
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const wheelRef = useRef<SVGSVGElement>(null);

  // Responsive size: 95vw, max 800px
  const size = Math.min(window.innerWidth * 0.95, 900);

  // Get the result for the current spin based on permutation
  function getPermutationResult(spinNumber: number) {
    if (type === "morning") {
      return MORNING_PERMUTATION[(spinNumber - 1) % 10];
    }
    // Default to evening permutation
    return EVENING_PERMUTATION[(spinNumber - 1) % 10];
  }

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setSelected(null);

    // Determine the result for this spin
    const nextSpinCount = spinCount + 1;
    const resultLabel = getPermutationResult(nextSpinCount);

    // Find the index of the resultLabel in the segments for this spin
    // If there are multiple, pick a random one
    const matchingIndexes = segments
      .map((seg, idx) => (seg === resultLabel ? idx : -1))
      .filter((idx) => idx !== -1);
    const winner =
      matchingIndexes.length > 0
        ? matchingIndexes[Math.floor(Math.random() * matchingIndexes.length)]
        : Math.floor(Math.random() * segments.length);

    // Calculate the angle so the selected segment lands at the pointer (top)
    const anglePerSegment = 360 / segments.length;
    const finalRotation =
      360 - (winner * anglePerSegment + anglePerSegment / 2);
    const spinRounds = 5;
    const totalRotation = 360 * spinRounds + finalRotation;

    if (wheelRef.current) {
      wheelRef.current.style.transition =
        "transform 2.5s cubic-bezier(0.23, 1, 0.32, 1)";
      wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
    }

    setTimeout(() => {
      setSelected(winner);
      setSpinning(false);
      setShowModal(true);
      setSpinCount(nextSpinCount);

      // Snap to final position with no transition for perfect alignment
      if (wheelRef.current) {
        wheelRef.current.style.transition = "none";
        wheelRef.current.style.transform = `rotate(${finalRotation}deg)`;
      }
    }, 2600);
  };

  const renderSegments = () => {
    const angle = 360 / segments.length;
    return segments.map((label, i) => {
      const rotate = i * angle;
      const midAngle = rotate + angle / 2;
      const textRadius = size / 2 - size * 0.22;
      const rad = ((midAngle - 90) * Math.PI) / 180.0;
      const textX = size / 2 + textRadius * Math.cos(rad);
      const textY = size / 2 + textRadius * Math.sin(rad);

      return (
        <g key={i}>
          <path
            d={describeArc(
              size / 2,
              size / 2,
              size / 2 - 10,
              rotate,
              rotate + angle,
            )}
            fill={colors[i % colors.length]}
            stroke="#fff"
            strokeWidth={size * 0.01}
          />
          <foreignObject
            x={textX - size * 0.13}
            y={textY - size * 0.06}
            width={size * 0.3}
            height={size * 0.12}
            transform={`rotate(${midAngle} ${textX} ${textY})`}
            style={{ overflow: "visible" }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                fontSize: 25,
                fontWeight: "bold",
                color: "#333",
                fontFamily: "system-ui, sans-serif",
                textShadow: "0 2px 8px #fff8",
                overflow: "hidden",
                whiteSpace: "pre-line",
                wordBreak: "break-word",
                lineHeight: 1.1,
                padding: 0,
                margin: 0,
                background: "transparent",
                pointerEvents: "none",
                userSelect: "none",
                // writingMode: "vertical-rl", // vertical text
                rotate: `${90}deg`,
                textOrientation: "mixed",
              }}
            >
              {label}
            </div>
          </foreignObject>
        </g>
      );
    });
  };

  // Helper to describe an SVG arc
  function describeArc(
    cx: number,
    cy: number,
    r: number,
    startAngle: number,
    endAngle: number,
  ) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M",
      cx,
      cy,
      "L",
      start.x,
      start.y,
      "A",
      r,
      r,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "Z",
    ].join(" ");
  }

  function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  // Improved Confetti: more shapes, colors, and animation
  const Confetti = () => {
    const confettiCount = 80;
    const shapes = ["circle", "rect", "triangle"];
    const confettiItems = Array.from({ length: confettiCount }).map((_, i) => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 8 + 4;
      const color = colors[i % colors.length];
      const delay = Math.random() * 1.5;
      const duration = 1.5 + Math.random() * 1.5;
      const rotate = Math.random() * 360;
      const shape = shapes[i % shapes.length];

      if (shape === "circle") {
        return (
          <circle
            key={i}
            cx={`${x}%`}
            cy={`${y}%`}
            r={size / 2}
            fill={color}
            opacity={0.8}
            style={{
              animation: `fall ${duration}s ${delay}s ease-in forwards, spin ${duration}s linear infinite`,
              transformOrigin: "center",
            }}
          />
        );
      }
      if (shape === "rect") {
        return (
          <rect
            key={i}
            x={`${x}%`}
            y={`${y}%`}
            width={size}
            height={size * 0.4}
            fill={color}
            opacity={0.8}
            rx={size * 0.1}
            style={{
              animation: `fall ${duration}s ${delay}s ease-in forwards, spin ${duration}s linear infinite`,
              transform: `rotate(${rotate}deg)`,
              transformOrigin: "center",
            }}
          />
        );
      }
      // triangle: tip points toward center
      const cx = x;
      const cy = y;
      const triHeight = size;
      const triBase = size * 0.8;
      const p1 = {
        x: cx,
        y: cy,
      };
      const p2 = {
        x: cx - triBase / 2,
        y: cy + triHeight,
      };
      const p3 = {
        x: cx + triBase / 2,
        y: cy + triHeight,
      };
      const centerX = (p1.x + p2.x + p3.x) / 3;
      const centerY = (p1.y + p2.y + p3.y) / 3;
      return (
        <polygon
          key={i}
          points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
          fill={color}
          opacity={0.8}
          style={{
            animation: `fall ${duration}s ${delay}s ease-in forwards, spin ${duration}s linear infinite`,
            transform: `rotate(${rotate + 180}deg)`,
            transformOrigin: `${centerX}% ${centerY}%`,
          }}
        />
      );
    });

    return (
      <>
        <svg
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {confettiItems}
          <style>
            {`
            @keyframes fall {
              to {
                transform: translateY(60vh);
                opacity: 0.2;
              }
            }
            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}
          </style>
        </svg>
      </>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 32,
        width: "100vw",
        minHeight: "100vh",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          maxWidth: "99vw",
          maxHeight: "99vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: spinning ? "not-allowed" : "pointer",
        }}
        onClick={spin}
      >
        <svg
          ref={wheelRef}
          width={size}
          height={size}
          style={{
            borderRadius: "50%",
            boxShadow: "0 8px 32px #0002",
            background: "#fff",
            width: "100%",
            height: "100%",
            display: "block",
            pointerEvents: "none",
          }}
        >
          {renderSegments()}
        </svg>
        {/* Corbi image in the center */}
        <img
          src={Corbi}
          alt="Corbi"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: size * 0.22,
            height: size * 0.22,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            zIndex: 3,
            pointerEvents: "none",
            background: "#fff",
            boxShadow: "0 2px 12px #0002",
            objectFit: "contain",
          }}
        />
        {/* Pointer */}
        <div
          style={{
            position: "absolute",
            top: -size * 0.02,
            left: "38%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: `${size * 0.06}px solid transparent`,
            borderRight: `${size * 0.06}px solid transparent`,
            borderBottom: `${size * 0.12}px solid #e74c3c`,
            zIndex: 2,
            rotate: "180deg",
            pointerEvents: "none",
          }}
        />
      </div>
      <div style={{ fontSize: size * 0.045, color: "#888" }}>
        {spinning ? "Spinning..." : "Tap the wheel to spin"}
      </div>
      {/* Modal */}
      {showModal && selected !== null && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: 24,
              padding: "48px 32px 32px 32px",
              minWidth: 320,
              minHeight: 180,
              boxShadow: "0 8px 32px #0003",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              overflow: "hidden",
            }}
          >
            <Confetti />
            <div style={{ fontSize: 36, fontWeight: "bold", marginBottom: 16 }}>
              {segments[selected]}
            </div>
            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: 24,
                padding: "12px 32px",
                fontSize: 18,
                borderRadius: 24,
                background: "#e74c3c",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                letterSpacing: 1,
                boxShadow: "0 2px 8px #0001",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinWheel;
