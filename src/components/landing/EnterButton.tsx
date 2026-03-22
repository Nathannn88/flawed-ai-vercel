/** 底部 CTA — Haven 风格最终入口 */

'use client';

import { motion } from 'framer-motion';

interface EnterButtonProps {
  onEnter: () => void;
}

/** 底部最终 CTA 区域 */
export default function EnterButton({ onEnter }: EnterButtonProps) {
  return (
    <section className="relative w-full py-32 px-6 bg-warm-50 flex flex-col items-center justify-center">
      {/* 诗人引言 */}
      <motion.p
        className="font-cinis text-body-lg text-txt-warm-secondary italic text-center max-w-md mb-10"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {'\u201C'}别急着回答。你刚才那句话里有一个很好的东西，
        但你自己还没发现。我等你。{'\u201D'}
      </motion.p>

      <motion.button
        className="btn-warm-primary flex items-center gap-2 text-lg px-10 py-4"
        onClick={onEnter}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        开始对话
        <span>→</span>
      </motion.button>

      <motion.p
        className="mt-5 text-caption text-txt-warm-muted"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        每一次对话都在推进倒计时
      </motion.p>
    </section>
  );
}
