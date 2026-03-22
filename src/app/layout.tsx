/** 根布局 — 配置全局字体、元数据和主题 */

import type { Metadata } from 'next';
import { Space_Grotesk, DM_Sans, Crimson_Pro, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600'],
});

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-cinis',
  display: 'swap',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: '有缺陷的AI — 诗人',
  description: '一个来自异质世界的AI诗人，拥有鲜明审美立场与不可逆的使命。不完美的对话，有限的旅程。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${crimsonPro.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-abyss-900 text-txt-primary font-body antialiased">
        {children}
      </body>
    </html>
  );
}
