/** 诗人3D模型 — 低多边形人物风格，参考 MBTI 角色图的几何纸工艺美学 */

'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface PoetFigureProps {
  position: [number, number, number];
}

/* 色板 — 暗色系 + 翡翠绿点缀 */
const COLORS = {
  skin: '#c4a882',
  coat: '#1a2e3e',
  coatDark: '#0d1f2d',
  scarf: '#00E5A0',
  pants: '#141e28',
  shoes: '#0d1520',
  book: '#8B6235',
  bookPage: '#e8dcc8',
  eye: '#0a0a0a',
  glow: '#00E5A0',
};

export function PoetFigure({ position }: PoetFigureProps) {
  const groupRef = useRef<THREE.Group>(null);
  const armLeftRef = useRef<THREE.Group>(null);
  const armRightRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    /* 轻微摇摆 */
    groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.12;
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.02;

    /* 手臂轻微摆动 */
    if (armLeftRef.current) {
      armLeftRef.current.rotation.x = Math.sin(t * 0.7) * 0.1;
    }
    if (armRightRef.current) {
      armRightRef.current.rotation.x = Math.sin(t * 0.7 + Math.PI) * 0.08;
    }
  });

  const flat = { flatShading: true } as const;

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} position={position} scale={0.825}>
        {/* —— 贝雷帽 —— */}
        <mesh position={[0, 0.96, 0.02]} rotation={[0.15, 0, 0.12]}>
          <cylinderGeometry args={[0.2, 0.15, 0.06, 6]} />
          <meshStandardMaterial color={COLORS.coatDark} {...flat} />
        </mesh>
        {/* 帽顶小球 */}
        <mesh position={[0, 1.0, 0.02]}>
          <sphereGeometry args={[0.035, 4, 4]} />
          <meshStandardMaterial color={COLORS.scarf} {...flat} />
        </mesh>

        {/* —— 头部 — 十二面体 —— */}
        <mesh position={[0, 0.78, 0]}>
          <dodecahedronGeometry args={[0.17, 0]} />
          <meshStandardMaterial color={COLORS.skin} roughness={0.7} {...flat} />
        </mesh>

        {/* —— 眼睛 —— */}
        <mesh position={[-0.06, 0.8, 0.14]}>
          <sphereGeometry args={[0.025, 4, 4]} />
          <meshBasicMaterial color={COLORS.eye} />
        </mesh>
        <mesh position={[0.06, 0.8, 0.14]}>
          <sphereGeometry args={[0.025, 4, 4]} />
          <meshBasicMaterial color={COLORS.eye} />
        </mesh>

        {/* —— 围巾 —— */}
        <mesh position={[0, 0.58, 0.02]}>
          <boxGeometry args={[0.28, 0.08, 0.16]} />
          <meshStandardMaterial color={COLORS.scarf} roughness={0.5} {...flat} />
        </mesh>
        {/* 围巾垂尾 */}
        <mesh position={[0.12, 0.45, 0.08]} rotation={[0.2, 0, -0.1]}>
          <boxGeometry args={[0.06, 0.18, 0.04]} />
          <meshStandardMaterial color={COLORS.scarf} roughness={0.5} {...flat} />
        </mesh>

        {/* —— 身体/大衣 —— */}
        <mesh position={[0, 0.32, 0]}>
          <boxGeometry args={[0.3, 0.42, 0.18]} />
          <meshStandardMaterial
            color={COLORS.coat}
            emissive={COLORS.glow}
            emissiveIntensity={0.03}
            roughness={0.6}
            {...flat}
          />
        </mesh>
        {/* 大衣下摆（略宽） */}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[0.34, 0.12, 0.2]} />
          <meshStandardMaterial color={COLORS.coat} roughness={0.6} {...flat} />
        </mesh>

        {/* —— 左臂 —— */}
        <group ref={armLeftRef} position={[-0.21, 0.42, 0]}>
          <mesh position={[0, -0.14, 0]} rotation={[0, 0, 0.12]}>
            <boxGeometry args={[0.08, 0.3, 0.08]} />
            <meshStandardMaterial color={COLORS.coat} roughness={0.6} {...flat} />
          </mesh>
          {/* 左手 */}
          <mesh position={[0.01, -0.3, 0]}>
            <boxGeometry args={[0.06, 0.06, 0.06]} />
            <meshStandardMaterial color={COLORS.skin} roughness={0.7} {...flat} />
          </mesh>
        </group>

        {/* —— 右臂（持书） —— */}
        <group ref={armRightRef} position={[0.21, 0.42, 0]}>
          <mesh position={[0, -0.14, 0]} rotation={[0, 0, -0.12]}>
            <boxGeometry args={[0.08, 0.3, 0.08]} />
            <meshStandardMaterial color={COLORS.coat} roughness={0.6} {...flat} />
          </mesh>
          {/* 右手 */}
          <mesh position={[-0.01, -0.3, 0]}>
            <boxGeometry args={[0.06, 0.06, 0.06]} />
            <meshStandardMaterial color={COLORS.skin} roughness={0.7} {...flat} />
          </mesh>
          {/* 书 */}
          <mesh position={[0.02, -0.28, 0.06]} rotation={[0.4, 0.1, -0.3]}>
            <boxGeometry args={[0.12, 0.16, 0.03]} />
            <meshStandardMaterial color={COLORS.book} roughness={0.85} {...flat} />
          </mesh>
          {/* 书页 */}
          <mesh position={[0.02, -0.28, 0.075]} rotation={[0.4, 0.1, -0.3]}>
            <boxGeometry args={[0.1, 0.14, 0.005]} />
            <meshBasicMaterial color={COLORS.bookPage} />
          </mesh>
        </group>

        {/* —— 左腿 —— */}
        <mesh position={[-0.08, -0.12, 0]}>
          <boxGeometry args={[0.1, 0.28, 0.1]} />
          <meshStandardMaterial color={COLORS.pants} roughness={0.7} {...flat} />
        </mesh>
        {/* 左鞋 */}
        <mesh position={[-0.08, -0.28, 0.02]}>
          <boxGeometry args={[0.11, 0.06, 0.14]} />
          <meshStandardMaterial color={COLORS.shoes} roughness={0.8} {...flat} />
        </mesh>

        {/* —— 右腿 —— */}
        <mesh position={[0.08, -0.12, 0]}>
          <boxGeometry args={[0.1, 0.28, 0.1]} />
          <meshStandardMaterial color={COLORS.pants} roughness={0.7} {...flat} />
        </mesh>
        {/* 右鞋 */}
        <mesh position={[0.08, -0.28, 0.02]}>
          <boxGeometry args={[0.11, 0.06, 0.14]} />
          <meshStandardMaterial color={COLORS.shoes} roughness={0.8} {...flat} />
        </mesh>

        {/* 微弱翡翠光 */}
        <pointLight position={[0, 0.4, 0.3]} color={COLORS.glow} intensity={0.15} distance={1.5} />
      </group>
    </Float>
  );
}
