# 오늘의 증시 리포트 기능 설정 가이드

이 문서는 AI 기반 '오늘의 증시 리포트' 기능의 설정 및 실행 방법을 안내합니다.

## 1. 환경 변수 설정

프로젝트 루트 경로의 `.env.local` 파일에 다음 환경 변수들이 설정되어 있어야 합니다.

```env
# Supabase 설정 (데이터 캐싱용)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini API 설정 (AI 리포트 생성용)
GEMINI_API_KEY=your_gemini_api_key
```

## 2. Supabase 테이블 생성

리포트 캐싱을 위해 Supabase 데이터베이스에 테이블이 필요합니다.
Supabase 대시보드의 **SQL Editor**에서 아래 쿼리를 실행해 주세요.

```sql
-- daily_reports 테이블 생성
create table if not exists daily_reports (
  id uuid default gen_random_uuid() primary key,
  content jsonb not null, -- 리포트 내용 (JSON)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- (선택사항) RLS 정책 설정 - 누구나 읽기/쓰기 가능하게 하거나 서비스 키 사용 시 생략 가능
alter table daily_reports enable row level security;

create policy "Enable read access for all users"
on daily_reports for select
using (true);

create policy "Enable insert access for all users"
on daily_reports for insert
with check (true);
```

## 3. 기능 작동 원리

1. **뉴스 수집**: 네이버 금융의 주요 뉴스를 실시간으로 크롤링합니다.
2. **AI 분석**: 수집된 뉴스를 Google Gemini AI에게 전달하여 요약, 분석, 핵심 포인트를 생성합니다.
3. **캐싱 (Caching)**: 생성된 리포트는 Supabase에 저장됩니다.
   - 사용자가 리포트를 요청할 때, **최근 6시간 이내**에 생성된 리포트가 있다면 AI를 호출하지 않고 저장된 리포트를 즉시 보여줍니다.
   - 이를 통해 응답 속도를 높이고 AI 비용을 절감합니다.

## 4. 사용 방법

1. 앱을 실행합니다 (`npm run dev`).
2. **홈 화면** 중간에 있는 파란색 **"오늘의 증시 리포트" 배너**를 클릭합니다.
3. 로딩 후 AI가 분석한 오늘의 증시 리포트가 표시됩니다.

## 5. 트러블슈팅

- **리포트가 생성되지 않아요**:
  - `.env.local`에 `GEMINI_API_KEY`가 올바른지 확인하세요.
  - 서버 로그에 크롤링 에러나 Supabase 에러가 있는지 확인하세요.
- **계속 로딩만 떠요**:
  - API 라우트(`app/api/daily-report/route.ts`)에서 에러가 발생했을 수 있습니다. 터미널 로그를 확인해 주세요.
