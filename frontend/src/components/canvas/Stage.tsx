"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import { getPerformanceTier, PerformanceTier } from "@/lib/perf/tier";
import { Lighting } from "./Lighting";
import { Bench } from "./Bench";
import { Verifier } from "./Verifier";
import { TestWord } from "./TestWord";

interface StageProps {
  onReady?: () => void;
  dispersion?: number;
  roughness?: number;
  bladeProgress?: number;
}

/**
 * Shared-Backdrop Two-Pass Render Pipeline (Section 5.2 & Section D)
 * 1. Render Layer 0 (Bench, Lighting, TestWord) into the offscreen FBO.
 * 2. Render Layer 0 + Layer 1 (Verifier glass sampling FBO) to the screen.
 */
function TwoPassPipeline({
  tier,
  dispersion,
  roughness,
  bladeProgress,
  onReady,
}: {
  tier: PerformanceTier;
  dispersion: number;
  roughness: number;
  bladeProgress: number;
  onReady?: () => void;
}) {
  const { gl, scene, camera, size } = useThree();
  const dpr = gl.getPixelRatio();

  // FBO scale: 1.0 (Tier 3), 0.5 (Tier 2/1)
  const fboScale = tier >= 3 ? 1.0 : 0.5;
  const fboWidth = Math.max(1, Math.floor(size.width * dpr * fboScale));
  const fboHeight = Math.max(1, Math.floor(size.height * dpr * fboScale));

  const fbo = useFBO(fboWidth, fboHeight, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    depthBuffer: true,
  });

  const resVec = useRef(new THREE.Vector2(size.width * dpr, size.height * dpr));

  useEffect(() => {
    resVec.current.set(size.width * dpr, size.height * dpr);
  }, [size.width, size.height, dpr]);

  // Signal ready after initial frame setup
  const readyRef = useRef(false);
  useEffect(() => {
    if (!readyRef.current) {
      readyRef.current = true;
      onReady?.();
    }
  }, [onReady]);

  // Priority 1 takes over manual frame rendering
  useFrame(() => {
    // 1. Pass 1: Render Layer 0 (Environment, Bench, TestWord) to FBO
    camera.layers.set(0);
    gl.setRenderTarget(fbo);
    gl.clear();
    gl.render(scene, camera);

    // 2. Pass 2: Enable Layer 0 + Layer 1 (Verifier) and render composite to screen
    camera.layers.enable(1);
    gl.setRenderTarget(null);
    gl.render(scene, camera);
  }, 1);

  return (
    <>
      {/* Procedural Lighting (Layer 0) */}
      <Lighting />

      {/* Receding Bench Floor Plane (Layer 0) */}
      <Bench travel={0} />

      {/* Stage 2 Test Typography: VERIFY at z = -5 (Layer 0) */}
      <TestWord />

      {/* The Verifier: 8 Strata (Layer 1) sampling the FBO backdrop */}
      <Verifier
        dispersion={dispersion}
        roughness={roughness}
        bladeProgress={bladeProgress}
        backdropTexture={fbo.texture}
        resolution={resVec.current}
      />
    </>
  );
}

export default function Stage({
  onReady,
  dispersion = 0.04,
  roughness = 0.0,
  bladeProgress = 0.0,
}: StageProps) {
  const [tier, setTier] = useState<PerformanceTier | null>(null);

  useEffect(() => {
    setTier(getPerformanceTier());
  }, []);

  // Graceful fallback: If Tier 0 or unsupported, render null and keep HeroPoster visible
  if (tier === null || tier === 0) {
    return null;
  }

  // DPR clamp: [1, 1.75] desktop tier 3, [1, 1.25] mobile/lower tiers
  const maxDpr = tier >= 3 ? 1.75 : 1.25;

  return (
    <div
      aria-hidden="true"
      className="canvas-container fixed inset-0 z-10 pointer-events-none"
    >
      <Canvas
        dpr={[1, maxDpr]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{
          position: [0, 0.15, 11],
          fov: 30,
          near: 0.1,
          far: 70,
        }}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
      >
        <Suspense fallback={null}>
          <TwoPassPipeline
            tier={tier}
            dispersion={dispersion}
            roughness={roughness}
            bladeProgress={bladeProgress}
            onReady={onReady}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
