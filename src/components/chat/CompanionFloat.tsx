/** 2D 伴生体浮窗 — 诗人头像 + 方形宠物（纯 CSS 实现） */

'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

/** 阶段对应的宠物光晕颜色 */
const PET_GLOW: Record<string, string> = {
  intro: 'rgba(0, 229, 160, 0.25)',
  acquaintance: 'rgba(255, 179, 71, 0.25)',
  familiar: 'rgba(255, 179, 71, 0.30)',
  close: 'rgba(199, 62, 92, 0.30)',
  bonded: 'rgba(156, 163, 175, 0.20)',
};

const PET_BORDER: Record<string, string> = {
  intro: 'rgba(0, 229, 160, 0.40)',
  acquaintance: 'rgba(255, 179, 71, 0.40)',
  familiar: 'rgba(255, 179, 71, 0.50)',
  close: 'rgba(199, 62, 92, 0.50)',
  bonded: 'rgba(156, 163, 175, 0.30)',
};

/** 2D 伴生体 — 浮动在聊天区域右下角 */
export default function CompanionFloat() {
  const { character } = useGameStore();
  const phase = character.currentPhase;
  const glow = PET_GLOW[phase] || PET_GLOW.intro;
  const border = PET_BORDER[phase] || PET_BORDER.intro;

  return (
    <motion.div
      className="fixed bottom-24 right-4 sm:right-6 z-content flex flex-col items-center gap-3 pointer-events-none select-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    >
      {/* 诗人头像 — 抽象圆形 */}
      <motion.div
        className="relative w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, rgba(255,200,120,0.12) 0%, rgba(200,150,100,0.06) 100%)',
          border: '1px solid rgba(255,200,120,0.15)',
        }}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* 诗人符号 — 羽毛笔 */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-60">
          <path
            d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"
            stroke="rgba(255,200,140,0.7)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="16" y1="8" x2="2" y2="22"
            stroke="rgba(255,200,140,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* 方形伴生体 — 审美象征 */}
      <motion.div
        className="relative w-7 h-7 rounded-[4px]"
        style={{
          background: `linear-gradient(135deg, ${glow}, transparent)`,
          border: `1.5px solid ${border}`,
          boxShadow: `0 0 12px ${glow}, inset 0 0 8px ${glow}`,
        }}
        animate={{
          rotate: [0, 3, -3, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* 内部光点 */}
        <motion.div
          className="absolute inset-[30%] rounded-[2px]"
          style={{
            background: border,
            opacity: 0.5,
          }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
}
