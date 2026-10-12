"use client";

import React from "react";

export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="layout-grid pt-6 items-center">
        {/* Top-Left: Wordmark */}
        <div className="col-span-4 sm:col-span-3 flex items-center pointer-events-auto">
          <a
            href="/"
            className="text-[13px] font-mono tracking-tight lowercase text-bone hover:opacity-80 transition-opacity"
            aria-label="Veriflow home"
          >
            veriflow
          </a>
        </div>

        {/* Top-Right: Minimal Navigation Links (Method · Replay · GitHub ↗ · Sound off) */}
        <nav
          className="col-span-8 sm:col-span-9 flex justify-end items-center gap-6 pointer-events-auto"
          aria-label="Primary navigation"
        >
          <a href="#method" className="micro-label under-link text-[12px]">
            Method
          </a>
          <a href="#replay" className="micro-label under-link text-[12px]">
            Replay
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="micro-label under-link text-[12px]"
          >
            GitHub ↗
          </a>
          <button
            type="button"
            className="micro-label under-link text-[12px] bg-transparent border-0 cursor-pointer"
            aria-label="Toggle sound"
          >
            Sound off
          </button>
        </nav>
      </div>
    </header>
  );
}
