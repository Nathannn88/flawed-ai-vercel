/** 伴生体3D宠物 — 球体/立方体/烤面包机变形，支持拖拽与展示模式 */

'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

export type PetForm = 'sphere' | 'cube' | 'toaster';

interface PetCompanionProps {
  form: PetForm;
  toastPopped: boolean;
  onClick: () => void;
  onShowcase: () => void;
  onDragChange?: (dragging: boolean) => void;
}

const REST_X = 0.7;
const REST_Y = -0.4;
const SHOWCASE_PX = 150;

export function PetCompanion({
  form,
  toastPopped,
  onClick,
  onShowcase,
  onDragChange,
}: PetCompanionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Group>(null);
  const cubeRef = useRef<THREE.Group>(null);
  const toasterRef = useRef<THREE.Group>(null);
  const toast1Ref = useRef<THREE.Mesh>(null);
  const toast2Ref = useRef<THREE.Mesh>(null);

  const { gl, camera } = useThree();
  const isDragging = useRef(false);
  const wasClick = useRef(true);
  const startXY = useRef({ x: 0, y: 0 });
  const vel = useRef(new THREE.Vector3());

  /* —— 拖拽开始 —— */
  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      isDragging.current = true;
      wasClick.current = true;
      const pe = e.nativeEvent;
      startXY.current = { x: pe.clientX, y: pe.clientY };
      gl.domElement.setPointerCapture(pe.pointerId);
      gl.domElement.style.cursor = 'grabbing';
      onDragChange?.(true);
    },
    [gl.domElement, onDragChange],
  );

  /* —— canvas 级拖拽 & 释放 —— */
  useEffect(() => {
    const canvas = gl.domElement;

    const onMove = (e: PointerEvent) => {
      if (!isDragging.current || !groupRef.current) return;
      if (Math.abs(e.clientX - startXY.current.x) > 4 || Math.abs(e.clientY - startXY.current.y) > 4) {
        wasClick.current = false;
      }
      const rect = canvas.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      const vec = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      const wp = camera.position.clone().add(dir.multiplyScalar(dist));
      groupRef.current.position.set(wp.x, wp.y, 0);
    };

    const onUp = (e: PointerEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      canvas.releasePointerCapture(e.pointerId);
      canvas.style.cursor = 'auto';
      onDragChange?.(false);
      vel.current.set(0, 0, 0);

      if (wasClick.current) {
        onClick();
        return;
      }
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      if (Math.abs(e.clientX - cx) < SHOWCASE_PX && Math.abs(e.clientY - cy) < SHOWCASE_PX) {
        onShowcase();
      }
    };

    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    return () => {
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
    };
  }, [gl.domElement, camera, onClick, onShowcase, onDragChange]);

  /* —— 每帧动画 —— */
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const pos = groupRef.current.position;

    /* 弹回 */
    if (!isDragging.current) {
      const dx = REST_X - pos.x;
      const dy = REST_Y - pos.y;
      vel.current.x = vel.current.x * 0.88 + dx * 5 * delta;
      vel.current.y = vel.current.y * 0.88 + dy * 5 * delta;
      pos.x += vel.current.x;
      pos.y += vel.current.y;
      pos.y += Math.sin(state.clock.elapsedTime * 2.5) * 0.005;
      pos.x += Math.cos(state.clock.elapsedTime * 1.8) * 0.003;
    }

    /* 旋转 */
    groupRef.current.rotation.y += delta * (isDragging.current ? 3 : 0.8);

    /* 变形缩放 */
    lerpGroup(sphereRef, form === 'sphere' ? 1 : 0.001, 0.1);
    lerpGroup(cubeRef, form === 'cube' ? 1 : 0.001, 0.1);
    lerpGroup(toasterRef, form === 'toaster' ? 1 : 0.001, 0.1);

    /* 面包弹出 */
    if (toast1Ref.current) {
      const t = toastPopped ? 0.24 : 0.02;
      toast1Ref.current.position.y += (t - toast1Ref.current.position.y) * 0.12;
    }
    if (toast2Ref.current) {
      const t = toastPopped ? 0.21 : 0.0;
      toast2Ref.current.position.y += (t - toast2Ref.current.position.y) * 0.12;
    }
  });

  const glow = '#00E5A0';

  return (
    <group
      ref={groupRef}
      position={[REST_X, REST_Y, 0]}
      onPointerDown={handlePointerDown}
      onPointerOver={() => {
        if (!isDragging.current) gl.domElement.style.cursor = 'grab';
      }}
      onPointerOut={() => {
        if (!isDragging.current) gl.domElement.style.cursor = 'auto';
      }}
    >
      {/* —— 球体 —— */}
      <group ref={sphereRef}>
        <mesh>
          <sphereGeometry args={[0.26, 24, 24]} />
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
          <sphereGeometry args={[0.28, 12, 12]} />
          <meshBasicMaterial color={glow} wireframe transparent opacity={0.25} />
        </mesh>
      </group>

      {/* —— 立方体 —— */}
      <group ref={cubeRef}>
        <mesh>
          <boxGeometry args={[0.36, 0.36, 0.36]} />
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
          <boxGeometry args={[0.38, 0.38, 0.38]} />
          <meshBasicMaterial color="#33EDBA" wireframe transparent opacity={0.2} />
        </mesh>
      </group>

      {/* —— 烤面包机 —— */}
      <group ref={toasterRef}>
        <mesh>
          <boxGeometry args={[0.38, 0.24, 0.22]} />
          <meshPhysicalMaterial
            color="#B8C0CC"
            emissive={glow}
            emissiveIntensity={0.1}
            roughness={0.25}
            metalness={0.95}
            clearcoat={0.5}
          />
        </mesh>
        {/* 插槽 */}
        <mesh position={[0, 0.11, 0]}>
          <boxGeometry args={[0.24, 0.03, 0.06]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
        </mesh>
        {/* 把手 */}
        <mesh position={[0.21, 0.03, 0]}>
          <boxGeometry args={[0.025, 0.1, 0.025]} />
          <meshStandardMaterial color="#888" metalness={0.95} roughness={0.3} />
        </mesh>
        {/* 面包片 */}
        <mesh ref={toast1Ref} position={[-0.04, 0.02, 0]}>
          <boxGeometry args={[0.09, 0.15, 0.035]} />
          <meshStandardMaterial color="#D4A574" roughness={0.85} />
        </mesh>
        <mesh ref={toast2Ref} position={[0.04, 0.0, 0]}>
          <boxGeometry args={[0.09, 0.15, 0.035]} />
          <meshStandardMaterial color="#C9985E" roughness={0.9} />
        </mesh>
      </group>

      <pointLight color={glow} intensity={0.4} distance={2.5} />
    </group>
  );
}

/* 平滑缩放辅助 */
function lerpGroup(ref: React.RefObject<THREE.Group | null>, target: number, speed: number) {
  if (!ref.current) return;
  const s = ref.current.scale.x;
  const next = s + (target - s) * speed;
  ref.current.scale.setScalar(Math.max(next, 0.001));
  ref.current.visible = next > 0.01;
}
