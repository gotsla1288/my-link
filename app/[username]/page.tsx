"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { 
  BookOpen, 
  Briefcase, 
  Camera, 
  ChevronRight, 
  ExternalLink,
  Lock,
  ArrowRight,
  Eye,
  Check,
  AlertCircle
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

// Custom SVG Icons to avoid Lucide compatibility issues
const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
)

const EditIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
)

// Types & Interfaces
interface ProfileData {
  username: string
  displayName: string
  bio: string
  avatarUrl: string
  isOnline: boolean
  waves: number
  links: Array<{
    id: string
    title: string
    url: string
    platform: "github" | "blog" | "linkedin" | "portfolio" | "instagram" | "youtube"
    subtitle?: string
    description?: string
  }>
}

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params)
  const rawUsername = resolvedParams.username
  // @가 붙어있으면 떼어내고 판별
  const displayName = rawUsername.startsWith("%40") 
    ? rawUsername.substring(3) 
    : rawUsername.startsWith("@") 
      ? rawUsername.substring(1) 
      : rawUsername

  const isHyerim = displayName.toLowerCase() === "hyerim"

  // States
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  
  // Wave state
  const [wavesReceived, setWavesReceived] = useState(42)
  const [waveAnimating, setWaveAnimating] = useState(false)
  const [waveCompleted, setWaveCompleted] = useState(false)
  const [rippleEffect, setRippleEffect] = useState(false)

  // Editing state
  const [editingField, setEditingField] = useState<"username" | "bio" | null>(null)
  const [editUsernameVal, setEditUsernameVal] = useState("")
  const [editBioVal, setEditBioVal] = useState("")
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Initialize Data
  useEffect(() => {
    // 1초간 Skeleton UI 표시
    const timer = setTimeout(() => {
      if (isHyerim) {
        // 로컬스토리지에서 기존 프로필 값이나 파도 수를 가져옴
        const storedProfile = localStorage.getItem("profile_hyerim")
        const storedWaves = localStorage.getItem("waves_hyerim")
        
        const defaultProfile: ProfileData = {
          username: "전혜림",
          displayName: "hyerim",
          bio: "사용하기 명쾌하고 미학적으로 완성도 높은 인터랙션을 설계합니다 ✨",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&fit=crop&q=80", // 아름다운 예시 인물 사진
          isOnline: true,
          waves: storedWaves ? parseInt(storedWaves) : 42,
          links: [
            { id: "1", title: "GitHub", url: "https://github.com", platform: "github", subtitle: "github.com/hyerim" },
            { id: "2", title: "기술 블로그", url: "https://velog.io", platform: "blog", subtitle: "velog.io/@hyerim" },
            { id: "3", title: "LinkedIn", url: "https://linkedin.com", platform: "linkedin", subtitle: "linkedin.com/in/hyerim" },
            { id: "4", title: "포트폴리오", url: "https://github.com", platform: "portfolio", subtitle: "hyerim.dev" },
          ]
        }

        if (storedProfile) {
          try {
            const parsed = JSON.parse(storedProfile)
            setProfile({ ...defaultProfile, ...parsed, waves: storedWaves ? parseInt(storedWaves) : parsed.waves })
            setWavesReceived(storedWaves ? parseInt(storedWaves) : parsed.waves)
          } catch (e) {
            setProfile(defaultProfile)
            setWavesReceived(defaultProfile.waves)
          }
        } else {
          setProfile(defaultProfile)
          setWavesReceived(defaultProfile.waves)
        }
      }
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [isHyerim])

  // Save to LocalStorage helper
  const saveProfileData = (updated: Partial<ProfileData>) => {
    if (!profile) return
    const newProfile = { ...profile, ...updated }
    setProfile(newProfile)
    localStorage.setItem("profile_hyerim", JSON.stringify(newProfile))
  }

  // Wave Action
  const handleSendWave = () => {
    if (isOwner) {
      showToast("소유자는 본인 페이지에 파도를 보낼 수 없습니다.")
      return
    }
    
    // 카운터 애니메이션 트리거
    setWaveAnimating(true)
    setRippleEffect(true)
    setWaveCompleted(true)
    
    const newWaves = wavesReceived + 1
    setWavesReceived(newWaves)
    localStorage.setItem("waves_hyerim", String(newWaves))

    // 600ms 뒤 완료 상태 원복
    setTimeout(() => {
      setWaveCompleted(false)
    }, 600)

    // 900ms 뒤 리플 애니메이션 종료
    setTimeout(() => {
      setRippleEffect(false)
    }, 900)

    // 400ms 뒤 bounce 스케일 원복
    setTimeout(() => {
      setWaveAnimating(false)
    }, 400)
  }

  // Inline edit actions
  const startEdit = (field: "username" | "bio") => {
    if (!profile) return
    setEditingField(field)
    if (field === "username") setEditUsernameVal(profile.username)
    if (field === "bio") setEditBioVal(profile.bio)
  }

  const cancelEdit = () => {
    setEditingField(null)
  }

  const saveEdit = (field: "username" | "bio") => {
    if (!profile) return
    if (field === "username") {
      if (!editUsernameVal.trim()) {
        showToast("이름은 비워둘 수 없습니다.")
        return
      }
      if (editUsernameVal.length > 30) {
        showToast("이름은 최대 30자까지 입력 가능합니다.")
        return
      }
      saveProfileData({ username: editUsernameVal })
      showToast("이름이 성공적으로 저장되었습니다.")
    } else if (field === "bio") {
      if (editBioVal.length > 150) {
        showToast("한 줄 소개는 최대 150자까지 입력 가능합니다.")
        return
      }
      saveProfileData({ bio: editBioVal })
      showToast("소개가 성공적으로 저장되었습니다.")
    }
    setEditingField(null)
  }

  const handleAvatarChange = () => {
    if (!profile) return
    // 아바타 랜덤 변경 모사
    const randomAvatars = [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&fit=crop&q=80",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&fit=crop&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&fit=crop&q=80"
    ]
    const currentIdx = randomAvatars.indexOf(profile.avatarUrl)
    let nextIdx = Math.floor(Math.random() * randomAvatars.length)
    if (nextIdx === currentIdx) {
      nextIdx = (nextIdx + 1) % randomAvatars.length
    }
    saveProfileData({ avatarUrl: randomAvatars[nextIdx] })
    showToast("프로필 이미지가 변경되었습니다.")
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // 1. Loading Skeleton Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0a1e] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Floating Blurs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="w-full max-w-md space-y-8 animate-pulse text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-28 h-28 bg-zinc-800 rounded-full" />
            <div className="h-6 w-32 bg-zinc-800 rounded-md" />
            <div className="h-4 w-48 bg-zinc-800 rounded-md" />
          </div>
          <div className="space-y-4">
            <div className="h-14 w-full bg-zinc-800 rounded-2xl" />
            <div className="h-14 w-full bg-zinc-800 rounded-2xl" />
            <div className="h-14 w-full bg-zinc-800 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  // 2. 404 User Not Found Screen
  if (!isHyerim) {
    return (
      <div className="min-h-screen bg-[#0d0a1e] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-sm space-y-6 bg-white/5 dark:bg-zinc-900/40 backdrop-blur-md p-8 rounded-3xl border border-zinc-800/80 shadow-2xl">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center text-3xl">
            🔍
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">페이지를 찾을 수 없습니다</h2>
            <p className="text-zinc-400 text-sm">
              <span className="font-mono text-indigo-400">@{rawUsername}</span> 은 아직 마이링크 프로필 페이지가 없어요.
            </p>
          </div>
          <Link 
            href="/"
            className="block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wider transition-all duration-300 active:scale-95 shadow-md shadow-violet-950"
          >
            ✦ 나도 페이지 만들기
          </Link>
        </div>
      </div>
    )
  }

  const fillPct = Math.min(wavesReceived * 1.8, 100)

  // 3. Render Profile View
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0a1e] via-[#1e1050] to-[#0a0f23] text-zinc-100 flex flex-col relative overflow-hidden transition-colors duration-500">
      
      {/* Floating Background Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-20 right-10 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />

      {/* Top Banner for Owner Mode */}
      {isOwner && (
        <div className="sticky top-0 z-50 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 py-3.5 px-4 flex items-center justify-between text-xs sm:text-sm animate-fade-in-down">
          <div className="flex items-center gap-2 font-medium text-indigo-400">
            <Lock className="w-4 h-4" />
            <span>✏️ 내 페이지 편집 중</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsOwner(false)} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors font-medium cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>미리보기</span>
            </button>
            <Link 
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
            >
              <span>대시보드 →</span>
            </Link>
          </div>
        </div>
      )}

      {/* Floating Switch Role Button (for Demo purposes) */}
      {!isOwner && (
        <div className="fixed top-4 right-4 z-40">
          <button
            onClick={() => setIsOwner(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-lg backdrop-blur-sm transition-all active:scale-95 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>소유자 권한 로그인</span>
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10 flex flex-col justify-between">
        
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: ProfileSidebar */}
          <aside className="lg:sticky lg:top-16 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            
            {/* Avatar Section */}
            <div className="relative group">
              {/* Conic Gradient Glow Ring */}
              <div className="absolute inset-0 -m-1 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-500 to-pink-500 opacity-80 blur-[6px] group-hover:scale-105 transition-all duration-300" />
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-[3px] border-zinc-950 bg-zinc-900">
                <img 
                  src={profile?.avatarUrl} 
                  alt={profile?.username}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Online Indicator Badge */}
              {profile?.isOnline && (
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-zinc-950 rounded-full shadow-lg" title="온라인 상태" />
              )}

              {/* Camera edit overlay for Owner */}
              {isOwner && (
                <button
                  onClick={handleAvatarChange}
                  className="absolute bottom-0 right-7 bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-full border-2 border-zinc-950 cursor-pointer shadow-xl transition-all active:scale-90"
                  title="프로필 이미지 변경"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Username & Bio Area */}
            <div className="space-y-4 w-full">
              {/* Username Field */}
              {editingField === "username" ? (
                <div className="space-y-2 max-w-xs mx-auto lg:mx-0">
                  <input
                    type="text"
                    value={editUsernameVal}
                    onChange={(e) => setEditUsernameVal(e.target.value)}
                    maxLength={30}
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white outline-none focus:border-indigo-500 text-sm font-bold text-center lg:text-left"
                    placeholder="유저네임 입력"
                  />
                  <div className="flex justify-end gap-1.5 text-xs">
                    <button onClick={cancelEdit} className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700">취소</button>
                    <button onClick={() => saveEdit("username")} className="px-2.5 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-500">저장</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center lg:justify-start gap-2 group/title">
                  <h1 className="text-3xl font-black tracking-tight text-white">
                    {profile?.username}
                  </h1>
                  {isOwner && (
                    <button 
                      onClick={() => startEdit("username")} 
                      className="p-1 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                      title="이름 수정"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Title / Role Subtitle */}
              <div className="text-sm text-purple-300 font-medium tracking-wide">
                Frontend Developer
              </div>

              {/* Bio Field */}
              {editingField === "bio" ? (
                <div className="space-y-2 w-full max-w-sm mx-auto lg:mx-0">
                  <textarea
                    value={editBioVal}
                    onChange={(e) => setEditBioVal(e.target.value)}
                    maxLength={150}
                    className="w-full h-24 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs outline-none focus:border-indigo-500 resize-none leading-relaxed"
                    placeholder="소개글을 작성해보세요 (최대 150자)"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] text-zinc-500">{editBioVal.length} / 150자</span>
                    <div className="flex gap-1.5">
                      <button onClick={cancelEdit} className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700">취소</button>
                      <button onClick={() => saveEdit("bio")} className="px-2.5 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-500">저장</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-center lg:justify-start gap-2 max-w-sm mx-auto lg:mx-0 group/bio">
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                    {profile?.bio}
                  </p>
                  {isOwner && (
                    <button 
                      onClick={() => startEdit("bio")} 
                      className="p-1 text-zinc-500 hover:text-white transition-colors cursor-pointer shrink-0 mt-0.5"
                      title="소개글 수정"
                    >
                      <EditIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Social Icons Section */}
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-zinc-800/80 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all hover:scale-110" title="GitHub">
                <GithubIcon className="w-4 h-4" />
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-zinc-800/80 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all hover:scale-110" title="X (Twitter)">
                <span className="text-xs font-bold font-sans">𝕏</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-zinc-800/80 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all hover:scale-110" title="Instagram">
                <span className="text-xs font-bold font-sans">IG</span>
              </a>
            </div>

            <hr className="w-24 border-zinc-800/60 my-2 lg:block hidden" />

            {/* CTA Badge (Pill with purple glow animation) */}
            <div className="pt-2">
              <Link 
                href="/" 
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-violet-950/40 border border-violet-500/30 text-purple-200 text-xs font-semibold tracking-wide hover:bg-violet-900/50 shadow-lg shadow-violet-900/20 hover:scale-105 active:scale-95 transition-all animate-pulse"
                style={{
                  boxShadow: "0 0 15px rgba(124, 58, 237, 0.15)"
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
              {profile?.links.map((link, idx) => {
                // 플랫폼별 유리 틴트 스타일링
                const tintStyles = {
                  github: "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 text-white",
                  blog: "bg-emerald-500/10 border-emerald-500/10 hover:bg-emerald-500/15 hover:border-emerald-500/30 text-emerald-300",
                  linkedin: "bg-blue-500/10 border-blue-500/10 hover:bg-blue-500/15 hover:border-blue-500/30 text-blue-300",
                  portfolio: "bg-purple-500/10 border-purple-500/10 hover:bg-purple-500/15 hover:border-purple-500/30 text-purple-300",
                  instagram: "bg-pink-500/10 border-pink-500/10 hover:bg-pink-500/15 hover:border-pink-500/30 text-pink-300",
                  youtube: "bg-red-500/10 border-red-500/10 hover:bg-red-500/15 hover:border-red-500/30 text-red-300"
                }

                const platformIcons = {
                  github: <GithubIcon className="w-5 h-5" />,
                  blog: <BookOpen className="w-5 h-5" />,
                  linkedin: <LinkedinIcon className="w-5 h-5" />,
                  portfolio: <Briefcase className="w-5 h-5" />,
                  instagram: <InstagramIcon className="w-5 h-5" />,
                  youtube: <YoutubeIcon className="w-5 h-5" />
                }

                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`group flex items-center justify-between p-4.5 rounded-2xl border backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${tintStyles[link.platform]}`}
                    style={{
                      animationDelay: `${idx * 70}ms`,
                      animationFillMode: "both"
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-black/30 rounded-xl">
                        {platformIcons[link.platform]}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-zinc-100 group-hover:text-white tracking-wide">{link.title}</div>
                        <div className="text-[11px] opacity-45 font-mono mt-0.5">{link.subtitle}</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                  </a>
                )
              })}

              {/* Add shortcut Link for Owner */}
              {isOwner && (
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 p-4.5 rounded-2xl border border-dashed border-zinc-800 bg-white/2 hover:bg-white/5 text-zinc-400 hover:text-white transition-all text-xs font-semibold tracking-wider uppercase cursor-pointer"
                >
                  <span>+ 링크 추가 / 순서 정렬 → 대시보드</span>
                </Link>
              )}
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
                
                {/* SVG Water Wave Surface */}
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-sky-600/80 via-indigo-600/80 to-sky-400/30 transition-all duration-700 ease-out"
                  style={{
                    height: `${fillPct}%`
                  }}
                >
                  {/* Wave effect overlay */}
                  <svg className="absolute -top-3 left-0 w-[200%] h-4 fill-sky-400/40 animate-wave-flow" viewBox="0 0 120 28" preserveAspectRatio="none">
                    <path d="M0 15 Q 30 0, 60 15 T 120 15 L 120 28 L 0 28 Z" />
                  </svg>
                  <svg className="absolute -top-3 left-0 w-[200%] h-4 fill-sky-500/20 animate-wave-flow-slow" viewBox="0 0 120 28" preserveAspectRatio="none" style={{ animationDirection: "reverse" }}>
                    <path d="M0 15 Q 30 25, 60 15 T 120 15 L 120 28 L 0 28 Z" />
                  </svg>
                </div>

                {/* Centered Counter */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none select-none">
                  <span className={`text-5xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] transition-all duration-300 ${waveAnimating ? "scale-125 translate-y-[-4px]" : "scale-100"}`}>
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
                <span>{waveCompleted ? "🌊 파도 전송 완료!" : "🌊 파도 보내기"}</span>
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
            <Link href="/" className="hover:text-zinc-300">대시보드</Link>
            <a href="#" className="hover:text-zinc-300">이용약관</a>
            <a href="#" className="hover:text-zinc-300">개인정보처리방침</a>
          </div>
        </div>
      </footer>

      {/* Toast Alert Box */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs shadow-2xl flex items-center gap-2.5 animate-fade-in-up">
          <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
