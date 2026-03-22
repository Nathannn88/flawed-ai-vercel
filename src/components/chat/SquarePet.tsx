/** 方形伴生体 — 可拖拽、展示模式可旋转的审美象征 */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

/** 阶段配色 */
const PHASE_STYLE: Record<string, { glow: string; border: string; core: string }> = {
  intro:        { glow: 'rgba(0,229,160,0.30)',  border: 'rgba(0,229,160,0.55)',  core: '#00E5A0' },
  acquaintance: { glow: 'rgba(255,179,71,0.30)',  border: 'rgba(255,179,71,0.55)',  core: '#FFB347' },
  familiar:     { glow: 'rgba(255,179,71,0.35)',  border: 'rgba(255,179,71,0.60)',  core: '#FFB347' },
  close:        { glow: 'rgba(199,62,92,0.35)',   border: 'rgba(199,62,92,0.60)',   core: '#C73E5C' },
  bonded:       { glow: 'rgba(156,163,175,0.25)', border: 'rgba(156,163,175,0.40)', core: '#9CA3AF' },
};

/** 判断是否接近屏幕中心 */
function isNearCenter(x: number, y: number) {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
  return dist < 120;
}

export default function SquarePet() {
  const { character } = useGameStore();
  const phase = character.currentPhase;
  const style = PHASE_STYLE[phase] || PHASE_STYLE.intro;

  const [showcase, setShowcase] = useState(false);
  const [rotation, setRotation] = useState(0);
  const rotateStartRef = useRef<{ x: number; angle: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 拖拽位置
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // 呼吸动画缩放
  const breathScale = useTransform(
    useMotionValue(0),
    () => 1 + 0.03 * Math.sin(Date.now() / 1500)
  );

  // 拖拽结束：判断是否进入展示模式
  const handleDragEnd = useCallback((_: unknown, info: { point: { x: number; y: number } }) => {
    if (isNearCenter(info.point.x, info.point.y)) {
      setShowcase(true);
    }
  }, []);

  // 展示模式：鼠标/触摸拖拽旋转
  const handleShowcasePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    rotateStartRef.current = { x: e.clientX, angle: rotation };
  }, [rotation]);

  const handleShowcasePointerMove = useCallback((e: React.PointerEvent) => {
    if (!rotateStartRef.current) return;
    const dx = e.clientX - rotateStartRef.current.x;
    setRotation(rotateStartRef.current.angle + dx * 0.8);
  }, []);

  const handleShowcasePointerUp = useCallback(() => {
    rotateStartRef.current = null;
  }, []);

  // ESC 关闭展示模式
  useEffect(() => {
    if (!showcase) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowcase(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showcase]);

  // 关闭展示模式后重置拖拽位置
  useEffect(() => {
    if (!showcase) {
      dragX.set(0);
      dragY.set(0);
    }
  }, [showcase, dragX, dragY]);

  return (
    <>
      {/* 常态：可拖拽的小方块 */}
      {!showcase && (
        <motion.div
          ref={containerRef}
          className="fixed bottom-28 right-6 sm:right-10 z-content cursor-grab active:cursor-grabbing"
          drag
          dragMomentum={false}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          style={{ x: dragX, y: dragY }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          title="拖到屏幕中央可展示"
        >
          <motion.div
            className="relative w-12 h-12 rounded-[6px] transition-colors duration-500"
            style={{
              background: `linear-gradient(135deg, ${style.glow}, rgba(0,0,0,0.15))`,
              border: `2px solid ${style.border}`,
              boxShadow: `0 0 20px ${style.glow}, 0 0 8px ${style.glow}, inset 0 0 12px ${style.glow}`,
            }}
            animate={{
              rotate: [0, 4, -4, 0],
              scale: [1, 1.05, 0.95, 1],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.15, boxShadow: `0 0 30px ${style.glow}` }}
          >
            {/* 内核 */}
            <motion.div
              className="absolute inset-[20%] rounded-[3px]"
              style={{ background: style.core }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* 角落符文 */}
            <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full" style={{ background: style.border }} />
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full" style={{ background: style.border }} />
          </motion.div>

          {/* 提示文字 */}
          <motion.span
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-txt-muted whitespace-nowrap opacity-0 group-hover:opacity-100"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.6 }}
          >
            拖拽展示
          </motion.span>
        </motion.div>
      )}

      {/* 展示模式：全屏遮罩 + 中央旋转方块 */}
      <AnimatePresence>
        {showcase && (
          <motion.div
            className="fixed inset-0 z-modal flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 半透明背景 */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowcase(false)}
            />

            {/* 中央展示方块 */}
            <motion.div
              className="relative z-10 touch-none"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              onPointerDown={handleShowcasePointerDown}
              onPointerMove={handleShowcasePointerMove}
              onPointerUp={handleShowcasePointerUp}
              onPointerLeave={handleShowcasePointerUp}
              style={{ cursor: 'grab' }}
            >
              <div
                className="w-40 h-40 sm:w-52 sm:h-52 rounded-[12px]"
                style={{
                  background: `linear-gradient(135deg, ${style.glow}, rgba(20,18,14,0.9))`,
                  border: `3px solid ${style.border}`,
                  boxShadow: `
                    0 0 40px ${style.glow},
                    0 0 80px ${style.glow},
                    inset 0 0 30px ${style.glow}
                  `,
                  transform: `perspective(600px) rotateY(${rotation}deg)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* 内核 — 大号 */}
                <motion.div
                  className="absolute inset-[15%] rounded-[8px] flex items-center justify-center"
                  style={{ background: style.core }}
                  animate={{ opacity: [0.5, 0.9, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {/* 中心审美符号 */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="opacity-70">
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      stroke="rgba(255,255,255,0.8)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>

                {/* 四角符文 */}
                <div className="absolute top-3 left-3 w-3 h-3 rounded-full border border-white/30" />
                <div className="absolute top-3 right-3 w-3 h-3 rounded-full border border-white/30" />
                <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full border border-white/30" />
                <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full border border-white/30" />

                {/* 边线装饰 */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] rounded-full" style={{ background: style.border }} />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] rounded-full" style={{ background: style.border }} />
              </div>
            </motion.div>

            {/* 操作提示 */}
            <motion.p
              className="absolute bottom-20 text-caption text-txt-secondary/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              左右拖拽旋转 · 点击空白关闭
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
