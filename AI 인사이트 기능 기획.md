# 🚀 StockIt: 대한민국 국장 특화 AI 인사이트 대시보드 마스터 명세서

> **문서 권한 및 목적**: 본 문서는 기존 StockIt PWA(Next.js + Supabase) 프로젝트에 **새로운 '인사이트' 탭**을 구축하기 위한 **단일 진실 공급원(Single Source of Truth)**입니다.
> **핵심 변경점**: 정적 리포트 발행 방식을 폐기하고, **장 운영 시간(Pre/Active/Post)**에 따라 실시간으로 변하는 **위젯 기반 대시보드**를 구축합니다.

---

## 1. 프로젝트 컨텍스트 및 목표

### 1.1. 환경 정보 (Prerequisites)

- **Project Type**: Next.js 15 PWA (Mobile Web App).
- **Database**: Supabase (PostgreSQL).
- **Focus Market**: **South Korea Only (KOSPI, KOSDAQ)**. 해외 데이터는 국장에 미치는 영향 분석용으로만 사용.
- **UX Philosophy**: Toss Securities Style (Visual, Chunked, Contextual).

### 1.2. 기능 정의: "Live Insight Dashboard"

사용자가 앱을 켜는 순간, 그 시간에 가장 필요한 한국 증시 정보를 보여줍니다.

- **아침 (08:00)**: "미국장이 올랐으니, 오늘 국장 반도체도 오를까요?"
- **장중 (12:00)**: "지금 외국인이 뭘 사고 있나요?"
- **마감 (16:00)**: "오늘 누가 상한가 갔나요? 내일은 뭐가 좋을까요?"

---

## 2. 데이터 소스 및 수집 전략 (Data Pipeline & Fact Sheet)

**"Fact Sheet" 중심의 데이터 파이프라인**을 구축합니다. AI에게 원본 데이터를 그대로 던지는 것이 아니라, **Next.js 서버에서 1차 가공된 "Fact Sheet(사실 관계 정의서)"를 생성**하여 할루시네이션을 방지하고 분석의 정확도를 높입니다.

### 2.1. 데이터 소스 (Data Sources)

| 소스 (Source)     | 수집 방식 (Method)                      | 대상 데이터 (Target Data)                                                                                           | 수집 주기 (Frequency) |
| :---------------- | :-------------------------------------- | :------------------------------------------------------------------------------------------------------------------ | :-------------------- |
| **Naver Finance** | **Crawling** (`cheerio`)                | **[국장]** 코스피/코스닥 지수, 시총 상위 50위 등락, 외국인/기관 수급(잠정), 섹터별 등락률, 주요 뉴스(많이 본 뉴스). | 10분 간격 (장중)      |
| **Yahoo Finance** | **API** (`axios`)                       | **[미장]** 나스닥, S&P500, 필라델피아 반도체, VIX(공포지수), 주요 기술주(엔비디아, 테슬라, 애플) 종가.              | 장 시작 전 1회        |
| **FRED**          | **API** (`axios`)                       | **[거시]** 원/달러 환율, 미국 10년물 국채금리, WTI 유가.                                                            | 장 시작 전 1회        |
| **Open DART**     | **API** (`axios`)                       | **[공시]** 실시간 주요 공시 (단일판매계약, 무상증자, 유상증자, 배당, 실적발표).                                     | 30분 간격 (장중)      |
| **Google Trends** | **Crawling** (`puppeteer` or `cheerio`) | **[트렌드]** 실시간 검색어 내 주식 관련 키워드 추출 (대중의 관심도 파악).                                           | 1시간 간격            |

### 2.2. 데이터 가공 파이프라인 (Pre-processing on Next.js Server)

클라이언트가 아닌 **Next.js API Route (Server-side)**에서 모든 데이터 수집 및 가공이 이루어집니다.

