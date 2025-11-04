// "use client";
// import React, { useState, useEffect } from 'react';

// // Import supporting components
// import ComponentCard from '@/components/design/ComponentCard';
// import UserFlowDiagram from '@/components/design/UserFlowDiagram';

// // Import all icons to display in the library
// import * as Icons from '@/components/icons/Icons';

// // Import app components for mockups
// import StatCard from '@/components/StatCard';
// import CompetitionCard from '@/components/CompetitionCard';
// import InvestmentAnalysisCard from '@/components/InvestmentAnalysisCard';
// import AccountSwitcher from '@/components/AccountSwitcher';
// import StockChart from '@/components/StockChart';
// import PortfolioDonutChart from '@/components/PortfolioDonutChart';
// import RadarChart from '@/components/RadarChart';
// import { LeaderboardEntry } from '@/lib/types';

// // Import screens for mockups
// import CreateCompetitionScreen from './CreateCompetitionScreen';
// import HomeScreen from './HomeScreen';
// import StocksContainerScreen from './StocksContainerScreen';
// import StockDetailScreen from './StockDetailScreen';
// import NotificationsScreen from './NotificationsScreen';


// // Import mock data to populate components
// import { 
//     MOCK_USER, MOCK_ACCOUNTS, MOCK_COMPETITIONS, 
//     MOCK_ANALYSIS_RESULT, MOCK_LEADERBOARD,
//     MOCK_STOCK_DETAILS, MOCK_NOTIFICATIONS
// } from '@/lib/constants';



// // Small realistic mock data for StockChart so the design screen shows a meaningful demo.
// const MOCK_STOCK_CHART_DATA = {
//     day: Array.from({ length: 24 }).map((_, i) => ({ date: `09:${String(i).padStart(2, '0')}`, price: 10000 + Math.round(Math.sin(i / 3) * 200) + i * 5, volume: 1000 + Math.round(Math.random() * 800) })),
//     week: Array.from({ length: 7 }).map((_, i) => ({ date: `Day ${i + 1}`, price: 10000 + i * 50 + Math.round(Math.random() * 150), volume: 5000 + Math.round(Math.random() * 5000) })),
//     month: Array.from({ length: 30 }).map((_, i) => ({ date: `D${i + 1}`, price: 10000 + i * 20 + Math.round(Math.random() * 200), volume: 3000 + Math.round(Math.random() * 4000) })),
//     year: Array.from({ length: 12 }).map((_, i) => ({ date: `${i + 1}월`, price: 10000 + i * 300 + Math.round(Math.random() * 1000), volume: 20000 + Math.round(Math.random() * 20000) })),
// };

// // Some icon bundles may not include every glyph in demo builds. Use any-cast to
// // avoid TypeScript complaints and provide a graceful fallback at runtime.
// const PlusIcon = (Icons as any).PlusIcon ?? null;

// // --- Mock Auth Components for Display ---
// const OAuthButtonsMock: React.FC<{ title: string }> = ({ title }) => (
//     <div className="w-full space-y-3">
//         <div className="relative my-6">
//             <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-border-color" /></div>
//             <div className="relative flex justify-center"><span className="bg-bg-primary px-2 text-sm text-text-secondary">{title}</span></div>
//         </div>
//         <button className="w-full flex items-center justify-center gap-3 py-3 border border-border-color rounded-xl font-semibold hover:bg-border-color/50"><Icons.GoogleIcon className="w-6 h-6" /><span>Google로 계속하기</span></button>
//         <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold bg-[#FEE500] text-[#3C1E1E] hover:bg-opacity-90"><Icons.KakaoIcon className="w-6 h-6" /><span>카카오로 계속하기</span></button>
//         <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold bg-black text-white hover:bg-opacity-90"><Icons.AppleIcon className="w-6 h-6" /><span>Apple로 계속하기</span></button>
//     </div>
// );

// const LoginFormMock: React.FC = () => (
//     <div className="p-6 flex flex-col h-full bg-bg-primary">
//         <div className="mb-8"><h2 className="text-3xl font-bold">다시 오신 것을 환영해요!</h2></div>
//         <div className="space-y-4">
//             <div className="relative"><Icons.EnvelopeIcon className="w-5 h-5 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2"/><input type="email" placeholder="이메일" className="w-full bg-bg-secondary border-2 border-border-color rounded-lg p-3.5 pl-11"/></div>
//             <div className="relative"><Icons.KeyIcon className="w-5 h-5 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2"/><input type="password" placeholder="비밀번호" className="w-full bg-bg-secondary border-2 border-border-color rounded-lg p-3.5 pl-11"/></div>
//         </div>
//         <button className="w-full bg-primary text-white font-bold py-3.5 rounded-xl mt-8">로그인</button>
//         <OAuthButtonsMock title="소셜 계정으로 로그인"/>
//     </div>
// );

// const PassVerificationMock: React.FC = () => (
//     <div className="p-6 flex flex-col h-full bg-bg-primary text-center">
//         <div className="mb-8 self-start"><button className="p-1"><Icons.ArrowLeftIcon className="w-6 h-6"/></button></div>
//         <Icons.PhoneIcon className="w-16 h-16 text-primary mx-auto"/>
//         <h2 className="text-3xl font-bold mt-4">휴대폰 본인인증</h2>
//         <p className="text-text-secondary mt-2 mb-8">안전한 서비스 이용을 위해<br/>PASS로 본인인증을 진행해주세요.</p>
//         <div className="h-40 bg-bg-secondary rounded-2xl p-6 flex flex-col justify-center">
//             <p className="font-semibold text-text-primary">홍길동 010-1234-5678</p>
//             <p className="text-sm text-text-secondary mt-1">본인 정보가 맞으시면 인증하기를 눌러주세요.</p>
//         </div>
//         <button className="w-full bg-primary text-white font-bold py-3.5 rounded-xl mt-auto">인증하기</button>
//     </div>
// );


// const Section: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
//     <section className="mb-16">
//         <h2 className="text-3xl font-bold text-slate-800 border-b border-slate-300 pb-3 mb-8">{title}</h2>
//         {children}
//     </section>
// );

// const MobileMockup: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
//   <div className={`w-[425px] h-[720px] bg-bg-primary text-text-primary rounded-3xl shadow-2xl ring-8 ring-slate-800 overflow-hidden relative ${className}`}>
//     {children}
//   </div>
// );

// const ColorPalette = () => {
//     const lightColors = [
//         { name: 'Primary', varName: '--primary', hex: '#4f46e5', description: '주요 액션, 활성 상태' },
//         { name: 'Secondary', varName: '--secondary', hex: '#9333ea', description: 'AI 기능, 보조 강조' },
//         { name: 'Accent', varName: '--accent', hex: '#f59e0b', description: '칭호, 특별 보상' },
//         { name: 'Positive', hex: '#22c55e', description: '수익, 상승, 매수' },
//         { name: 'Negative', hex: '#ef4444', description: '손실, 하락, 매도' },
//         { name: 'Bg Primary', varName: '--bg-primary', hex: '#f8fafc', description: '앱 기본 배경' },
//         { name: 'Bg Secondary', varName: '--bg-secondary', hex: '#ffffff', description: '카드, 모달 등 컴포넌트 배경' },
//         { name: 'Text Primary', varName: '--text-primary', hex: '#1e293b', description: '본문, 제목 등 주요 텍스트' },
//         { name: 'Text Secondary', varName: '--text-secondary', hex: '#64748b', description: '보조 정보, 비활성 텍스트' },
//         { name: 'Border Color', varName: '--border-color', hex: '#e2e8f0', description: '컴포넌트 경계선' },
//     ];

