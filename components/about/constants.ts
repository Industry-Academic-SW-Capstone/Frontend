import {
  TrendingUp,
  Trophy,
  ShieldCheck,
  Smartphone,
  Users,
  BarChart3,
  Zap,
  Box,
} from "lucide-react";
import { Feature, TeamMember, NavItem } from "./types";

export const NAV_ITEMS: NavItem[] = [
  { label: "홈", href: "/about#home" },
  { label: "특징", href: "/about#features" },
  { label: "기술 스택", href: "/about/tech" },
  { label: "블로그", href: "/about/blog" },
  { label: "이벤트", href: "/about/event" },
  { label: "공지사항", href: "/about/announce" },
  { label: "팀 소개", href: "/about#team" },
];

export const FEATURES: Feature[] = [
  {
    title: "실전 같은 모의투자",
    description:
      "실제 주식 시장 데이터를 기반으로 리스크 없이 투자 실력을 키우세요. 가상의 자산으로 대담하게 전략을 실험해볼 수 있습니다.",
    icon: TrendingUp,
  },
  {
    title: "주식 투자 대회",
    description:
      "매주 열리는 주식 대회에 참여하여 다른 유저들과 수익률을 경쟁하세요. 상위 랭커에게는 특별한 뱃지가 부여됩니다.",
    icon: Trophy,
  },
  {
    title: "초보자 맞춤 가이드",
    description:
      "어려운 용어는 그만! 주식 초보자도 쉽게 이해할 수 있는 직관적인 UI와 용어 설명을 제공합니다.",
    icon: ShieldCheck,
  },
  {
    title: "모바일 최적화",
    description:
      "PWA 기술을 적용하여 앱스토어 다운로드 없이도 네이티브 앱처럼 부드럽고 빠른 경험을 제공합니다.",
    icon: Smartphone,
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "최재현",
    role: "LLMOps, Backend",
    description:
      "Team GRIT의 리더로서 스톡잇의 AI 모델 개발과 클라우드 DevOps 및 CI/CD, 랭킹기능을 개발을 담당하고 있습니다.",
    image:
      "https://img.seoul.co.kr/img/upload/2015/07/02/SSI_20150702155500.jpg",
    github: "https://github.com/MacArthur17",
  },
  {
    name: "김환희",
    role: "DevOps, Backend",
    description:
      "실시간 종목 데이터 처리와 체결로직, 소켓 기능과 Firebase 알림을 맡아 개발하고 있습니다.",
    image:
      "https://item.kakaocdn.net/do/dd0984cf971dd8ac6f8909775b7e8cd7617ea012db208c18f6e83b1a90a7baa7",
    github: "https://github.com/hwanh2",
  },
  {
    name: "김지훈",
    role: "UI/UX, Frontend",
    description:
      "누구나 사용할 수 있는 캐주얼한 UI와, 빠르고 신속하며 신뢰성 있는 웹앱을 개발합니다.",
    image: "https://avatars.githubusercontent.com/u/40907210?s=96&v=4",
    github: "https://github.com/urous3814",
    linkedIn: "https://www.linkedin.com/in/urous3814/",
    email: "mailto:urous3814@gmail.com",
  },
  {
    name: "변정원",
    role: "Backend",
    description: "유저와 계정, 인증에 관한 로직과 API들을 개발하고있습니다.",
    image: "https://avatars.githubusercontent.com/u/185999086?s=96&v=4",
    github: "https://github.com/Yeeyahou",
  },
  {
    name: "나준선",
    role: "Backend",
    description:
      "미션과 업적, 칭호 등 게이미피케이션 요소의 기획과 개발을 담당하고 있습니다.",
    image: "https://avatars.githubusercontent.com/u/91936830?s=96&v=4",
    github: "https://github.com/junsunna",
  },
];

export const MOCK_CHART_DATA = [
  { name: "1월", value: 4000 },
  { name: "2월", value: 3000 },
  { name: "3월", value: 2000 },
  { name: "4월", value: 2780 },
  { name: "5월", value: 1890 },
  { name: "6월", value: 2390 },
  { name: "7월", value: 3490 },
  { name: "8월", value: 4200 },
  { name: "9월", value: 5100 },
  { name: "10월", value: 4800 },
  { name: "11월", value: 5600 },
  { name: "12월", value: 6200 },
];

