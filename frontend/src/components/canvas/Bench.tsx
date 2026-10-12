"use client";

import React, { useMemo } from "react";
import { BenchMaterial } from "./materials/BenchMaterial";

interface BenchProps {
  travel?: number;
}

export function Bench({ travel = 0 }: BenchProps) {
  const material = useMemo(() => new BenchMaterial(), []);

  // Update uTravel if prop changes
  material.travel = travel;

  return (
    <mesh
      position={[0, -1.9, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      material={material}
      receiveShadow={false}
    >
      <planeGeometry args={[60, 60, 1, 1]} />
    </mesh>
  );
}
