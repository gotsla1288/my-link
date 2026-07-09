'use client';

import { useState } from "react";

export default function Home() {
  const [vibes, setVibes] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleVibeClick = () => {
    setVibes(prev => prev + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-zinc-950 px-4 py-12 transition-colors duration-300">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-violet-400/20 dark:bg-violet-900/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-cyan-400/20 dark:bg-cyan-900/10 blur-3xl pointer-events-none" />

      {/* Main Profile Card */}
      <div className="relative w-full max-w-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-zinc-800/50 shadow-2xl rounded-3xl p-8 md:p-10 flex flex-col items-center text-center transition-all duration-300 hover:shadow-cyan-500/5 dark:hover:shadow-violet-500/5">
        
        {/* Sparkle badge */}
        <div className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 text-amber-500 animate-pulse">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>

        {/* Animated Avatar Container */}
        <div className="relative group cursor-pointer mb-6">
          {/* Animated glow border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />
          
          {/* Inner circle */}
          <div className="relative w-28 h-28 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-zinc-950">
            <svg className="w-14 h-14 text-violet-600 dark:text-cyan-400 animate-float" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* User Info */}
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50 mb-1">
          전혜림
        </h1>
        
        <p className="text-sm font-semibold tracking-wide text-violet-600 dark:text-cyan-400 uppercase mb-5">
          Junior Vibe Coder
        </p>

        <p className="text-base md:text-lg text-slate-600 dark:text-zinc-300 leading-relaxed font-normal mb-8 max-w-sm">
          안녕하세요! 바이브 코딩을 배우고 있는 대학생입니다.
        </p>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {["React", "Next.js", "TailwindCSS", "Vibe Coding", "대학생"].map((tag) => (
            <span
              key={tag}
              className="px-3.5 py-1 text-xs font-semibold text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800/50 rounded-full border border-slate-200/30 dark:border-zinc-700/30 transition-all duration-300 hover:scale-105 hover:bg-slate-200/50 dark:hover:bg-zinc-800"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-slate-200/80 dark:bg-zinc-800/80 mb-8" />

        {/* Interactive Vibe Button */}
        <div className="w-full flex flex-col items-center gap-3 mb-6">
          <button
            onClick={handleVibeClick}
            className={`relative px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all duration-300 flex items-center gap-2 select-none active:scale-95 cursor-pointer ${
              isAnimating 
                ? 'bg-cyan-500 text-white scale-95 ring-4 ring-cyan-500/30'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-violet-500/20 hover:-translate-y-0.5'
            }`}
          >
            <svg className={`w-4 h-4 ${isAnimating ? 'animate-bounce' : 'animate-pulse'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            {isAnimating ? 'Vibe Sent! ⚡' : 'Send Vibe'}
          </button>
          
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Received vibes: <span className="font-bold text-violet-600 dark:text-cyan-400">{vibes}</span>
          </p>
        </div>

        {/* Social / Contact Links */}
        <div className="flex justify-center gap-6 mt-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-100 transition-colors"
            title="GitHub"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
            </svg>
          </a>
          <a
            href="mailto:contact@example.com"
            className="text-slate-400 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-100 transition-colors"
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