//     const darkColors = [
//         { name: 'Primary', varName: '--primary', hex: '#6366f1', description: '주요 액션, 활성 상태' },
//         { name: 'Secondary', varName: '--secondary', hex: '#a855f7', description: 'AI 기능, 보조 강조' },
//         { name: 'Accent', varName: '--accent', hex: '#f59e0b', description: '칭호, 특별 보상' },
//         { name: 'Positive', hex: '#22c55e', description: '수익, 상승, 매수' },
//         { name: 'Negative', hex: '#ef4444', description: '손실, 하락, 매도' },
//         { name: 'Bg Primary', varName: '--bg-primary', hex: '#0f172a', description: '앱 기본 배경' },
//         { name: 'Bg Secondary', varName: '--bg-secondary', hex: '#1e293b', description: '카드, 모달 등 컴포넌트 배경' },
//         { name: 'Text Primary', varName: '--text-primary', hex: '#f8fafc', description: '본문, 제목 등 주요 텍스트' },
//         { name: 'Text Secondary', varName: '--text-secondary', hex: '#94a3b8', description: '보조 정보, 비활성 텍스트' },
//         { name: 'Border Color', varName: '--border-color', hex: '#334155', description: '컴포넌트 경계선' },
//     ];

//     return (
//         <div className="space-y-8">
//             {/* Light Mode Colors */}
//             <div>
//                 <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
//                     라이트 모드 팔레트
//                 </h3>
//                 <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
//                     {lightColors.map(color => (
//                         <div key={`light-${color.name}`}>
//                             <div className="w-full h-24 rounded-lg shadow border border-slate-200" style={{ backgroundColor: color.hex }}></div>
//                             <div className="mt-3">
//                                 <p className="font-bold text-slate-800">{color.name}</p>
//                                 <p className="text-sm text-slate-500">{color.hex}</p>
//                                 <p className="text-sm text-slate-500">{color.description}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Dark Mode Colors */}
//             <div>
//                 <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
//                     다크 모드 팔레트
//                 </h3>
//                 <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-6">
//                     {darkColors.map(color => (
//                         <div key={`dark-${color.name}`}>
//                             <div className="w-full h-24 rounded-lg shadow border border-slate-700" style={{ backgroundColor: color.hex }}></div>
//                             <div className="mt-3">
//                                 <p className="font-bold text-slate-800">{color.name}</p>
//                                 <p className="text-sm text-slate-500">{color.hex}</p>
//                                 <p className="text-sm text-slate-500">{color.description}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Live Preview */}
//             <div className="p-6 bg-slate-50 rounded-xl border border-indigo-200">
//                 <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
//                     <Icons.SparklesIcon className="w-5 h-5 text-indigo-600" />
//                     실시간 테마 미리보기
//                 </h4>
//                 <p className="text-sm text-slate-600 mb-4">
//                     현재 페이지의 테마를 전환하여 색상이 실제로 어떻게 적용되는지 확인할 수 있습니다.
//                 </p>
//                 <div className="flex gap-3">
//                     <div className="px-4 py-2 bg-primary text-white rounded-lg font-semibold">Primary 버튼</div>
//                     <div className="px-4 py-2 bg-secondary text-white rounded-lg font-semibold">Secondary 버튼</div>
//                     <div className="px-4 py-2 bg-accent text-white rounded-lg font-semibold">Accent 버튼</div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const TypographyScale = () => {
//     const styles = [
//         { name: 'Heading 1 (h1)', class: 'text-4xl font-extrabold', text: '주린이 놀이터', usage: '화면의 메인 타이틀 (예: 홈 총 자산)' },
//         { name: 'Heading 2 (h2)', class: 'text-3xl font-bold', text: '멋진 닉네임을 만들어보세요', usage: '섹션 제목, 온보딩 단계별 타이틀' },
//         { name: 'Heading 3 (h3)', class: 'text-xl font-bold', text: 'AI 투자 스타일 분석', usage: '카드, 컴포넌트 제목' },
//         { name: 'Body (p)', class: 'text-base', text: '게임하듯 즐겁게, 주식 투자를 마스터하세요.', usage: '일반 본문 텍스트' },
//         { name: 'Subtext / Caption', class: 'text-sm text-text-secondary', text: '나의 투자 스타일은 가치투자자 유형과 유사합니다.', usage: '보조 정보, 설명' },
//         { name: 'Button', class: 'text-lg font-bold', text: '시작하기', usage: '주요 액션 버튼' },
//     ];
//     return (
//         <div className="space-y-6">
//             <p className="text-slate-600 mb-4">기본 폰트는 'Inter'를 사용합니다.</p>
//             {styles.map(style => (
//                 <div key={style.name} className="flex items-start gap-8">
//                     <div className="w-1/3">
//                         <p className="font-semibold text-slate-700">{style.name}</p>
//                         <p className="text-sm text-slate-500">{style.usage}</p>
//                     </div>
//                     <div className="w-2/3">
//                         <p className={style.class}>{style.text}</p>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// const IconLibrary = () => {
//     const iconList = Object.entries(Icons);
//     return (
//         <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 text-center">
//             {iconList.map(([name, IconComponent]) => (
//                 <div key={name} className="flex flex-col items-center p-3 bg-slate-100 rounded-lg">
//                     <IconComponent className="w-8 h-8 text-slate-700 mb-2" />
//                     <p className="text-xs text-slate-600 break-words">{name}</p>
//                 </div>
//             ))}
//         </div>
//     );
// };


// const DesignSystemScreen = () => {
//     const [leaderboardUser] = useState<LeaderboardEntry>(MOCK_LEADERBOARD[1]);
//     const [isAccountSwitcherOpen, setAccountSwitcherOpen] = useState(false);
//     const [isOrderModalOpen, setOrderModalOpen] = useState(false);
//     const [isUserProfileModalOpen, setUserProfileModalOpen] = useState(false);
//     const [isCreateCompetitionOpen, setCreateCompetitionOpen] = useState(false);
//     const sampleTicker = Object.keys(MOCK_STOCK_DETAILS)[0] ?? '';
//     const [isDarkMode, setIsDarkMode] = useState(false);

//     useEffect(() => {
//         // 초기 로드 시 로컬 스토리지에서 테마 읽기
//         const savedTheme = localStorage.getItem('theme');
//         if (savedTheme === 'dark') {
//             setIsDarkMode(true);
//             document.documentElement.classList.add('dark');
//         }
//     }, []);

//     useEffect(() => {
//         if (isDarkMode) {
//             document.documentElement.classList.add('dark');
//             localStorage.setItem('theme', 'dark');
//         } else {
//             document.documentElement.classList.remove('dark');
//             localStorage.setItem('theme', 'light');
//         }
//     }, [isDarkMode]);

//     return (
//         <div className="bg-slate-50 text-slate-700 min-h-screen font-sans p-6 md:p-12">
//             <div className="max-w-7xl mx-auto">
//                 <header className="text-center mb-16">
//                     <Icons.StonkIcon className="w-16 h-16 text-primary mx-auto mb-4" />
//                     <h1 className="text-5xl font-extrabold text-slate-900">주린이놀이터 UI/UX Design System</h1>
//                     <p className="mt-4 text-lg text-slate-600">A guide to the components, styles, and principles that shape our application.</p>
//                 </header>

//                 <Section title="Design Principles">
//                     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//                         <div className="bg-white p-6 rounded-lg border border-slate-200">
//                             <h3 className="text-lg font-bold text-primary mb-2">Casual & Gamified</h3>
//                             <p className="text-slate-600">복잡한 주식 투자를 게임처럼 쉽고 재미있게 만듭니다. 업적, 랭킹, 칭호 등 게임 요소를 통해 학습 동기를 부여합니다.</p>
//                         </div>
//                          <div className="bg-white p-6 rounded-lg border border-slate-200">
//                             <h3 className="text-lg font-bold text-primary mb-2">Intuitive & Accessible</h3>
//                             <p className="text-slate-600">주식 입문자도 쉽게 이해하고 사용할 수 있도록 직관적인 UI와 명확한 정보 구조를 제공합니다.</p>
//                         </div>
//                          <div className="bg-white p-6 rounded-lg border border-slate-200">
//                             <h3 className="text-lg font-bold text-primary mb-2">Modern Fintech</h3>
//                             <p className="text-slate-600">신뢰감을 주는 현대적인 핀테크 앱의 미학을 따릅니다. 깔끔한 디자인과 부드러운 인터랙션을 통해 전문성을 전달합니다.</p>
//                         </div>
//                          <div className="bg-white p-6 rounded-lg border border-slate-200">
//                             <h3 className="text-lg font-bold text-primary mb-2">Data-Driven</h3>
//                             <p className="text-slate-600">실제 시세 데이터를 기반으로 하며, AI 분석을 통해 사용자에게 개인화된 투자 인사이트를 제공합니다.</p>
//                         </div>
//                     </div>
//                 </Section>

