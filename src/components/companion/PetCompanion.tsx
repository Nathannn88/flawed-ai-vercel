/** 伴生体3D宠物 — 球体/立方体/烤面包机变形，支持拖拽、展示模式、变形动画 */

'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { DragState, PetForm } from './types';

export type { PetForm } from './types';

interface PetCompanionProps {
  form: PetForm;
  toastPopped: boolean;
  transforming: boolean;
  dragRef: React.RefObject<DragState>;
}

const REST_X = 3.0;
const REST_Y = -1.5;
const SPARKLE_COUNT = 8;

export function PetCompanion({
  form,
  toastPopped,
  transforming,
  dragRef,
}: PetCompanionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Group>(null);
  const cubeRef = useRef<THREE.Group>(null);
  const toasterRef = useRef<THREE.Group>(null);
  const toast1Ref = useRef<THREE.Mesh>(null);
  const toast2Ref = useRef<THREE.Mesh>(null);
  const sparkleGroupRef = useRef<THREE.Group>(null);

  const { gl, camera } = useThree();
  const vel = useRef(new THREE.Vector3());
  const transformStart = useRef(0);

  /* 粒子数据（位置 + 速度） */
  const sparkleData = useMemo(
    () =>
      Array.from({ length: SPARKLE_COUNT }, () => ({
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
      })),
    [],
  );

  /* 变形动画开始时初始化粒子 */
  useEffect(() => {
    if (transforming) {
      transformStart.current = 0;
      sparkleData.forEach((s) => {
        s.pos.set(0, 0, 0);
        const angle = Math.random() * Math.PI * 2;
        const upward = 1.5 + Math.random() * 2;
        s.vel.set(
          Math.cos(angle) * (1.5 + Math.random() * 1.5),
          upward,
          Math.sin(angle) * (1.5 + Math.random() * 1.5),
        );
      });
    }
  }, [transforming, sparkleData]);

  /* —— 每帧动画 —— */
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const pos = groupRef.current.position;
    /* 防止标签页切回时 delta 极大导致物理爆炸 */
    const dt = Math.min(delta, 0.05);

    /* 拖拽时：从 dragRef 读取鼠标坐标，映射到 3D 世界坐标 */
    const isDragging = dragRef.current?.isDragging ?? false;

    if (isDragging) {
      const canvas = gl.domElement;
      const rect = canvas.getBoundingClientRect();
      const clientX = dragRef.current?.clientX ?? 0;
      const clientY = dragRef.current?.clientY ?? 0;
      const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;
      const vec = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      const wp = camera.position.clone().add(dir.multiplyScalar(dist));
      pos.set(wp.x, wp.y, 0);
      vel.current.set(0, 0, 0);
    }

    /* ===== 变形动画 ===== */
    if (transforming) {
      if (transformStart.current === 0) {
        transformStart.current = state.clock.elapsedTime;
        /* 同步粒子起点到宠物当前位置 */
        if (sparkleGroupRef.current) {
          sparkleGroupRef.current.position.copy(pos);
        }
      }
      const elapsed = state.clock.elapsedTime - transformStart.current;

      /* 弹跳 (0-0.4s) */
      if (elapsed < 0.4) {
        const bounce = Math.sin((elapsed / 0.4) * Math.PI) * 0.35;
        pos.y = REST_Y + bounce;
        const scalePulse = 1 + Math.sin((elapsed / 0.4) * Math.PI) * 0.25;
        groupRef.current.scale.setScalar(scalePulse);
      } else {
        /* 弹跳结束后渐变恢复 */
        pos.y += (REST_Y - pos.y) * 0.15;
        const s = groupRef.current.scale.x;
        groupRef.current.scale.setScalar(s + (1 - s) * 0.15);
      }

      /* 快速旋转 (0.1-0.7s) */
      if (elapsed > 0.1 && elapsed < 0.7) {
        groupRef.current.rotation.y += dt * 14;
      } else {
        groupRef.current.rotation.y += dt * 0.8;
      }

      /* 粒子动画 */
      if (sparkleGroupRef.current && elapsed > 0.15) {
        const sparkleElapsed = elapsed - 0.15;
        sparkleData.forEach((s, i) => {
          s.pos.x += s.vel.x * dt;
          s.pos.y += s.vel.y * dt;
          s.pos.z += s.vel.z * dt;
          s.vel.y -= 4.5 * dt;
          const child = sparkleGroupRef.current?.children[i];
          if (child) {
            child.position.copy(s.pos);
            const fade = Math.max(0, 1 - sparkleElapsed * 1.8);
            child.scale.setScalar(fade * 0.07);
            child.visible = fade > 0.01;
          }
        });
      }
    } else {
      /* ===== 正常状态 ===== */
      transformStart.current = 0;
      /* 渐变恢复 scale 避免跳变 */
      const s = groupRef.current.scale.x;
      if (Math.abs(s - 1) > 0.001) {
        groupRef.current.scale.setScalar(s + (1 - s) * 0.2);
      } else {
        groupRef.current.scale.setScalar(1);
      }

      /* 弹回休息位（帧率无关阻尼）— 仅在非拖拽时 */
      if (!isDragging) {
        const damping = Math.pow(0.88, dt * 60);
        const dx = REST_X - pos.x;
        const dy = REST_Y - pos.y;
        vel.current.x = vel.current.x * damping + dx * 5 * dt;
        vel.current.y = vel.current.y * damping + dy * 5 * dt;
        pos.x += vel.current.x;
        pos.y += vel.current.y;
        pos.y += Math.sin(state.clock.elapsedTime * 2.5) * 0.005;
        pos.x += Math.cos(state.clock.elapsedTime * 1.8) * 0.003;
      }

      /* 缓慢旋转（定期取模防溢出） */
      groupRef.current.rotation.y += dt * (isDragging ? 3 : 0.8);
      if (groupRef.current.rotation.y > Math.PI * 20) {
        groupRef.current.rotation.y %= Math.PI * 2;
      }

      /* 隐藏粒子 */
      if (sparkleGroupRef.current) {
        sparkleGroupRef.current.children.forEach((c) => {
          c.visible = false;
        });
      }
    }

    /* ===== 形态变形缩放（始终运行） ===== */
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
    <>
      <group
        ref={groupRef}
        position={[REST_X, REST_Y, 0]}
      >
        <group scale={0.5}>
        {/* —— 球体 —— */}
        <group ref={sphereRef}>
          <mesh>
            <sphereGeometry args={[0.52, 24, 24]} />
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
            <sphereGeometry args={[0.56, 12, 12]} />
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
      </group>

      {/* —— 变形粒子（独立于主模型的旋转/弹跳） —— */}
      <group ref={sparkleGroupRef} position={[REST_X, REST_Y, 0]}>
        {Array.from({ length: SPARKLE_COUNT }, (_, i) => (
          <mesh key={i} visible={false}>
            <icosahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#00E5A0' : '#33EDBA'} transparent opacity={0.9} />
          </mesh>
        ))}
      </group>
    </>
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
