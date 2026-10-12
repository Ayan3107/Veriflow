"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

export function TestWord() {
  // Procedural canvas texture: 100% synchronous, zero external network font delay
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 384;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ECE8DF";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // Heavy architectural condensed grotesk
      ctx.font = "900 240px Anton, Impact, 'Arial Narrow', sans-serif";
      ctx.fillText("VERIFY", canvas.width / 2, canvas.height / 2);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  if (!texture) return null;

  return (
    <mesh position={[0, 0, -5]} layers={0}>
      <planeGeometry args={[11, 4.125]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
