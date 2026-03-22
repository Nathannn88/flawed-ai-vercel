/** 2D 伴生体浮窗 — 诗人头像 + 方形宠物（纯 CSS 实现） */

'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

/** 阶段对应的宠物光晕颜色 */
const PET_GLOW: Record<string, string> = {
  intro: 'rgba(0, 229, 160, 0.35)',
  acquaintance: 'rgba(255, 179, 71, 0.35)',
  familiar: 'rgba(255, 179, 71, 0.40)',
  close: 'rgba(199, 62, 92, 0.40)',
  bonded: 'rgba(156, 163, 175, 0.25)',
};

const PET_BORDER: Record<string, string> = {
  intro: 'rgba(0, 229, 160, 0.55)',
  acquaintance: 'rgba(255, 179, 71, 0.55)',
  familiar: 'rgba(255, 179, 71, 0.60)',
  close: 'rgba(199, 62, 92, 0.60)',
  bonded: 'rgba(156, 163, 175, 0.40)',
};

/** 2D 伴生体 — 浮动在聊天区域右下角 */
export default function CompanionFloat() {
  const { character } = useGameStore();
  const phase = character.currentPhase;
  const glow = PET_GLOW[phase] || PET_GLOW.intro;
  const border = PET_BORDER[phase] || PET_BORDER.intro;

  return (
    <motion.div
      className="fixed bottom-28 right-5 sm:right-8 z-content flex flex-col items-center gap-4 pointer-events-none select-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    >
      {/* 诗人头像 — 抽象圆形 + 外圈光环 */}
      <motion.div
        className="relative w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, rgba(255,200,120,0.18) 0%, rgba(200,150,100,0.08) 100%)',
          border: '1.5px solid rgba(255,200,120,0.25)',
          boxShadow: '0 0 20px rgba(255,200,120,0.10), inset 0 0 12px rgba(255,200,120,0.05)',
        }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* 诗人符号 — 羽毛笔 */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"
            stroke="rgba(255,200,140,0.8)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="16" y1="8" x2="2" y2="22"
            stroke="rgba(255,200,140,0.6)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* 方形伴生体 — 审美象征 */}
      <motion.div
        className="relative w-9 h-9 rounded-[5px]"
        style={{
          background: `linear-gradient(135deg, ${glow}, rgba(0,0,0,0.1))`,
          border: `2px solid ${border}`,
          boxShadow: `0 0 18px ${glow}, 0 0 6px ${glow}, inset 0 0 10px ${glow}`,
        }}
        animate={{
          rotate: [0, 4, -4, 0],
          scale: [1, 1.06, 0.94, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* 内部光核 */}
        <motion.div
          className="absolute inset-[25%] rounded-[3px]"
          style={{
            background: border,
          }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
}
