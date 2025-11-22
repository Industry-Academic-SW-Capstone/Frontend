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

export interface AccountData {
  accountId: number;
  memberId: number;
  contestId: number;
  accountName: string;
  cash: number;
  holdAmount: number;
  availableCash: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Account {
  id: number;
  memberId: number;
  contestId: number;
  name: string;
  type: AccountType;
  totalValue: number;
  cashBalance: number;
  change: number;
  changePercent: number;
  isDefault: boolean;
  chartData: ChartDataPoint[];
}

export interface AccountAssetHolding extends StockLogoInfo {
  stockName: string;
  quantity: number;
  currentPrice: number;
  averagePrice: number;
  totalValue: number;
}

export interface AccountAssets {
  totalAssets: number;
  cash: number;
  stockValue: number;
  holdings: AccountAssetHolding[];
}

export interface AssetInfo extends AccountAssets {
  totalInvested: number;
  totalProfit: number;
  returnRate: number;
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

export interface Order extends StockLogoInfo {
  id: string;
  stockName: string;
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
  contestId: number;
  contestName: string;
  isDefault: boolean;
  managerMemberId: number;
  startDate: string;
  endDate: string;
  seedMoney: number;
  commissionRate: number;
  minMarketCap: number;
  maxMarketCap: number;
  dailyTradeLimit: number;
  maxHoldingsCount: number;
  buyCooldownMinutes: number;
  sellCooldownMinutes: number;
  createdAt: string;
  updatedAt: string;
  // Optional fields for UI compatibility if needed, or remove if fully replacing
  participants?: number; // Not in API response, might need to fetch separately or remove
  isJoined?: boolean; // Not in API response
  rank?: number; // Not in API response
  returnPercent?: number; // Not in API response
  description?: string; // Not in API response
}

export interface CreateCompetitionRequest {
  contestName: string;
  startDate: string;
  endDate: string;
  seedMoney: number;
  commissionRate: number;
  minMarketCap: number;
  maxMarketCap: number;
  dailyTradeLimit: number;
  maxHoldingsCount: number;
  buyCooldownMinutes: number;
  sellCooldownMinutes: number;
}

export interface JoinCompetitionRequest {
  accountName: string;
}

export interface UpdateCompetitionRequest {
  contestName: string;
  startDate: string;
  endDate: string;
  seedMoney: number;
  commissionRate: number;
  minMarketCap: number;
  maxMarketCap: number;
  dailyTradeLimit: number;
  maxHoldingsCount: number;
  buyCooldownMinutes: number;
  sellCooldownMinutes: number;
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

export type ChangeSign =
  | "FALL"
  | "RISE"
  | "UPPER_LIMIT"
  | "LOWER_LIMIT"
  | "EVEN";

export type OrderType = "amount" | "volume" | "gainers" | "losers";

export interface StockLogoInfo {
  stockCode: string;
  marketType: "KOSPI" | "KOSDAQ";
}

export interface BasicStockInfo extends StockLogoInfo {
  stockName: string;
  currentPrice: number;
  changeRate: number;
  changeSign: ChangeSign;
  changeAmount: number;
}
export interface StockInfo extends BasicStockInfo {
  volume: number;
  amount: number;
}

export interface StockDetailInfo extends StockInfo {
  marketCap: number;
  per: number;
  eps: number;
  pbr: number;
  faceValue: number;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  previousClosePrice: number;
}

export interface IndustriesTopStocks {
  industryCode: string;
  industryName: string;
  stocks: StockInfo[];
}

export interface FavoriteStock {
  favoriteId: number;
  stockCode: string;
  stockName: string;
  addedAt: string; // ISO 날짜 문자열
}

export type PeriodType = "1day" | "1week" | "3month" | "1year" | "5year";

export interface ChartData {
  date: string; // "2025-11-06"
  time?: string; // "09:30:00"
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  volume: number;
  amount: number;
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

export interface OrderBookLevel {
  price: number;
  quantity: number;
}

export interface OrderBookData {
  stock_code: string;
  timestamp: string;
  total_ask_quantity: number;
  total_bid_quantity: number;
  ask_levels: OrderBookLevel[];
  bid_levels: OrderBookLevel[];
  expected_price?: number;
  expected_change_amount?: number;
  expected_change_rate?: number;
  expected_change_sign?: string;
  expected_quantity?: number;
  expected_volume?: number;
  accumulated_volume?: number;
  overtime_total_bid_quantity?: number;
}

export interface RankingEntry {
  rank: number;
  memberId: number;
  nickname: string;
  balance: number;
  returnRate: number;
}

export interface RankingResponse {
  contestId: number;
  contestName: string;
  sortBy: string;
  rankings: RankingEntry[];
  totalParticipants: number;
  lastUpdated: string;
}

export interface MyRankingResponse {
  balanceRank: number;
  returnRateRank: number;
  totalParticipants: number;
  myBalance: number;
  myReturnRate: number;
}

export interface StockSearchResult {
  stockCode: string;
  stockName: string;
  similarity: number;
}
