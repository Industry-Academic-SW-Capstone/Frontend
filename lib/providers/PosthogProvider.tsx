"use client";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      person_profiles: "identified_only", // 익명 사용자 프로필 생성 방지 (비용 절약)
      capture_pageview: false, // Next.js는 SPA라 페이지뷰 자동 수집이 부정확할 수 있어 수동 처리 권장 (선택사항)
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
