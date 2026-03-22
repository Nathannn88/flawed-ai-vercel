/** 诗人 2D 立绘 — SVG 风格化角色插画，位于聊天区域左侧 */

'use client';

import { motion } from 'framer-motion';

/** 诗人 2D 立绘：一个来自异质世界的拟人形生命体 */
export default function PoetFigure2D() {
  return (
    <motion.div
      className="fixed bottom-16 left-4 sm:left-8 z-content pointer-events-none select-none"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 0.85, y: 0 }}
      transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          width="100"
          height="200"
          viewBox="0 0 100 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_20px_rgba(255,200,120,0.15)]"
        >
          {/* 光环 / 使命之光 */}
          <motion.ellipse
            cx="50" cy="22" rx="14" ry="4"
            stroke="rgba(255,200,140,0.4)"
            strokeWidth="1"
            fill="none"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* 头部 — 略带裂缝的圆形 */}
          <circle cx="50" cy="35" r="16" fill="#2A2420" stroke="rgba(255,200,140,0.3)" strokeWidth="1.5" />
          {/* 面部裂缝 — 使命的痕迹 */}
          <path d="M44,28 L46,36 L43,42" stroke="rgba(0,229,160,0.35)" strokeWidth="1" fill="none" strokeLinecap="round" />
          {/* 眼睛 — 一只发光，一只暗淡 */}
          <circle cx="44" cy="34" r="2" fill="rgba(0,229,160,0.7)" />
          <circle cx="56" cy="34" r="2" fill="rgba(200,180,150,0.4)" />
          {/* 嘴 — 一条安静的线 */}
          <line x1="46" y1="40" x2="54" y2="40" stroke="rgba(200,180,150,0.3)" strokeWidth="1" strokeLinecap="round" />

          {/* 脖子 */}
          <line x1="50" y1="51" x2="50" y2="60" stroke="#2A2420" strokeWidth="4" />

          {/* 躯干 — 长袍/大衣 */}
          <path
            d="M30,60 Q35,58 50,58 Q65,58 70,60 L75,140 Q60,148 50,148 Q40,148 25,140 Z"
            fill="#1E1A15"
            stroke="rgba(255,200,140,0.15)"
            strokeWidth="1"
          />

          {/* 大衣内层纹理 — 异世界符号 */}
          <path d="M42,75 L44,85 L40,95" stroke="rgba(0,229,160,0.15)" strokeWidth="0.8" fill="none" />
          <path d="M58,70 L56,82 L60,90" stroke="rgba(255,179,71,0.12)" strokeWidth="0.8" fill="none" />
          <circle cx="50" cy="90" r="3" stroke="rgba(0,229,160,0.12)" strokeWidth="0.5" fill="none" />

          {/* 领口装饰 */}
          <path d="M40,60 L50,68 L60,60" stroke="rgba(255,200,140,0.25)" strokeWidth="1" fill="none" />

          {/* 左手 — 微微抬起 */}
          <path d="M30,60 L18,95 L20,100" stroke="#2A2420" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* 手中发光碎片 */}
          <motion.circle
            cx="19" cy="100" r="3"
            fill="rgba(0,229,160,0.3)"
            animate={{ opacity: [0.2, 0.5, 0.2], r: [2.5, 3.5, 2.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* 右手 — 自然下垂 */}
          <path d="M70,60 L80,110 L78,118" stroke="#2A2420" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* 下摆 — 飘动感 */}
          <path
            d="M25,140 Q30,155 35,165 Q40,170 42,180"
            stroke="rgba(255,200,140,0.10)"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M75,140 Q70,155 65,165 Q60,170 58,180"
            stroke="rgba(255,200,140,0.10)"
            strokeWidth="1"
            fill="none"
          />

          {/* 脚部 — 几乎融入阴影 */}
          <path d="M38,148 L35,165" stroke="#1A1610" strokeWidth="3" strokeLinecap="round" />
          <path d="M62,148 L65,165" stroke="#1A1610" strokeWidth="3" strokeLinecap="round" />

          {/* 底部光影 */}
          <ellipse cx="50" cy="170" rx="22" ry="4" fill="rgba(0,0,0,0.15)" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