//                 <Section title="테마 및 다크 모드">
//                     <div className="grid md:grid-cols-2 gap-8">
//                         <div className="bg-white p-6 rounded-lg border border-slate-200">
//                             <h3 className="text-xl font-bold text-slate-800 mb-4">라이트 / 다크 모드</h3>
//                             <p className="text-slate-600 mb-6">
//                                 사용자의 선호도와 환경에 맞춰 밝은 테마와 어두운 테마를 자유롭게 전환할 수 있습니다. 
//                                 다크 모드는 야간 사용 시 눈의 피로를 줄이고, OLED 화면에서 배터리 소모를 절감합니다.
//                             </p>
//                             <div className="space-y-3">
//                                 <div className="flex items-center gap-3">
//                                     <Icons.SparklesIcon className="w-5 h-5 text-amber-500" />
//                                     <span className="text-sm text-slate-600">라이트 모드: 밝고 명확한 화면, 주간 사용에 최적</span>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                     <Icons.ClockIcon className="w-5 h-5 text-indigo-600" />
//                                     <span className="text-sm text-slate-600">다크 모드: 눈의 피로 감소, 야간 및 저조도 환경에 적합</span>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                     <Icons.CpuChipIcon className="w-5 h-5 text-slate-500" />
//                                     <span className="text-sm text-slate-600">시스템 설정: 기기의 설정을 자동으로 따릅니다</span>
//                                 </div>
//                             </div>
//                         </div>
                        
//                         <div className="bg-white p-6 rounded-lg border border-slate-200">
//                             <h3 className="text-xl font-bold text-slate-800 mb-4">테마 전환 UI</h3>
//                             <p className="text-slate-600 mb-6">프로필 화면 또는 설정에서 간단한 토글로 테마를 전환할 수 있습니다.</p>
                            
//                             {/* Theme Toggle Demo */}
//                             <div className="space-y-4">
//                                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
//                                     <div className="flex items-center gap-3">
//                                         {isDarkMode ? (
//                                             <Icons.ClockIcon className="w-6 h-6 text-indigo-600" />
//                                         ) : (
//                                             <Icons.SparklesIcon className="w-6 h-6 text-amber-500" />
//                                         )}
//                                         <div>
//                                             <p className="font-semibold text-slate-800">테마 모드</p>
//                                             <p className="text-sm text-slate-500">{isDarkMode ? '다크 모드' : '라이트 모드'}</p>
//                                         </div>
//                                     </div>
//                                     <button
//                                         onClick={() => setIsDarkMode(!isDarkMode)}
//                                         className={`relative w-14 h-8 rounded-full transition-colors ${
//                                             isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'
//                                         }`}
//                                     >
//                                         <div
//                                             className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
//                                                 isDarkMode ? 'translate-x-6' : 'translate-x-0'
//                                             }`}
//                                         />
//                                     </button>
//                                 </div>

//                                 {/* Theme Preview - Now uses actual theme */}
//                                 <div className="p-4 rounded-xl border-2 transition-colors bg-bg-primary border-border-color">
//                                     <h4 className="font-bold mb-2 text-text-primary">
//                                         실시간 미리보기
//                                     </h4>
//                                     <p className="text-sm mb-3 text-text-secondary">
//                                         이 페이지 전체가 {isDarkMode ? '다크' : '라이트'} 모드로 전환됩니다.
//                                     </p>
//                                     <div className="flex gap-2">
//                                         <button className="px-3 py-1.5 rounded-lg font-semibold text-sm bg-primary text-white">
//                                             Primary 버튼
//                                         </button>
//                                         <button className="px-3 py-1.5 rounded-lg font-semibold text-sm border border-border-color text-text-primary bg-bg-secondary">
//                                             Secondary 버튼
//                                         </button>
//                                     </div>
//                                 </div>

//                             </div>
//                         </div>
//                     </div>

                
//                 </Section>
                
//                 <Section title="Color Palette">
//                     <ColorPalette />
//                 </Section>
                
//                 <Section title="Typography">
//                     <TypographyScale />
//                 </Section>
                
//                 <Section title="Iconography">
//                     <IconLibrary />
//                 </Section>

//                 <Section title="사용자 여정 및 화면">
//                    <UserFlowDiagram />
//                 </Section>

//                 <Section title="1단계: 온보딩 및 인증">
//                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                          <ComponentCard
//                             title="로그인"
//                             description="기존 사용자를 위한 로그인 화면입니다."
//                             usage="환영 화면에서 '이미 계정이 있어요'를 선택하거나, 회원가입 중 '로그인' 링크를 클릭하면 나타납니다. 이메일/비밀번호 입력과 소셜 로그인을 지원합니다."
//                         >
//                            <MobileMockup>
//                                 <LoginFormMock/>
//                            </MobileMockup>
//                         </ComponentCard>
//                         <ComponentCard
//                             title="회원가입 및 본인인증"
//                             description="신규 사용자를 위한 가입 및 본인 인증 화면입니다."
//                             usage="이메일/비밀번호 설정 후, 핀테크 앱의 신뢰도를 높이기 위한 PASS 본인 인증 절차를 거칩니다."
//                         >
//                            <MobileMockup>
//                                 <PassVerificationMock />
//                            </MobileMockup>
//                         </ComponentCard>
//                      </div>
//                 </Section>


//                 <Section title="2단계: 핵심 기능 (메인 앱)">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                         <ComponentCard
//                             title="고정 UI: 헤더 & 하단 네비게이션"
//                             description="메인 앱의 모든 핵심 화면에 일관되게 표시되는 UI 요소입니다."
//                             usage="상단 헤더는 현재 화면의 컨텍스트를 제공하고 계좌 전환 기능을 담고 있습니다. 하단 네비게이션 바는 앱의 주요 기능(홈, 증권, 대회, MY) 간의 빠른 이동을 지원합니다."
//                         >
//                            <MobileMockup className="justify-between">
//                                 <div className="p-4 text-center">
//                                     <h3 className="text-xl font-bold mb-4">화면 컨텐츠</h3>
//                                     <p className="text-text-secondary">각 화면의 내용이 여기에 표시됩니다.</p>
//                                     <button onClick={() => setAccountSwitcherOpen(true)} className="mt-4 text-sm text-primary font-semibold">계좌 전환 모달 열기</button>
//                                 </div>
//                                 <AccountSwitcher isOpen={isAccountSwitcherOpen} onClose={() => setAccountSwitcherOpen(false)} accounts={MOCK_ACCOUNTS} selectedAccount={MOCK_ACCOUNTS[0]} onSelect={() => setAccountSwitcherOpen(false)} />
//                            </MobileMockup>
//                         </ComponentCard>
                        
//                         <ComponentCard
//                             title="홈 화면"
//                             description="로그인 후 가장 먼저 마주하는 대시보드입니다."
//                             usage="전체 자산 현황, 오늘의 수익, 참여중인 대회, 전체 랭킹 같은 핵심 지표를 빠르게 파악할 수 있습니다."
//                         >
//                            <MobileMockup>
//                                 <div className="p-4"><HomeScreen selectedAccount={MOCK_ACCOUNTS[0]} /></div>
//                            </MobileMockup>
//                         </ComponentCard>

