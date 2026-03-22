/** 滚动区域 — 诗人角色介绍 */

'use client';

import { motion } from 'framer-motion';

/** 诗人介绍区块（Landing 下滑内容） */
export default function StoryIntro() {
  return (
    <section className="relative w-full py-24 sm:py-32 px-6 bg-warm-50">
      <div className="max-w-3xl mx-auto text-center">
        <motion.p
          className="text-overline uppercase text-warm-600 tracking-[0.15em] mb-4"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          来自异质世界
        </motion.p>

        <motion.h2
          className="font-display text-display text-txt-warm-primary mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          诗人
        </motion.h2>

        <motion.div
          className="space-y-6 font-cinis text-body-lg text-txt-warm-secondary leading-relaxed max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <p>
            {'\u201C'}你说你喜欢下雨天。但你喜欢的是雨，还是待在屋里的借口？
            <br />
            ——这两件事完全不同。{'\u201D'}
          </p>
          <p className="text-body text-txt-warm-muted">
            他有强烈的审美偏好，不追求{'\u201C'}正确{'\u201D'}，追求{'\u201C'}风格{'\u201D'}。
            他来到人类世界，是为了点燃你的审美感知。
            当使命完成，他必须离开。离别不可逆。
          </p>
        </motion.div>

        {/* 分隔线 */}
        <motion.div
          className="w-16 h-[1px] bg-warm-300 mx-auto mt-12"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />
      </div>
    </section>
  );
}
