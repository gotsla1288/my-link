"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { links } from "@/data/links";
import {
  BookOpen,
  Briefcase,
  ChevronRight,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

// Custom SVG Icons to avoid Lucide compatibility issues and match the premium theme
const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="9.7 9 9.7 15 14.5 12 9.7 9" />
  </svg>
);

export default function Page() {
  // States
  const [wavesReceived, setWavesReceived] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const storedWaves = localStorage.getItem("waves_hyerim");
      return storedWaves ? parseInt(storedWaves) : 42;
    }
    return 42;
  });
  const [waveAnimating, setWaveAnimating] = useState(false);
  const [waveCompleted, setWaveCompleted] = useState(false);
  const [rippleEffect, setRippleEffect] = useState(false);

  // Wave Action
  const handleSendWave = () => {
    setWaveAnimating(true);
    setRippleEffect(true);
    setWaveCompleted(true);

    const newWaves = wavesReceived + 1;
    setWavesReceived(newWaves);
    localStorage.setItem("waves_hyerim", String(newWaves));

    setTimeout(() => {
      setWaveCompleted(false);
    }, 600);

    setTimeout(() => {
      setRippleEffect(false);
    }, 900);

    setTimeout(() => {
      setWaveAnimating(false);
    }, 400);
  };

  const activeLinks = links
    .filter((link) => link.isActive)
    .sort((a, b) => a.order - b.order);

  const fillPct = Math.min(wavesReceived * 1.8, 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0a1e] via-[#1e1050] to-[#0a0f23] text-zinc-100 flex flex-col relative overflow-hidden transition-colors duration-500">
      {/* Floating Background Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-20 right-10 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />

      {/* Main Container */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10 flex flex-col justify-between">
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 lg:gap-14 items-start">
          {/* LEFT COLUMN: ProfileSidebar */}
          <aside className="lg:sticky lg:top-16 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="absolute inset-0 -m-1 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-500 to-pink-500 opacity-80 blur-[6px] group-hover:scale-105 transition-all duration-300" />
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-[3px] border-zinc-950 bg-zinc-900">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&fit=crop&q=80"
                  alt="전혜림"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <div
                className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-zinc-950 rounded-full shadow-lg"
                title="온라인 상태"
              />
            </div>

            {/* Username & Bio Area */}
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <h1 className="text-3xl font-black tracking-tight text-white">
                  전혜림
                </h1>
              </div>

              <div className="text-sm text-purple-300 font-medium tracking-wide">
                Frontend Developer
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal max-w-sm mx-auto lg:mx-0">
                사용하기 명쾌하고 미학적으로 완성도 높은 인터랙션을 설계합니다 ✨
              </p>
            </div>

            {/* Social Icons Section */}
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <a
                href="https://github.com/hyerim"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-zinc-800/80 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all hover:scale-110"
                title="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/hyerim.jeon"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-zinc-800/80 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all hover:scale-110"
                title="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>

            <hr className="w-24 border-zinc-800/60 my-2 lg:block hidden" />

            {/* CTA Badge */}
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-violet-950/40 border border-violet-500/30 text-purple-200 text-xs font-semibold tracking-wide hover:bg-violet-900/50 shadow-lg shadow-violet-900/20 hover:scale-105 active:scale-[0.98] transition-all animate-pulse"
                style={{
                  boxShadow: "0 0 15px rgba(124, 58, 237, 0.15)",
                }}
              >
                <span>✦ 마이링크로 만들기</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>

          {/* RIGHT COLUMN: ContentPanel */}
          <main className="space-y-6 lg:pb-12">
            {/* Link List */}
            <div className="space-y-4">
              {activeLinks.map((link, idx) => {
                const tintStyles = {
                  github:
                    "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 text-white",
                  blog:
                    "bg-emerald-500/10 border-emerald-500/10 hover:bg-emerald-500/15 hover:border-emerald-500/30 text-emerald-300",
                  portfolio:
                    "bg-purple-500/10 border-purple-500/10 hover:bg-purple-500/15 hover:border-purple-500/30 text-purple-300",
                  instagram:
                    "bg-pink-500/10 border-pink-500/10 hover:bg-pink-500/15 hover:border-pink-500/30 text-pink-300",
                  youtube:
                    "bg-red-500/10 border-red-500/10 hover:bg-red-500/15 hover:border-red-500/30 text-red-300",
                  linkedin:
                    "bg-blue-500/10 border-blue-500/10 hover:bg-blue-500/15 hover:border-blue-500/30 text-blue-300",
                };

                const platformIcons = {
                  github: <GithubIcon className="w-5 h-5" />,
                  blog: <BookOpen className="w-5 h-5" />,
                  portfolio: <Briefcase className="w-5 h-5" />,
                  instagram: <InstagramIcon className="w-5 h-5" />,
                  youtube: <YoutubeIcon className="w-5 h-5" />,
                  linkedin: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  ),
                };

                const platform = link.platform || "portfolio";

                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`group flex items-center justify-between p-4.5 rounded-2xl border backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${tintStyles[platform]}`}
                    style={{
                      animationDelay: `${idx * 70}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-black/30 rounded-xl">
                        {platformIcons[platform]}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-zinc-100 group-hover:text-white tracking-wide">
                          {link.title}
                        </div>
                        {link.description && (
                          <div className="text-xs text-zinc-400 mt-1">
                            {link.description}
                          </div>
                        )}
                        {link.subtitle && (
                          <div className="text-[10px] opacity-45 font-mono mt-0.5">
                            {link.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                  </a>
                );
              })}
            </div>

            {/* WaveWidget */}
            <div className="p-6 rounded-2xl bg-white/5 dark:bg-zinc-900/30 border border-zinc-800/80 backdrop-blur-md shadow-2xl space-y-6">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <span>🌊 파도 보내기</span>
                </h3>
                <p className="text-zinc-400 text-xs mt-1">
                  프로필 소유자에게 힘찬 응원 에너지를 보내주세요!
                </p>
              </div>

              {/* Water tank visual widget */}
              <div className="relative h-32 w-full bg-zinc-950/80 rounded-2xl overflow-hidden border border-zinc-800">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-sky-600/80 via-indigo-600/80 to-sky-400/30 transition-all duration-700 ease-out"
                  style={{
                    height: `${fillPct}%`,
                  }}
                >
                  {/* Wave effect overlay */}
                  <svg
                    className="absolute -top-3 left-0 w-[200%] h-4 fill-sky-400/40 animate-wave-flow"
                    viewBox="0 0 120 28"
                    preserveAspectRatio="none"
                  >
                    <path d="M0 15 Q 30 0, 60 15 T 120 15 L 120 28 L 0 28 Z" />
                  </svg>
                  <svg
                    className="absolute -top-3 left-0 w-[200%] h-4 fill-sky-500/20 animate-wave-flow-slow"
                    viewBox="0 0 120 28"
                    preserveAspectRatio="none"
                    style={{ animationDirection: "reverse" }}
                  >
                    <path d="M0 15 Q 30 25, 60 15 T 120 15 L 120 28 L 0 28 Z" />
                  </svg>
                </div>

                {/* Centered Counter */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none select-none">
                  <span
                    className={`text-5xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] transition-all duration-300 ${
                      waveAnimating
                        ? "scale-125 translate-y-[-4px]"
                        : "scale-100"
                    }`}
                  >
                    {wavesReceived}
                  </span>
                  <span className="text-[10px] font-semibold text-sky-200 uppercase tracking-widest mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    Waves Received
                  </span>
                </div>

                {/* Wave Ripple visual effect */}
                {rippleEffect && (
                  <div className="absolute inset-0 border-[3px] border-sky-400 rounded-2xl animate-ping opacity-50" />
                )}
              </div>

              {/* Action Wave Button */}
              <button
                onClick={handleSendWave}
                className={`w-full py-4.5 rounded-2xl font-bold text-sm tracking-widest text-white shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer ${
                  waveCompleted
                    ? "bg-sky-500"
                    : "bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-400 hover:opacity-95"
                }`}
              >
                <span>
                  {waveCompleted ? "🌊 파도 전송 완료!" : "🌊 파도 보내기"}
                </span>
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-600 border-t border-zinc-800/30">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 MyLink. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-zinc-300">
              대시보드
            </Link>
            <a href="#" className="hover:text-zinc-300">
              이용약관
            </a>
            <a href="#" className="hover:text-zinc-300">
              개인정보처리방침
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