//                         <ComponentCard
//                             title="대회 화면"
//                             description="진행 중인 투자 대회 목록을 보여주고 새로 만들 수 있습니다."
//                             usage="사용자는 CompetitionCard를 통해 각 대회의 정보를 확인하고 참여할 수 있습니다. 우측 상단 버튼으로 새 대회를 만드는 화면으로 진입합니다."
//                         >
//                             <MobileMockup>
//                                 <div className="p-4">
//                                     <div className="flex justify-between items-center mb-4">
//                                         <h2 className="text-xl font-bold">대회 목록</h2>
//                                         <button onClick={() => setCreateCompetitionOpen(true)} className="bg-primary text-white text-sm font-bold py-2 px-3 rounded-lg flex items-center gap-1">
//                                             {/* Some icon sets may not include PlusIcon in demo bundles. Use the alias with runtime fallback. */}
//                                             {PlusIcon ? <PlusIcon className="w-4 h-4" /> : <span className="inline-block w-4 h-4 text-white">+</span>}
//                                             <span>만들기</span>
//                                         </button>
//                                     </div>
//                                     <div className="space-y-3">
//                                         <CompetitionCard competition={MOCK_COMPETITIONS[0]} />
//                                         <CompetitionCard competition={{...MOCK_COMPETITIONS[1], isJoined: true}} />
//                                     </div>
//                                 </div>
//                                 {isCreateCompetitionOpen && <CreateCompetitionScreen onBack={() => setCreateCompetitionOpen(false)} />}
//                             </MobileMockup>
//                         </ComponentCard>

//                         <ComponentCard
//                             title="MY (내 정보) 화면"
//                             description="사용자의 투자 성향과 활동을 종합적으로 보여주는 공간입니다."
//                             usage="AI 투자 스타일 분석(InvestmentAnalysisCard) 결과를 통해 자신의 투자 페르소나를 확인하고, 투자 조언을 얻을 수 있습니다."
//                         >
//                             <MobileMockup>
//                                 <div className="p-4">
//                                     <h2 className="text-xl font-bold mb-4">마이페이지</h2>
//                                     <InvestmentAnalysisCard analysis={MOCK_ANALYSIS_RESULT}/>
//                                 </div>
//                             </MobileMockup>
//                         </ComponentCard>
//                     </div>
//                 </Section>

//                 <Section title="3단계: 증권 트레이딩">
//                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                         <ComponentCard
//                             title="증권 메인 및 하단 네비게이션"
//                             description="트레이딩 관련 기능들을 모아놓은 별도 섹션입니다."
//                             usage="메인 앱의 '증권' 탭 선택 시 진입합니다. 자체 하단 네비게이션(내 자산, 탐색, 분석)을 통해 포트폴리오, 종목 탐색, 투자 분석 화면으로 이동합니다."
//                         >
//                             <MobileMockup>
//                                 <StocksContainerScreen needHeader={false} onExit={() => {}} />
//                             </MobileMockup>
//                         </ComponentCard>
//                         <ComponentCard
//                             title="모달: 주식 주문 (매수/매도)"
//                             description="종목 상세 화면에서 '매수' 또는 '매도' 버튼 클릭 시 나타나는 모달입니다."
//                             usage="시장가/지정가 등 주문 유형을 선택하고, 수량과 가격을 입력하여 주문을 실행합니다. 사용자의 현재 현금 잔고가 표시되어 참고할 수 있습니다."
//                         >
//                              <MobileMockup className="justify-center items-center">
//                                 <div className="p-4 text-center w-full">
//                                     <h3 className="text-xl font-bold">종목 상세 화면</h3>
//                                     <p className="text-text-secondary mt-2 mb-6">컨텐츠가 여기에 표시됩니다.</p>
//                                     <button onClick={() => setOrderModalOpen(true)} className="bg-primary text-white font-bold py-3 px-6 rounded-lg">주문 모달 열기</button>
//                                 </div>
//                            </MobileMockup>
//                         </ComponentCard>
//                      </div>
//                 </Section>
                
//                 <Section title="주식 상세정보 페이지">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                         <ComponentCard
//                             title="종목 상세 화면"
//                             description="특정 종목의 시세, 차트, 호가, 뉴스 등을 한눈에 확인할 수 있는 화면입니다."
//                             usage="종목을 선택하면 진입하는 상세 화면으로, 매수/매도, 차트 기간 전환, 주요 지표 확인이 가능합니다."
//                         >
//                             <MobileMockup>
//                                 <div className="p-4">
//                                     {/* Render the stock detail mock using a sample ticker */}
//                                     <StockDetailScreen ticker={sampleTicker} onBack={() => {}} />
//                                 </div>
//                             </MobileMockup>
//                         </ComponentCard>
//                     </div>
//                 </Section>
                
//                 <Section title="4단계: 소셜 기능">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                         <ComponentCard
//                             title="모달: 타 유저 프로필"
//                             description="랭킹 화면 등에서 다른 사용자를 탭했을 때 나타나는 간략한 프로필 모달입니다."
//                             usage="해당 유저의 랭킹, 수익률, 대표 칭호 등의 정보를 보여주며 '라이벌 추가' 같은 소셜 기능을 제공합니다."
//                         >
//                              <MobileMockup className="justify-center items-center">
//                                 <div className="p-4 text-center w-full">
//                                     <h3 className="text-xl font-bold">랭킹 화면</h3>
//                                     <p className="text-text-secondary mt-2 mb-6">사용자 목록이 여기에 표시됩니다.</p>
//                                     <button onClick={() => setUserProfileModalOpen(true)} className="bg-secondary text-white font-bold py-3 px-6 rounded-lg">유저 프로필 열기</button>
//                                 </div>
//                            </MobileMockup>
//                         </ComponentCard>

//                         <ComponentCard
//                             title="알림 화면"
//                             description="주문 체결, 랭킹 상승, 업적 달성 등 중요한 이벤트를 실시간으로 알려주는 알림 센터입니다."
//                             usage="헤더의 알림 아이콘을 클릭하면 전체 화면으로 나타나며, 필터링과 읽음 처리가 가능합니다. 테스트 알림 버튼으로 푸시 알림을 체험할 수 있습니다."
//                         >
//                             <MobileMockup>
//                                 <NotificationsScreen />
//                             </MobileMockup>
//                         </ComponentCard>
//                     </div>
//                 </Section>

//                 <Section title="전체 컴포넌트 라이브러리">
//                     <div className="space-y-8">
//                         <div>
//                             <h3 className="text-xl font-bold text-slate-700 mb-4">네비게이션</h3>
//                             <div className="p-4 text-sm text-text-secondary">
//                                 네비게이션 컴포넌트는 디자인 라이브러리에서 제거되었습니다 (요청에 따라).
//                             </div>
//                         </div>
//                         <div>
//                             <h3 className="text-xl font-bold text-slate-700 mb-4">카드</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                 <ComponentCard title="통계 카드 (Stat Card)">
//                                     <StatCard title="항목" value="1,234" change="+5.6%" changeType="positive">
//                                         <div className="bg-primary/10 p-3 rounded-full"><Icons.ChartBarIcon className="w-6 h-6 text-primary"/></div>
//                                     </StatCard>
//                                 </ComponentCard>
//                                 <ComponentCard title="대회 카드 (Competition Card)"><CompetitionCard competition={MOCK_COMPETITIONS[0]} /></ComponentCard>
//                                 <ComponentCard title="AI 분석 카드 (Analysis Card)"><InvestmentAnalysisCard analysis={MOCK_ANALYSIS_RESULT} /></ComponentCard>
//                             </div>
//                         </div>
//                         <div>
//                             <h3 className="text-xl font-bold text-slate-700 mb-4">차트</h3>
//                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                                 <ComponentCard title="주식 시세 차트 (Stock Chart)">
//                                     <StockChart data={MOCK_STOCK_CHART_DATA} isPositive={true} />
//                                 </ComponentCard>
//                                 <ComponentCard title="포트폴리오 도넛 차트 (Donut Chart)">
//                                     <PortfolioDonutChart holdings={Array.isArray((MOCK_ACCOUNTS[0] as any)?.holdings) ? (MOCK_ACCOUNTS[0] as any).holdings : []} cash={(MOCK_ACCOUNTS[0] as any)?.cashBalance ?? 0} />
//                                 </ComponentCard>
//                                 <ComponentCard title="투자성향 레이더 차트 (Radar Chart)" className="lg:col-span-2">
//                                     <div className="max-w-xs mx-auto">
//                                         {/* Guard against different mock shapes; try common paths then fallback to sample data */}
//                                         <RadarChart data={
//                                             (MOCK_ANALYSIS_RESULT && (MOCK_ANALYSIS_RESULT as any).style && (MOCK_ANALYSIS_RESULT as any).style.stats)
//                                             || (MOCK_ANALYSIS_RESULT && (MOCK_ANALYSIS_RESULT as any).stats)
//                                             || [{ label: '가치', value: 70 }, { label: '성장', value: 50 }, { label: '안정성', value: 60 }, { label: '단기성', value: 40 }, { label: '배당', value: 30 }]
//                                         } />
//                                     </div>
//                                 </ComponentCard>
//                             </div>
//                         </div>
//                     </div>
//                 </Section>


