export interface Link {
  id: string;
  title: string; // 버튼에 노출되는 텍스트 (최대 50자)
  url: string; // http:// 또는 https:// 포함
  icon?: string; // 아이콘 세트에서 선택 (선택)
  description?: string; // 링크 아래 표시되는 서브텍스트 (최대 100자, 선택)
  isActive: boolean; // 공개 프로필에 표시 / 숨김 토글
  order: number; // 드래그 앤 드롭 정렬 순서
  clickCount: number; // 링크 총 클릭 수 (F-08)
  subtitle?: string; // 링크 카드 하단에 표시되는 부제목 (선택)
  platform?: "github" | "blog" | "linkedin" | "portfolio" | "instagram" | "youtube"; // 플랫폼 구분 (선택)
}

export const links: Link[] = [
  {
    id: "instagram",
    title: "인스타그램",
    url: "https://www.instagram.com/hyerim.jeon",
    icon: "instagram",
    description: "일상과 사이드 프로젝트 작업 기록을 공유합니다 📸",
    isActive: true,
    order: 0,
    clickCount: 0,
    subtitle: "instagram.com/hyerim.jeon",
    platform: "instagram",
  },
  {
    id: "youtube",
    title: "유튜브",
    url: "https://www.youtube.com/@hyerim_dev",
    icon: "youtube",
    description: "인터랙티브 웹 퍼포먼스 및 UI 가이드 영상 🎥",
    isActive: true,
    order: 1,
    clickCount: 0,
    subtitle: "youtube.com/@hyerim_dev",
    platform: "youtube",
  },
  {
    id: "blog",
    title: "기술 블로그",
    url: "https://velog.io/@hyerim",
    icon: "blog",
    description: "깊이 있는 프론트엔드 개념과 시행착오를 기록합니다 ✍️",
    isActive: true,
    order: 2,
    clickCount: 0,
    subtitle: "velog.io/@hyerim",
    platform: "blog",
  },
  {
    id: "github",
    title: "GitHub",
    url: "https://github.com/hyerim",
    icon: "github",
    description: "개발 중인 오픈소스 라이브러리와 개인 프로젝트 🚀",
    isActive: true,
    order: 3,
    clickCount: 0,
    subtitle: "github.com/hyerim",
    platform: "github",
  },
  {
    id: "portfolio",
    title: "포트폴리오",
    url: "https://hyerim.dev",
    icon: "portfolio",
    description: "저의 약력과 지금까지의 프로젝트 상세 아카이브 ✨",
    isActive: true,
    order: 4,
    clickCount: 0,
    subtitle: "hyerim.dev",
    platform: "portfolio",
  },
];
