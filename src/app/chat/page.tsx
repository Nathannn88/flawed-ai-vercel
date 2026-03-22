/** 聊天主界面 — 包含顶栏、消息区、输入栏、送礼弹窗、事件弹窗 */

'use client';

import { Suspense, useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useChat } from '@/hooks/useChat';
import { useSaveLoad } from '@/hooks/useSaveLoad';
import TopBar from '@/components/chat/TopBar';
import ChatContainer from '@/components/chat/ChatContainer';
import InputBar from '@/components/chat/InputBar';
import FamiliarityBar from '@/components/chat/FamiliarityBar';
import GiftModal from '@/components/chat/GiftModal';
import EventModal from '@/components/chat/EventModal';
import IntroFlow from '@/components/intro/IntroFlow';
import ParticleCanvas from '@/components/landing/ParticleCanvas';
import HavenBackground from '@/components/chat/HavenBackground';
import PoetFigure2D from '@/components/chat/PoetFigure2D';
import SquarePet from '@/components/chat/SquarePet';

export default function ChatPage() {
  return (
    <Suspense>
      <ChatPageInner />
    </Suspense>
  );
}

function ChatPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, character, skipIntro } = useGameStore();
  const { isTyping, error, pendingEvent, clearEvent, sendMessage } = useChat();
  const { saveToFile, loadFromFile } = useSaveLoad();

  // 处理 ?skip=true 跳过所有 intro
  const shouldSkip = searchParams.get('skip') === 'true';
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showIntro, setShowIntro] = useState(!user.introCompleted && !shouldSkip);
  const [toast, setToast] = useState<string | null>(null);

  // 跳过 intro 时自动完成
  useEffect(() => {
    if (shouldSkip && !user.introCompleted) {
      skipIntro();
    }
  }, [shouldSkip, user.introCompleted, skipIntro]);

  // toast 自动消失
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  const handleRecharge = useCallback(() => {
    router.push('/recharge');
  }, [router]);

  const handleSave = useCallback(() => {
    saveToFile();
    setToast('存档已保存');
  }, [saveToFile]);

  const handleLoad = useCallback(() => {
    loadFromFile((success, err) => {
      if (success) {
        setToast('存档已恢复');
      } else {
        setToast(err || '导入失败');
      }
    });
  }, [loadFromFile]);

  // 根据阶段确定粒子颜色
  const particleColors: Record<string, string[]> = {
    intro: ['#00E5A0', '#33EDBA', '#7FF5D5'],
    acquaintance: ['#00E5A0', '#FFB347', '#FFC870'],
    familiar: ['#00E5A0', '#FFB347', '#C73E5C'],
    close: ['#C73E5C', '#E84855', '#FFB347'],
    bonded: ['#9CA3AF', '#6B7280', '#4B5563'],
  };

  return (
    <div
      className="h-dvh flex flex-col relative overflow-hidden"
      data-phase={character.currentPhase}
    >
      {/* Haven 风格风景背景 */}
      <HavenBackground />

      {/* 背景粒子 */}
      <ParticleCanvas
        colors={particleColors[character.currentPhase] || particleColors.intro}
        count={20}
        showLines={false}
      />

      {/* 阶段环境光 — 平滑过渡 */}
      <div
        className="absolute inset-0 pointer-events-none z-particles transition-colors duration-1000"
        style={{ backgroundColor: 'var(--ambient-color)' }}
      />

      {/* 自我介绍流程 */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="absolute inset-0 z-[90]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <IntroFlow onComplete={handleIntroComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主界面 */}
      {!showIntro && (
        <>
          <TopBar
            onUpload={handleLoad}
            onSave={handleSave}
            onRecharge={handleRecharge}
          />

          <ChatContainer isTyping={isTyping} />

          {/* 错误提示 */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mx-4 mb-2 p-3 rounded-card bg-ember-500/10 border border-ember-500/20 text-caption text-ember-300 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <FamiliarityBar />

          <InputBar
            onSend={sendMessage}
            onGiftClick={() => setShowGiftModal(true)}
            disabled={isTyping}
          />

          {/* 送礼弹窗 */}
          <GiftModal
            isOpen={showGiftModal}
            onClose={() => setShowGiftModal(false)}
            onNavigateToRecharge={handleRecharge}
          />

          {/* 事件弹窗 */}
          <EventModal eventId={pendingEvent} onClose={clearEvent} />

          {/* 诗人 2D 立绘 */}
          <PoetFigure2D />

          {/* 方形伴生体 — 可拖拽、展示模式可旋转 */}
          <SquarePet />

          {/* Toast 提示 */}
          <AnimatePresence>
            {toast && (
              <motion.div
                className="fixed bottom-24 left-1/2 -translate-x-1/2 z-toast glass-panel-elevated rounded-capsule px-6 py-3 text-caption text-jade-400 pointer-events-none"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                {toast}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