//                 <Section title="정보 아키텍처 (Information Architecture)">
//                     <div className="space-y-8">
//                         {/* App Structure Overview */}
//                         <div className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
//                             <div className="flex items-start justify-between mb-6">
//                                 <div>
//                                     <h3 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
//                                         <div className="p-2 bg-indigo-100 rounded-lg">
//                                             <Icons.CpuChipIcon className="w-6 h-6 text-indigo-600" />
//                                         </div>
//                                         앱 구조 개요
//                                     </h3>
//                                     <p className="text-slate-600">
//                                         주린이놀이터는 크게 <strong className="text-primary">4개의 주요 섹션</strong>으로 구성되어 있습니다
//                                     </p>
//                                 </div>
//                             </div>
                            
//                             {/* Main Navigation Structure */}
//                             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
//                                 <div className="group relative bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-5 rounded-xl border border-indigo-200 hover:border-indigo-400 transition-all hover:shadow-md hover:-translate-y-1">
//                                     <div className="absolute top-3 right-3 text-xs font-bold text-indigo-400">01</div>
//                                     <Icons.HomeIcon className="w-9 h-9 text-indigo-600 mb-3 group-hover:scale-110 transition-transform" />
//                                     <h4 className="text-lg font-bold text-indigo-900 mb-1.5">홈</h4>
//                                     <p className="text-sm text-indigo-700/80 leading-relaxed">대시보드, 자산 현황, 랭킹 요약</p>
//                                 </div>
//                                 <div className="group relative bg-gradient-to-br from-green-50 to-green-100/50 p-5 rounded-xl border border-green-200 hover:border-green-400 transition-all hover:shadow-md hover:-translate-y-1">
//                                     <div className="absolute top-3 right-3 text-xs font-bold text-green-400">02</div>
//                                     <Icons.StonkIcon className="w-9 h-9 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
//                                     <h4 className="text-lg font-bold text-green-900 mb-1.5">증권</h4>
//                                     <p className="text-sm text-green-700/80 leading-relaxed">포트폴리오, 종목 탐색, 매매</p>
//                                 </div>
//                                 <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100/50 p-5 rounded-xl border border-purple-200 hover:border-purple-400 transition-all hover:shadow-md hover:-translate-y-1">
//                                     <div className="absolute top-3 right-3 text-xs font-bold text-purple-400">03</div>
//                                     <Icons.TrophyIcon className="w-9 h-9 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
//                                     <h4 className="text-lg font-bold text-purple-900 mb-1.5">대회</h4>
//                                     <p className="text-sm text-purple-700/80 leading-relaxed">투자 대회, 랭킹, 리더보드</p>
//                                 </div>
//                                 <div className="group relative bg-gradient-to-br from-amber-50 to-amber-100/50 p-5 rounded-xl border border-amber-200 hover:border-amber-400 transition-all hover:shadow-md hover:-translate-y-1">
//                                     <div className="absolute top-3 right-3 text-xs font-bold text-amber-400">04</div>
//                                     <Icons.UserCircleIcon className="w-9 h-9 text-amber-600 mb-3 group-hover:scale-110 transition-transform" />
//                                     <h4 className="text-lg font-bold text-amber-900 mb-1.5">MY</h4>
//                                     <p className="text-sm text-amber-700/80 leading-relaxed">프로필, AI 분석, 설정</p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Detailed Screen Hierarchy */}
//                         <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
//                             <div className="mb-8">
//                                 <h3 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
//                                     <div className="p-2 bg-purple-100 rounded-lg">
//                                         <Icons.ChartBarIcon className="w-6 h-6 text-purple-600" />
//                                     </div>
//                                     화면 계층 구조
//                                 </h3>
//                                 <p className="text-slate-600">각 섹션의 상세 화면 흐름과 계층을 확인하세요</p>
//                             </div>
                            