export const MOCK_USER_INFO = {
  name: "김스톡",
  email: "stockit@example.com",
};

export const MOCK_ASSETS = {
  totalAssets: 12450000,
  totalInvested: 10000000,
  currentStockValue: 11500000,
  cashBalance: 950000,
};

export const MOCK_FAVORITE_STOCKS = [
  {
    stockCode: "005930",
    stockName: "삼성전자",
    currentPrice: 72500,
    changeRate: 1.2,
    logo: "https://ssl.pstatic.net/imgfinance/chart/mobile/mini/005930.png",
  },
  {
    stockCode: "035420",
    stockName: "NAVER",
    currentPrice: 215000,
    changeRate: -0.5,
    logo: "https://ssl.pstatic.net/imgfinance/chart/mobile/mini/035420.png",
  },
  {
    stockCode: "035720",
    stockName: "카카오",
    currentPrice: 54300,
    changeRate: 2.1,
    logo: "https://ssl.pstatic.net/imgfinance/chart/mobile/mini/035720.png",
  },
];

export const MOCK_PENDING_ORDERS = [
  {
    orderId: 1,
    stockName: "삼성전자",
    orderMethod: "BUY",
    price: 72000,
    remainingQuantity: 10,
  },
  {
    orderId: 2,
    stockName: "SK하이닉스",
    orderMethod: "SELL",
    price: 130000,
    remainingQuantity: 5,
  },
];

export const MOCK_RANKINGS = [
  { rank: 1, nickname: "워렌버핏", balance: 150000000 },
  { rank: 2, nickname: "찰리멍거", balance: 120000000 },
  { rank: 3, nickname: "피터린치", balance: 90000000 },
];

export const MOCK_MY_RANKING = {
  rank: 15,
  nickname: "김스톡",
  balance: 12450000,
  returnRate: 24.5,
};

export const MOCK_COMPETITION = {
  contestId: 1,
  contestName: "제 1회 스톡잇 실전투자대회",
  startDate: "2024-01-01",
  endDate: "2024-01-31",
  status: "PROCEEDING",
  rank: 15,
  returnPercent: 24.5,
};

