export interface Link {
  id: string;
  title: string; // 버튼에 노출되는 텍스트 (최대 50자)
  url: string; // http:// 또는 https:// 포함
  icon?: string; // 아이콘 세트에서 선택 (선택)
  description?: string; // 링크 아래 표시되는 서브텍스트 (최대 100자, 선택)
  isActive: boolean; // 공개 프로필에 표시 / 숨김 토글
  order: number; // 드래그 앤 드롭 정렬 순서
  clickCount: number; // 링크 총 클릭 수 (F-08)
}

export const links: Link[] = [
  {
    id: "instagram",
    title: "인스타그램",
    url: "https://www.instagram.com/your_username",
    icon: "instagram",
    description: "일상과 작업물을 공유해요 📸",
    isActive: true,
    order: 0,
    clickCount: 0,
  },
  {
    id: "youtube",
    title: "유튜브",
    url: "https://www.youtube.com/@your_channel",
    icon: "youtube",
    description: "개발 튜토리얼 & 브이로그",
    isActive: true,
    order: 1,
    clickCount: 0,
  },
  {
    id: "blog",
    title: "기술 블로그",
    url: "https://your-blog.tistory.com",
    icon: "blog",
    description: "개발 경험과 학습 기록을 남겨요 ✍️",
    isActive: true,
    order: 2,
    clickCount: 0,
  },
  {
    id: "github",
    title: "GitHub",
    url: "https://github.com/your_username",
    icon: "github",
    description: "오픈소스 프로젝트 & 코드 저장소",
    isActive: true,
    order: 3,
    clickCount: 0,
  },
  {
    id: "portfolio",
    title: "포트폴리오",
    url: "https://your-portfolio.vercel.app",
    icon: "portfolio",
    description: "지금까지 만든 프로젝트를 확인해보세요 🚀",
    isActive: true,
    order: 4,
    clickCount: 0,
  },
];