//                             <div className="space-y-6">
//                                 {/* Pre-Auth Flow */}
//                                 <div className="group relative">
//                                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-400 via-slate-300 to-transparent rounded-full"></div>
//                                     <div className="pl-8">
//                                         <div className="flex items-center gap-3 mb-4">
//                                             <div className="p-2 bg-slate-100 rounded-lg">
//                                                 <Icons.ShieldCheckIcon className="w-5 h-5 text-slate-600" />
//                                             </div>
//                                             <h4 className="text-lg font-bold text-slate-800">인증 전 (Pre-Authentication)</h4>
//                                         </div>
//                                         <div className="space-y-2.5">
//                                             <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
//                                                 <div className="w-2.5 h-2.5 rounded-full bg-slate-400 flex-shrink-0"></div>
//                                                 <span className="font-semibold text-slate-800">랜딩 화면</span>
//                                                 <Icons.ArrowTrendingUpIcon className="w-4 h-4 text-slate-400 mx-2" />
//                                                 <span className="text-sm text-slate-500">앱 소개 및 CTA</span>
//                                             </div>
//                                             <div className="flex items-center gap-3 p-3 ml-4 bg-slate-50/50 rounded-lg hover:bg-slate-100 transition-colors">
//                                                 <div className="w-2 h-2 rounded-full bg-slate-300 flex-shrink-0"></div>
//                                                 <span className="font-semibold text-slate-700">온보딩 화면</span>
//                                                 <Icons.ArrowTrendingUpIcon className="w-4 h-4 text-slate-400 mx-2" />
//                                                 <span className="text-sm text-slate-500">닉네임, 초기 자금 설정</span>
//                                             </div>
//                                             <div className="flex items-center gap-3 p-3 ml-4 bg-slate-50/50 rounded-lg hover:bg-slate-100 transition-colors">
//                                                 <div className="w-2 h-2 rounded-full bg-slate-300 flex-shrink-0"></div>
//                                                 <span className="font-semibold text-slate-700">로그인 / 회원가입</span>
//                                                 <Icons.ArrowTrendingUpIcon className="w-4 h-4 text-slate-400 mx-2" />
//                                                 <span className="text-sm text-slate-500">이메일 또는 소셜 로그인</span>
//                                             </div>
//                                             <div className="flex items-center gap-3 p-3 ml-8 bg-slate-50/30 rounded-lg hover:bg-slate-100 transition-colors">
//                                                 <div className="w-1.5 h-1.5 rounded-full bg-slate-200 flex-shrink-0"></div>
//                                                 <span className="font-medium text-slate-600">PASS 본인인증</span>
//                                                 <Icons.ArrowTrendingUpIcon className="w-4 h-4 text-slate-400 mx-2" />
//                                                 <span className="text-sm text-slate-500">신규 가입 시</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Main App Flow */}
//                                 <div className="group relative">
//                                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-indigo-400 to-transparent rounded-full"></div>
//                                     <div className="pl-8">
//                                         <div className="flex items-center gap-3 mb-4">
//                                             <div className="p-2 bg-indigo-100 rounded-lg">
//                                                 <Icons.HomeIcon className="w-5 h-5 text-indigo-600" />
//                                             </div>
//                                             <h4 className="text-lg font-bold text-slate-800">홈 섹션</h4>
//                                             <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full font-semibold">메인</span>
//                                         </div>
//                                         <div className="space-y-2.5">
//                                             <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
//                                                 <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 flex-shrink-0"></div>
//                                                 <span className="font-semibold text-indigo-900">홈 화면</span>
//                                                 <Icons.ArrowTrendingUpIcon className="w-4 h-4 text-indigo-400 mx-2" />
//                                                 <span className="text-sm text-indigo-700">전체 자산, 수익률, 랭킹 요약</span>
//                                             </div>
//                                             <div className="flex items-center gap-3 p-3 ml-4 bg-indigo-50/50 rounded-lg hover:bg-indigo-100 transition-colors">
//                                                 <div className="w-2 h-2 rounded-full bg-indigo-300 flex-shrink-0"></div>
//                                                 <span className="text-indigo-800">알림 센터</span>
//                                                 <span className="text-xs px-2 py-0.5 bg-white text-indigo-600 rounded-md font-medium ml-auto">모달</span>
//                                             </div>
//                                             <div className="flex items-center gap-3 p-3 ml-4 bg-indigo-50/50 rounded-lg hover:bg-indigo-100 transition-colors">
//                                                 <div className="w-2 h-2 rounded-full bg-indigo-300 flex-shrink-0"></div>
//                                                 <span className="text-indigo-800">계좌 전환</span>
//                                                 <span className="text-xs px-2 py-0.5 bg-white text-indigo-600 rounded-md font-medium ml-auto">모달</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Stocks Flow */}
//                                 <div className="group relative">
//                                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-green-400 to-transparent rounded-full"></div>
//                                     <div className="pl-8">
//                                         <div className="flex items-center gap-3 mb-4">
//                                             <div className="p-2 bg-green-100 rounded-lg">
//                                                 <Icons.StonkIcon className="w-5 h-5 text-green-600" />
//                                             </div>
//                                             <h4 className="text-lg font-bold text-slate-800">증권 섹션</h4>
//                                             <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-semibold">트레이딩</span>
//                                         </div>
//                                         <div className="space-y-2.5">
//                                             <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
//                                                 <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0"></div>
//                                                 <span className="font-semibold text-green-900">포트폴리오 화면</span>
//                                                 <Icons.ArrowTrendingUpIcon className="w-4 h-4 text-green-400 mx-2" />
//                                                 <span className="text-sm text-green-700">내 자산 구성</span>
//                                             </div>
//                                             <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
//                                                 <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0"></div>
//                                                 <span className="font-semibold text-green-900">탐색 화면</span>
//                                                 <Icons.ArrowTrendingUpIcon className="w-4 h-4 text-green-400 mx-2" />
//                                                 <span className="text-sm text-green-700">종목 검색 및 발견</span>
//                                             </div>
//                                             <div className="flex items-center gap-3 p-3 ml-4 bg-green-50/50 rounded-lg hover:bg-green-100 transition-colors">
//                                                 <div className="w-2 h-2 rounded-full bg-green-300 flex-shrink-0"></div>
//                                                 <span className="text-green-800">종목 상세</span>
//                                                 <Icons.ArrowTrendingUpIcon className="w-4 h-4 text-green-400 mx-2" />
//                                                 <span className="text-sm text-green-600">차트, 호가, 뉴스</span>
//                                             </div>
//                                             <div className="flex items-center gap-3 p-3 ml-8 bg-green-50/30 rounded-lg hover:bg-green-100 transition-colors">
//                                                 <div className="w-1.5 h-1.5 rounded-full bg-green-200 flex-shrink-0"></div>
//                                                 <span className="text-green-700">매수/매도 모달</span>
//                                                 <span className="text-xs px-2 py-0.5 bg-white text-green-600 rounded-md font-medium ml-auto">모달</span>
//                                             </div>
//                                             <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
//                                                 <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0"></div>
//                                                 <span className="font-semibold text-green-900">분석 화면</span>
//                                                 <Icons.ArrowTrendingUpIcon className="w-4 h-4 text-green-400 mx-2" />
//                                                 <span className="text-sm text-green-700">투자 성과 분석</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Competitions Flow */}
//                                 <div className="group relative">
//                                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-purple-400 to-transparent rounded-full"></div>
//                                     <div className="pl-8">
//                                         <div className="flex items-center gap-3 mb-4">
//                                             <div className="p-2 bg-purple-100 rounded-lg">
//                                                 <Icons.TrophyIcon className="w-5 h-5 text-purple-600" />
//                                             </div>
//                                             <h4 className="text-lg font-bold text-slate-800">대회 섹션</h4>
//                                             <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">소셜</span>
//                                         </div>
//                                         <div className="space-y-2.5">
//                                             <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
//                                                 <div className="w-2.5 h-2.5 rounded-full bg-purple-500 flex-shrink-0"></div>
//                                                 <span className="font-semibold text-purple-900">대회 목록</span>
//                                                 <Icons.ArrowTrendingUpIcon className="w-4 h-4 text-purple-400 mx-2" />
//                                                 <span className="text-sm text-purple-700">진행 중 & 예정된 대회</span>
//                                             </div>
//                                             <div className="flex items-center gap-3 p-3 ml-4 bg-purple-50/50 rounded-lg hover:bg-purple-100 transition-colors">
//                                                 <div className="w-2 h-2 rounded-full bg-purple-300 flex-shrink-0"></div>
//                                                 <span className="text-purple-800">대회 생성</span>
//                                                 <span className="text-xs px-2 py-0.5 bg-white text-purple-600 rounded-md font-medium ml-auto">전체화면</span>
//                                             </div>
//                                             <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
//                                                 <div className="w-2.5 h-2.5 rounded-full bg-purple-500 flex-shrink-0"></div>
//                                                 <span className="font-semibold text-purple-900">랭킹 화면</span>
//                                                 <Icons.ArrowTrendingUpIcon className="w-4 h-4 text-purple-400 mx-2" />
//                                                 <span className="text-sm text-purple-700">리더보드</span>
//                                             </div>
//                                             <div className="flex items-center gap-3 p-3 ml-4 bg-purple-50/50 rounded-lg hover:bg-purple-100 transition-colors">
//                                                 <div className="w-2 h-2 rounded-full bg-purple-300 flex-shrink-0"></div>
//                                                 <span className="text-purple-800">유저 프로필 모달</span>
//                                                 <span className="text-xs px-2 py-0.5 bg-white text-purple-600 rounded-md font-medium ml-auto">모달</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Profile Flow */}
//                                 <div className="group relative">
//                                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-amber-400 to-transparent rounded-full"></div>
//                                     <div className="pl-8">
//                                         <div className="flex items-center gap-3 mb-4">
//                                             <div className="p-2 bg-amber-100 rounded-lg">
//                                                 <Icons.UserCircleIcon className="w-5 h-5 text-amber-600" />
//                                             </div>
//                                             <h4 className="text-lg font-bold text-slate-800">MY 섹션</h4>
//                                             <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-semibold">프로필</span>
//                                         </div>
//                                         <div className="space-y-2.5">
//                                             <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
//                                                 <div className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0"></div>
//                                                 <span className="font-semibold text-amber-900">프로필 화면</span>
//                                                 <Icons.ArrowTrendingUpIcon className="w-4 h-4 text-amber-400 mx-2" />
//                                                 <span className="text-sm text-amber-700">AI 분석, 업적, 칭호</span>
//                                             </div>
//                                             <div className="flex items-center gap-3 p-3 ml-4 bg-amber-50/50 rounded-lg hover:bg-amber-100 transition-colors">
//                                                 <div className="w-2 h-2 rounded-full bg-amber-300 flex-shrink-0"></div>
//                                                 <span className="text-amber-800">설정</span>
//                                                 <Icons.ArrowTrendingUpIcon className="w-4 h-4 text-amber-400 mx-2" />
//                                                 <span className="text-sm text-amber-600">테마, 알림, 계정</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Navigation Patterns */}
//                         <div className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
//                             <div className="mb-8">
//                                 <h3 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
//                                     <div className="p-2 bg-blue-100 rounded-lg">
//                                         <Icons.ArrowUturnLeftIcon className="w-6 h-6 text-blue-600" />
//                                     </div>
//                                     네비게이션 패턴
//                                 </h3>
//                                 <p className="text-slate-600">사용자가 앱을 탐색하는 주요 방식들</p>
//                             </div>
                            
