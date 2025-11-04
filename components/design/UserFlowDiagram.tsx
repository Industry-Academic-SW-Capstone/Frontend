"use client";
import React, { useState } from 'react';

const UserFlowDiagram: React.FC = () => {
  const [activeFlow, setActiveFlow] = useState<'overview' | 'auth' | 'trading' | 'competition' | 'social'>('overview');

  const Node: React.FC<{ x: number, y: number, width: number, height: number, label: string, subtext?: string, color?: string, stroke?: string, strokeWidth?: string | number }> = 
    ({ x, y, width, height, label, subtext, color = '#f1f5f9', stroke = '#94a3b8', strokeWidth = "1.5" }) => (
    <g>
      <rect x={x} y={y} width={width} height={height} rx="10" fill={color} stroke={stroke} strokeWidth={strokeWidth} />
      <text x={x + width / 2} y={y + height / 2 - (subtext ? 8 : 0)} textAnchor="middle" fontWeight="bold" fontSize="14" fill="#1e293b">{label}</text>
      {subtext && <text x={x + width / 2} y={y + height / 2 + 12} textAnchor="middle" fontSize="11" fill="#64748b">{subtext}</text>}
    </g>
  );

  const Arrow: React.FC<{ path: string, label?: string, labelPos?: { x: number, y: number }, dashed?: boolean }> = ({ path, label, labelPos, dashed = false }) => (
    <g>
      <path d={path} stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowhead)" fill="none" strokeDasharray={dashed ? "5,5" : "none"} />
      {label && labelPos && <text x={labelPos.x} y={labelPos.y} fontSize="11" fill="#64748b" textAnchor="middle">{label}</text>}
    </g>
  );

  const Decision: React.FC<{ x: number, y: number, size: number, label: string, color?: string }> = ({ x, y, size, label, color = '#fef3c7' }) => (
    <g>
      <path d={`M${x},${y - size} L${x + size},${y} L${x},${y + size} L${x - size},${y} Z`} fill={color} stroke="#f59e0b" strokeWidth="1.5" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#92400e">{label}</text>
    </g>
  );

  // Overview Flow
  const OverviewFlow = () => (
    <>
      <Node x={525} y={20} width={150} height={60} label="앱 시작" color="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
      <Node x={525} y={120} width={150} height={70} label="환영 화면" subtext="시작 / 로그인" color="#e0e7ff" stroke="#4f46e5"/>
      
      <Node x={300} y={240} width={150} height={70} label="로그인 화면" subtext="ID/PW 입력" />
      <Node x={750} y={240} width={150} height={70} label="회원가입 화면" subtext="ID/PW 생성" />
      <Node x={750} y={350} width={150} height={70} label="본인인증" subtext="PASS 인증" />
      <Node x={750} y={460} width={150} height={70} label="프로필 설정" subtext="닉네임, 아바타" />
      <Node x={525} y={240} width={150} height={60} label="소셜 로그인" subtext="Google, Kakao..." color="#d1fae5" stroke="#10b981" />

      <Node x={525} y={680} width={150} height={70} label="메인 앱" subtext="홈 화면" color="#c7d2fe" stroke="#4338ca" strokeWidth="2" />
      
      <rect x="730" y="620" width="450" height="130" rx="15" fill="none" stroke="#94a3b8" strokeDasharray="5,5" />
      <text x={955} y={610} textAnchor="middle" fontSize="12" fill="#64748b">하단 네비게이션</text>
      <Node x={740} y={640} width={100} height={50} label="증권" />
      <Node x={850} y={640} width={100} height={50} label="대회" />
      <Node x={960} y={640} width={100} height={50} label="랭킹" />
      <Node x={1070} y={640} width={100} height={50} label="프로필" />

      <Arrow path="M600,80 V120" />
      <Arrow path="M525,170 C450,170 400,200 375,240" label="로그인 선택" labelPos={{ x: 450, y: 200 }} />
      <Arrow path="M675,170 C725,170 750,200 775,240" label="시작하기 선택" labelPos={{ x: 725, y: 200 }} />
      <Arrow path="M600,190 V240" label="소셜 로그인" labelPos={{ x: 630, y: 215 }} />
      <Arrow path="M375,310 C375,450 450,550 525,680" label="로그인 성공" labelPos={{ x: 400, y: 500 }} />
      <Arrow path="M600,300 V680" label="소셜 로그인 성공" labelPos={{ x: 630, y: 500 }} />
      <Arrow path="M825,310 V350" />
      <Arrow path="M825,420 V460" />
      <Arrow path="M825,530 C825,600 650,620 600,680" label="회원가입 완료" labelPos={{ x: 800, y: 600 }} />
      <Arrow path="M675,715 H740" />
      <Arrow path="M710,700 C730,680 740,680 740,665" />
      <Arrow path="M710,700 C750,660 850,660 850,665" />
      <Arrow path="M710,700 C770,640 960,640 960,665" />
      <Arrow path="M710,700 C790,620 1070,620 1070,665" />
    </>
  );

  // Authentication Flow (상세)
  const AuthFlow = () => (
    <>
      <text x={600} y={30} textAnchor="middle" fontSize="20" fontWeight="bold" fill="#4f46e5">인증 플로우 (상세)</text>
      
      <Node x={50} y={80} width={140} height={60} label="앱 시작" color="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
      <Node x={250} y={80} width={140} height={60} label="환영 화면" color="#e0e7ff" stroke="#4f46e5" />
      
      <Decision x={420} y={110} size={40} label="선택?" />
      
      {/* 로그인 플로우 */}
      <Node x={250} y={200} width={140} height={60} label="로그인 화면" subtext="이메일/PW 입력" />
      <Decision x={320} y={310} size={35} label="유효?" />
      <Node x={250} y={380} width={140} height={50} label="로그인 성공" color="#d1fae5" stroke="#10b981" />
      <Node x={450} y={280} width={120} height={50} label="에러 메시지" color="#fee2e2" stroke="#ef4444" />
      
      {/* 소셜 로그인 */}
      <Node x={550} y={200} width={140} height={60} label="소셜 선택" subtext="Google/Kakao/Apple" color="#d1fae5" stroke="#10b981" />
      <Node x={550} y={300} width={140} height={60} label="OAuth 인증" />
      <Decision x={620} y={410} size={35} label="성공?" />
      <Node x={550} y={480} width={140} height={50} label="로그인 완료" color="#d1fae5" stroke="#10b981" />
      <Node x={770} y={380} width={120} height={50} label="인증 실패" color="#fee2e2" stroke="#ef4444" />
      
      {/* 회원가입 플로우 */}
      <Node x={850} y={200} width={140} height={60} label="회원가입" subtext="이메일/PW 생성" />
      <Decision x={920} y={310} size={35} label="유효?" />
      <Node x={850} y={380} width={140} height={60} label="PASS 본인인증" subtext="휴대폰 인증" />
      <Decision x={920} y={490} size={35} label="인증?" />
      <Node x={850} y={560} width={140} height={60} label="프로필 설정" subtext="닉네임/아바타" />
      <Node x={850} y={650} width={140} height={60} label="초기 자산 설정" subtext="1억원 가상 자산" />
      <Node x={850} y={740} width={140} height={60} label="가입 완료" color="#d1fae5" stroke="#10b981" />
      <Node x={1050} y={280} width={120} height={50} label="중복 에러" color="#fee2e2" stroke="#ef4444" />
      <Node x={1050} y={460} width={120} height={50} label="인증 실패" color="#fee2e2" stroke="#ef4444" />
      
      {/* 메인 앱 진입 */}
      <Node x={500} y={740} width={180} height={70} label="메인 앱 진입" subtext="홈 화면" color="#c7d2fe" stroke="#4338ca" strokeWidth="2" />
      
      {/* Arrows */}
      <Arrow path="M190,110 H250" />
      <Arrow path="M390,110 H460" />
      <Arrow path="M420,150 V200 H390" label="로그인" labelPos={{ x: 350, y: 175 }} />
      <Arrow path="M460,110 H550 V200" label="소셜" labelPos={{ x: 505, y: 155 }} />
      <Arrow path="M480,110 H850 V200" label="회원가입" labelPos={{ x: 665, y: 95 }} />
      
      <Arrow path="M320,260 V275" />
      <Arrow path="M320,345 V380" label="✓" labelPos={{ x: 300, y: 365 }} />
      <Arrow path="M355,310 H450" label="✗" labelPos={{ x: 400, y: 300 }} />
      <Arrow path="M450,310 V200 H390" dashed />
      
      <Arrow path="M620,260 V300" />
      <Arrow path="M620,360 V375" />
      <Arrow path="M620,445 V480" label="✓" labelPos={{ x: 600, y: 465 }} />
      <Arrow path="M655,410 H770" label="✗" labelPos={{ x: 710, y: 400 }} />
      <Arrow path="M770,405 V300 H690" dashed />
      
      <Arrow path="M920,260 V275" />
      <Arrow path="M920,345 V380" label="✓" labelPos={{ x: 900, y: 365 }} />
      <Arrow path="M955,310 H1050" label="✗" labelPos={{ x: 1000, y: 300 }} />
      <Arrow path="M1050,305 V230 H990" dashed />
      <Arrow path="M920,440 V455" />
      <Arrow path="M920,525 V560" label="✓" labelPos={{ x: 900, y: 545 }} />
      <Arrow path="M955,490 H1050" label="✗" labelPos={{ x: 1000, y: 480 }} />
      <Arrow path="M1050,485 V410 H990" dashed />
      <Arrow path="M920,620 V650" />
      <Arrow path="M920,710 V740" />
      
      <Arrow path="M320,430 C320,740 400,740 500,740" />
      <Arrow path="M620,530 C620,740 560,740 560,740" />
      <Arrow path="M920,800 C700,800 590,760 590,770" />
    </>
  );

  // Trading Flow (주식 투자)
  const TradingFlow = () => (
    <>
      <text x={600} y={30} textAnchor="middle" fontSize="20" fontWeight="bold" fill="#4f46e5">주식 투자 플로우 (상세)</text>
      
      <Node x={50} y={80} width={140} height={60} label="홈 화면" color="#c7d2fe" stroke="#4338ca" />
      <Node x={250} y={80} width={140} height={60} label="증권 탭 선택" color="#e0e7ff" stroke="#4f46e5" />
      
      <Decision x={490} y={110} size={40} label="하위탭?" />
      
      {/* 내 자산 플로우 */}
      <Node x={50} y={200} width={140} height={60} label="내 자산" subtext="포트폴리오" />
      <Node x={50} y={300} width={140} height={60} label="보유 종목 조회" subtext="수익률/평가액" />
      <Node x={50} y={400} width={140} height={60} label="종목 선택" />
      <Node x={50} y={500} width={140} height={60} label="종목 상세" />
      
      {/* 탐색 플로우 */}
      <Node x={300} y={200} width={140} height={60} label="탐색" subtext="종목 검색" />
      <Node x={300} y={300} width={140} height={60} label="검색/카테고리" subtext="업종별/인기순" />
      <Decision x={370} y={410} size={35} label="필터?" />
      <Node x={300} y={480} width={140} height={60} label="검색 결과" />
      <Node x={520} y={380} width={120} height={50} label="시가총액 필터" color="#fef3c7" />
      <Node x={520} y={450} width={120} height={50} label="수익률 필터" color="#fef3c7" />
      <Node x={300} y={580} width={140} height={60} label="종목 선택" />
      <Node x={300} y={680} width={140} height={60} label="종목 상세" />
      
      {/* 종목 상세 공통 */}
      <Node x={550} y={580} width={160} height={70} label="종목 상세 화면" subtext="차트/지표/뉴스" color="#ddd6fe" stroke="#7c3aed" strokeWidth="2" />
      <Node x={550} y={700} width={80} height={50} label="매수" color="#d1fae5" stroke="#10b981" />
      <Node x={650} y={700} width={80} height={50} label="매도" color="#fee2e2" stroke="#ef4444" />
      
      {/* 주문 플로우 */}
      <Decision x={800} y={725} size={40} label="주문?" />
      <Node x={950} y={660} width={140} height={60} label="주문 모달" subtext="시장가/지정가" />
      <Node x={950} y={750} width={140} height={60} label="수량/가격 입력" />
      <Decision x={1020} y={860} size={35} label="확인?" />
      <Node x={950} y={930} width={140} height={60} label="주문 실행" color="#d1fae5" stroke="#10b981" />
      <Node x={1150} y={830} width={100} height={50} label="취소" color="#fee2e2" stroke="#ef4444" />
      <Node x={800} y={930} width={100} height={60} label="체결 알림" />
      <Node x={800} y={1030} width={140} height={60} label="포트폴리오 갱신" />
      
      {/* 분석 플로우 */}
      <Node x={50} y={700} width={140} height={60} label="분석 탭" />
      <Node x={50} y={800} width={140} height={60} label="AI 투자 분석" subtext="투자 성향 파악" color="#ddd6fe" stroke="#7c3aed" />
      <Node x={50} y={900} width={140} height={60} label="추천 종목" subtext="AI 기반 추천" />
      <Node x={50} y={1000} width={140} height={60} label="종목 상세 이동" />
      
      {/* Arrows */}
      <Arrow path="M190,110 H250" />
      <Arrow path="M390,110 H450" />
      <Arrow path="M490,150 V200 H190" label="내 자산" labelPos={{ x: 340, y: 175 }} />
      <Arrow path="M490,110 H300 V200" label="탐색" labelPos={{ x: 395, y: 100 }} />
      <Arrow path="M120,260 V300" />
      <Arrow path="M120,360 V400" />
      <Arrow path="M120,460 V500" />
      <Arrow path="M370,260 V300" />
      <Arrow path="M370,360 V375" />
      <Arrow path="M370,445 V480" label="기본" labelPos={{ x: 350, y: 465 }} />
      <Arrow path="M405,410 H520" label="필터" labelPos={{ x: 460, y: 400 }} />
      <Arrow path="M520,405 V360 H440" dashed />
      <Arrow path="M520,475 V440 H440" dashed />
      <Arrow path="M370,540 V580" />
      <Arrow path="M370,640 V680" />
      <Arrow path="M440,700 H550" />
      <Arrow path="M190,520 H550 V580" />
      <Arrow path="M630,650 V700" label="매수" labelPos={{ x: 610, y: 675 }} />
      <Arrow path="M690,650 V700" label="매도" labelPos={{ x: 710, y: 675 }} />
      <Arrow path="M590,725 H760" />
      <Arrow path="M690,725 H760" />
      <Arrow path="M840,725 H950" label="선택" labelPos={{ x: 895, y: 715 }} />
      <Arrow path="M800,765 V930" label="뒤로" labelPos={{ x: 780, y: 850 }} dashed />
      <Arrow path="M1020,720 V750" />
      <Arrow path="M1020,810 V825" />
      <Arrow path="M1020,895 V930" label="✓" labelPos={{ x: 1000, y: 915 }} />
      <Arrow path="M1055,860 H1150" label="✗" labelPos={{ x: 1100, y: 850 }} />
      <Arrow path="M1150,855 V770 H1090" dashed />
      <Arrow path="M950,960 H900" />
      <Arrow path="M800,990 V1030" />
      <Arrow path="M120,560 V700" />
      <Arrow path="M120,760 V800" />
      <Arrow path="M120,860 V900" />
      <Arrow path="M120,960 V1000" />
      <Arrow path="M190,1020 H550 V650" dashed />
    </>
  );

  // Competition Flow (대회)
  const CompetitionFlow = () => (
    <>
      <text x={600} y={30} textAnchor="middle" fontSize="20" fontWeight="bold" fill="#4f46e5">대회 플로우 (상세)</text>
      
      <Node x={50} y={80} width={140} height={60} label="홈 화면" color="#c7d2fe" stroke="#4338ca" />
      <Node x={250} y={80} width={140} height={60} label="대회 탭 선택" color="#e0e7ff" stroke="#4f46e5" />
      
      {/* 대회 목록 */}
      <Node x={450} y={80} width={160} height={60} label="대회 목록 화면" />
      <Decision x={630} y={110} size={40} label="액션?" />
      
      {/* 대회 참여 플로우 */}
      <Node x={450} y={200} width={140} height={60} label="대회 선택" />
      <Node x={450} y={300} width={140} height={60} label="대회 상세 정보" subtext="규칙/상금/기간" />
      <Decision x={520} y={410} size={35} label="참여?" />
      <Node x={450} y={480} width={140} height={60} label="참여 확인" color="#d1fae5" stroke="#10b981" />
      <Node x={450} y={580} width={140} height={60} label="대회용 계좌 생성" subtext="초기 자산 할당" />
      <Node x={450} y={680} width={140} height={60} label="대회 진행 중" />
      <Node x={450} y={780} width={140} height={60} label="실시간 순위 확인" />
      <Node x={700} y={380} width={120} height={50} label="취소" color="#fee2e2" stroke="#ef4444" />
      
      {/* 대회 생성 플로우 */}
      <Node x={800} y={200} width={140} height={60} label="대회 만들기" />
      <Node x={800} y={300} width={140} height={60} label="대회 정보 입력" subtext="제목/설명" />
      <Node x={800} y={400} width={140} height={60} label="규칙 설정" subtext="기간/초기금/수수료" />
      <Node x={800} y={500} width={140} height={60} label="공개 범위 설정" subtext="전체/친구/비공개" />
      <Node x={800} y={600} width={140} height={60} label="상금 설정" subtext="1/2/3등 배분" />
      <Decision x={870} y={710} size={35} label="확인?" />
      <Node x={800} y={780} width={140} height={60} label="대회 생성 완료" color="#d1fae5" stroke="#10b981" />
      <Node x={1020} y={680} width={100} height={50} label="취소" color="#fee2e2" stroke="#ef4444" />
      <Node x={800} y={880} width={140} height={60} label="대회 목록에 추가" />
      
      {/* 대회 중 활동 */}
      <Node x={200} y={680} width={140} height={60} label="증권 거래" subtext="대회용 계좌" />
      <Node x={200} y={780} width={140} height={60} label="순위 변동" />
      <Node x={200} y={880} width={140} height={60} label="알림 수신" subtext="순위/종료 임박" />
      
      {/* 대회 종료 */}
      <Node x={450} y={920} width={140} height={60} label="대회 종료" color="#fef3c7" stroke="#f59e0b" />
      <Node x={450} y={1020} width={140} height={60} label="최종 순위 발표" />
      <Decision x={520} y={1130} size={35} label="입상?" />
      <Node x={450} y={1200} width={140} height={60} label="보상 지급" subtext="칭호/배지" color="#d1fae5" stroke="#10b981" />
      <Node x={700} y={1100} width={120} height={50} label="참가 기록" />
      
      {/* Arrows */}
      <Arrow path="M190,110 H250" />
      <Arrow path="M390,110 H450" />
      <Arrow path="M610,110 H670" />
      <Arrow path="M630,150 V200 H590" label="참여" labelPos={{ x: 600, y: 175 }} />
      <Arrow path="M670,110 H800 V200" label="생성" labelPos={{ x: 735, y: 100 }} />
      <Arrow path="M520,260 V300" />
      <Arrow path="M520,360 V375" />
      <Arrow path="M520,445 V480" label="✓" labelPos={{ x: 500, y: 465 }} />
      <Arrow path="M555,410 H700" label="✗" labelPos={{ x: 625, y: 400 }} />
      <Arrow path="M700,405 V280 H590" dashed />
      <Arrow path="M520,540 V580" />
      <Arrow path="M520,640 V680" />
      <Arrow path="M520,740 V780" />
      <Arrow path="M870,260 V300" />
      <Arrow path="M870,360 V400" />
      <Arrow path="M870,460 V500" />
      <Arrow path="M870,560 V600" />
      <Arrow path="M870,660 V675" />
      <Arrow path="M870,745 V780" label="✓" labelPos={{ x: 850, y: 765 }} />
      <Arrow path="M905,710 H1020" label="✗" labelPos={{ x: 960, y: 700 }} />
      <Arrow path="M1020,705 V620 H940" dashed />
      <Arrow path="M870,840 V880" />
      <Arrow path="M800,910 H590" />
      <Arrow path="M390,700 H450" />
      <Arrow path="M270,740 V780" />
      <Arrow path="M270,840 V880" />
      <Arrow path="M340,700 C380,700 400,740 450,740" />
      <Arrow path="M340,800 C380,800 400,800 450,800" />
      <Arrow path="M520,840 V920" />
      <Arrow path="M520,980 V1020" />
      <Arrow path="M520,1080 V1095" />
      <Arrow path="M520,1165 V1200" label="✓" labelPos={{ x: 500, y: 1185 }} />
      <Arrow path="M555,1130 H700" label="✗" labelPos={{ x: 625, y: 1120 }} />
      <Arrow path="M700,1125 V1060 H590" dashed />
    </>
  );

  // Social Flow (소셜)
  const SocialFlow = () => (
    <>
      <text x={600} y={30} textAnchor="middle" fontSize="20" fontWeight="bold" fill="#4f46e5">소셜 기능 플로우 (상세)</text>
      
      <Node x={50} y={80} width={140} height={60} label="홈 화면" color="#c7d2fe" stroke="#4338ca" />
      <Node x={250} y={80} width={140} height={60} label="랭킹 탭 선택" color="#e0e7ff" stroke="#4f46e5" />
      
      {/* 랭킹 화면 */}
      <Node x={450} y={80} width={160} height={60} label="랭킹 화면" />
      <Decision x={630} y={110} size={40} label="필터?" />
      
      {/* 랭킹 조회 */}
      <Node x={450} y={200} width={140} height={60} label="전체 랭킹" subtext="수익률 순" />
      <Node x={750} y={80} width={120} height={50} label="친구만" color="#fef3c7" />
      <Node x={750} y={150} width={120} height={50} label="대회별" color="#fef3c7" />
      <Node x={450} y={300} width={140} height={60} label="유저 리스트" subtext="순위/수익률/칭호" />
      <Node x={450} y={400} width={140} height={60} label="유저 선택" />
      
      {/* 유저 프로필 */}
      <Node x={450} y={500} width={160} height={70} label="유저 프로필 모달" subtext="상세 정보" color="#ddd6fe" stroke="#7c3aed" strokeWidth="2" />
      <Node x={450} y={610} width={140} height={60} label="투자 성향" subtext="레이더 차트" />
      <Node x={450} y={710} width={140} height={60} label="대표 칭호/배지" />
      <Node x={450} y={810} width={140} height={60} label="최근 거래 내역" />
      
      <Decision x={720} y={640} size={40} label="액션?" />
      
      {/* 라이벌 추가 */}
      <Node x={850} y={580} width={140} height={60} label="라이벌 추가" color="#d1fae5" stroke="#10b981" />
      <Node x={850} y={680} width={140} height={60} label="라이벌 목록에 추가" />
      <Node x={850} y={780} width={140} height={60} label="실시간 비교" subtext="수익률 경쟁" />
      
      {/* 메시지 */}
      <Node x={1050} y={580} width={140} height={60} label="메시지 보내기" color="#e0e7ff" stroke="#4f46e5" />
      <Node x={1050} y={680} width={140} height={60} label="대화방 생성" />
      <Node x={1050} y={780} width={140} height={60} label="투자 의견 교환" />
      
      {/* 프로필 화면 */}
      <Node x={50} y={400} width={140} height={60} label="MY 탭" />
      <Node x={50} y={500} width={140} height={60} label="내 프로필" subtext="통계/성향" />
      <Node x={50} y={600} width={140} height={60} label="획득 칭호 관리" />
      <Node x={50} y={700} width={140} height={60} label="대표 칭호 설정" />
      <Node x={50} y={800} width={140} height={60} label="친구 목록" />
      <Node x={50} y={900} width={140} height={60} label="라이벌 목록" />
      <Node x={50} y={1000} width={140} height={60} label="활동 기록" subtext="거래/대회" />
      
      {/* 친구/라이벌 관리 */}
      <Decision x={270} y={930} size={35} label="선택?" />
      <Node x={350} y={900} width={120} height={50} label="프로필 보기" />
      <Node x={350} y={970} width={120} height={50} label="비교 분석" color="#ddd6fe" stroke="#7c3aed" />
      <Node x={350} y={1040} width={120} height={50} label="삭제" color="#fee2e2" stroke="#ef4444" />
      
      {/* 알림 */}
      <Node x={650} y={900} width={140} height={60} label="알림 센터" />
      <Node x={650} y={1000} width={140} height={60} label="라이벌 추월" subtext="순위 변동" color="#fef3c7" stroke="#f59e0b" />
      <Node x={650} y={1100} width={140} height={60} label="메시지 수신" />
      <Node x={650} y={1200} width={140} height={60} label="대회 초대" />
      
      {/* Arrows */}
      <Arrow path="M190,110 H250" />
      <Arrow path="M390,110 H450" />
      <Arrow path="M610,110 H670" />
      <Arrow path="M630,150 V200 H590" label="전체" labelPos={{ x: 600, y: 175 }} />
      <Arrow path="M670,110 H750" label="필터" labelPos={{ x: 710, y: 100 }} />
      <Arrow path="M750,105 V80 H610" dashed />
      <Arrow path="M750,175 V140 H610" dashed />
      <Arrow path="M530,260 V300" />
      <Arrow path="M530,360 V400" />
      <Arrow path="M530,460 V500" />
      <Arrow path="M530,570 V610" />
      <Arrow path="M530,670 V710" />
      <Arrow path="M530,770 V810" />
      <Arrow path="M590,640 H680" />
      <Arrow path="M760,640 H850" label="라이벌" labelPos={{ x: 805, y: 630 }} />
      <Arrow path="M760,610 H1050 V580" label="메시지" labelPos={{ x: 905, y: 570 }} />
      <Arrow path="M920,640 V680" />
      <Arrow path="M920,740 V780" />
      <Arrow path="M1120,640 V680" />
      <Arrow path="M1120,740 V780" />
      <Arrow path="M120,460 V500" />
      <Arrow path="M120,560 V600" />
      <Arrow path="M120,660 V700" />
      <Arrow path="M120,760 V800" />
      <Arrow path="M120,860 V900" />
      <Arrow path="M120,960 V1000" />
      <Arrow path="M190,930 V900 H350" />
      <Arrow path="M270,965 H350" />
      <Arrow path="M270,1000 H350 V1040" />
      <Arrow path="M190,950 H650 V900" />
      <Arrow path="M720,960 V1000" />
      <Arrow path="M720,1060 V1100" />
      <Arrow path="M720,1160 V1200" />
    </>
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-3 p-2 bg-slate-100 rounded-lg flex-wrap">
        <button
          onClick={() => setActiveFlow('overview')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeFlow === 'overview' ? 'bg-primary text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
          }`}
        >
          📱 전체 개요
        </button>
        <button
          onClick={() => setActiveFlow('auth')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeFlow === 'auth' ? 'bg-primary text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
          }`}
        >
          🔐 로그인/회원가입
        </button>
        <button
          onClick={() => setActiveFlow('trading')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeFlow === 'trading' ? 'bg-primary text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
          }`}
        >
          💹 주식 투자
        </button>
        <button
          onClick={() => setActiveFlow('competition')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeFlow === 'competition' ? 'bg-primary text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
          }`}
        >
          🏆 대회
        </button>
        <button
          onClick={() => setActiveFlow('social')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeFlow === 'social' ? 'bg-primary text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
          }`}
        >
          👥 소셜/랭킹
        </button>
      </div>

      {/* Flow Diagram */}
      <div className="p-6 bg-white rounded-lg border border-slate-200 overflow-x-auto">
        <svg width="1200" height={activeFlow === 'overview' ? '800' : '1300'} viewBox={`0 0 1200 ${activeFlow === 'overview' ? '800' : '1300'}`} className="min-w-[1200px]">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L10,3.5 L0,7 Z" fill="#64748b" />
            </marker>
          </defs>
          
          {activeFlow === 'overview' && <OverviewFlow />}
          {activeFlow === 'auth' && <AuthFlow />}
          {activeFlow === 'trading' && <TradingFlow />}
          {activeFlow === 'competition' && <CompetitionFlow />}
          {activeFlow === 'social' && <SocialFlow />}
        </svg>
      </div>

      {/* Legend */}
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
        <h4 className="font-bold text-slate-700 mb-3">범례 (Legend)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-100 border-2 border-slate-400 rounded"></div>
            <span>일반 화면</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 border-2 border-indigo-600 rounded"></div>
            <span>주요 화면</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 border-2 border-green-500 rounded"></div>
            <span>성공 상태</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-100 border-2 border-red-500 rounded"></div>
            <span>에러 상태</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-100 border-2 border-amber-500 rounded transform rotate-45"></div>
            <span>분기/결정</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-slate-500"></div>
            <span>→</span>
            <span>플로우</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-slate-500 border-dashed" style={{ borderTop: '1.5px dashed #64748b', height: 0 }}></div>
            <span>→</span>
            <span>되돌아가기</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 border-2 border-purple-600 rounded"></div>
            <span>특수 기능</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFlowDiagram;
