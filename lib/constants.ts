import { Account, StockHolding, Transaction, Competition, Achievement, LeaderboardEntry, StockDetail, Sector, User, UserGroup, AIPersonaLeaderboardEntry, RivalLeaderboardEntry, BasicStockInfo, Order, InvestmentStyleAnalysis, Notification } from './types';

export const MOCK_USER: User = {
  username: '주린이탈출',
  avatar: 'https://picsum.photos/seed/userMe/100',
  title: '주식의 신',
  group: {
    id: 'group-hsu',
    name: '한성대학교',
    averageReturn: 18.5,
  }
}

export const MOCK_CASH_BALANCE = 2350000;

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    name: '내 주식 계좌',
    type: 'regular',
    totalValue: 12500000,
    cashBalance: MOCK_CASH_BALANCE,
    change: 250000,
    changePercent: 2.04,
    chartData: [
      { date: '9:00', price: 12250000 },
      { date: '10:00', price: 12300000 },
      { date: '11:00', price: 12450000 },
      { date: '12:00', price: 12400000 },
      { date: '13:00', price: 12550000 },
      { date: '14:00', price: 12500000 },
    ],
  },
  {
    id: 'acc-2',
    name: '제 1회 수익률 대회',
    type: 'competition',
    totalValue: 11500000,
    cashBalance: 1500000,
    change: 150000,
    changePercent: 1.32,
    chartData: [
      { date: '1일차', price: 10000000 },
      { date: '2일차', price: 10500000 },
      { date: '3일차', price: 10800000 },
      { date: '4일차', price: 11200000 },
      { date: '5일차', price: 11350000 },
    ],
  },
];

const generateLogo = (ticker: string, name: string) => `https://avatar.vercel.sh/${ticker}.png?text=${name.substring(0,1)}`;

export const MOCK_STOCK_HOLDINGS: StockHolding[] = [
  { ticker: '005930', name: '삼성전자', shares: 50, currentPrice: 82000, avgPrice: 78000, logo: generateLogo('005930', '삼성전자'), todayChangePercent: 1.5 },
  { ticker: '035720', name: '카카오', shares: 30, currentPrice: 55000, avgPrice: 62000, logo: generateLogo('035720', '카카오'), todayChangePercent: -2.1 },
  { ticker: '035420', name: 'NAVER', shares: 25, currentPrice: 190000, avgPrice: 185000, logo: generateLogo('035420', 'NAVER'), todayChangePercent: 0.8 },
  { ticker: '005380', name: '현대차', shares: 10, currentPrice: 250000, avgPrice: 240000, logo: generateLogo('005380', '현대차'), todayChangePercent: 3.2 },
];

export const MOCK_PENDING_ORDERS: Order[] = [
    { id: 'o-1', ticker: '373220', name: 'LG에너지솔루션', logo: generateLogo('373220', 'LG에너지솔루션'), type: 'buy', orderType: 'limit', shares: 5, price: 380000, status: 'pending', date: '2023-10-26' },
    { id: 'o-2', ticker: '000660', name: 'SK하이닉스', logo: generateLogo('000660', 'SK하이닉스'), type: 'sell', orderType: 'limit', shares: 10, price: 135000, status: 'pending', date: '2023-10-26' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't-1', ticker: '005930', name: '삼성전자', type: 'buy', shares: 20, price: 75000, date: '2023-08-01' },
  { id: 't-2', ticker: '035720', name: '카카오', type: 'buy', shares: 10, price: 65000, date: '2023-08-05' },
  { id: 't-3', ticker: '035420', name: 'NAVER', type: 'buy', shares: 5, price: 180000, date: '2023-08-10' },
  { id: 't-4', ticker: '005930', name: '삼성전자', type: 'sell', shares: 5, price: 80000, date: '2023-08-15' },
];