//                             <div className="grid md:grid-cols-2 gap-5">
//                                 <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-primary hover:shadow-md transition-all">
//                                     <div className="flex items-start gap-3 mb-4">
//                                         <div className="p-2 bg-indigo-50 rounded-lg">
//                                             <Icons.ChartBarIcon className="w-5 h-5 text-primary" />
//                                         </div>
//                                         <div>
//                                             <h4 className="font-bold text-slate-800">하단 네비게이션 바</h4>
//                                             <p className="text-xs text-slate-500 mt-0.5">Main Navigation</p>
//                                         </div>
//                                     </div>
//                                     <p className="text-sm text-slate-600 mb-4">
//                                         앱의 4개 주요 섹션 간 이동을 담당하는 고정 네비게이션입니다.
//                                     </p>
//                                     <ul className="space-y-2">
//                                         <li className="flex items-center gap-2.5 text-sm">
//                                             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
//                                             <Icons.HomeIcon className="w-4 h-4 text-indigo-600" />
//                                             <span className="text-slate-700">홈 → 대시보드</span>
//                                         </li>
//                                         <li className="flex items-center gap-2.5 text-sm">
//                                             <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
//                                             <Icons.StonkIcon className="w-4 h-4 text-green-600" />
//                                             <span className="text-slate-700">증권 → 트레이딩 섹션</span>
//                                         </li>
//                                         <li className="flex items-center gap-2.5 text-sm">
//                                             <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
//                                             <Icons.TrophyIcon className="w-4 h-4 text-purple-600" />
//                                             <span className="text-slate-700">대회 → 대회 목록</span>
//                                         </li>
//                                         <li className="flex items-center gap-2.5 text-sm">
//                                             <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
//                                             <Icons.UserCircleIcon className="w-4 h-4 text-amber-600" />
//                                             <span className="text-slate-700">MY → 프로필</span>
//                                         </li>
//                                     </ul>
//                                 </div>

//                                 <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-green-500 hover:shadow-md transition-all">
//                                     <div className="flex items-start gap-3 mb-4">
//                                         <div className="p-2 bg-green-50 rounded-lg">
//                                             <Icons.ChartPieIcon className="w-5 h-5 text-green-600" />
//                                         </div>
//                                         <div>
//                                             <h4 className="font-bold text-slate-800">증권 하위 네비게이션</h4>
//                                             <p className="text-xs text-slate-500 mt-0.5">Sub Navigation</p>
//                                         </div>
//                                     </div>
//                                     <p className="text-sm text-slate-600 mb-4">
//                                         증권 섹션 내에서만 활성화되는 별도의 하단 네비게이션입니다.
//                                     </p>
//                                     <ul className="space-y-2">
//                                         <li className="flex items-center gap-2.5 text-sm">
//                                             <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
//                                             <Icons.BriefcaseIcon className="w-4 h-4 text-green-600" />
//                                             <span className="text-slate-700">내 자산 → 포트폴리오</span>
//                                         </li>
//                                         <li className="flex items-center gap-2.5 text-sm">
//                                             <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
//                                             <Icons.MagnifyingGlassIcon className="w-4 h-4 text-green-600" />
//                                             <span className="text-slate-700">탐색 → 종목 검색</span>
//                                         </li>
//                                         <li className="flex items-center gap-2.5 text-sm">
//                                             <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
//                                             <Icons.ChartBarIcon className="w-4 h-4 text-green-600" />
//                                             <span className="text-slate-700">분석 → 투자 성과</span>
//                                         </li>
//                                     </ul>
//                                 </div>

//                                 <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all">
//                                     <div className="flex items-start gap-3 mb-4">
//                                         <div className="p-2 bg-slate-50 rounded-lg">
//                                             <Icons.ArrowLeftIcon className="w-5 h-5 text-slate-600" />
//                                         </div>
//                                         <div>
//                                             <h4 className="font-bold text-slate-800">뒤로 가기 / 닫기</h4>
//                                             <p className="text-xs text-slate-500 mt-0.5">Back & Close</p>
//                                         </div>
//                                     </div>
//                                     <p className="text-sm text-slate-600 mb-4">
//                                         상세 화면이나 모달에서 이전 화면으로 돌아가는 패턴입니다.
//                                     </p>
//                                     <ul className="space-y-2 text-sm text-slate-600">
//                                         <li className="flex items-start gap-2">
//                                             <Icons.CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
//                                             <span>좌측 상단 뒤로가기 버튼</span>
//                                         </li>
//                                         <li className="flex items-start gap-2">
//                                             <Icons.CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
//                                             <span>모달 X 버튼 또는 바깥 영역 탭</span>
//                                         </li>
//                                         <li className="flex items-start gap-2">
//                                             <Icons.CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
//                                             <span>스와이프 제스처 (iOS 네이티브)</span>
//                                         </li>
//                                     </ul>
//                                 </div>

//                                 <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all">
//                                     <div className="flex items-start gap-3 mb-4">
//                                         <div className="p-2 bg-blue-50 rounded-lg">
//                                             <Icons.MagnifyingGlassIcon className="w-5 h-5 text-blue-600" />
//                                         </div>
//                                         <div>
//                                             <h4 className="font-bold text-slate-800">검색 및 필터링</h4>
//                                             <p className="text-xs text-slate-500 mt-0.5">Search & Filter</p>
//                                         </div>
//                                     </div>
//                                     <p className="text-sm text-slate-600 mb-4">
//                                         컨텐츠를 빠르게 찾고 정렬하는 기능입니다.
//                                     </p>
//                                     <ul className="space-y-2 text-sm text-slate-600">
//                                         <li className="flex items-start gap-2">
//                                             <Icons.CheckCircleIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
//                                             <span>탐색 화면: 종목 검색</span>
//                                         </li>
//                                         <li className="flex items-start gap-2">
//                                             <Icons.CheckCircleIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
//                                             <span>대회 목록: 진행중/종료 필터</span>
//                                         </li>
//                                         <li className="flex items-start gap-2">
//                                             <Icons.CheckCircleIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
//                                             <span>알림: 카테고리별 필터</span>
//                                         </li>
//                                     </ul>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Information Hierarchy */}
//                         <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
//                             <div className="mb-8">
//                                 <h3 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
//                                     <div className="p-2 bg-indigo-100 rounded-lg">
//                                         <Icons.ChartBarIcon className="w-6 h-6 text-indigo-600" />
//                                     </div>
//                                     정보 위계
//                                 </h3>
//                                 <p className="text-slate-600">정보의 중요도에 따른 시각적 우선순위</p>
//                             </div>
                            
//                             <div className="space-y-5">
//                                 <div className="group">
//                                     <div className="flex items-center gap-3 mb-3">
//                                         <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-sm">
//                                             1
//                                         </div>
//                                         <h4 className="font-bold text-slate-800 text-lg">1차 정보 (Primary)</h4>
//                                     </div>
//                                     <p className="text-sm text-slate-600 mb-3 ml-11">사용자가 가장 먼저 보고 인식해야 하는 핵심 정보</p>
//                                     <div className="ml-11 bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl border-l-4 border-indigo-500 group-hover:border-indigo-600 transition-colors">
//                                         <ul className="space-y-2.5">
//                                             <li className="flex items-start gap-3 text-sm text-slate-700">
//                                                 <Icons.BanknotesIcon className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
//                                                 <div>
//                                                     <span className="font-semibold">총 자산 금액</span>
//                                                     <span className="text-slate-500 ml-2">홈 화면의 메인 지표</span>
//                                                 </div>
//                                             </li>
//                                             <li className="flex items-start gap-3 text-sm text-slate-700">
//                                                 <Icons.ChartBarIcon className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
//                                                 <div>
//                                                     <span className="font-semibold">현재가 및 등락률</span>
//                                                     <span className="text-slate-500 ml-2">종목 상세의 핵심 정보</span>
//                                                 </div>
//                                             </li>
//                                             <li className="flex items-start gap-3 text-sm text-slate-700">
//                                                 <Icons.TrophyIcon className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
//                                                 <div>
//                                                     <span className="font-semibold">랭킹 순위</span>
//                                                     <span className="text-slate-500 ml-2">대회 화면의 주요 지표</span>
//                                                 </div>
//                                             </li>
//                                         </ul>
//                                     </div>
//                                 </div>

