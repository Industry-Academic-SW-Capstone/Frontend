export type Screen = 'home' | 'stocks' | 'competitions' | 'rankings' | 'profile';
export type AccountType = 'regular' | 'competition';

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
  id:string;
  ticker: string;
  name: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  date: string;
}

export interface Order {
    id: string;
    ticker: string;
    name: string;
    logo: string;
    type: 'buy' | 'sell';
    orderType: 'market' | 'limit';
    shares: number;
    price?: number;
    status: 'pending';
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
  change: 'up' | 'down' | 'same';
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
  ticker: string;
  name: string;
  description: string;
  currentPrice: number;
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

export type PopularStockCategory = 'gainers' | 'losers' | 'volume';

export interface InvestmentStyleAnalysis {
  personaName: string;
  description: string;
  similarity: number;
  tips: string[];
  radarChartData: { label: string; value: number }[]; // value should be 0 to 100
}

export type NotificationType = 'order_filled' | 'ranking_up' | 'achievement' | 'competition' | 'system';

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
    orderType?: 'buy' | 'sell';
    shares?: number;
    price?: number;
    rankChange?: number;
    achievementId?: string;
    competitionId?: string;
  };
}
