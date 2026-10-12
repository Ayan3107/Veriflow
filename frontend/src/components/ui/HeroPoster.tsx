"use client";

import React from "react";

interface HeroPosterProps {
  isCanvasReady?: boolean;
}

export function HeroPoster({ isCanvasReady = false }: HeroPosterProps) {
  // 8 Strata geometry parameters according to Section 5.1
  // Idle pose: cumulative spiral twist around Y axis (i * 1.8°)
  const strataCount = 8;
  const strataIndices = Array.from({ length: strataCount }, (_, i) => i);

  return (
    <div
      aria-hidden="true"
      className={`hero-poster absolute inset-0 z-0 overflow-hidden pointer-events-none select-none transition-opacity duration-1000 ${
        isCanvasReady ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundColor: "var(--ink)" }}
    >
      {/* 1. Receding Bench Rules (Perspective Hairline Grid Floor) */}
      <div
        className="absolute inset-x-0 bottom-0 h-[56%] overflow-hidden"
        style={{
          perspective: "480px",
          perspectiveOrigin: "50% 0%",
        }}
      >
        <div
          className="w-full h-[180%] origin-top"
          style={{
            transform: "rotateX(78deg) translateY(-8%)",
            backgroundImage: `
              repeating-linear-gradient(
                to bottom,
                var(--rule) 0px,
                var(--rule) 1px,
                transparent 1px,
                transparent 22px
              ),
              repeating-linear-gradient(
                to right,
                rgba(236, 232, 223, 0.08) 0px,
                rgba(236, 232, 223, 0.08) 1px,
                transparent 1px,
                transparent 140px
              )
            `,
            maskImage:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0) 95%)",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0) 95%)",
          }}
        />
        {/* Receding Central Axis Hairline */}
        <div
          className="absolute inset-y-0 left-1/2 w-[1px] -translate-x-1/2"
          style={{
            background:
              "linear-gradient(to top, rgba(236, 232, 223, 0.28) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* 2. Giant In-Scene Word: VERIFY (~94% viewport width at z-depth) */}
      <div className="absolute inset-x-0 top-[46%] -translate-y-1/2 flex items-center justify-center z-10">
        <h2
          className="w-[94vw] text-center font-normal uppercase leading-none tracking-tight select-none"
          style={{
            color: "var(--bone)",
            fontFamily: "var(--font-display), Impact, Arial Narrow, sans-serif",
            fontSize: "clamp(84px, 20vw, 320px)",
            letterSpacing: "-0.02em",
            opacity: 0.92,
            textRendering: "geometricPrecision",
          }}
        >
          VERIFY
        </h2>
      </div>

      {/* 3. The Verifier Monolith (8 Strata + Chrome Blade) */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <div
          className="relative flex flex-col items-center justify-center"
          style={{
            width: "clamp(180px, 22vw, 300px)",
            height: "clamp(300px, 52vh, 460px)",
            perspective: "900px",
          }}
        >
          {/* Strata Stack: 8 Glass Slabs with gentle spiral twist */}
          <div className="w-full h-full flex flex-col justify-between py-1">
            {strataIndices.map((i) => {
              const twistDeg = (i - 3.5) * 1.8;
              return (
                <div
                  key={i}
                  className="w-full relative transition-transform duration-500"
                  style={{
                    height: "10.5%",
                    transform: `rotateY(${twistDeg}deg)`,
                    borderTop: "1px solid rgba(236, 232, 223, 0.75)",
                    borderBottom: "1px solid rgba(236, 232, 223, 0.18)",
                    borderLeft: "1px solid rgba(236, 232, 223, 0.28)",
                    borderRight: "1px solid rgba(236, 232, 223, 0.38)",
                    backgroundColor: "rgba(18, 18, 20, 0.62)",
                    backdropFilter: "blur(9px)",
                    WebkitBackdropFilter: "blur(9px)",
                    boxShadow: "inset 0 1px 0 rgba(236, 232, 223, 0.35)",
                  }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(105deg, rgba(236, 232, 223, 0.15) 0%, transparent 40%, rgba(236, 232, 223, 0.05) 100%)",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Central Chrome Blade Specular Line */}
          <div
            className="absolute inset-y-0 w-[2px] pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(236, 232, 223, 0.4) 15%, rgba(236, 232, 223, 0.95) 50%, rgba(236, 232, 223, 0.4) 85%, transparent 100%)",
              boxShadow:
                "0 0 10px rgba(236, 232, 223, 0.6), 0 0 2px rgba(236, 232, 223, 0.9)",
            }}
          />
        </div>
      </div>

      {/* 4. Atmospheric Horizon Fog Dissolve */}
      <div
        className="absolute inset-x-0 top-0 h-[48%] pointer-events-none z-15"
        style={{
          background:
            "linear-gradient(to bottom, var(--ink) 0%, rgba(10, 10, 11, 0.65) 55%, transparent 100%)",
        }}
      />
    </div>
  );
}
