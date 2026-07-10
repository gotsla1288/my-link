'use client';

import { useState } from "react";

/* ─── 링크 데이터 ─────────────────────────── */
interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon: React.ReactNode;
  cardStyle: string;
  iconBg: string;
}

const LINKS: LinkItem[] = [
  {
    id: "github",
    title: "GitHub",
    url: "https://github.com",
    description: "github.com/hyerim",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
      </svg>
    ),
    cardStyle: "bg-white/8 text-white border-white/10 hover:bg-white/16 hover:border-white/22",
    iconBg: "bg-white/15",
  },
  {
    id: "blog",
    title: "기술 블로그",
    url: "https://velog.io",
    description: "velog.io/@hyerim",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 5h18a1 1 0 010 2H3a1 1 0 110-2zm0 6h18a1 1 0 010 2H3a1 1 0 110-2zm0 6h11a1 1 0 010 2H3a1 1 0 110-2z" />
      </svg>
    ),
    cardStyle: "bg-emerald-500/12 text-emerald-100 border-emerald-500/18 hover:bg-emerald-500/22 hover:border-emerald-400/32",
    iconBg: "bg-emerald-400/20",
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    url: "https://linkedin.com",
    description: "linkedin.com/in/hyerim",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    cardStyle: "bg-blue-500/12 text-blue-100 border-blue-500/18 hover:bg-blue-500/22 hover:border-blue-400/32",
    iconBg: "bg-blue-400/20",
  },
  {
    id: "portfolio",
    title: "포트폴리오",
    url: "https://hyerim.dev",
    description: "hyerim.dev",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.711-1.422 2.572A48.776 48.776 0 0112 18.75a48.776 48.776 0 01-7.781.625c-1.448.14-2.421-1.572-1.422-2.572L5 14.5" />
      </svg>
    ),
    cardStyle: "bg-purple-500/12 text-purple-100 border-purple-500/18 hover:bg-purple-500/22 hover:border-purple-400/32",
    iconBg: "bg-purple-400/20",
  },
];

