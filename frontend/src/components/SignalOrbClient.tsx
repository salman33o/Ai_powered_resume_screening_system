'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface SignalOrbClientProps {
  score?: number;
  size?: number;
  position?: [number, number, number];
  intensity?: number;
  wireframe?: boolean;
}

function SignalMesh({ score = 0, size = 1, wireframe = false }: { score: number; size: number; wireframe: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  let baseColor = '#e76f51';
  if (score >= 80) {
    baseColor = '#2a9d8f';
  } else if (score >= 50) {
    baseColor = '#e9c46a';
  }

  const interpolatedColor = new THREE.Color(baseColor).lerp(new THREE.Color('white'), 1 - score / 100);

  useFrame((_state, delta) => {
    if (meshRef.current && !wireframe) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  const scale = size * (1 + (score / 100) * 0.05);

  return (
    <Sphere ref={meshRef} args={[size, 32, 32]} scale={scale} castShadow>
      <meshStandardMaterial
        color={interpolatedColor}
        transparent
        opacity={0.9}
        wireframe={wireframe}
        roughness={0.5}
        metalness={0.2}
        emissive={new THREE.Color(0, 0, 0).lerp(interpolatedColor, score / 100)}
        emissiveIntensity={0.5 + (score / 100) * 0.8}
      />
    </Sphere>
  );
}

const SignalOrbClient: React.FC<SignalOrbClientProps> = ({
  score = 50,
  size = 1.5,
  position = [0, 0, 0],
  intensity = 0.8,
  wireframe = false,
}) => {
  const memoizedScore = useMemo(() => score, [score]);
  const memoizedSize = useMemo(() => size, [size]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: 'transparent' }}>
      <Canvas
        shadows
        camera={{ position: [position[0], position[1], 5], fov: 50 }}
        gl={{ antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={intensity} castShadow />
        <directionalLight
          position={[-5, 5, 5]}
          intensity={intensity * 0.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <SignalMesh score={memoizedScore} size={memoizedSize} wireframe={wireframe} />

        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  );
};

export default SignalOrbClient;
