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

  // 파도 레벨 계산 (최대 100%까지, 한 번 누를 때마다 차오름)
  const waveFillPercentage = Math.min(waves * 5, 100);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8 md:py-16 md:px-8 lg:px-16 transition-colors duration-500 overflow-hidden">
      {/* Decorative Blur Backgrounds (Floating spheres) */}
      <div className="absolute top-12 left-10 w-96 h-96 rounded-full bg-blue-400/20 dark:bg-blue-900/10 blur-3xl pointer-events-none animate-orb-1" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-cyan-400/20 dark:bg-cyan-900/10 blur-3xl pointer-events-none animate-orb-2" />
      <div className="absolute top-1/2 left-2/3 -translate-x-1/2 w-80 h-80 rounded-full bg-sky-300/15 dark:bg-sky-900/5 blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-indigo-300/15 dark:bg-indigo-900/5 blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: '3s' }} />

      {/* Main Grid Wrapper */}
      <div className="relative max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 z-10">
        
        {/* 1. Hero & About Card */}
        <div className="lg:col-span-7 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/50 dark:border-slate-800/40 rounded-3xl p-8 md:p-10 flex flex-col justify-between shadow-glass transition-all duration-500 hover:shadow-glass-strong">
          <div>
            {/* Sparkle Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100/50 dark:border-blue-900/30 text-blue-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-6">
              <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              시원한 솔루션을 만드는 코더 🌊
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-6">
              바다처럼 깊고,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 dark:from-blue-400 dark:via-sky-300 dark:to-cyan-300">파도처럼 역동적인</span><br />
              코드를 작성합니다.
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-xl">
              안녕하세요! 프론트엔드 개발자 전혜림입니다. 사용하기 명쾌하고 미학적으로 완성도 높은 인터랙션을 효율적인 코드로 설계하는 과정에서 큰 보람을 느낍니다. 매 순간 배움의 파도 위에서 성장을 멈추지 않는 개발자가 되기 위해 노력하고 있습니다.
            </p>
          </div>

          {/* Mini Profile Info Row */}
          <div className="flex items-center gap-4 mt-10 pt-6 border-t border-slate-200/40 dark:border-slate-800/40">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-sky-400 rounded-full blur opacity-50 group-hover:opacity-80 transition duration-300" />
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-sky-50 to-blue-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center overflow-hidden border border-white dark:border-slate-950">
                <svg className="w-7 h-7 text-blue-500 dark:text-sky-400 animate-wave-float" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5a3 3 0 0 0-3 3" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">전혜림</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">React & Next.js Developer</p>
            </div>
          </div>
        </div>

        {/* 2. Interactive Wave Widget */}
        <div className="lg:col-span-5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/50 dark:border-slate-800/40 rounded-3xl p-8 md:p-10 flex flex-col justify-between shadow-glass transition-all duration-500 hover:shadow-glass-strong relative overflow-hidden">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-2">파도 보내기 🌊</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal mb-6">
              전혜림 개발자에게 청량한 에너지를 전송해 주세요. 파도가 쌓이면 내부 수조 게이지가 차오릅니다.
            </p>
          </div>

          {/* Interactive visual gauge */}
          <div className="relative w-full bg-sky-50/50 dark:bg-slate-950/40 rounded-2xl h-44 overflow-hidden border border-sky-100/30 dark:border-sky-900/20 shadow-inner flex flex-col items-center justify-center mb-6">
            {/* Water Wave Fill */}
            <div 
              className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-600/30 via-sky-500/20 to-transparent transition-all duration-700 ease-out"
              style={{ height: `${waveFillPercentage}%` }}
            />
            {/* Floating ripples inside */}
            {waves > 0 && (
              <div className="absolute inset-x-0 bottom-0 h-4 bg-sky-400/20 animate-pulse pointer-events-none" style={{ bottom: `${waveFillPercentage - 2}%` }} />
            )}
            
            <div className="z-10 text-center">
              <span className="text-4xl md:text-5xl font-black text-blue-600 dark:text-sky-300 tracking-tight transition-all duration-300">
                {waves}
              </span>
              <p className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400 tracking-widest mt-1">
                Waves Received
              </p>
            </div>
          </div>

          <div className="w-full flex flex-col items-center gap-3">
            <button
              onClick={handleWaveClick}
              className={`w-full py-4 rounded-2xl font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 select-none active:scale-95 cursor-pointer ${
                isAnimating 
                  ? 'bg-sky-500 text-white scale-95 ring-4 ring-sky-300/50 shadow-sky-500/20'
                  : 'bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-sky-500/20 hover:-translate-y-0.5'
              }`}
            >
              <svg className={`w-4 h-4 ${isAnimating ? 'animate-bounce' : 'animate-pulse'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              {isAnimating ? '파도 전송 완료! 🌊' : '파도 보내기 🌊'}
            </button>
          </div>
        </div>

        {/* 3. Tech Stack Grid Card */}
        <div className="lg:col-span-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/50 dark:border-slate-800/40 rounded-3xl p-8 shadow-glass transition-all duration-500 hover:shadow-glass-strong">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            기술 스택
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "React", desc: "컴포넌트 설계 및 상태 관리", level: "Expert" },
              { name: "Next.js", desc: "RSC 및 SSR 웹 서비스", level: "Intermediate" },
              { name: "TailwindCSS", desc: "반응형 및 커스텀 스타일링", level: "Expert" },
              { name: "TypeScript", desc: "타입 안정성 및 구조 설계", level: "Intermediate" }
            ].map((tech) => (
              <div 
                key={tech.name}
                className="p-5 rounded-2xl bg-white/50 dark:bg-slate-850/40 border border-white/40 dark:border-slate-800/20 flex flex-col justify-between transition-all duration-300 hover:scale-102 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 group"
              >
                <div>
                  <span className="text-xs font-semibold text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md border border-blue-100/30 dark:border-blue-900/20">
                    {tech.level}
                  </span>
                  <h4 className="text-base font-extrabold text-slate-800 dark:text-white mt-3 group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                    {tech.name}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-2">
                  {tech.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Social Links Card */}
        <div className="lg:col-span-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/50 dark:border-slate-800/40 rounded-3xl p-8 shadow-glass transition-all duration-500 hover:shadow-glass-strong flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              네트워크 연결
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal mb-6">
              프로젝트 협업 제안 및 문의는 아래 채널을 이용해 연락해 주세요.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/30 border border-white/30 dark:border-slate-850/30 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 transition-colors"
            >
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
              </svg>
              GitHub 리포지토리 방문
            </a>
            <a
              href="mailto:contact@example.com"
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/30 border border-white/30 dark:border-slate-850/30 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 transition-colors"
            >
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              이메일로 문의 남기기
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
