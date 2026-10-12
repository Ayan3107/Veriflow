"use client";

import React from "react";

interface Stage2DebugControlsProps {
  dispersion: number;
  setDispersion: (val: number) => void;
  roughness: number;
  setRoughness: (val: number) => void;
  bladeProgress: number;
  setBladeProgress: (val: number) => void;
}

export function Stage2DebugControls({
  dispersion,
  setDispersion,
  roughness,
  setRoughness,
  bladeProgress,
  setBladeProgress,
}: Stage2DebugControlsProps) {
  return (
    <div
      className="fixed top-20 right-[clamp(16px,2.2vw,40px)] z-50 p-4 border border-[var(--rule)] bg-[rgba(10,10,11,0.85)] backdrop-blur-md flex flex-col gap-3 pointer-events-auto select-none"
      style={{ width: "240px" }}
      aria-label="Stage 2 Acceptance Test Controls"
    >
      <div className="flex items-center justify-between border-b border-[var(--rule)] pb-2">
        <span className="micro-label text-[10px] font-bold text-[var(--bone)]">
          STAGE 2 · GLASS TEST
        </span>
        <span className="micro-label text-[10px] text-[var(--bone-60)]">
          DEV HUD
        </span>
      </div>

      {/* Dispersion Slider: 0.00 -> 0.40 */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center text-[11px] font-mono">
          <span className="text-[var(--bone-60)]">DISPERSION</span>
          <span className="text-[var(--bone)] tabular-nums">
            {dispersion.toFixed(2)}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="0.40"
          step="0.01"
          value={dispersion}
          onChange={(e) => setDispersion(parseFloat(e.target.value))}
          className="w-full accent-[var(--bone)] cursor-pointer h-1 bg-[var(--graphite)]"
        />
        <div className="flex justify-between text-[10px] font-mono text-[var(--bone-60)] pt-0.5">
          <button
            type="button"
            onClick={() => setDispersion(0.0)}
            className="hover:text-[var(--bone)] underline cursor-pointer"
          >
            0.0 (crisp)
          </button>
          <button
            type="button"
            onClick={() => setDispersion(0.3)}
            className="hover:text-[var(--bone)] underline cursor-pointer"
          >
            0.30 (fringed)
          </button>
        </div>
      </div>

      {/* Roughness Slider: 0.00 -> 0.012 */}
      <div className="flex flex-col gap-1 pt-1 border-t border-[var(--rule)]">
        <div className="flex justify-between items-center text-[11px] font-mono">
          <span className="text-[var(--bone-60)]">ROUGHNESS</span>
          <span className="text-[var(--bone)] tabular-nums">
            {roughness.toFixed(4)}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="0.012"
          step="0.0005"
          value={roughness}
          onChange={(e) => setRoughness(parseFloat(e.target.value))}
          className="w-full accent-[var(--bone)] cursor-pointer h-1 bg-[var(--graphite)]"
        />
        <div className="flex justify-between text-[10px] font-mono text-[var(--bone-60)] pt-0.5">
          <button
            type="button"
            onClick={() => setRoughness(0.0)}
            className="hover:text-[var(--bone)] underline cursor-pointer"
          >
            0.0 (clear)
          </button>
          <button
            type="button"
            onClick={() => setRoughness(0.012)}
            className="hover:text-[var(--bone)] underline cursor-pointer"
          >
            0.012 (frosted)
          </button>
        </div>
      </div>

      {/* Chrome Blade Extension Toggle */}
      <div className="flex items-center justify-between pt-1 border-t border-[var(--rule)] text-[11px] font-mono">
        <span className="text-[var(--bone-60)]">CHROME BLADE</span>
        <button
          type="button"
          onClick={() => setBladeProgress(bladeProgress > 0.5 ? 0.0 : 1.0)}
          className="micro-label text-[11px] px-2 py-0.5 border border-[var(--rule)] hover:border-[var(--bone)] cursor-pointer transition-colors"
        >
          {bladeProgress > 0.5 ? "EXTENDED" : "HIDDEN"}
        </button>
      </div>
    </div>
  );
}