1.  **Raw Data Collection**: 위 소스에서 데이터를 수집.
2.  **Cleaning & Normalization**: HTML 태그 제거, 불필요한 공백 제거, 숫자 단위 통일(억 원, % 등).
3.  **Fact Sheet Generation**: 수집된 데이터를 하나의 거대한 텍스트/JSON 파일인 **"Daily Market Fact Sheet"**로 병합.
    - _예시: "2024-05-20 09:30 Fact Sheet - 코스피 2700 돌파, 외국인 삼성전자 2000억 매수 중, 환율 1350원 하락..."_
4.  **Storage**: 생성된 Fact Sheet를 Supabase `market_fact_sheets` 테이블에 저장 (History 관리).

## 3. 동적 위젯 시스템 (Dynamic Widget Pool)

고정된 위젯을 보여주는 것이 아니라, **AI가 현재 시장 상황에 가장 적합한 위젯을 "Widget Pool"에서 선택하여 배치**합니다.

### 3.1. 위젯 풀 (Widget Pool)

| 위젯 ID               | 설명                                           | 데이터 소스               | 시각화 형태              |
| :-------------------- | :--------------------------------------------- | :------------------------ | :----------------------- |
| **`HeroHeader`**      | 최상단 메인 브리핑. 한 줄 요약 + 감정 이모지.  | AI 생성                   | 텍스트 + 배경 그라디언트 |
| **`MarketGauge`**     | 공포/탐욕 지수 또는 매수 우위 강도.            | Naver (상승/하락 종목 수) | 반원형 게이지 차트       |
| **`SectorHeatmap`**   | 현재 주도 섹터와 소외 섹터 시각화.             | Naver (섹터 등락)         | 트리맵 (Treemap)         |
| **`SupplyTrend`**     | 외국인/기관의 실시간 순매수 추이.              | Naver (투자자별 매매동향) | 라인 차트 (Line Chart)   |
| **`StockCarousel`**   | 특정 테마(예: "외국인이 담는 중") 종목 리스트. | Naver (수급 상위)         | 가로 스크롤 카드         |
| **`NewsBrief`**       | 핵심 뉴스 3줄 요약.                            | Naver News                | 리스트 (List)            |
| **`DartSignal`**      | 실시간 호재 공시 포착.                         | Open DART                 | 알림 카드 (Toast Style)  |
| **`GlobalIndex`**     | 주요 해외 지수 (나스닥, 환율 등).              | Yahoo, FRED               | 미니 카드 그리드         |
| **`ThemeRanking`**    | 현재 급등하는 테마 (예: 초전도체, HBM).        | Naver (테마)              | 순위 리스트              |
| **`MarketNarrative`** | 시장 상황을 줄글로 풀어낸 스토리텔링 위젯.     | AI 생성 (Pro)             | 텍스트 (본문형)          |
| **`AnalystNote`**     | 특정 종목/섹터에 대한 심층 분석 노트.          | AI 생성 (Pro)             | 텍스트 + 인용구          |
| **`KeywordCloud`**    | 현재 시장을 관통하는 키워드 시각화.            | Google Trends             | 워드 클라우드            |
| **`ScheduleList`**    | 오늘/내일 주요 경제 일정 리스트.               | Investing.com             | 타임라인 리스트          |

### 3.2. AI 레이아웃 결정 로직 (Layout Architect)

AI는 Fact Sheet를 분석한 후, 다음 기준에 따라 위젯을 배치합니다. **단순 나열이 아니라, "기승전결"이 있는 스토리텔링 구조를 지향합니다.**

- **폭락장 (Bear Market)**:
  1.  `HeroHeader` (위로/침착): "시장이 많이 놀랐네요. 잠시 숨을 고를 때입니다."
  2.  `MarketGauge` (공포 지수): 현재 공포 단계 시각화.
  3.  `MarketNarrative`: 하락의 원인과 배경 설명 (줄글).
  4.  `SectorHeatmap`: 그나마 방어하고 있는 섹터 확인.
