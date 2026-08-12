'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.25;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
      ringRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Glass Orb */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshPhysicalMaterial
          roughness={0.15}
          transmission={0.9}
          thickness={1.2}
          color="#6366f1"
          ior={1.5}
          transparent
          opacity={0.85}
          wireframe={false}
        />
      </mesh>

      {/* Inner Glowing Core */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#6366f1"
          emissiveIntensity={2.5}
          roughness={0.2}
        />
      </mesh>

      {/* Orbiting Wireframe Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.4, 0.04, 16, 100]} />
        <meshBasicMaterial color="#a5b4fc" wireframe={true} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function StarParticles({ count = 120 }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return pos;
  });

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#818cf8"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

export default function ThreeCanvas() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.65,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#818cf8" />
        <pointLight position={[-10, -10, -10]} intensity={1.0} color="#06b6d4" />
        <FloatingOrb />
        <StarParticles />
      </Canvas>
    </div>
  );
}