export const MOCK_COMPETITIONS: Competition[] = [
  { id: 'c-1', name: '제 1회 스탁앱 수익률 대회', description: '최고의 수익률을 달성하고 상금을 차지하세요!', participants: 1250, totalPrize: 10000000, startDate: '2023.10.01', endDate: '2023.10.31', isJoined: true, rank: 12, returnPercent: 15.0 },
  { id: 'c-2', name: '단타의 신 선발전', description: '하루 최고의 수익률을 가리는 단타 대회', participants: 880, totalPrize: 5000000, startDate: '2023.11.01', endDate: '2023.11.01', isJoined: false },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-1', name: '첫 거래', description: '첫 주식 거래 완료', unlocked: true, icon: 'BriefcaseIcon' },
  { id: 'ach-2', name: '수익 실현', description: '첫 수익 실현', unlocked: true, icon: 'ArrowTrendingUpIcon' },
  { id: 'ach-3', name: '포트폴리오 다각화', description: '5개 이상의 종목 보유', unlocked: true, icon: 'ChartPieIcon' },
  { id: 'ach-4', name: '시드머니 돌파', description: '계좌 총액 100만원 돌파', unlocked: true, icon: 'BanknotesIcon' },
  { id: 'ach-5', name: '대회 참가', description: '수익률 대회 첫 참가', unlocked: true, icon: 'TrophyIcon' },
  { id: 'ach-6', name: '커뮤니티 활동가', description: '첫 게시글 작성', unlocked: false, icon: 'UsersIcon' },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, username: '수익률의마법사', avatar: 'https://picsum.photos/seed/user1/100', returnRate: 152.4, change: 'same', isRival: false },
  { rank: 2, username: '슈퍼개미', avatar: 'https://picsum.photos/seed/user2/100', returnRate: 148.2, change: 'up', isRival: true },
  { rank: 3, username: '가치투자자', avatar: 'https://picsum.photos/seed/user3/100', returnRate: 130.1, change: 'down', isRival: false },
  { rank: 4, username: MOCK_USER.username, avatar: MOCK_USER.avatar, returnRate: 125.6, change: 'up' },
  { rank: 5, username: '존버는승리한다', avatar: 'https://picsum.photos/seed/user5/100', returnRate: 110.9, change: 'same', isRival: true },
];

export const MOCK_COMPETITION_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, username: '대회최강자', avatar: 'https://picsum.photos/seed/comp1/100', returnRate: 25.4, change: 'up' },
  { rank: 2, username: '단타왕', avatar: 'https://picsum.photos/seed/comp2/100', returnRate: 22.1, change: 'down' },
  { rank: 12, username: MOCK_USER.username, avatar: MOCK_USER.avatar, returnRate: 15.0, change: 'up' },
];

export const MOCK_AI_LEADERBOARD: AIPersonaLeaderboardEntry[] = [
    { rank: 1, username: '워렌 버핏 BOT', personaName: '가치투자', avatar: 'https://picsum.photos/seed/ai1/100', returnRate: 28.5, change: 'same' },
    { rank: 2, username: '레이 달리오 BOT', personaName: '올웨더', avatar: 'https://picsum.photos/seed/ai2/100', returnRate: 19.2, change: 'up' },
    // FIX: Added missing personaName property for the user's entry.
    { rank: 3, username: MOCK_USER.username, personaName: '나의 투자 스타일', avatar: MOCK_USER.avatar, returnRate: 15.0, change: 'up' },
    { rank: 4, username: '캐시 우드 BOT', personaName: '혁신성장', avatar: 'https://picsum.photos/seed/ai3/100', returnRate: 12.1, change: 'down' },
];

export const MOCK_RIVAL_LEADERBOARD: RivalLeaderboardEntry[] = [
    { rank: 1, username: '슈퍼개미', avatar: 'https://picsum.photos/seed/user2/100', returnRate: 148.2, change: 'up' },
    { rank: 2, username: MOCK_USER.username, avatar: MOCK_USER.avatar, returnRate: 125.6, change: 'up' },
    { rank: 3, username: '가치투자자', avatar: 'https://picsum.photos/seed/user3/100', returnRate: 130.1, change: 'down' },
];

export const MOCK_GROUP_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, username: '컴공선배', avatar: 'https://picsum.photos/seed/hsu1/100', returnRate: 35.1, change: 'up' },
    { rank: 2, username: MOCK_USER.username, avatar: MOCK_USER.avatar, returnRate: 18.5, change: 'same' },
    { rank: 3, username: '스마트재무팀장', avatar: 'https://picsum.photos/seed/hsu2/100', returnRate: 15.2, change: 'down' },
];

