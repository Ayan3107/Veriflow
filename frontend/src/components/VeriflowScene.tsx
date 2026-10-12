"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function EvidenceSculpture() {
  const group = useRef<THREE.Group | null>(null);

  useFrame((state) => {
    if (!group.current) {
      return;
    }

    const time = state.clock.getElapsedTime();

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      Math.sin(time * 0.32) * 0.14 + state.pointer.y * 0.12,
      0.025,
    );

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      time * 0.16 + state.pointer.x * 0.28,
      0.025,
    );

    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      state.pointer.x * 0.18,
      0.025,
    );

    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      state.pointer.y * 0.1,
      0.025,
    );
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <Float
        speed={1.1}
        rotationIntensity={0.12}
        floatIntensity={0.16}
      >
        {/* Main translucent metallic form */}
        <mesh scale={[1.05, 1.45, 0.65]}>
          <icosahedronGeometry args={[1.35, 2]} />
          <meshPhysicalMaterial
            color="#d7e4e6"
            metalness={0.92}
            roughness={0.08}
            transmission={0.42}
            thickness={1.4}
            clearcoat={1}
            clearcoatRoughness={0.08}
            transparent
            opacity={0.88}
          />
        </mesh>

        {/* Wire structure */}
        <mesh scale={[1.08, 1.48, 0.68]}>
          <icosahedronGeometry args={[1.35, 1]} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.16}
          />
        </mesh>

        {/* Inner vertical crystal */}
        <mesh
          position={[0.18, -0.05, 0.24]}
          rotation={[0.4, 0.55, 0.2]}
          scale={[0.5, 1.55, 0.34]}
        >
          <octahedronGeometry args={[1, 1]} />
          <meshPhysicalMaterial
            color="#eef7f8"
            metalness={0.98}
            roughness={0.04}
            transmission={0.25}
            thickness={0.7}
            clearcoat={1}
            transparent
            opacity={0.72}
          />
        </mesh>

        {/* Secondary fragment */}
        <mesh
          position={[-0.34, 0.22, -0.16]}
          rotation={[0.2, -0.4, 0.3]}
          scale={[0.35, 0.9, 0.28]}
        >
          <tetrahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color="#a9ecf2"
            metalness={0.84}
            roughness={0.09}
            transmission={0.2}
            clearcoat={1}
            transparent
            opacity={0.48}
          />
        </mesh>
      </Float>
    </group>
  );
}

function SceneGrid() {
  const gridLines: Array<[THREE.Vector3, THREE.Vector3]> = [];

  const width = 18;
  const depth = 22;
  const spacing = 1.2;

  // Perspective lines running toward the horizon.
  for (let x = -width; x <= width; x += spacing) {
    gridLines.push([
      new THREE.Vector3(x, -4.4, -2),
      new THREE.Vector3(x * 2.3, -4.4, -depth),
    ]);
  }

  // Horizontal depth lines.
  for (let z = -2; z >= -depth; z -= spacing) {
    gridLines.push([
      new THREE.Vector3(-width, -4.4, z),
      new THREE.Vector3(width, -4.4, z),
    ]);
  }

  return (
    <group position={[0, 0, -1]}>
      {gridLines.map(([start, end], index) => {
        const positions = new Float32Array([
          start.x,
          start.y,
          start.z,
          end.x,
          end.y,
          end.z,
        ]);

        return (
          <line key={index}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[positions, 3]}
              />
            </bufferGeometry>

            <lineBasicMaterial
              color="#d7faff"
              transparent
              opacity={index % 5 === 0 ? 0.11 : 0.045}
            />
          </line>
        );
      })}
    </group>
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.38} />

      <pointLight
        position={[4, 5, 5]}
        intensity={65}
        distance={18}
        color="#ffffff"
      />

      <pointLight
        position={[-4, 1, 3]}
        intensity={40}
        distance={14}
        color="#8debf4"
      />

      <pointLight
        position={[1, -2, 1]}
        intensity={30}
        distance={12}
        color="#b9c4ff"
      />
    </>
  );
}

export default function VeriflowScene() {
  return (
    <Canvas
      dpr={[1, 1.7]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{
        position: [0, 0.55, 8.5],
        fov: 42,
        near: 0.1,
        far: 100,
      }}
    >
      <PerspectiveCamera
        makeDefault
        position={[0, 0.55, 8.5]}
        fov={42}
        near={0.1}
        far={100}
      />

      <SceneLights />
      <SceneGrid />
      <EvidenceSculpture />
    </Canvas>
  );
}