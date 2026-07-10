"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { links, Link as LinkType } from "@/data/links";
import { db, auth, googleProvider } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import {
  BookOpen,
  Briefcase,
  ChevronRight,
  ExternalLink,
  AlertCircle,
  Plus,
  Pencil,
  Check,
  X,
  Trash2,
  Loader2,
} from "lucide-react";
import LinkAddDialog from "@/components/LinkAddDialog";

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
  const [wavesReceived, setWavesReceived] = useState<number>(42);
  const [waveAnimating, setWaveAnimating] = useState(false);
  const [waveCompleted, setWaveCompleted] = useState(false);
  const [rippleEffect, setRippleEffect] = useState(false);

  const [linkList, setLinkList] = useState<LinkType[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 인라인 편집 상태 추가
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editErrors, setEditErrors] = useState<{ title?: string; url?: string }>({});
  const [isUpdating, setIsUpdating] = useState(false);

  // 삭제 확인 모달 상태 추가
  const [deleteLinkId, setDeleteLinkId] = useState<string | null>(null);
  const [deleteLinkTitle, setDeleteLinkTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // 로그인 상태 및 프로필 정보 상태 추가
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileInfo, setProfileInfo] = useState<{ username: string; bio: string; avatarUrl: string } | null>(null);

  // Firestore로부터 링크 데이터 로드 함수
  const fetchLinks = async (uid: string) => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "users", uid, "links"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedLinks: LinkType[] = [];
      querySnapshot.forEach((doc) => {
        fetchedLinks.push({
          id: doc.id,
          ...doc.data(),
        } as LinkType);
      });

      // 만약 Firestore에 데이터가 없는 경우, 기본 링크 데이터 삽입 (Seed)
      if (fetchedLinks.length === 0) {
        const seedPromises = links.map((link, idx) => {
          const { id, ...dataWithoutId } = link;
          // 인스턴스 정렬 순서 유지를 위해 시간차 적용 (idx가 작을수록 더 최신 시간)
          const seedDate = new Date();
          seedDate.setSeconds(seedDate.getSeconds() - idx * 10);
          return addDoc(collection(db, "users", uid, "links"), {
            ...dataWithoutId,
            createdAt: seedDate.toISOString(),
          });
        });
        await Promise.all(seedPromises);
        
        // 다시 조회
        const reQuerySnapshot = await getDocs(q);
        const reFetchedLinks: LinkType[] = [];
        reQuerySnapshot.forEach((doc) => {
          reFetchedLinks.push({
            id: doc.id,
            ...doc.data(),
          } as LinkType);
        });
        setLinkList(reFetchedLinks);
      } else {
        setLinkList(fetchedLinks);
      }
    } catch (error) {
      console.error("Firestore에서 링크 데이터를 가져오는 중 에러 발생:", error);
      setLinkList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);

    // Firebase Auth 상태 변화 구독
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setProfileInfo({
              username: data.username || currentUser.displayName || "무명 유저",
              bio: data.bio || "나만의 링크 공간입니다. ✨",
              avatarUrl: data.avatarUrl || currentUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&fit=crop&q=80",
            });
            setWavesReceived(data.waves || 42);
          } else {
            // 유저 정보 문서가 없으면 최초 Google 정보를 기반으로 자동 Seed 생성
            const initialProfile = {
              username: currentUser.displayName || "무명 유저",
              displayName: currentUser.email?.split("@")[0] || currentUser.uid.substring(0, 10),
              bio: "나만의 링크 공간입니다. ✨",
              avatarUrl: currentUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&fit=crop&q=80",
              createdAt: new Date().toISOString(),
              waves: 42,
            };
            await setDoc(userDocRef, initialProfile);
            setProfileInfo({
              username: initialProfile.username,
              bio: initialProfile.bio,
              avatarUrl: initialProfile.avatarUrl,
            });
            setWavesReceived(42);
          }
          
          // 링크 데이터 조회
          await fetchLinks(currentUser.uid);
        } catch (error) {
          console.error("사용자 정보 연동 에러:", error);
        }
      } else {
        setUser(null);
        setProfileInfo(null);
        setLinkList([]);
        setIsLoading(false);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddLink = async (newLinkData: Omit<LinkType, "id" | "order" | "clickCount">) => {
    if (!user) return;
    const maxOrder = linkList.length > 0 ? Math.max(...linkList.map((l) => l.order)) : -1;
    const order = maxOrder + 1;
    const createdAt = new Date().toISOString();
    
    const newFirestoreLink = {
      ...newLinkData,
      order,
      clickCount: 0,
      createdAt,
    };

    try {
      await addDoc(collection(db, "users", user.uid, "links"), newFirestoreLink);
      // 변경사항이 있으므로 fetchLinks()를 재호출하여 최신 데이터를 가져옵니다.
      await fetchLinks(user.uid);
    } catch (error) {
      console.error("Firestore에 링크를 추가하는 중 에러 발생:", error);
    }
  };

  // 인라인 편집 시작 핸들러
  const handleStartEdit = (link: LinkType) => {
    setEditingLinkId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
    setEditErrors({});
  };

  // 인라인 편집 취소 핸들러
  const handleCancelEdit = () => {
    setEditingLinkId(null);
    setEditTitle("");
    setEditUrl("");
    setEditErrors({});
  };

  // 인라인 편집 저장 핸들러
  const handleSaveEdit = async (linkId: string) => {
    if (!user) return;
    const newErrors: { title?: string; url?: string } = {};

    if (!editTitle.trim()) {
      newErrors.title = "링크 제목을 입력해주세요.";
    } else if (editTitle.length > 50) {
      newErrors.title = "제목은 최대 50자까지 입력 가능합니다.";
    }

    if (!editUrl.trim()) {
      newErrors.url = "URL을 입력해주세요.";
    } else if (!/^https?:\/\//i.test(editUrl.trim())) {
      newErrors.url = "http:// 또는 https:// 로 시작하는 올바른 URL을 입력해주세요.";
    }

    if (Object.keys(newErrors).length > 0) {
      setEditErrors(newErrors);
      return;
    }

    setIsUpdating(true);

    // URL에서 호스트 이름을 추출하여 부제목(subtitle)으로 자동 할당
    let subtitle = "";
    try {
      const parsedUrl = new URL(editUrl.trim());
      subtitle = parsedUrl.hostname.replace("www.", "");
    } catch {
      subtitle = editUrl.trim();
    }

    try {
      const docRef = doc(db, "users", user.uid, "links", linkId);
      await updateDoc(docRef, {
        title: editTitle.trim(),
        url: editUrl.trim(),
        subtitle: subtitle || undefined,
        updatedAt: new Date().toISOString(),
      });

      // 변경사항이 있으므로 fetchLinks()를 재호출하여 최신 데이터를 가져옵니다.
      await fetchLinks(user.uid);

      setEditingLinkId(null);
      setEditTitle("");
      setEditUrl("");
      setEditErrors({});
    } catch (error) {
      console.error("Firestore 링크 업데이트 중 에러 발생:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // 삭제 확인 모달 열기 핸들러
  const handleConfirmDelete = (linkId: string, title: string) => {
    setDeleteLinkId(linkId);
    setDeleteLinkTitle(title);
  };

  // 삭제 취소 핸들러
  const handleCancelDelete = () => {
    setDeleteLinkId(null);
    setDeleteLinkTitle("");
  };

  // 삭제 실행 핸들러
  const handleExecuteDelete = async () => {
    if (!deleteLinkId || !user) return;
    setIsDeleting(true);

    try {
      const docRef = doc(db, "users", user.uid, "links", deleteLinkId);
      await deleteDoc(docRef);

      // 변경사항이 있으므로 fetchLinks()를 재호출하여 최신 데이터를 가져옵니다.
      await fetchLinks(user.uid);

      // 모달 상태 초기화
      setDeleteLinkId(null);
      setDeleteLinkTitle("");
    } catch (error) {
      console.error("Firestore 링크 삭제 중 에러 발생:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // 구글 소셜 로그인 핸들러
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("구글 로그인 중 에러 발생:", error);
    }
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("로그아웃 중 에러 발생:", error);
    }
  };

  // Wave Action
  const handleSendWave = async () => {
    if (!user) return;
    setWaveAnimating(true);
    setRippleEffect(true);
    setWaveCompleted(true);

    const newWaves = wavesReceived + 1;
    setWavesReceived(newWaves);

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        waves: newWaves,
      });
    } catch (error) {
      console.error("대시보드 파도 수 업데이트 중 에러 발생:", error);
    }

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

  const activeLinks = linkList
    .filter((link) => link.isActive)
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime; // createdAt 최신순(desc) 정렬
    });

  const fillPct = Math.min(wavesReceived * 1.8, 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0a1e] via-[#1e1050] to-[#0a0f23] text-zinc-100 flex flex-col relative overflow-hidden transition-colors duration-500">
      {/* Floating Background Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-20 right-10 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />

      {/* Header GNB */}
      <header className="w-full bg-[#0d0a1e]/60 backdrop-blur-md border-b border-zinc-800/40 sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="p-1.5 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-lg text-white font-black text-xs sm:text-sm tracking-wider shadow-md group-hover:scale-105 transition-all">
              ✦ ML
            </span>
            <span className="font-extrabold text-xs sm:text-sm tracking-widest text-zinc-100 uppercase hidden sm:inline-block">
              MyLink Dashboard
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {!authLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2.5 sm:gap-3 bg-zinc-900/40 border border-zinc-800/80 rounded-full py-1 pl-1.5 pr-3">
                    <img
                      src={user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&fit=crop&q=80"}
                      alt={user.displayName || "User"}
                      className="w-7 h-7 rounded-full border border-zinc-850 object-cover"
                    />
                    <span className="text-[11px] sm:text-xs font-semibold text-zinc-200 hidden sm:inline">
                      {user.displayName}
                    </span>
                    <span className="text-zinc-700 sm:inline hidden">|</span>
                    <button
                      onClick={handleLogout}
                      className="text-[11px] sm:text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="px-4 py-2 bg-gradient-to-tr from-violet-600 to-indigo-600 hover:opacity-95 rounded-full text-[11px] sm:text-xs font-bold text-white shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Google 로그인</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10 flex flex-col justify-center">
        
        {authLoading ? (
          // 로딩 상태 (Premium skeleton)
          <div className="w-full max-w-md mx-auto space-y-8 animate-pulse text-center py-20 bg-white/5 border border-zinc-800/40 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-zinc-800/80 rounded-full" />
              <div className="h-5 w-32 bg-zinc-800/80 rounded" />
              <div className="h-3 w-48 bg-zinc-800/60 rounded" />
            </div>
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
            </div>
          </div>
        ) : !user ? (
          // 비로그인 상태: 설명 문구 및 로그인 유도 카드
          <div className="max-w-md mx-auto w-full py-16 text-center">
            <div className="bg-white/5 border border-zinc-800/80 rounded-3xl p-8 backdrop-blur-md shadow-2xl space-y-8">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-2xl shadow-lg text-white font-bold">
                ✦
              </div>
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">나만의 링크 공간 만들기</h2>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
                  Google 로그인 후 나만의 프로필 링크를 관리하고 다른 사람들과 공유해보세요. ✨
                </p>
              </div>
              
              <button
                onClick={handleLogin}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm tracking-wider transition-all duration-300 active:scale-[0.98] shadow-lg shadow-violet-900/30 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Google 계정으로 로그인하기</span>
              </button>
            </div>
          </div>
        ) : (
          // 로그인한 상태: 대시보드 2컬럼 레이아웃
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 lg:gap-14 items-start w-full">
            {/* LEFT COLUMN: ProfileSidebar */}
            <aside className="lg:sticky lg:top-24 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
              {/* Avatar Section */}
              <div className="relative group">
                <div className="absolute inset-0 -m-1 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-500 to-pink-500 opacity-80 blur-[6px] group-hover:scale-105 transition-all duration-300" />
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-[3px] border-zinc-950 bg-zinc-900">
                  <Image
                    src={profileInfo?.avatarUrl || user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&fit=crop&q=80"}
                    alt={profileInfo?.username || user.displayName || "프로필"}
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
                    {profileInfo?.username || user.displayName || "무명 유저"}
                  </h1>
                </div>

                <div className="text-sm text-purple-300 font-medium tracking-wide">
                  Frontend Developer
                </div>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal max-w-sm mx-auto lg:mx-0">
                  {profileInfo?.bio || "나만의 링크 공간입니다. ✨"}
                </p>
              </div>

              {/* Social Icons Section */}
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-zinc-800/80 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all hover:scale-110"
                  title="GitHub"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
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
                <a
                  href={`/@${profileInfo?.username || user.displayName}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-violet-950/40 border border-violet-500/30 text-purple-200 text-xs font-semibold tracking-wide hover:bg-violet-900/50 shadow-lg shadow-violet-900/20 hover:scale-105 active:scale-[0.98] transition-all animate-pulse cursor-pointer"
                  style={{
                    boxShadow: "0 0 15px rgba(124, 58, 237, 0.15)",
                  }}
                >
                  <span>✦ 내 공개 프로필 보기</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </aside>

            {/* RIGHT COLUMN: ContentPanel */}
            <main className="space-y-6 lg:pb-12 w-full">
              {/* Link List */}
              <div className="space-y-4">
                {isLoading || !isMounted ? (
                  // Premium glassmorphism loading skeleton
                  <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="flex items-center justify-between p-4.5 rounded-2xl border border-zinc-800/40 bg-white/5 backdrop-blur-md"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 bg-zinc-800/80 rounded-xl shrink-0" />
                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-zinc-800/80 rounded" />
                            <div className="h-3 w-48 bg-zinc-800/60 rounded" />
                          </div>
                        </div>
                        <div className="w-4 h-4 bg-zinc-800/40 rounded" />
                      </div>
                    ))}
                  </div>
                ) : (
                  activeLinks.map((link, idx) => {
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

                    if (editingLinkId === link.id) {
                      return (
                        <div
                          key={link.id}
                          className="flex flex-col p-5 rounded-2xl border backdrop-blur-md shadow-lg bg-zinc-950/80 border-zinc-700/50 space-y-4 transition-all duration-300"
                          style={{
                            animationDelay: `${idx * 70}ms`,
                            animationFillMode: "both",
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-black/30 rounded-xl text-zinc-450">
                              {platformIcons[platform]}
                            </div>
                            <span className="text-xs font-semibold text-zinc-450 uppercase tracking-wider">
                              링크 인라인 편집
                            </span>
                          </div>

                          <div className="space-y-3.5">
                            {/* 제목 입력 */}
                            <div>
                              <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                                제목
                              </label>
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="링크 제목"
                                maxLength={50}
                                className={`w-full px-3.5 py-2.5 bg-black/40 border ${
                                  editErrors.title ? "border-red-500" : "border-zinc-800 focus:border-violet-500"
                                } rounded-xl text-sm text-zinc-100 focus:outline-none transition-all`}
                              />
                              {editErrors.title && (
                                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                  {editErrors.title}
                                </p>
                              )}
                            </div>

                            {/* 주소 입력 */}
                            <div>
                              <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                                주소 (URL)
                              </label>
                              <input
                                type="text"
                                value={editUrl}
                                onChange={(e) => setEditUrl(e.target.value)}
                                placeholder="https://example.com"
                                className={`w-full px-3.5 py-2.5 bg-black/40 border ${
                                  editErrors.url ? "border-red-500" : "border-zinc-800 focus:border-violet-500"
                                } rounded-xl text-sm text-zinc-100 focus:outline-none transition-all`}
                              />
                              {editErrors.url && (
                                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                  {editErrors.url}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* 저장 / 취소 버튼 */}
                          <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-zinc-850">
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              disabled={isUpdating}
                              className="px-3.5 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 border border-zinc-800/80 hover:bg-zinc-900 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>취소</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(link.id)}
                              disabled={isUpdating}
                              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:opacity-90 transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{isUpdating ? "저장 중..." : "저장"}</span>
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={link.id}
                        className={`group flex items-center justify-between p-4.5 rounded-2xl border backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${tintStyles[platform]}`}
                        style={{
                          animationDelay: `${idx * 70}ms`,
                          animationFillMode: "both",
                        }}
                      >
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 flex items-center gap-4 cursor-pointer"
                        >
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
                        </a>

                        <div className="flex items-center gap-2">
                          {/* 수정 버튼 (연필 이모티콘 - 항상 표시) */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleStartEdit(link);
                            }}
                            className="p-2 rounded-xl bg-black/35 hover:bg-black/55 text-zinc-300 hover:text-white transition-all duration-300 hover:scale-105 active:scale-[0.95] cursor-pointer border border-zinc-800/40"
                            title="수정"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* 삭제 버튼 (휴지통 이모티콘 - 항상 표시) */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleConfirmDelete(link.id, link.title);
                            }}
                            className="p-2 rounded-xl bg-black/35 hover:bg-red-950/40 hover:border-red-500/30 text-zinc-300 hover:text-red-400 transition-all duration-300 hover:scale-105 active:scale-[0.95] cursor-pointer border border-zinc-800/40"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-zinc-400 hover:text-white transition-all duration-300 hover:scale-105"
                            title="새 창에서 열기"
                          >
                            <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Add Link Trigger Button */}
                <button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="w-full group flex items-center justify-center p-4 rounded-2xl border border-dashed border-zinc-700/60 bg-zinc-900/10 hover:bg-zinc-900/30 hover:border-violet-500/50 hover:text-violet-300 text-zinc-400 font-semibold text-sm tracking-wider backdrop-blur-md transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer gap-2 py-4.5"
                >
                  <Plus className="w-5 h-5" />
                  <span>새 링크 추가하기</span>
                </button>
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
        )}
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

      {/* Add Link Dialog */}
      <LinkAddDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddLink}
        existingUrls={linkList.map((l) => l.url)}
      />

      {/* Delete Confirmation Modal */}
      {deleteLinkId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={handleCancelDelete}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-md bg-[#13112b]/95 border border-zinc-800/80 rounded-2xl p-6 shadow-2xl z-10 flex flex-col animate-fade-in-down backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-zinc-800/60 pb-4 mb-4">
              <span className="p-1.5 bg-red-500/20 text-red-400 rounded-lg">
                <Trash2 className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-white">
                정말 삭제하시겠습니까?
              </h2>
            </div>

            {/* Content */}
            <div className="space-y-3 mb-6">
              <p className="text-sm text-zinc-350 leading-relaxed">
                삭제 대상 링크: <span className="font-bold text-white text-base">&ldquo;{deleteLinkTitle}&rdquo;</span>
              </p>
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-400 font-semibold leading-normal">
                  이 작업은 되돌릴 수 없습니다
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 text-sm font-semibold text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 border border-zinc-800/80 rounded-xl hover:bg-zinc-900 transition-all cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-red-950/20 active:scale-[0.98] cursor-pointer"
              >
                {isDeleting ? "삭제 중..." : "삭제하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
