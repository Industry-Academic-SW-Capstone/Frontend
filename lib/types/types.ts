export type Screen =
  | "home"
  | "stocks"
  | "competitions"
  | "rankings"
  | "profile";
export type AccountType = "regular" | "competition";

export interface User {
  username: string;
  avatar: string;
  title: string;
  group: UserGroup;
}

export interface UserGroup {
  id: string;
  name: string;
  averageReturn: number;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  totalValue: number;
  cashBalance: number;
  change: number;
  changePercent: number;
  chartData: ChartDataPoint[];
}

export interface StockHolding {
  ticker: string;
  name: string;
  shares: number;
  currentPrice: number;
  avgPrice: number;
  logo: string;
  todayChangePercent: number;
}

export interface Transaction {
  id: string;
  ticker: string;
  name: string;
  type: "buy" | "sell";
  shares: number;
  price: number;
  date: string;
}

export interface Order {
  id: string;
  ticker: string;
  name: string;
  logo: string;
  type: "buy" | "sell";
  orderType: "market" | "limit";
  shares: number;
  price?: number;
  status: "pending";
  date: string;
}

export interface CompetitionRules {
  startingCapital: number;
  maxInvestmentPerStock: number;
  allowedSectors: string[];
}

export interface Competition {
  id: string;
  name: string;
  description: string;
  participants: number;
  totalPrize: number;
  startDate: string;
  endDate: string;
  isJoined: boolean;
  rules?: CompetitionRules;
  rank?: number;
  returnPercent?: number;
  isAdmin?: boolean; // 현재 사용자가 관리자인지 여부
  creatorId?: string; // 대회 생성자 ID
}

export interface CompetitionParticipant {
  id: string;
  username: string;
  avatar: string;
  joinDate: string;
  currentRank: number;
  totalValue: number;
  returnPercent: number;
  trades: number;
  lastActive: string;
  portfolio: {
    ticker: string;
    shares: number;
    value: number;
  }[];
}

export interface CompetitionLog {
  id: string;
  timestamp: Date;
  type:
    | "join"
    | "leave"
    | "trade"
    | "ranking_change"
    | "setting_change"
    | "announcement";
  userId?: string;
  username?: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface CompetitionAnnouncement {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  isPinned: boolean;
  readBy: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  returnRate: number;
  change: "up" | "down" | "same";
  isRival?: boolean;
}

export interface AIPersonaLeaderboardEntry extends LeaderboardEntry {
  personaName: string;
}
export interface RivalLeaderboardEntry extends LeaderboardEntry {}

export interface ChartDataPoint {
  date: string;
  price: number;
  volume?: number;
}

export interface StockDetail {
  stock_code: string;
  stock_name: string;
  description: string;
  current_price: number;
  todayChange: number;
  todayChangePercent: number;
  marketCap: number;
  peRatio: number;
  shares: number; // shares owned by user
  chartData: {
    day: ChartDataPoint[];
    week: ChartDataPoint[];
    month: ChartDataPoint[];
    year: ChartDataPoint[];
  };
  logo: string;
}

export interface BasicStockInfo {
  ticker: string;
  name: string;
  price: number;
  changePercent: number;
  logo: string;
}

export interface Sector {
  name: string;
  stocks: BasicStockInfo[];
}

export type PopularStockCategory = "gainers" | "losers" | "volume" | "amount";

export interface InvestmentStyleAnalysis {
  personaName: string;
  description: string;
  similarity: number;
  tips: string[];
  radarChartData: { label: string; value: number }[]; // value should be 0 to 100
}

export type NotificationType =
  | "order_filled"
  | "ranking_up"
  | "achievement"
  | "competition"
  | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  metadata?: {
    ticker?: string;
    orderType?: "buy" | "sell";
    shares?: number;
    price?: number;
    rankChange?: number;
    achievementId?: string;
    competitionId?: string;
  };
}

export type MissionDifficulty = "beginner" | "intermediate" | "advanced";
export type MissionStatus = "locked" | "in_progress" | "completed";

export interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: MissionDifficulty;
  status: MissionStatus;
  progress: number;
  maxProgress: number;
  reward: number;
  theme: string;
}

export interface MissionProgress {
  dailyMissionsCompleted: number;
  dailyMissionsTotal: number;
  themeMissions: {
    beginner: { completed: number; total: number };
    intermediate: { completed: number; total: number };
    advanced: { completed: number; total: number };
  };
  currentTheme: string;
}

/**
 * @param stockCode 주식코드
 * @param stockName 주식명
 * @param volume 거래량
 * @param amount 거래대금
 * @param marketType 시장구분 (KOSPI/KOSDAQ)
 * @param currentPrice 현재가
 * @param changeAmount 전일대비 금액
 * @param changeRate 전일대비율
 * @param changeSign 등락 부호
 */
export interface StockInfo {
  stock_code: string;
  stock_name: string;
  volume: number;
  amount: number;
  market_type: "KOSPI" | "KOSDAQ";
  current_price: number;
  change_amount: number;
  change_rate: number;
  change_sign: "+" | "-";
}