/* ─── 파도 위젯 ──────────────────────────────── */
function WaveWidget() {
  const [waves, setWaves] = useState(42);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ripples, setRipples] = useState<number[]>([]);

  const fillPct = Math.min(waves * 1.8, 100);

  const handleWave = () => {
    setWaves(prev => prev + 1);
    setIsAnimating(true);
    setRipples(prev => [...prev, Date.now()]);
    setTimeout(() => setIsAnimating(false), 600);
    setTimeout(() => setRipples(prev => prev.slice(1)), 1000);
  };

  return (
    <div className="glass-card rounded-3xl p-6 flex flex-col gap-5">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <span className="text-2xl select-none">🌊</span>
        <div>
          <h2 className="text-base font-bold text-white leading-tight">파도 보내기</h2>
          <p className="text-xs text-purple-300/60 mt-0.5">청량한 에너지를 전송해 주세요</p>
        </div>
      </div>

      {/* 수조 게이지 */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-white/8"
        style={{ height: 140, background: "rgba(8,6,28,0.65)" }}
      >
        {/* 물 채우기 */}
        <div
          className="absolute bottom-0 left-0 w-full water-fill"
          style={{
            height: `${fillPct}%`,
            background: "linear-gradient(to top, rgba(56,189,248,0.50) 0%, rgba(99,102,241,0.30) 100%)",
          }}
        />

        {/* 파도 표면 SVG */}
        {fillPct > 0 && (
          <div
            className="absolute left-0 w-full pointer-events-none overflow-hidden"
            style={{ bottom: `calc(${fillPct}% - 10px)` }}
          >
            <svg
              viewBox="0 0 400 20"
              preserveAspectRatio="none"
              className="w-full"
              style={{ height: 20 }}
            >
              <path
                d="M0,8 Q50,2 100,8 Q150,14 200,8 Q250,2 300,8 Q350,14 400,8 L400,20 L0,20 Z"
                fill="rgba(125,211,252,0.35)"
              />
            </svg>
          </div>
        )}

        {/* 카운터 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 select-none">
          <span
            className={`text-5xl font-black text-sky-200 transition-all duration-300 ${isAnimating ? "animate-bounce-in scale-125" : ""}`}
          >
            {waves}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400/70 mt-1.5">
            Waves Received
          </span>
        </div>

        {/* 리플 */}
        {ripples.map(id => (
          <div
            key={id}
            className="absolute inset-0 rounded-2xl border-2 border-sky-400/40 pointer-events-none"
            style={{ animation: "ripple 0.9s ease-out forwards" }}
          />
        ))}
      </div>

      {/* 파도 보내기 버튼 */}
      <button
        id="wave-btn"
        onClick={handleWave}
        className={`ripple-btn w-full py-4 rounded-2xl font-bold text-sm text-white transition-all duration-300 flex items-center justify-center gap-2 select-none active:scale-95 cursor-pointer ${
          isAnimating
            ? "bg-sky-500 shadow-lg shadow-sky-500/30"
            : "bg-gradient-to-r from-violet-600 via-blue-500 to-sky-400 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
        }`}
      >
        <svg
          className={`w-4 h-4 ${isAnimating ? "animate-bounce" : "animate-pulse"}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 15s2-1 4 0 4 2 6 1 4-2 6-1" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 19s2-1 4 0 4 2 6 1 4-2 6-1" />
        </svg>
        {isAnimating ? "🌊 파도 전송 완료!" : "🌊 파도 보내기"}
      </button>
    </div>
  );
}

/* ─── LEFT: 프로필 사이드바 ──────────────────── */
function ProfileSidebar() {
  return (
    <aside className="lg:sticky lg:top-10 flex flex-col items-center lg:items-start gap-6 text-center lg:text-left">

      {/* 아바타 */}
      <div className="animate-float-avatar relative self-center lg:self-start">
        <div className="absolute -inset-1.5 rounded-full avatar-ring opacity-75 blur-sm" />
        <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-500 p-[3px] shadow-2xl shadow-violet-900/60">
          <div className="w-full h-full rounded-full bg-[#0d0a1e] flex items-center justify-center overflow-hidden">
            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-300 to-sky-300 select-none">
              전
            </span>
          </div>
        </div>
        {/* 온라인 뱃지 */}
        <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0d0a1e] shadow-md" />
      </div>

      {/* 이름 / 직함 / 소개 */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight">전혜림</h1>
        <p className="text-sm font-semibold text-purple-300/80">Frontend Developer</p>
        <p className="text-[13px] text-slate-400 leading-relaxed max-w-[280px]">
          사용하기 명쾌하고 미학적으로 완성도 높은 인터랙션을 효율적인 코드로 설계합니다 ✨
        </p>
      </div>

      {/* 소셜 아이콘 */}
      <div className="flex items-center gap-2">
        {[
          { label: "GitHub", text: "GH" },
          { label: "Twitter", text: "𝕏" },
          { label: "Instagram", text: "IG" },
        ].map(s => (
          <button
            key={s.label}
            aria-label={s.label}
            className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-[11px] font-bold text-purple-200/80 hover:text-white hover:bg-white/15 transition-all duration-200 cursor-pointer"
          >
            {s.text}
          </button>
        ))}
      </div>

      {/* 구분선 */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden lg:block" />

      {/* CTA 배지 */}
      <a
        href="/"
        id="cta-badge"
        className="animate-badge-glow glass-card inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-purple-200 hover:text-white transition-colors duration-200 cursor-pointer group self-center lg:self-start"
      >
        <svg
          className="w-4 h-4 text-violet-400 group-hover:rotate-12 transition-transform duration-300"
          fill="currentColor" viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        마이링크로 만들기
        <svg className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </a>
    </aside>
  );
}

/* ─── RIGHT: 링크 + 위젯 ────────────────────── */
function ContentPanel() {
  return (
    <div className="flex flex-col gap-3">
      {/* 링크 카드 목록 */}
      <div className="flex flex-col gap-3" role="list" aria-label="링크 목록">
        {LINKS.map((link, i) => (
          <a
            key={link.id}
            id={`link-${link.id}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            role="listitem"
            className={`link-card-anim glass-card-hover flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-200 group ${link.cardStyle}`}
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            {/* 아이콘 */}
            <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${link.iconBg} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
              {link.icon}
            </div>

            {/* 텍스트 */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-tight">{link.title}</p>
              {link.description && (
                <p className="text-[11px] opacity-45 mt-0.5 truncate">{link.description}</p>
              )}
            </div>

            {/* 화살표 */}
            <svg
              className="w-4 h-4 opacity-35 group-hover:opacity-75 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 flex-shrink-0"
              fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        ))}
      </div>

      {/* 파도 위젯 */}
      <WaveWidget />
    </div>
  );
}

/* ─── 메인 페이지 ────────────────────────────── */
export default function Home() {
  return (
    <div className="relative flex min-h-dvh w-full items-start justify-center px-6 py-12 overflow-hidden">

      {/* 배경 오브 */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-violet-800/20 blur-3xl pointer-events-none animate-orb-1 -translate-x-1/3 -translate-y-1/4" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-sky-700/20 blur-3xl pointer-events-none animate-orb-2 translate-x-1/4 translate-y-1/4" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-900/20 blur-3xl pointer-events-none animate-pulse-slow" />

      {/* 메인 컨테이너 */}
      <main className="relative z-10 w-full max-w-5xl">

        {/* 2컬럼 그리드 (데스크탑) / 단일 컬럼 (모바일) */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 lg:gap-14 lg:items-start">
          <ProfileSidebar />
          <ContentPanel />
        </div>

      </main>
    </div>
  );
}