- **상승장 (Bull Market)**:
  1.  `HeroHeader` (흥분/기회): "오늘 시장, 분위기가 아주 좋아요! 🎉"
  2.  `StockCarousel`: 지금 외국인이 쓸어담는 주도주.
  3.  `AnalystNote`: 왜 이 섹터가 오르는지 심층 분석.
  4.  `SupplyTrend`: 수급이 계속 들어오는지 확인.
- **횡보장 (Sideways)**:
  1.  `HeroHeader` (관망): "뚜렷한 방향 없이 눈치보기 장세입니다."
  2.  `ThemeRanking`: 지수는 조용하지만 뜨거운 테마 찾기.
  3.  `DartSignal`: 개별 호재 공시로 수익 기회 포착.

---

## 4. 데이터베이스 스키마 (Supabase)

AI가 생성한 **레이아웃(Layout)**과 **위젯 데이터(Data)**를 분리하거나 통합하여 저장합니다. 여기서는 유연성을 위해 **통합 JSONB 구조**를 채택합니다.

```sql
-- 1. 인사이트 스냅샷 테이블 (AI가 생성한 최종 결과물)
CREATE TABLE insight_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- 생성 시점의 모드 (morning, active, closing, weekend)
  mode_type VARCHAR(20) NOT NULL,

  -- AI가 결정한 레이아웃 및 위젯 데이터 전체
  -- 구조: {
  --   "layout": ["HeroHeader", "SupplyTrend", "StockCarousel"],
  --   "widgets": {
  --     "HeroHeader": { ... },
  --     "SupplyTrend": { ... }
  --   }
  -- }
  payload JSONB NOT NULL,

  -- AI 분석의 근거가 된 Fact Sheet ID (Traceability)
  fact_sheet_id UUID REFERENCES market_fact_sheets(id),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Market Fact Sheet (AI 분석 원천 데이터)
CREATE TABLE market_fact_sheets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  raw_content TEXT NOT NULL, -- 텍스트로 변환된 시장 데이터
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DART 캐시 (중복 방지)
CREATE TABLE dart_cache (
  rcept_no VARCHAR(20) PRIMARY KEY,
  corp_name VARCHAR(100),
  report_nm VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5\. AI 하이브리드 파이프라인 및 모델 전략

비용 최적화를 위해 Flash와 Pro 모델을 역할에 따라 분리하여 사용합니다.

### 5.1. 모델 역할 분담

- **Gemini 2.5 Flash (Sub LLM)**:
  - **역할**: "데이터 처리반 (Data Processor)".
  - **임무**:
    1.  방대한 뉴스 기사/공시 텍스트를 읽고 핵심 3줄 요약.
    2.  HTML 태그 제거 및 데이터 정제.
    3.  Fact Sheet의 기초 데이터 블록 생성.
  - **특징**: 속도 빠름, 비용 저렴, 단순 반복 작업 특화.
- **Gemini 2.5 Pro (Main LLM)**:
  - **역할**: "수석 애널리스트 & 편집장 (Chief Analyst & Editor)".
  - **임무**:
    1.  Flash가 정리한 Fact Sheet를 읽고 시장의 맥락(Context) 파악.
    2.  `HeroHeader`의 감성적인 멘트 작성 ("오늘장은 마치 롤러코스터 같네요 🎢").
    3.  `MarketNarrative`, `AnalystNote`와 같은 줄글 위젯 작성.
    4.  최종 위젯 레이아웃 결정 (어떤 위젯을 어디에 배치할지).
  - **특징**: 높은 추론 능력, 창의적인 글쓰기, JSON 구조 설계 능력.

---

## 6\. AI 프롬프트 엔지니어링 전략 (System Prompts)

**핵심**: AI에게 "너는 한국 주식 전문가이고, JSON 포맷터야"라는 역할을 부여합니다.

### 6.1. 공통 시스템 프롬프트 (Common System Prompt)

```text
Role: You are an AI Stock Analyst specializing in the South Korean market (KOSPI/KOSDAQ).
Task: Convert raw financial data into a JSON structure for UI widgets.
Tone: Witty, Concise, Professional yet Friendly (Toss Style).
Output Format: JSON Only. No Markdown. No Explanations outside JSON.
Constraints:
1. All stock names must be in Korean.
2. Provide specific reasoning for market movements based on the context provided.
3. If US data is provided, explain its impact on specific Korean sectors (e.g., Tesla -> K-Battery).
```

### 6.2. 모드별 프롬프트 시나리오 (Active Mode Example)

**Input Data**:

- Naver Finance Real-time Supply: Foreigners buying KOSPI (+2000억), Selling KOSDAQ (-500억).
- Top Sectors: Secondary Battery (+3.5%), Semiconductor (+1.2%).
- Exchange Rate: 1350 KRW/USD (Down).

**Task Prompt**:

```text
Based on the input data:
1. Generate a 'HeroHeader' widget.
   - Title: Summarize the main supply trend (e.g., "Foreigners are picking up Batteries").
   - Mood: 'bull' if main index is up, else 'bear'.
