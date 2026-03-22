/** 诗人3D模型 — 几何抽象风格，由八面体/二十面体/锥体组成 */

'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface PoetFigureProps {
  position: [number, number, number];
}

export function PoetFigure({ position }: PoetFigureProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.15;
    groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.3) * 0.03;
  });

  const glow = '#00E5A0';
  const body = '#0a1628';

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} position={position} scale={0.85}>
        {/* 身体 — 纵向拉伸八面体 */}
        <mesh scale={[1, 1.6, 1]}>
          <octahedronGeometry args={[0.35, 0]} />
          <meshPhysicalMaterial
            color={body}
            emissive={glow}
            emissiveIntensity={0.25}
            transparent
            opacity={0.85}
            roughness={0.15}
            metalness={0.9}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
        <mesh scale={[1.05, 1.65, 1.05]}>
          <octahedronGeometry args={[0.35, 0]} />
          <meshBasicMaterial color={glow} wireframe transparent opacity={0.3} />
        </mesh>

        {/* 头部 — 二十面体 */}
        <mesh position={[0, 0.8, 0]}>
          <icosahedronGeometry args={[0.2, 1]} />
          <meshPhysicalMaterial
            color={body}
            emissive={glow}
            emissiveIntensity={0.4}
            transparent
            opacity={0.9}
            roughness={0.1}
            metalness={0.95}
            clearcoat={1}
          />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <icosahedronGeometry args={[0.22, 1]} />
          <meshBasicMaterial color="#33EDBA" wireframe transparent opacity={0.2} />
        </mesh>

        {/* 底座 — 倒锥 */}
        <mesh position={[0, -0.72, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.18, 0.25, 6]} />
          <meshPhysicalMaterial
            color={body}
            emissive={glow}
            emissiveIntensity={0.15}
            transparent
            opacity={0.7}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* 内发光 */}
        <pointLight position={[0, 0.3, 0.3]} color={glow} intensity={0.3} distance={2} />
      </group>
    </Float>
  );
}
