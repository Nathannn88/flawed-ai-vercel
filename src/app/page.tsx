/** Landing Page — Haven 风格温暖引入页面 */

'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import StoryIntro from '@/components/landing/StoryIntro';
import FeatureShowcase from '@/components/landing/FeatureShowcase';
import EnterButton from '@/components/landing/EnterButton';

export default function Home() {
  const router = useRouter();
  const [transitioning, setTransitioning] = useState(false);

  const handleEnter = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      router.push('/chat');
    }, 800);
  }, [router]);

  const handleSkip = useCallback(() => {
    router.push('/chat?skip=true');
  }, [router]);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* 跳过按钮 */}
      <button
        onClick={handleSkip}
        className="fixed top-6 right-6 z-[50] text-caption text-txt-warm-muted/60 hover:text-txt-warm-secondary transition-colors"
      >
        跳过
      </button>

      {/* 过渡遮罩 — 暖色圆形展开 */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            className="fixed inset-0 z-[100] bg-abyss-900"
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(150% at 50% 50%)' }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
      </AnimatePresence>

      {/* 主内容 */}
      <HeroSection onEnter={handleEnter} />
      <StoryIntro />
      <FeatureShowcase />
      <EnterButton onEnter={handleEnter} />
    </main>
  );
}