const generateChartData = (base: number) => {
    let price = base;
    return Array.from({length: 30}, (_, i) => {
        price += (Math.random() - 0.5) * (base/20);
        return { date: `D-${30-i}`, price: Math.max(price, 0), volume: Math.random() * 100000 }
    });
}

export const MOCK_STOCK_DETAILS: { [key: string]: StockDetail } = {
  '005930': { ticker: '005930', name: '삼성전자', description: '대한민국의 반도체, 전자제품 제조 기업.', currentPrice: 82000, todayChange: 1200, todayChangePercent: 1.5, marketCap: 489000000000000, peRatio: 18.5, shares: 50, logo: generateLogo('005930', '삼성전자'), chartData: { day: generateChartData(82000), week: generateChartData(81000), month: generateChartData(78000), year: generateChartData(70000) }},
  '035720': { ticker: '035720', name: '카카오', description: '대한민국의 IT 기업. 메신저, 포털, 콘텐츠 등 다양한 서비스를 제공.', currentPrice: 55000, todayChange: -1200, todayChangePercent: -2.1, marketCap: 24000000000000, peRatio: 35.2, shares: 30, logo: generateLogo('035720', '카카오'), chartData: { day: generateChartData(55000), week: generateChartData(56000), month: generateChartData(62000), year: generateChartData(50000) }},
  '035420': { ticker: '035420', name: 'NAVER', description: '대한민국의 최대 검색 포털을 운영하는 IT 기업.', currentPrice: 190000, todayChange: 1500, todayChangePercent: 0.8, marketCap: 31000000000000, peRatio: 29.8, shares: 25, logo: generateLogo('035420', 'NAVER'), chartData: { day: generateChartData(190000), week: generateChartData(188000), month: generateChartData(185000), year: generateChartData(200000) }},
  '005380': { ticker: '005380', name: '현대차', description: '대한민국의 대표적인 자동차 제조 기업.', currentPrice: 250000, todayChange: 7800, todayChangePercent: 3.2, marketCap: 52000000000000, peRatio: 6.7, shares: 10, logo: generateLogo('005380', '현대차'), chartData: { day: generateChartData(250000), week: generateChartData(245000), month: generateChartData(240000), year: generateChartData(200000) }},
  '373220': { ticker: '373220', name: 'LG에너지솔루션', description: '전기차 배터리 제조 기업.', currentPrice: 385000, todayChange: 5000, todayChangePercent: 1.3, marketCap: 90000000000000, peRatio: 70.1, shares: 0, logo: generateLogo('373220', 'LG에너지솔루션'), chartData: { day: generateChartData(385000), week: generateChartData(380000), month: generateChartData(400000), year: generateChartData(420000) }},
  '000660': { ticker: '000660', name: 'SK하이닉스', description: '메모리 반도체 제조 기업.', currentPrice: 130000, todayChange: -2000, todayChangePercent: -1.5, marketCap: 94000000000000, peRatio: 22.4, shares: 0, logo: generateLogo('000660', 'SK하이닉스'), chartData: { day: generateChartData(130000), week: generateChartData(132000), month: generateChartData(125000), year: generateChartData(110000) }},
};

const SEMICONDUCTOR_STOCKS: BasicStockInfo[] = [
    { ticker: '005930', name: '삼성전자', price: 82000, changePercent: 1.5, logo: generateLogo('005930', '삼성전자') },
    { ticker: '000660', name: 'SK하이닉스', price: 130000, changePercent: -1.5, logo: generateLogo('000660', 'SK하이닉스') },
];
const PLATFORM_STOCKS: BasicStockInfo[] = [
    { ticker: '035720', name: '카카오', price: 55000, changePercent: -2.1, logo: generateLogo('035720', '카카오') },
    { ticker: '035420', name: 'NAVER', price: 190000, changePercent: 0.8, logo: generateLogo('035420', 'NAVER') },
];
const AUTOMOTIVE_STOCKS: BasicStockInfo[] = [
    { ticker: '005380', name: '현대차', price: 250000, changePercent: 3.2, logo: generateLogo('005380', '현대차') },
    { ticker: '000270', name: '기아', price: 120000, changePercent: 2.5, logo: generateLogo('000270', '기아') },
];
export const MOCK_SECTORS: Sector[] = [
    { name: '반도체', stocks: SEMICONDUCTOR_STOCKS },
    { name: '플랫폼', stocks: PLATFORM_STOCKS },
    { name: '자동차', stocks: AUTOMOTIVE_STOCKS },
];

