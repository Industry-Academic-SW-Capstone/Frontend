import {
  TrendingUp,
  Trophy,
  ShieldCheck,
  Smartphone,
  Users,
  BarChart3,
} from "lucide-react";
import { Feature, TeamMember, NavItem } from "./types";

export const NAV_ITEMS: NavItem[] = [
  { label: "홈", href: "#home" },
  { label: "특징", href: "#features" },
  { label: "미리보기", href: "#demo" },
  { label: "팀 소개", href: "#team" },
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
    role: "PM & Backend",
    description:
      "금융 데이터 처리 및 전체 프로젝트 리딩을 담당합니다. 안정적인 서버 운영을 최우선으로 합니다.",
    image: "https://picsum.photos/200/200?random=1",
  },
  {
    name: "김환희",
    role: "Backend",
    description:
      "Next.js를 활용하여 사용자 경험을 극대화하는 직관적인 UI/UX를 설계하고 개발합니다.",
    image: "https://picsum.photos/200/200?random=2",
  },
  {
    name: "김지훈",
    role: "Frontend",
    description:
      "복잡한 금융 데이터를 시각적으로 아름답고 이해하기 쉽게 풀어내는 디자인을 연구합니다.",
    image: "https://picsum.photos/200/200?random=3",
  },
  {
    name: "변정원",
    role: "Backend",
    description:
      "실시간 데이터 파이프라인 구축 및 PWA 최적화를 담당하여 끊김 없는 서비스를 제공합니다.",
    image: "https://picsum.photos/200/200?random=4",
  },
  {
    name: "나준선",
    role: "Backend",
    description:
      "실시간 데이터 파이프라인 구축 및 PWA 최적화를 담당하여 끊김 없는 서비스를 제공합니다.",
    image: "https://picsum.photos/200/200?random=4",
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
