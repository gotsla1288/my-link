'use client';

import { useState } from "react";

export default function Home() {
  const [waves, setWaves] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleWaveClick = () => {
    setWaves(prev => prev + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 px-4 py-12 transition-colors duration-300 overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-sky-400/20 dark:bg-sky-900/10 blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-400/20 dark:bg-blue-900/15 blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-300/15 dark:bg-cyan-900/5 blur-3xl pointer-events-none" />

      {/* Main Profile Card */}
      <div className="relative w-full max-w-md bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/40 dark:border-slate-800/40 shadow-[0_20px_50px_rgba(8,112,184,0.12)] rounded-3xl p-8 md:p-10 flex flex-col items-center text-center transition-all duration-500 hover:shadow-[0_20px_50px_rgba(8,112,184,0.22)]">
        
        {/* Sparkle badge */}
        <div className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-sky-100/80 dark:bg-sky-900/40 text-sky-500 dark:text-sky-300 animate-pulse">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>

        {/* Animated Avatar Container */}
        <div className="relative group cursor-pointer mb-6 animate-wave-float">
          {/* Animated glow border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />
          
          {/* Inner circle - Drop/Water representation */}
          <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-sky-50 to-blue-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-950 shadow-inner">
            <svg className="w-14 h-14 text-blue-500 dark:text-sky-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5a3 3 0 0 0-3 3" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/10 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* User Info */}
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
          전혜림
        </h1>
        
        <p className="text-xs font-bold tracking-wider text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full mb-5 border border-blue-100 dark:border-blue-900/30">
          시원한 솔루션을 만드는 코더 🌊
        </p>

        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8 max-w-sm">
          안녕하세요! 파란 바다처럼 맑고 넓은 시선으로 효율적인 코드를 고민하는 개발자 전혜림입니다. 새로운 기술을 배우고 적용하는 과정을 즐깁니다.
        </p>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {["React", "Next.js", "TailwindCSS", "TypeScript", "🌊청량한코딩"].map((tag) => (
            <span
              key={tag}
              className="px-3.5 py-1 text-xs font-semibold text-blue-700 dark:text-sky-300 bg-blue-50/60 dark:bg-sky-950/40 rounded-full border border-blue-100/50 dark:border-sky-900/30 transition-all duration-300 hover:scale-105 hover:bg-blue-100 dark:hover:bg-sky-900/60"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-800 to-transparent mb-8" />

        {/* Interactive Wave Button */}
        <div className="w-full flex flex-col items-center gap-3 mb-6">
          <button
            onClick={handleWaveClick}
            className={`relative px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all duration-300 flex items-center gap-2 select-none active:scale-95 cursor-pointer ${
              isAnimating 
                ? 'bg-sky-500 text-white scale-95 ring-4 ring-sky-300/50'
                : 'bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-sky-500/35 hover:-translate-y-0.5'
            }`}
          >
            <svg className={`w-4 h-4 ${isAnimating ? 'animate-bounce' : 'animate-pulse'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            {isAnimating ? '파도 전송 완료! 🌊' : '파도 보내기 🌊'}
          </button>
          
          <p className="text-xs text-slate-500 dark:text-slate-400">
            보낸 파도: <span className="font-bold text-blue-600 dark:text-sky-400">{waves}</span> 개
          </p>
        </div>

        {/* Social / Contact Links */}
        <div className="flex justify-center gap-6 mt-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-blue-500 dark:text-slate-500 dark:hover:text-sky-400 transition-colors"
            title="GitHub"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
            </svg>
          </a>
          <a
            href="mailto:contact@example.com"
            className="text-slate-400 hover:text-blue-500 dark:text-slate-500 dark:hover:text-sky-400 transition-colors"
            title="Email"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
        </div>

      </div>
    </div>
  );
}
