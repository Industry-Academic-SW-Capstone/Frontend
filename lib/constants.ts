import {
  Account,
  Transaction,
  Competition,
  Achievement,
  LeaderboardEntry,
  User,
  UserGroup,
  AIPersonaLeaderboardEntry,
  RivalLeaderboardEntry,
  Order,
  InvestmentStyleAnalysis,
  Notification,
  Mission,
  MissionProgress,
  BasicStockInfo,
} from "./types/stock";

export const MOCK_USER: User = {
  username: "주린이탈출",
  avatar: "https://picsum.photos/seed/userMe/100",
  title: "주식의 신",
  group: {
    id: "group-hsu",
    name: "한성대학교",
    averageReturn: 18.5,
  },
};

export const MOCK_CASH_BALANCE = 2350000;

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    name: "첫 거래",
    description: "첫 주식 거래 완료",
    unlocked: true,
    icon: "BriefcaseIcon",
  },
  {
    id: "ach-2",
    name: "수익 실현",
    description: "첫 수익 실현",
    unlocked: true,
    icon: "ArrowTrendingUpIcon",
  },
  {
    id: "ach-3",
    name: "포트폴리오 다각화",
    description: "5개 이상의 종목 보유",
    unlocked: true,
    icon: "ChartPieIcon",
  },
  {
    id: "ach-4",
    name: "시드머니 돌파",
    description: "계좌 총액 100만원 돌파",
    unlocked: true,
    icon: "BanknotesIcon",
  },
  {
    id: "ach-5",
    name: "대회 참가",
    description: "수익률 대회 첫 참가",
    unlocked: true,
    icon: "TrophyIcon",
  },
  {
    id: "ach-6",
    name: "커뮤니티 활동가",
    description: "첫 게시글 작성",
    unlocked: false,
    icon: "UsersIcon",
  },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    username: "수익률의마법사",
    avatar: "https://picsum.photos/seed/user1/100",
    returnRate: 152.4,
    change: "same",
    isRival: false,
  },
  {
    rank: 2,
    username: "슈퍼개미",
    avatar: "https://picsum.photos/seed/user2/100",
    returnRate: 148.2,
    change: "up",
    isRival: true,
  },
  {
    rank: 3,
    username: "가치투자자",
    avatar: "https://picsum.photos/seed/user3/100",
    returnRate: 130.1,
    change: "down",
    isRival: false,
  },
  {
    rank: 4,
    username: MOCK_USER.username,
    avatar: MOCK_USER.avatar,
    returnRate: 125.6,
    change: "up",
  },
  {
    rank: 5,
    username: "존버는승리한다",
    avatar: "https://picsum.photos/seed/user5/100",
    returnRate: 110.9,
    change: "same",
    isRival: true,
  },
];

export const MOCK_COMPETITION_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    username: "대회최강자",
    avatar: "https://picsum.photos/seed/comp1/100",
    returnRate: 25.4,
    change: "up",
  },
  {
    rank: 2,
    username: "단타왕",
    avatar: "https://picsum.photos/seed/comp2/100",
    returnRate: 22.1,
    change: "down",
  },
  {
    rank: 12,
    username: MOCK_USER.username,
    avatar: MOCK_USER.avatar,
    returnRate: 15.0,
    change: "up",
  },
];

export const MOCK_AI_LEADERBOARD: AIPersonaLeaderboardEntry[] = [
  {
    rank: 1,
    username: "워렌 버핏 BOT",
    personaName: "가치투자",
    avatar: "https://picsum.photos/seed/ai1/100",
    returnRate: 28.5,
    change: "same",
  },
  {
    rank: 2,
    username: "레이 달리오 BOT",
    personaName: "올웨더",
    avatar: "https://picsum.photos/seed/ai2/100",
    returnRate: 19.2,
    change: "up",
  },
  // FIX: Added missing personaName property for the user's entry.
  {
    rank: 3,
    username: MOCK_USER.username,
    personaName: "나의 투자 스타일",
    avatar: MOCK_USER.avatar,
    returnRate: 15.0,
    change: "up",
  },
  {
    rank: 4,
    username: "캐시 우드 BOT",
    personaName: "혁신성장",
    avatar: "https://picsum.photos/seed/ai3/100",
    returnRate: 12.1,
    change: "down",
  },
];

export const MOCK_RIVAL_LEADERBOARD: RivalLeaderboardEntry[] = [
  {
    rank: 1,
    username: "슈퍼개미",
    avatar: "https://picsum.photos/seed/user2/100",
    returnRate: 148.2,
    change: "up",
  },
  {
    rank: 2,
    username: MOCK_USER.username,
    avatar: MOCK_USER.avatar,
    returnRate: 125.6,
    change: "up",
  },
  {
    rank: 3,
    username: "가치투자자",
    avatar: "https://picsum.photos/seed/user3/100",
    returnRate: 130.1,
    change: "down",
  },
];

