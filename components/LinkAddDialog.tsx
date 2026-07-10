"use client";

import { useState } from "react";
import { X, AlertCircle, BookOpen, Briefcase, Plus, Loader2 } from "lucide-react";
import { Link as LinkType } from "@/data/links";

// Custom SVG Icons to match page.tsx
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

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface LinkAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newLink: Omit<LinkType, "id" | "order" | "clickCount">) => Promise<void> | void;
  existingUrls?: string[];
}

type PlatformType = "github" | "blog" | "linkedin" | "portfolio" | "instagram" | "youtube";

export default function LinkAddDialog({ isOpen, onClose, onAdd, existingUrls = [] }: LinkAddDialogProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState<PlatformType>("portfolio");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});
  const [isPending, setIsPending] = useState(false);

  if (!isOpen) return null;

  // URL 포맷 정규화 비교 함수 (대소문자 무시, 공백 제거, 끝부분의 '/' 제거)
  const cleanUrl = (u: string) => {
    return u.trim().toLowerCase().replace(/\/$/, "");
  };

  // 실시간 URL 중복 여부 검사
  const isDuplicateUrl =
    url.trim() !== "" &&
    existingUrls.some((existing) => cleanUrl(existing) === cleanUrl(url));

  const platforms: { value: PlatformType; label: string; icon: React.ReactNode; color: string }[] = [
    { value: "portfolio", label: "포트폴리오", icon: <Briefcase className="w-4 h-4" />, color: "border-purple-500/30 text-purple-300 bg-purple-500/10" },
    { value: "github", label: "GitHub", icon: <GithubIcon className="w-4 h-4" />, color: "border-white/20 text-white bg-white/5" },
    { value: "blog", label: "블로그", icon: <BookOpen className="w-4 h-4" />, color: "border-emerald-500/30 text-emerald-300 bg-emerald-500/10" },
    { value: "linkedin", label: "LinkedIn", icon: <LinkedinIcon className="w-4 h-4" />, color: "border-blue-500/30 text-blue-300 bg-blue-500/10" },
    { value: "instagram", label: "인스타그램", icon: <InstagramIcon className="w-4 h-4" />, color: "border-pink-500/30 text-pink-300 bg-pink-500/10" },
    { value: "youtube", label: "YouTube", icon: <YoutubeIcon className="w-4 h-4" />, color: "border-red-500/30 text-red-300 bg-red-500/10" },
  ];

  const validate = () => {
    const newErrors: { title?: string; url?: string } = {};

    if (!title.trim()) {
      newErrors.title = "링크 제목을 입력해주세요.";
    } else if (title.length > 50) {
      newErrors.title = "제목은 최대 50자까지 입력 가능합니다.";
    }

    if (!url.trim()) {
      newErrors.url = "URL을 입력해주세요.";
    } else if (!/^https?:\/\//i.test(url.trim())) {
      newErrors.url = "http:// 또는 https:// 로 시작하는 올바른 URL을 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;
    setIsPending(true);

    // URL에서 호스트 이름을 추출하여 부제목(subtitle)으로 자동 할당
    let subtitle = "";
    try {
      const parsedUrl = new URL(url.trim());
      subtitle = parsedUrl.hostname.replace("www.", "");
    } catch {
      subtitle = url.trim();
    }

    try {
      await onAdd({
        title: title.trim(),
        url: url.trim(),
        description: description.trim() || undefined,
        platform,
        isActive,
        subtitle: subtitle || undefined,
        icon: platform,
      });

      // Reset Form
      setTitle("");
      setUrl("");
      setDescription("");
      setPlatform("portfolio");
      setIsActive(true);
      setErrors({});
      onClose();
    } catch (error) {
      console.error("링크 추가 중 에러 발생:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={() => !isPending && onClose()}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#13112b]/95 border border-zinc-800/80 rounded-2xl p-6 shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-y-auto animate-fade-in-down backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4 mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="p-1.5 bg-violet-600/20 text-violet-400 rounded-lg">
              <Plus className="w-5 h-5" />
            </span>
            새 링크 추가
          </h2>
          <button
            onClick={onClose}
            disabled={isPending}
            className="p-1 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          {/* Title */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                링크 제목 <span className="text-red-400">*</span>
              </label>
              <span className={`text-[10px] font-medium tracking-wide ${title.length > 50 ? "text-red-400 font-bold animate-pulse" : "text-zinc-500"}`}>
                {title.length} / 50
              </span>
            </div>
            <input
              type="text"
              placeholder="예: 내 기술 블로그"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={50}
              className={`w-full px-4 py-2.5 bg-black/40 border ${
                errors.title ? "border-red-500" : "border-zinc-800/80 focus:border-violet-500"
              } rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-all`}
            />
            {errors.title && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.title}
              </p>
            )}
          </div>

          {/* URL */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                URL <span className="text-red-400">*</span>
              </label>
              {isDuplicateUrl && !errors.url && (
                <span className="text-[10px] text-amber-400 font-semibold tracking-wide animate-pulse">
                  ⚠️ 중복된 URL
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={`w-full px-4 py-2.5 bg-black/40 border ${
                errors.url
                  ? "border-red-500"
                  : isDuplicateUrl
                  ? "border-amber-500/80 focus:border-amber-500"
                  : "border-zinc-800/80 focus:border-violet-500"
              } rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-all`}
            />
            {errors.url && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.url}
              </p>
            )}
            {!errors.url && isDuplicateUrl && (
              <p className="mt-1.5 text-xs text-amber-400 flex items-center gap-1 leading-normal">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                이미 등록된 URL입니다. (등록은 가능)
              </p>
            )}
          </div>

          {/* Platform */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              플랫폼 타입
            </label>
            <div className="grid grid-cols-3 gap-2">
              {platforms.map((p) => {
                const isSelected = platform === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPlatform(p.value)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs gap-1.5 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? `${p.color} border-current ring-1 ring-current`
                        : "border-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                    }`}
                  >
                    {p.icon}
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                링크 설명 <span className="text-zinc-600 font-normal">(선택)</span>
              </label>
              <span className={`text-[10px] font-medium tracking-wide ${description.length > 100 ? "text-red-400 font-bold animate-pulse" : "text-zinc-500"}`}>
                {description.length} / 100
              </span>
            </div>
            <textarea
              placeholder="링크에 대한 짤막한 소개를 적어주세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={100}
              rows={2}
              className="w-full px-4 py-2.5 bg-black/40 border border-zinc-800/80 focus:border-violet-500 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Active status toggle */}
          <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-zinc-800/40">
            <div>
              <span className="block text-sm font-semibold text-zinc-200">링크 활성화</span>
              <span className="block text-xs text-zinc-500 mt-0.5">비활성화 시 프로필에 노출되지 않습니다.</span>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                isActive ? "bg-emerald-500" : "bg-zinc-800"
              }`}
            >
              <span
                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-zinc-800/60 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 py-3 text-sm font-semibold text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 border border-zinc-800/80 rounded-xl hover:bg-zinc-900 transition-all cursor-pointer disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-3 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-indigo-900/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-80"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>추가 중...</span>
                </>
              ) : (
                <span>추가하기</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
