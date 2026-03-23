/** 伴生体场景 — 诗人模型 + 宠物伴生体 + 展示模式 + 变形动画 */

'use client';

import { useState, useCallback, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { PoetFigure } from './PoetFigure';
import { PetCompanion } from './PetCompanion';
import { ShowcaseOverlay } from './ShowcaseOverlay';
import type { PetForm, DragState } from './types';
export type { DragState } from './types';

/* 变形动画时间线（毫秒） */
const TRANSFORM_MORPH_DELAY = 300;
const TRANSFORM_TOTAL_DURATION = 800;
const SHOWCASE_PX = 150;

export function CompanionScene() {
  const [form, setForm] = useState<PetForm>('sphere');
  const [toastPopped, setToastPopped] = useState(false);
  const [showcaseOpen, setShowcaseOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [transforming, setTransforming] = useState(false);
  const transformTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  /* 拖拽状态 — 通过 ref 传递给 3D 组件，避免 React 渲染开销 */
  const dragRef = useRef<DragState>({ isDragging: false, clientX: 0, clientY: 0 });
  const wasClick = useRef(true);
  const startXY = useRef({ x: 0, y: 0 });

  /* 清除变形计时器 */
  const clearTransformTimers = useCallback(() => {
    transformTimers.current.forEach(clearTimeout);
    transformTimers.current = [];
  }, []);

  useEffect(() => {
    return clearTransformTimers;
  }, [clearTransformTimers]);

  const handleClick = useCallback(() => {
    if (transforming) return;
    if (form === 'sphere') {
      setForm('cube');
    } else if (form === 'cube') {
      setTransforming(true);
      clearTransformTimers();
      const t1 = setTimeout(() => setForm('toaster'), TRANSFORM_MORPH_DELAY);
      const t2 = setTimeout(() => setTransforming(false), TRANSFORM_TOTAL_DURATION);
      transformTimers.current = [t1, t2];
    } else {
      if (!toastPopped) {
        setToastPopped(true);
      } else {
        setForm('sphere');
        setToastPopped(false);
      }
    }
  }, [form, toastPopped, transforming, clearTransformTimers]);

  /* —— 交互区域 pointerdown —— */
  const handleHitPointerDown = useCallback((e: React.PointerEvent) => {
    if (transforming) return;
    e.preventDefault();
    dragRef.current.isDragging = true;
    dragRef.current.clientX = e.clientX;
    dragRef.current.clientY = e.clientY;
    wasClick.current = true;
    startXY.current = { x: e.clientX, y: e.clientY };
    document.body.style.cursor = 'grabbing';
    setDragging(true);
  }, [transforming]);

  /* —— window 级拖拽 & 释放 —— */
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current.isDragging) return;
      if (Math.abs(e.clientX - startXY.current.x) > 4 || Math.abs(e.clientY - startXY.current.y) > 4) {
        wasClick.current = false;
      }
      dragRef.current.clientX = e.clientX;
      dragRef.current.clientY = e.clientY;
    };

    const onUp = (e: PointerEvent) => {
      if (!dragRef.current.isDragging) return;
      dragRef.current.isDragging = false;
      document.body.style.cursor = '';
      setDragging(false);

      if (wasClick.current) {
        handleClick();
        return;
      }
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      if (Math.abs(e.clientX - cx) < SHOWCASE_PX && Math.abs(e.clientY - cy) < SHOWCASE_PX) {
        setShowcaseOpen(true);
      }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [handleClick]);

  return (
    <>
      {/* 3D 画布 — 全屏渲染，不接收事件 */}
      <div className="fixed inset-0 z-[8] pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: 'transparent', pointerEvents: 'none' }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[3, 3, 5]} intensity={0.8} />
            <pointLight position={[-2, -1, 3]} intensity={0.4} color="#00E5A0" />

            <PoetFigure position={[1.8, -1.5, 0]} />
            <PetCompanion
              form={form}
              toastPopped={toastPopped}
              transforming={transforming}
              dragRef={dragRef}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* 交互命中区域 — 覆盖模型默认位置 */}
      <div
        className="fixed z-[12] cursor-grab active:cursor-grabbing"
        style={{ bottom: '4rem', right: 0, width: 450, height: 500 }}
        onPointerDown={handleHitPointerDown}
      />

      {/* 拖拽时的中心落点指示 */}
      <AnimatePresence>
        {dragging && (
          <motion.div
            className="fixed inset-0 z-[5] pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="w-28 h-28 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center">
              <span className="text-white/40 text-[11px] select-none">松开展示</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 展示模式 */}
      <AnimatePresence>
        {showcaseOpen && (
          <ShowcaseOverlay
            key="showcase"
            form={form}
            toastPopped={toastPopped}
            onClose={() => setShowcaseOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