export const TECH_STACK: import("./types").TechStackItem[] = [
  // Frontend
  {
    name: "Next.js 14",
    description: "App Router 기반의 서버 사이드 렌더링 및 SEO 최적화",
    icon: Smartphone,
    category: "Frontend",
    reason:
      "초기 로딩 속도(LCP)를 개선하고, 검색 엔진 최적화(SEO)를 위해 선택했습니다. Vercel과의 완벽한 호환성으로 배포 파이프라인을 간소화할 수 있었습니다.",
    usage:
      "App Router를 사용하여 페이지별 라우팅을 처리하고, 서버 컴포넌트와 클라이언트 컴포넌트를 분리하여 렌더링 성능을 최적화했습니다.",
  },
  {
    name: "TypeScript",
    description: "정적 타입 시스템을 통한 안정적인 개발 경험 제공",
    icon: ShieldCheck,
    category: "Frontend",
    reason:
      "금융 데이터의 복잡한 타입을 안전하게 처리하고, 런타임 에러를 사전에 방지하기 위해 도입했습니다.",
    usage:
      "API 응답 타입(DTO)을 정의하여 프론트엔드와 백엔드 간의 데이터 계약을 명확히 하고, 컴포넌트 Props 검증에 활용하고 있습니다.",
  },
  {
    name: "React Query",
    description: "서버 상태 관리 및 데이터 캐싱/동기화 최적화",
    icon: BarChart3,
    category: "Frontend",
    reason:
      "실시간으로 변하는 주식 데이터를 효율적으로 관리하고, 불필요한 네트워크 요청을 줄이기 위해 사용했습니다.",
    usage:
      "주식 차트 데이터, 사용자 자산 정보 등 서버에서 가져오는 모든 비동기 데이터를 관리하며, staleTime 설정을 통해 캐싱 전략을 구현했습니다.",
  },
  {
    name: "Zustand",
    description: "가볍고 직관적인 전역 상태 관리 라이브러리",
    icon: Users,
    category: "Frontend",
    reason:
      "Redux의 복잡한 보일러플레이트 없이 간단하게 클라이언트 전역 상태를 관리하기 위해 선택했습니다.",
    usage:
      "다크 모드 설정, 사용자 인증 토큰, 모달 상태 등 UI와 관련된 전역 상태를 관리하는 데 사용하고 있습니다.",
  },
  {
    name: "Tailwind CSS",
    description: "Utility-first 접근 방식의 신속한 UI 스타일링",
    icon: TrendingUp,
    category: "Frontend",
    reason:
      "일관된 디자인 시스템을 빠르게 적용하고, 클래스명 고민 없이 생산성을 높이기 위해 도입했습니다.",
    usage:
      "반응형 디자인, 다크 모드 스타일링, 그리고 커스텀 디자인 토큰을 정의하여 프로젝트 전반의 스타일을 관리합니다.",
  },
  {
    name: "Framer Motion",
    description: "선언적이고 강력한 애니메이션 라이브러리",
    icon: Zap,
    category: "Frontend",
    reason:
      "복잡한 CSS 애니메이션을 직관적인 코드로 구현하고, 자연스러운 제스처 인터랙션을 제공하기 위해 사용했습니다.",
    usage:
      "페이지 전환 효과, 스크롤 애니메이션, 그리고 시스템 아키텍처 다이어그램의 데이터 흐름 시각화에 활용되었습니다.",
  },
  // Backend
  {
    name: "Spring Boot",
    description: "안정적인 대규모 트래픽 처리 및 비즈니스 로직 수행",
    icon: ShieldCheck,
    category: "Backend",
  },
  {
    name: "FastAPI",
    description: "고성능 비동기 처리 및 데이터 분석/AI 서비스 전담",
    icon: Zap,
    category: "Backend",
  },
  {
    name: "PostgreSQL",
    description: "복잡한 금융 데이터의 무결성을 보장하는 관계형 데이터베이스",
    icon: BarChart3,
    category: "Backend",
  },
  {
    name: "Redis",
    description: "실시간 랭킹 산정 및 고속 데이터 캐싱",
    icon: TrendingUp,
    category: "Backend",
  },
  // DevOps & Analytics
  {
    name: "Vercel",
    description: "Frontend 배포 자동화 및 Edge Network 호스팅",
    icon: Box,
    category: "DevOps",
  },
  {
    name: "Docker",
    description: "컨테이너 기반의 일관된 개발 및 배포 환경 구축",
    icon: Box,
    category: "DevOps",
  },
  {
    name: "PostHog",
    description: "사용자 행동 분석 및 제품 데이터 인사이트 도출",
    icon: BarChart3,
    category: "Analytics",
  },
  {
    name: "Sentry",
    description: "실시간 에러 트래킹 및 성능 모니터링",
    icon: ShieldCheck,
    category: "Analytics",
  },
  // Security
  {
    name: "Iron Session",
    description: "암호화된 쿠키 기반의 안전한 세션 관리",
    icon: ShieldCheck,
    category: "Security",
  },
  {
    name: "SimpleWebAuthn",
    description: "Passkey 기반의 생체 인증 시스템 구현",
    icon: ShieldCheck,
    category: "Security",
  },
  {
    name: "Firebase FCM",
    description: "크로스 플랫폼 푸시 알림 서비스",
    icon: Smartphone,
    category: "Infrastructure",
  },
];

export const BLOG_POSTS: import("./types").BlogPost[] = [
  {
    id: 1,
    title: "Next.js 14로 마이그레이션하며 얻은 성능 개선 경험",
    excerpt:
      "App Router 도입으로 LCP를 1.2초 단축하고, 번들 사이즈를 30% 줄인 과정을 공유합니다.",
    date: "2024. 03. 15",
    author: "김환희",
    category: "Engineering",
    readTime: "5 min read",
    image: "https://picsum.photos/800/400?random=10",
  },
  {
    id: 2,
    title: "실시간 주식 차트, 어떻게 끊김 없이 그릴까?",
    excerpt:
      "WebSocket과 Canvas API를 활용하여 초당 60프레임의 부드러운 차트를 구현한 노하우.",
    date: "2024. 03. 10",
    author: "김지훈",
    category: "Frontend",
    readTime: "8 min read",
    image: "https://picsum.photos/800/400?random=11",
  },
  {
    id: 3,
    title: "주식 초보자가 가장 많이 하는 실수 5가지",
    excerpt:
      "스톡잇 데이터 분석 결과, 수익률 하위 10% 유저들의 공통적인 패턴을 발견했습니다.",
    date: "2024. 03. 05",
    author: "최재현",
    category: "Insight",
    readTime: "4 min read",
    image: "https://picsum.photos/800/400?random=12",
  },
];

