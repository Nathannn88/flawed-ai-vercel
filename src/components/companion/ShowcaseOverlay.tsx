/** 展示模式覆盖层 — 全屏360度旋转展示当前伴生体形态 */

'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import type { PetForm } from './PetCompanion';

interface ShowcaseOverlayProps {
  form: PetForm;
  toastPopped: boolean;
  onClose: () => void;
}

export function ShowcaseOverlay({ form, toastPopped, onClose }: ShowcaseOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 3D 展示区 */}
      <div className="relative w-[min(80vw,420px)] aspect-square">
        <Canvas
          camera={{ position: [0, 0, 2.8], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[4, 4, 5]} intensity={1} />
          <pointLight position={[-3, -2, 3]} intensity={0.5} color="#00E5A0" />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={4}
          />

          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.15}>
            <ShowcaseModel form={form} toastPopped={toastPopped} />
          </Float>
        </Canvas>

        <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/30 text-xs select-none">
          拖拽旋转 · 点击外部关闭
        </p>
      </div>
    </motion.div>
  );
}

/* —— 展示用模型 —— */
function ShowcaseModel({ form, toastPopped }: { form: PetForm; toastPopped: boolean }) {
  const glow = '#00E5A0';

  if (form === 'sphere') {
    return (
      <group scale={1.6}>
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshPhysicalMaterial
            color="#0d2137"
            emissive={glow}
            emissiveIntensity={0.6}
            transparent
            opacity={0.85}
            roughness={0.2}
            metalness={0.8}
            clearcoat={0.8}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.43, 16, 16]} />
          <meshBasicMaterial color={glow} wireframe transparent opacity={0.25} />
        </mesh>
      </group>
    );
  }

  if (form === 'cube') {
    return (
      <group scale={1.6}>
        <mesh>
          <boxGeometry args={[0.55, 0.55, 0.55]} />
          <meshPhysicalMaterial
            color="#0d2137"
            emissive="#33EDBA"
            emissiveIntensity={0.5}
            transparent
            opacity={0.85}
            roughness={0.15}
            metalness={0.85}
            clearcoat={1}
          />
        </mesh>
        <mesh>
          <boxGeometry args={[0.58, 0.58, 0.58]} />
          <meshBasicMaterial color="#33EDBA" wireframe transparent opacity={0.2} />
        </mesh>
      </group>
    );
  }

  /* toaster */
  const ty1 = toastPopped ? 0.38 : 0.04;
  const ty2 = toastPopped ? 0.34 : 0.02;
  return (
    <group scale={1.8}>
      <mesh>
        <boxGeometry args={[0.55, 0.34, 0.32]} />
        <meshPhysicalMaterial
          color="#B8C0CC"
          emissive={glow}
          emissiveIntensity={0.1}
          roughness={0.25}
          metalness={0.95}
          clearcoat={0.5}
        />
      </mesh>
      <mesh position={[0, 0.155, 0]}>
        <boxGeometry args={[0.35, 0.04, 0.09]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
      </mesh>
      <mesh position={[0.3, 0.04, 0]}>
        <boxGeometry args={[0.035, 0.14, 0.035]} />
        <meshStandardMaterial color="#888" metalness={0.95} roughness={0.3} />
      </mesh>
      <mesh position={[-0.06, ty1, 0]}>
        <boxGeometry args={[0.13, 0.22, 0.05]} />
        <meshStandardMaterial color="#D4A574" roughness={0.85} />
      </mesh>
      <mesh position={[0.06, ty2, 0]}>
        <boxGeometry args={[0.13, 0.22, 0.05]} />
        <meshStandardMaterial color="#C9985E" roughness={0.9} />
      </mesh>
    </group>
  );
}
