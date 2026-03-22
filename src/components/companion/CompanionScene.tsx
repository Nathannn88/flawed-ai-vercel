/** 伴生体场景 — 诗人模型 + 宠物伴生体 + 展示模式 */

'use client';

import { useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { PoetFigure } from './PoetFigure';
import { PetCompanion } from './PetCompanion';
import type { PetForm } from './PetCompanion';
import { ShowcaseOverlay } from './ShowcaseOverlay';

export function CompanionScene() {
  const [form, setForm] = useState<PetForm>('sphere');
  const [toastPopped, setToastPopped] = useState(false);
  const [showcaseOpen, setShowcaseOpen] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleClick = useCallback(() => {
    if (form === 'sphere') {
      setForm('cube');
    } else if (form === 'cube') {
      setForm('toaster');
    } else {
      if (!toastPopped) {
        setToastPopped(true);
      } else {
        setForm('sphere');
        setToastPopped(false);
      }
    }
  }, [form, toastPopped]);

  return (
    <>
      {/* 3D 画布 — 右下角 */}
      <div
        className="fixed z-10"
        style={{ bottom: '7rem', right: '1rem', width: 280, height: 360 }}
      >
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[3, 3, 5]} intensity={0.8} />
            <pointLight position={[-2, -1, 3]} intensity={0.4} color="#00E5A0" />

            <PoetFigure position={[-0.5, -0.1, 0]} />
            <PetCompanion
              form={form}
              toastPopped={toastPopped}
              onClick={handleClick}
              onShowcase={() => setShowcaseOpen(true)}
              onDragChange={setDragging}
            />
          </Suspense>
        </Canvas>
      </div>

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
            <div className="w-28 h-28 rounded-full border-2 border-dashed border-[#00E5A0]/25 flex items-center justify-center">
              <span className="text-[#00E5A0]/35 text-[11px] select-none">松开展示</span>
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
