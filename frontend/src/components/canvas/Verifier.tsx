"use client";

import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { GlassMaterial } from "./materials/GlassMaterial";

interface VerifierProps {
  dispersion?: number;
  roughness?: number;
  bladeProgress?: number; // 0 = hidden, 1 = fully extended
  backdropTexture?: THREE.Texture | null;
  resolution?: THREE.Vector2;
}

export function Verifier({
  dispersion = 0.04,
  roughness = 0.0,
  bladeProgress = 0.0,
  backdropTexture = null,
  resolution,
}: VerifierProps) {
  const strataCount = 8;
  const strataRefs = useRef<(THREE.Group | null)[]>([]);
  const bladeRef = useRef<THREE.Mesh | null>(null);

  // Create 8 GlassMaterial instances (one per stratum to allow per-stratum dispersion/roughness)
  const materials = useMemo(() => {
    return Array.from({ length: strataCount }, (_, i) => {
      // Subtle variations per stratum to catch light and dispersion uniquely
      const mat = new GlassMaterial({
        dispersion: dispersion,
        roughness: roughness,
        thickness: 0.88 + i * 0.015,
      });
      return mat;
    });
  }, [strataCount]);

  // Update uniform values across materials when props change
  useEffect(() => {
    materials.forEach((mat) => {
      mat.dispersion = dispersion;
      mat.roughness = roughness;
    });
  }, [materials, dispersion, roughness]);

  useEffect(() => {
    if (backdropTexture) {
      materials.forEach((mat) => {
        mat.backdrop = backdropTexture;
      });
    }
  }, [materials, backdropTexture]);

  useEffect(() => {
    if (resolution) {
      materials.forEach((mat) => {
        mat.resolution = resolution;
      });
    }
  }, [materials, resolution]);

  // Dimensions per Section 5.1: [1.0, 0.38, 0.55], gap 0.012
  const stratumHeight = 0.38;
  const gap = 0.012;
  const step = stratumHeight + gap; // 0.392
  const startY = -((strataCount - 1) * step) / 2; // -1.372

  // Subtle breathing rotation per stratum around Y axis (31s period, non-uniform phase offset)
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const period = 31.0;
    const baseFreq = (2.0 * Math.PI) / period;

    strataRefs.current.forEach((stratum, i) => {
      if (!stratum) return;

      // Base cumulative spiral twist: (i - 3.5) * 1.8 degrees
      const baseSpiralRad = (i - 3.5) * (1.8 * Math.PI / 180);

      // Breathing sway: +/-0.8 degrees with i * 0.4 rad phase offset
      const swayRad = Math.sin(time * baseFreq + i * 0.4) * (0.8 * Math.PI / 180);

      stratum.rotation.y = baseSpiralRad + swayRad;
    });

    // Animate blade height/scale based on bladeProgress
    if (bladeRef.current) {
      bladeRef.current.scale.y = THREE.MathUtils.lerp(
        bladeRef.current.scale.y,
        bladeProgress,
        0.1
      );
      bladeRef.current.visible = bladeRef.current.scale.y > 0.005;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 8 Glass Strata - Camera Layer 1 */}
      {materials.map((mat, i) => {
        const yPos = startY + i * step;

        return (
          <group
            key={i}
            ref={(el) => {
              strataRefs.current[i] = el;
            }}
            position={[0, yPos, 0]}
          >
            <RoundedBox
              args={[1.0, stratumHeight, 0.55]}
              radius={0.035}
              smoothness={4}
              material={mat}
              layers={1} // Put glass meshes on camera layer 1
            />
          </group>
        );
      })}

      {/* Chrome Core Blade: [0.035, 3.6, 0.28], metalness 1, roughness 0.12 - Camera Layer 0 */}
      <mesh
        ref={bladeRef}
        position={[0, 0, 0]}
        scale={[1, bladeProgress, 1]}
        visible={bladeProgress > 0.005}
        layers={0}
      >
        <boxGeometry args={[0.035, 3.6, 0.28]} />
        <meshStandardMaterial
          color="#f2f0eb"
          metalness={1.0}
          roughness={0.12}
          envMapIntensity={1.5}
        />
      </mesh>
    </group>
  );
}