export const MOCK_FAVORITE_STOCKS: BasicStockInfo[] = [
    { ticker: '005930', name: '삼성전자', price: 82000, changePercent: 1.5, logo: generateLogo('005930', '삼성전자') },
    { ticker: '035720', name: '카카오', price: 55000, changePercent: -2.1, logo: generateLogo('035720', '카카오') },
];

export const MOCK_POPULAR_STOCKS: { [key: string]: BasicStockInfo[] } = {
    gainers: [
        { ticker: '005380', name: '현대차', price: 250000, changePercent: 3.2, logo: generateLogo('005380', '현대차') },
        { ticker: '000270', name: '기아', price: 120000, changePercent: 2.5, logo: generateLogo('000270', '기아') },
        { ticker: '005930', name: '삼성전자', price: 82000, changePercent: 1.5, logo: generateLogo('005930', '삼성전자') },
    ],
    losers: [
        { ticker: '035720', name: '카카오', price: 55000, changePercent: -2.1, logo: generateLogo('035720', '카카오') },
        { ticker: '000660', name: 'SK하이닉스', price: 130000, changePercent: -1.5, logo: generateLogo('000660', 'SK하이닉스') },
    ],
    volume: [
        { ticker: '005930', name: '삼성전자', price: 82000, changePercent: 1.5, logo: generateLogo('005930', '삼성전자') },
        { ticker: '035720', name: '카카오', price: 55000, changePercent: -2.1, logo: generateLogo('035720', '카카오') },
        { ticker: '000660', name: 'SK하이닉스', price: 130000, changePercent: -1.5, logo: generateLogo('000660', 'SK하이닉스') },
    ],
};

export const MOCK_ANALYSIS_RESULT: InvestmentStyleAnalysis = {
    personaName: '가치투자자 워렌 버핏',
    description: '저평가된 우량주를 발굴하여 장기 보유하는 경향이 강합니다. 단기적인 시장 변동에 흔들리지 않고 기업의 본질적인 가치에 집중하는 투자 스타일입니다.',
    similarity: 85,
    tips: [
        '시장의 소음보다는 기업의 재무제표와 비즈니스 모델에 집중하세요.',
        '단기적인 손실에 두려워하지 말고, 장기적인 관점을 유지하는 것이 중요합니다.',
        '자신이 완벽하게 이해하는 기업에만 투자하는 원칙을 지키세요.'
    ],
    radarChartData: [
        { label: '안정성', value: 90 },
        { label: '성장성', value: 60 },
        { label: '수익성', value: 80 },
        { label: '가치', value: 95 },
        { label: '모멘텀', value: 30 },
        { label: '분산', value: 70 },
    ]
};

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'notif-1',
        type: 'order_filled',
        title: '주문 체결 완료',
        message: '삼성전자 50주 매수 주문이 82,000원에 체결되었습니다.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5분 전
        read: false,
        metadata: {
            ticker: '005930',
            orderType: 'buy',
            shares: 50,
            price: 82000,
        }
    },
    {
        id: 'notif-2',
        type: 'ranking_up',
        title: '랭킹 상승! 🎉',
        message: '축하합니다! 전체 랭킹이 3단계 상승했습니다. (7위 → 4위)',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
        read: false,
        metadata: {
            rankChange: 3,
        }
    },
    {
        id: 'notif-3',
        type: 'achievement',
        title: '업적 달성',
        message: '"포트폴리오 다각화" 업적을 달성했습니다! 5개 이상의 종목을 보유하고 있습니다.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
        read: true,
        metadata: {
            achievementId: 'ach-3',
        }
    },
    {
        id: 'notif-4',
        type: 'competition',
        title: '대회 순위 변동',
        message: '제 1회 스탁앱 수익률 대회에서 15위 → 12위로 상승했습니다!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5시간 전
        read: true,
        metadata: {
            competitionId: 'c-1',
        }
    },
    {
        id: 'notif-5',
        type: 'system',
        title: '시스템 점검 안내',
        message: '내일 오전 2시부터 4시까지 시스템 점검이 예정되어 있습니다.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
        read: true,
    }
];