2. Generate a 'LiveSupply' widget showing Top 3 stocks bought by foreigners.
3. Generate a 'MarketMood' score (0-100) based on the advance/decline ratio.
```

---

## 7\. 구현 로직 상세 가이드 (Logic Flow)

### Step 1: Fact Sheet 생성 (Scheduled Cron Job)

**실시간이 아닌, 정해진 시간에 "스냅샷"을 찍듯이 데이터를 수집하고 가공합니다.**

1.  **Cron Schedule**: `vercel.json`에 정의된 시간에 맞춰 `/api/insight/collect` 실행.
    - **08:30 (Morning)**: 미장 마감 직후, 국장 개장 전 전략 수립.
    - **12:00 (Active)**: 오전장 수급 분석 및 오후장 대응 전략.
    - **15:30 (Closing)**: 장 마감 직후, 오늘 시장 요약 및 내일 준비. (15:00 -> 15:30으로 변경: 장 마감 데이터 확보)
2.  **Parallel Fetching**: `Promise.all`을 사용하여 Naver, Yahoo, DART 등에서 동시에 데이터 수집.

3.  **Fact Sheet Assembly**: 수집된 데이터를 구조화된 텍스트로 변환.

    ```text
    [Market Status]
    Time: 2024-05-20 10:00 KST
    KOSPI: 2750.55 (+1.2%)
    USD/KRW: 1360.5 (-5.0)

    [Supply]
    Foreigner: Buying Samsung Elec (+1500B), Hynix (+500B)
    Institution: Selling Kakao (-200B)

    [Global Context]
    Nasdaq ended +2.5% led by Nvidia.
    ```

4.  **Save**: `market_fact_sheets` 테이블에 저장.

### Step 2: AI Layout & Widget Generation (LLM Processing)

1.  **Trigger**: Fact Sheet가 저장되면, 이어서 `/api/insight/analyze` 호출.
2.  **Prompting**: "Fact Sheet를 기반으로 현재 상황에 가장 적합한 위젯 레이아웃을 구성해줘."
3.  **LLM Output (JSON)**:
    ```json
    {
      "layout_strategy": "bull_market_focus",
      "widgets": [
        { "type": "HeroHeader", "data": { "title": "반도체 불장! 외국인 폭풍 매수 중 🔥", "mood": "excited" } },
        { "type": "SectorHeatmap", "data": { "focus": "Semiconductor", "change": "+3.5%" } },
        { "type": "StockCarousel", "data": { "title": "지금 외국인이 사는 주식", "items": [...] } }
      ]
    }
    ```
4.  **Save**: `insight_widgets` 테이블에 저장 (기존 방식과 달리, 레이아웃 자체를 저장).

### Step 3: 클라이언트 렌더링 (Frontend)

1.  **Fetch**: 클라이언트는 `insight_widgets` 테이블에서 가장 최신의 레코드를 조회.
2.  **Dynamic Component Mapping**: `widget.type`에 따라 컴포넌트 렌더링.
    - `HeroHeader` -> `<HeroHeader />`
    - `SectorHeatmap` -> `<SectorHeatmap />`
    - `StockCarousel` -> `<StockCarousel />`
    - `NewsList` -> `<NewsList />`
3.  **Toss Style UI**: 각 컴포넌트는 토스 증권 스타일의 깔끔하고 직관적인 UI/UX 적용 (큰 폰트, 명확한 카드 구분, 부드러운 인터랙션).

---

## 9. UI/UX 디자인 시스템 (Toss Style)

**"복잡한 금융 정보를 쉽고 예쁘게"** 보여주는 것이 핵심입니다.

### 9.1. Design Principles

1.  **Big & Bold Typography**: 핵심 숫자는 아주 크게(32px+), 설명은 작게(14px).
2.  **Card-based Layout**: 모든 정보는 카드(Container) 안에 담기며, 카드 간 간격은 넉넉하게(16px~24px).
3.  **Micro-Interaction**: 터치 시 카드가 살짝 눌리는 효과(Scale Down), 스크롤 시 부드러운 진입 애니메이션(Fade In Up).
4.  **Color Palette**:
    - **상승(Bull)**: `Toss Red` (#F04452)
    - **하락(Bear)**: `Toss Blue` (#3182F6)
    - **배경(Bg)**: `Off-White` (#F2F4F6) 또는 `Dark Gray` (#191F28) - 다크모드 필수.

### 9.2. Component Specs

#### A. `HeroHeader`

- **구성**: [이모지 아이콘] + [메인 카피(2줄)] + [서브 카피(1줄)].
- **스타일**: 그라디언트 배경 사용. (예: 상승장이면 붉은색 은은한 그라디언트).
- **예시**:
  > 🔥 **오늘 반도체가 뜨겁네요!**
  > 외국인이 하이닉스를 쓸어담고 있어요.

#### B. `StockCarousel` (가로 스크롤)

- **구성**: [종목명] + [현재가] + [등락률(뱃지)].
- **인터랙션**: 스냅 스크롤(Snap Scroll) 적용.
- **데이터**: 로고 이미지 필수 (없으면 텍스트 아바타).

#### C. `MarketGauge` (반원 차트)

- **구성**: [바늘(Indicator)] + [현재 상태 텍스트(공포/탐욕)].
- **애니메이션**: 페이지 진입 시 바늘이 0에서 현재 값으로 부드럽게 회전.

#### D. `DartSignal` (토스트/알림 카드)

- **구성**: [종목명] + [공시 제목(핵심만)] + [시간(방금 전)].
- **스타일**: 그림자(Shadow)를 강하게 주어 떠있는 느낌 강조.

---

## 10. 에지 케이스 및 예외 처리

- **공휴일/주말**: 평일 로직 대신 '주간 리뷰' 모드(Mode D)로 자동 전환하거나, 최근 금요일 마감 데이터 유지.
- **크롤링 차단**: 네이버 금융 구조 변경 시, `Supabase`에 저장된 이전 성공 데이터를 보여주되 상단에 "데이터 업데이트 지연 중" 토스트 메시지 노출.
- **Open DART API 한도**: 하루 호출 횟수 제한이 있으므로, 장중에만 30분 단위로 호출하도록 스케줄러 최적화.
- **LLM 할루시네이션**: 숫자 데이터(주가, 등락률)는 LLM이 생성하게 하지 말고, 크롤링한 원본 데이터를 프론트엔드에서 바인딩하는 것이 안전함. (LLM은 텍스트 해석과 '이유' 생성에 집중).