//                                 <div className="group">
//                                     <div className="flex items-center gap-3 mb-3">
//                                         <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-slate-400 to-slate-500 text-white font-bold text-sm">
//                                             2
//                                         </div>
//                                         <h4 className="font-bold text-slate-800 text-lg">2차 정보 (Secondary)</h4>
//                                     </div>
//                                     <p className="text-sm text-slate-600 mb-3 ml-11">1차 정보를 보조하거나 추가 컨텍스트를 제공하는 정보</p>
//                                     <div className="ml-11 bg-gradient-to-r from-slate-50 to-slate-100 p-5 rounded-xl border-l-4 border-slate-400 group-hover:border-slate-500 transition-colors">
//                                         <ul className="space-y-2.5">
//                                             <li className="flex items-start gap-3 text-sm text-slate-700">
//                                                 <Icons.ArrowTrendingUpIcon className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
//                                                 <div>
//                                                     <span className="font-semibold">전일 대비 변화량</span>
//                                                     <span className="text-slate-500 ml-2">추세 파악용 보조 정보</span>
//                                                 </div>
//                                             </li>
//                                             <li className="flex items-start gap-3 text-sm text-slate-700">
//                                                 <Icons.ChartPieIcon className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
//                                                 <div>
//                                                     <span className="font-semibold">거래량, 시가총액</span>
//                                                     <span className="text-slate-500 ml-2">종목의 규모와 활동성</span>
//                                                 </div>
//                                             </li>
//                                             <li className="flex items-start gap-3 text-sm text-slate-700">
//                                                 <Icons.UsersIcon className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
//                                                 <div>
//                                                     <span className="font-semibold">대회 참가자 수, 종료일</span>
//                                                     <span className="text-slate-500 ml-2">대회 활성도와 일정</span>
//                                                 </div>
//                                             </li>
//                                         </ul>
//                                     </div>
//                                 </div>

//                                 <div className="group">
//                                     <div className="flex items-center gap-3 mb-3">
//                                         <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-slate-300 to-slate-400 text-white font-bold text-sm">
//                                             3
//                                         </div>
//                                         <h4 className="font-bold text-slate-800 text-lg">3차 정보 (Tertiary)</h4>
//                                     </div>
//                                     <p className="text-sm text-slate-600 mb-3 ml-11">필요할 때만 확인하는 상세 정보 및 메타데이터</p>
//                                     <div className="ml-11 bg-gradient-to-r from-slate-50 to-slate-50 p-5 rounded-xl border-l-4 border-slate-300 group-hover:border-slate-400 transition-colors">
//                                         <ul className="space-y-2.5">
//                                             <li className="flex items-start gap-3 text-sm text-slate-700">
//                                                 <Icons.BookmarkIcon className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
//                                                 <div>
//                                                     <span className="font-semibold">뉴스 기사 내용</span>
//                                                     <span className="text-slate-500 ml-2">심층 분석용 정보</span>
//                                                 </div>
//                                             </li>
//                                             <li className="flex items-start gap-3 text-sm text-slate-700">
//                                                 <Icons.BuildingOffice2Icon className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
//                                                 <div>
//                                                     <span className="font-semibold">기업 정보 상세</span>
//                                                     <span className="text-slate-500 ml-2">회사 개요 및 재무제표</span>
//                                                 </div>
//                                             </li>
//                                             <li className="flex items-start gap-3 text-sm text-slate-700">
//                                                 <Icons.GiftIcon className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
//                                                 <div>
//                                                     <span className="font-semibold">업적 설명 텍스트</span>
//                                                     <span className="text-slate-500 ml-2">달성 조건 및 보상 설명</span>
//                                                 </div>
//                                             </li>
//                                         </ul>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Content Organization */}
//                         <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 rounded-2xl border-2 border-indigo-200/50 shadow-lg">
//                             {/* Decorative elements */}
//                             <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
//                             <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
                            
//                             <div className="relative z-10">
//                                 <div className="mb-8">
//                                     <h3 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
//                                         <div className="p-2.5 bg-white rounded-xl shadow-sm">
//                                             <Icons.SparklesIcon className="w-7 h-7 text-indigo-600" />
//                                         </div>
//                                         컨텐츠 조직 원칙
//                                     </h3>
//                                     <p className="text-slate-700">사용자 경험을 향상시키는 정보 구성 방법론</p>
//                                 </div>
                                
//                                 <div className="grid md:grid-cols-2 gap-5">
//                                     <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-indigo-200 hover:border-indigo-400 hover:shadow-xl transition-all hover:-translate-y-1">
//                                         <div className="flex items-start gap-3 mb-3">
//                                             <div className="p-2 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg group-hover:scale-110 transition-transform">
//                                                 <Icons.ChevronDownIcon className="w-5 h-5 text-indigo-700" />
//                                             </div>
//                                             <div>
//                                                 <h4 className="font-bold text-slate-800 text-base">프로그레시브 디스클로저</h4>
//                                                 <p className="text-xs text-indigo-600 font-medium">Progressive Disclosure</p>
//                                             </div>
//                                         </div>
//                                         <p className="text-sm text-slate-600 leading-relaxed">
//                                             복잡한 정보는 단계적으로 공개합니다. 기본 화면에는 필수 정보만 표시하고, 
//                                             사용자가 필요로 할 때 추가 정보를 펼치거나 이동할 수 있도록 합니다.
//                                         </p>
//                                     </div>
                                    
//                                     <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all hover:-translate-y-1">
//                                         <div className="flex items-start gap-3 mb-3">
//                                             <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg group-hover:scale-110 transition-transform">
//                                                 <Icons.ChartBarIcon className="w-5 h-5 text-purple-700" />
//                                             </div>
//                                             <div>
//                                                 <h4 className="font-bold text-slate-800 text-base">F-패턴 레이아웃</h4>
//                                                 <p className="text-xs text-purple-600 font-medium">F-Pattern Layout</p>
//                                             </div>
//                                         </div>
//                                         <p className="text-sm text-slate-600 leading-relaxed">
//                                             사용자의 시선이 좌상단에서 시작하여 F자 형태로 움직이는 패턴을 고려하여 
//                                             중요한 정보를 좌측 상단에 배치합니다.
//                                         </p>
//                                     </div>
                                    
//                                     <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-pink-200 hover:border-pink-400 hover:shadow-xl transition-all hover:-translate-y-1">
//                                         <div className="flex items-start gap-3 mb-3">
//                                             <div className="p-2 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg group-hover:scale-110 transition-transform">
//                                                 <Icons.ChartPieIcon className="w-5 h-5 text-pink-700" />
//                                             </div>
//                                             <div>
//                                                 <h4 className="font-bold text-slate-800 text-base">그룹화 및 카드 시스템</h4>
//                                                 <p className="text-xs text-pink-600 font-medium">Card-Based Grouping</p>
//                                             </div>
//                                         </div>
//                                         <p className="text-sm text-slate-600 leading-relaxed">
//                                             관련된 정보는 카드 컴포넌트로 그룹화하여 시각적으로 구분하고, 
//                                             각 카드는 독립적인 기능 단위로 작동합니다.
//                                         </p>
//                                     </div>
                                    
//                                     <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all hover:-translate-y-1">
//                                         <div className="flex items-start gap-3 mb-3">
//                                             <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg group-hover:scale-110 transition-transform">
//                                                 <Icons.CheckCircleIcon className="w-5 h-5 text-blue-700" />
//                                             </div>
//                                             <div>
//                                                 <h4 className="font-bold text-slate-800 text-base">일관된 액션 배치</h4>
//                                                 <p className="text-xs text-blue-600 font-medium">Consistent Action Placement</p>
//                                             </div>
//                                         </div>
//                                         <p className="text-sm text-slate-600 leading-relaxed">
//                                             주요 액션 버튼(매수, 참가하기 등)은 항상 화면 하단 고정 영역에 배치하여 
//                                             손가락이 닿기 쉽고 예측 가능한 위치를 유지합니다.
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </Section>

//             </div>
//         </div>
//     );
// };

// export default DesignSystemScreen;
