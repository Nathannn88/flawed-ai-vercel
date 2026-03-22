/** Haven 风格背景 — 温暖自然风景，用 CSS 渐变 + SVG 山形模拟金色日落 */

'use client';

export default function HavenBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {/* 天空渐变 — 从淡紫蓝到金色 */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              180deg,
              #7B8FA8 0%,
              #B8A78E 18%,
              #D4B07A 30%,
              #E8C08A 42%,
              #F0C878 52%,
              #E8A050 65%,
              #D08040 78%,
              #A06030 90%,
              #604020 100%
            )
          `,
        }}
      />

      {/* 太阳光晕 */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 45%, rgba(255,220,150,0.40) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(255,200,120,0.20) 0%, transparent 65%)
          `,
        }}
      />

      {/* 远山 SVG 层 */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: '70%' }}
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 远景山脉 — 浅色 */}
        <path
          d="M0,320 Q120,180 240,250 Q360,120 480,200 Q580,100 720,170 Q860,80 960,150 Q1080,60 1200,130 Q1320,80 1440,160 L1440,600 L0,600 Z"
          fill="rgba(100,75,50,0.35)"
        />

        {/* 中景山脉 — 中色 */}
        <path
          d="M0,380 Q100,280 200,320 Q320,220 440,300 Q540,200 680,270 Q780,180 900,260 Q1020,190 1140,250 Q1280,180 1440,240 L1440,600 L0,600 Z"
          fill="rgba(80,60,40,0.50)"
        />

        {/* 近景丘陵 — 深色，带绿意 */}
        <path
          d="M0,440 Q80,380 180,400 Q300,350 420,390 Q560,340 700,380 Q820,330 940,370 Q1080,320 1200,360 Q1340,330 1440,350 L1440,600 L0,600 Z"
          fill="rgba(55,50,35,0.65)"
        />

        {/* 最近的草地 — 温暖深色 */}
        <path
          d="M0,500 Q200,460 400,480 Q600,450 800,470 Q1000,445 1200,465 Q1350,455 1440,460 L1440,600 L0,600 Z"
          fill="rgba(40,35,25,0.80)"
        />
      </svg>

      {/* 底部暗化 — 确保输入栏可读 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(30,25,18,0.70) 60%, rgba(25,20,14,0.90) 100%)',
        }}
      />

      {/* 顶部轻微暗化 — 确保顶栏可读 */}
      <div
        className="absolute top-0 left-0 right-0 h-20"
        style={{
          background: 'linear-gradient(180deg, rgba(30,25,18,0.40) 0%, transparent 100%)',
        }}
      />

      {/* 暖色噪点纹理模拟 */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />
    </div>
  );
}
