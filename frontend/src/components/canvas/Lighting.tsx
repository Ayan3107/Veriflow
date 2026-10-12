"use client";

import React from "react";
import { Environment, Lightformer } from "@react-three/drei";

export function Lighting() {
  return (
    <>
      {/* Procedural HDR-free lighting environment (Section 4.5) */}
      <Environment frames={1} resolution={256}>
        {/* KEY: Tall narrow cool-white strip, upper-left (catches glass bevels) */}
        <Lightformer
          form="rect"
          intensity={3.2}
          color="#f4f7fb"
          position={[-3.8, 4.2, 3]}
          scale={[0.65, 7.5, 1]}
          target={[0, 0, 0]}
        />

        {/* RIM: Thin vertical bone strip, rear-right (silhouette edge line) */}
        <Lightformer
          form="rect"
          intensity={5.0}
          color="#ece8df"
          position={[3.6, 1.8, -3.5]}
          scale={[0.22, 6.5, 1]}
          target={[0, 0, 0]}
        />

        {/* FILL: Large dim rectangle overhead (blade and top facets legibility) */}
        <Lightformer
          form="rect"
          intensity={0.35}
          color="#ece8df"
          position={[0, 6, 0]}
          scale={[10, 10, 1]}
          rotation-x={Math.PI / 2}
        />
      </Environment>

      {/* Dim ambient ground bounce for minimal depth fill */}
      <ambientLight intensity={0.12} color="#141416" />
    </>
  );
}
