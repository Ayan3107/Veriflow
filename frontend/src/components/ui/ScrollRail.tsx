"use client";

import React from "react";

interface ScrollRailProps {
  currentChapter?: number;
  totalChapters?: number;
}

export function ScrollRail({
  currentChapter = 1,
  totalChapters = 6,
}: ScrollRailProps) {
  return (
    <aside
      aria-hidden="true"
      className="fixed left-[clamp(16px,2.2vw,40px)] top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-start gap-4 pointer-events-none select-none"
    >
      <div className="flex flex-col gap-2.5">
        {[...Array(totalChapters)].map((_, i) => {
          const index = i + 1;
          const isActive = index === currentChapter;
          return (
            <div
              key={index}
              className="h-[1px] transition-all duration-300"
              style={{
                width: isActive ? "24px" : "10px",
                backgroundColor: isActive ? "var(--bone)" : "var(--rule)",
              }}
            />
          );
        })}
      </div>
      <span className="micro-label text-[11px] mt-1 text-[var(--bone-60)]">
        {String(currentChapter).padStart(2, "0")}
      </span>
    </aside>
  );
}