export const MOCK_GROUP_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    username: "컴공선배",
    avatar: "https://picsum.photos/seed/hsu1/100",
    returnRate: 35.1,
    change: "up",
  },
  {
    rank: 2,
    username: MOCK_USER.username,
    avatar: MOCK_USER.avatar,
    returnRate: 18.5,
    change: "same",
  },
  {
    rank: 3,
    username: "스마트재무팀장",
    avatar: "https://picsum.photos/seed/hsu2/100",
    returnRate: 15.2,
    change: "down",
  },
];

const generateChartData = (base: number) => {
  let price = base;
  return Array.from({ length: 30 }, (_, i) => {
    price += (Math.random() - 0.5) * (base / 20);
    return {
      date: `D-${30 - i}`,
      price: Math.max(price, 0),
      volume: Math.random() * 100000,
    };
  });
};

export const MOCK_ANALYSIS_RESULT: InvestmentStyleAnalysis = {
  personaName: "가치투자자 워렌 버핏",
  description:
    "저평가된 우량주를 발굴하여 장기 보유하는 경향이 강합니다. 단기적인 시장 변동에 흔들리지 않고 기업의 본질적인 가치에 집중하는 투자 스타일입니다.",
  similarity: 85,
  tips: [
    "시장의 소음보다는 기업의 재무제표와 비즈니스 모델에 집중하세요.",
    "단기적인 손실에 두려워하지 말고, 장기적인 관점을 유지하는 것이 중요합니다.",
    "자신이 완벽하게 이해하는 기업에만 투자하는 원칙을 지키세요.",
  ],
  radarChartData: [
    { label: "안정성", value: 90 },
    { label: "성장성", value: 60 },
    { label: "수익성", value: 80 },
    { label: "가치", value: 95 },
    { label: "모멘텀", value: 30 },
    { label: "분산", value: 70 },
  ],
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    type: "order_filled",
    title: "주문 체결 완료",
    message: "삼성전자 50주 매수 주문이 82,000원에 체결되었습니다.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5분 전
    read: false,
    metadata: {
      ticker: "005930",
      orderType: "buy",
      shares: 50,
      price: 82000,
    },
  },
  {
    id: "notif-2",
    type: "ranking_up",
    title: "랭킹 상승! 🎉",
    message: "축하합니다! 전체 랭킹이 3단계 상승했습니다. (7위 → 4위)",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
    read: false,
    metadata: {
      rankChange: 3,
    },
  },
  {
    id: "notif-3",
    type: "achievement",
    title: "업적 달성",
    message:
      '"포트폴리오 다각화" 업적을 달성했습니다! 5개 이상의 종목을 보유하고 있습니다.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
    read: true,
    metadata: {
      achievementId: "ach-3",
    },
  },
  {
    id: "notif-4",
    type: "competition",
    title: "대회 순위 변동",
    message: "제 1회 스탁앱 수익률 대회에서 15위 → 12위로 상승했습니다!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5시간 전
    read: true,
    metadata: {
      competitionId: "c-1",
    },
  },
  {
    id: "notif-5",
    type: "system",
    title: "시스템 점검 안내",
    message: "내일 오전 2시부터 4시까지 시스템 점검이 예정되어 있습니다.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
    read: true,
  },
];

export const MOCK_MISSIONS: Mission[] = [
  {
    id: "m-1",
    title: "첫 거래 완료",
    description: "주식을 처음 거래해보세요",
    difficulty: "beginner",
    status: "completed",
    progress: 1,
    maxProgress: 1,
    reward: 10000,
    theme: "기본",
  },
  {
    id: "m-2",
    title: "일일 체크인",
    description: "오늘 앱에 접속하기",
    difficulty: "beginner",
    status: "completed",
    progress: 1,
    maxProgress: 1,
    reward: 5000,
    theme: "기본",
  },
  {
    id: "m-3",
    title: "3종목 보유",
    description: "서로 다른 3개의 종목을 보유하세요",
    difficulty: "beginner",
    status: "in_progress",
    progress: 2,
    maxProgress: 3,
    reward: 15000,
    theme: "기본",
  },
  {
    id: "m-4",
    title: "수익 실현",
    description: "주식을 매도하여 수익을 실현하세요",
    difficulty: "intermediate",
    status: "in_progress",
    progress: 0,
    maxProgress: 1,
    reward: 20000,
    theme: "가치투자",
  },
  {
    id: "m-5",
    title: "10% 수익률 달성",
    description: "계좌 수익률 10% 달성하기",
    difficulty: "intermediate",
    status: "locked",
    progress: 0,
    maxProgress: 1,
    reward: 50000,
    theme: "가치투자",
  },
  {
    id: "m-6",
    title: "월간 챌린지",
    description: "한 달 동안 매일 거래하기",
    difficulty: "advanced",
    status: "locked",
    progress: 0,
    maxProgress: 30,
    reward: 100000,
    theme: "가치투자",
  },
];

export const MOCK_MISSION_PROGRESS: MissionProgress = {
  dailyMissionsCompleted: 2,
  dailyMissionsTotal: 3,
  themeMissions: {
    beginner: { completed: 1, total: 3 },
    intermediate: { completed: 0, total: 2 },
    advanced: { completed: 0, total: 1 },
  },
  currentTheme: "가치투자",
};
