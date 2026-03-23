/** Landing 英雄区域 — Haven 风格：温暖渐变 + 磨砂玻璃导航 + 大标题 */

'use client';

import { motion } from 'framer-motion';

interface HeroSectionProps {
  onEnter: () => void;
}

/** Haven 风格导航栏 */
function GlassNav() {
  return (
    <motion.nav
      className="fixed top-4 inset-x-0 mx-auto w-fit z-[40] glass-warm rounded-capsule px-6 py-2.5 flex items-center gap-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <span className="font-display font-bold text-body-lg text-txt-warm-primary flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-warm-500" />
        有缺陷的诗人
      </span>
    </motion.nav>
  );
}

export default function HeroSection({ onEnter }: HeroSectionProps) {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* 温暖渐变背景 — 模拟金色日落 */}
      <div className="absolute inset-0 bg-gradient-golden-hour" />

      {/* 底部花田渐变叠层 */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 80%, rgba(255,180,100,0.25) 0%, transparent 50%),
            radial-gradient(ellipse at 30% 90%, rgba(200,120,80,0.15) 0%, transparent 40%),
            radial-gradient(ellipse at 70% 85%, rgba(180,200,100,0.10) 0%, transparent 45%)
          `,
        }}
      />

      {/* 柔光叠层 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)',
        }}
      />

      {/* 导航栏 */}
      <GlassNav />

      {/* 主内容 */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl">
        {/* 标签 */}
        <motion.div
          className="glass-warm rounded-capsule px-4 py-1.5 mb-8 mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span className="text-caption text-txt-warm-secondary">
            一个有审美偏好的 AI 诗人
          </span>
        </motion.div>

        {/* 大标题 */}
        <motion.h1
          className="font-display text-display-lg sm:text-[80px] leading-[1.05] tracking-tight text-txt-warm-primary mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          审美系统的升级
        </motion.h1>

        {/* 副标题 */}
        <motion.p
          className="text-body-lg text-txt-warm-secondary max-w-md mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          他来自另一个世界，有鲜明的审美立场。
          <br />
          他不会永远在这里。
        </motion.p>

        {/* 按钮组 */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          <motion.button
            className="btn-warm-primary flex items-center gap-2"
            onClick={onEnter}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            开始对话
            <span className="text-sm">→</span>
          </motion.button>

          <a
            href="#features"
            className="btn-warm-ghost"
          >
            了解更多
          </a>
        </motion.div>
      </div>

      {/* 底部 SCROLL 指示器 */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="text-overline text-txt-warm-muted tracking-[0.2em]">
          SCROLL
        </span>
        <motion.span
          className="text-caption text-txt-warm-muted"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}
