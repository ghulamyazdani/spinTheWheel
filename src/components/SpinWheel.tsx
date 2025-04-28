import React, { useRef, useState } from "react";

const segments = [
  "😅 Better Luck Next Time!",
  "🥃 Get a free shot",
  "😅 Better Luck Next Time!",
  "🥃 Get a free shot",
  "😅 Better Luck Next Time!",
  "🥃 Get a free shot",
];
const colors = [
  "#7A5BA7",
  "#CC59A1",
  "#F5936C",
  "#FFC659",
  "#4B79BC",
  "#95CB77",
];

const SpinWheel: React.FC = () => {
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const wheelRef = useRef<SVGSVGElement>(null);

  // Responsive size: 95vw, max 800px
  const size = Math.min(window.innerWidth * 0.95, 900);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setSelected(null);

    const winner = Math.floor(Math.random() * segments.length);
    setTimeout(() => {
      setSelected(winner);
      setSpinning(false);
      setShowModal(true);
    }, 2500);

    // Calculate the angle so the selected segment lands at the pointer (top)
    const anglePerSegment = 360 / segments.length;
    const rotation =
      360 * 5 + (360 - (winner * anglePerSegment + anglePerSegment / 2));
    if (wheelRef.current) {
      wheelRef.current.style.transition =
        "transform 2.5s cubic-bezier(.17,.67,.83,.67)";
      wheelRef.current.style.transform = `rotate(${rotation}deg)`;
    }
    setTimeout(() => {
      if (wheelRef.current) {
        wheelRef.current.style.transition = "none";
        wheelRef.current.style.transform = `rotate(${
          360 - (winner * anglePerSegment + anglePerSegment / 2)
        }deg)`;
      }
    }, 2600);
  };

  // ...existing code...
  const renderSegments = () => {
    const angle = 360 / segments.length;
    return segments.map((label, i) => {
      const rotate = i * angle;
      // Place text along the radius, horizontal from center to edge
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
          <text
            x={size / 2}
            y={size * 0.13}
            textAnchor="middle"
            fontSize={19}
            fontWeight="bold"
            fill="#333"
            // Rotate the text to the segment center, so it is horizontal from center to edge
            transform={`rotate(${rotate + angle / 2} ${size / 2} ${size / 2})`}
            style={{
              userSelect: "none",
              fontFamily: "system-ui, sans-serif",
              letterSpacing: 1,
              textShadow: "0 2px 8px #fff8",
              whiteSpace: "pre",
              dominantBaseline: "middle",
            }}
          >
            {label}
          </text>
        </g>
      );
    });
  };
  // ...existing code...
  // ...existing code...

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

  // Simple confetti SVG for demonstration
  // ...existing code...

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
      // triangle
      const points = [
        `${x},${y}`,
        `${x + size / 2},${y + size}`,
        `${x - size / 2},${y + size}`,
      ].join(" ");
      return (
        <polygon
          key={i}
          points={points}
          fill={color}
          opacity={0.8}
          style={{
            animation: `fall ${duration}s ${delay}s ease-in forwards, spin ${duration}s linear infinite`,
            transformOrigin: "center",
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

  // ...existing code...

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
        {/* Pointer */}
        <div
          style={{
            position: "absolute",
            top: -size * 0.06,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: `${size * 0.06}px solid transparent`,
            borderRight: `${size * 0.06}px solid transparent`,
            borderBottom: `${size * 0.12}px solid #e74c3c`,
            zIndex: 2,
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
