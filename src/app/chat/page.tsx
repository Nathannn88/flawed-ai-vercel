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
import dynamic from 'next/dynamic';

const CompanionScene = dynamic(
  () => import('@/components/companion/CompanionScene').then(m => ({ default: m.CompanionScene })),
  { ssr: false },
);

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

  return (
    <div
      className="h-dvh flex flex-col bg-abyss-900 relative overflow-hidden"
      data-phase={character.currentPhase}
    >
      {/* 背景图 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/bg-haven.png)' }}
      />
      <div className="absolute inset-0 bg-black/20" />

      {/* 环境光 — 阶段变化时平滑过渡 */}
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

          {/* 3D 伴生体 */}
          <CompanionScene />

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
