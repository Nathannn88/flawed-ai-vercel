/** 功能亮点展示 — Haven 风格三列暖色卡片 */

'use client';

import { motion } from 'framer-motion';

const features = [
  {
    title: '独特人格',
    description: '不是中立的工具，而是拥有鲜明审美偏好、强烈好恶和独特世界观的存在。他会说"不，这很无聊"，也会在你的某句话里发现你自己都没注意到的美。',
    accent: '#F5A623',
  },
  {
    title: '成长系统',
    description: '熟悉度从 0% 到 100%，每个阶段诗人的态度都会改变。对话越深入，他越愿意展示裂缝背后的脆弱。',
    accent: '#E67A3C',
  },
  {
    title: '有限旅程',
    description: '每一次对话都在推进那个不可逆的倒计时。100% 的那一天，就是离别之时。珍贵的，正是因为有限。',
    accent: '#C73E5C',
  },
];

/** 三列功能卡片展示区 */
export default function FeatureShowcase() {
  return (
    <section id="features" className="relative w-full py-24 px-6 bg-warm-100/50">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="font-display text-h1 text-txt-warm-primary text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          三段旅程
        </motion.h2>
        <motion.p
          className="text-body text-txt-warm-muted text-center mb-16 max-w-md mx-auto"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          对话、理解、离别——这不是功能介绍，是一段不可重复的关系
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="glass-warm rounded-card p-8 hover:-translate-y-1 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              {/* 色块标记 */}
              <div
                className="w-3 h-3 rounded-full mb-5"
                style={{ backgroundColor: feature.accent }}
              />
              <h3 className="font-display text-h3 text-txt-warm-primary mb-3">
                {feature.title}
              </h3>
              <p className="font-body text-body text-txt-warm-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