export const ANNOUNCEMENTS: import("./types").Announcement[] = [
  {
    id: 1,
    title: "🎉 스톡잇 정식 서비스 런칭 안내",
    content:
      "오랜 베타 테스트를 마치고 드디어 스톡잇이 정식 런칭했습니다. 지금 바로 앱을 설치하고 투자 대회를 시작해보세요!",
    date: "2024. 03. 01",
    type: "NOTICE",
  },
  {
    id: 2,
    title: "⚡️ 서버 점검 안내 (03/20 02:00 ~ 04:00)",
    content:
      "더 안정적인 서비스를 위해 서버 증설 작업이 진행될 예정입니다. 작업 시간 동안 서비스 이용이 제한됩니다.",
    date: "2024. 03. 18",
    type: "MAINTENANCE",
  },
  {
    id: 3,
    title: "🏆 제 1회 스톡잇 실전투자대회 개최",
    content:
      "총 상금 1,000만원! 수익률 1위에 도전하세요. 참가 신청은 3월 25일까지 가능합니다.",
    date: "2024. 03. 10",
    type: "EVENT",
  },
];

export const SYSTEM_ARCHITECTURE: import("./types").SystemArchitectureItem[] = [
  {
    name: "Frontend (Vercel)",
    description: "Next.js & React Native Client",
    icon: Smartphone,
  },
  {
    name: "Core Server (Spring Boot)",
    description: "Business Logic, Auth, Redis, Monitoring",
    icon: ShieldCheck,
  },
  {
    name: "Data Server (FastAPI)",
    description: "AI Analysis, Data Processing",
    icon: Zap,
  },
  {
    name: "Database (PostgreSQL)",
    description: "Primary Data Storage",
    icon: BarChart3,
  },
];

export const DEV_ENVIRONMENT: import("./types").DevEnvironmentItem[] = [
  {
    tool: "VS Code",
    purpose: "통합 개발 환경 (IDE)",
    icon: Smartphone, // Placeholder
    category: "IDE",
  },
  {
    tool: "Git & GitHub",
    purpose: "버전 관리 및 협업",
    icon: ShieldCheck, // Placeholder
    category: "Version Control",
  },
  {
    tool: "Vercel",
    purpose: "자동화된 배포 및 호스팅",
    icon: TrendingUp, // Placeholder
    category: "Deployment",
  },
  {
    tool: "Slack",
    purpose: "팀 커뮤니케이션",
    icon: Users, // Placeholder
    category: "Communication",
  },
];

export const SERVER_LOGIC: import("./types").ServerLogicItem[] = [
  {
    title: "주식 매수/매도 체결",
    description: "실시간 호가 데이터를 기반으로 즉시 체결 또는 예약 주문 처리",
    steps: [
      "사용자 주문 요청 수신",
      "가용 예수금/잔고 확인",
      "현재가와 주문가 비교",
      "체결 처리 및 잔고 업데이트",
      "거래 내역 기록",
    ],
    icon: TrendingUp,
  },
  {
    title: "일일 미션 시스템",
    description: "사용자 활동에 따른 미션 달성 여부 실시간 체크",
    steps: [
      "사용자 액션(로그인, 매매 등) 감지",
      "진행 중인 미션 조건 확인",
      "조건 달성 시 미션 상태 업데이트",
      "보상 지급 및 알림 발송",
    ],
    icon: Trophy,
  },
  {
    title: "랭킹 산정 로직",
    description: "전체 사용자의 수익률을 실시간/일간으로 집계하여 랭킹 산정",
    steps: [
      "전체 사용자 자산 가치 계산",
      "초기 자산 대비 수익률 계산",
      "수익률 기준 정렬",
      "랭킹 데이터 캐싱 (Redis)",
    ],
    icon: BarChart3,
  },
];
