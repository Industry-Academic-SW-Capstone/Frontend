import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import QueryProvider from "@/lib/providers/QueryProvider";
import Script from "next/script";
import PreventContextMenu from "@/components/PreventContextMenu";
import PWARegistry from "@/components/PWARegistry";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import ThemeManager from "@/components/ThemeManager";
import { PostHogProvider } from "@/lib/providers/PosthogProvider";
import CapacitorManager from "@/components/CapacitorManager";

const pretendard = localFont({
  src: "../fonts/pretendard/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "스톡잇!",
  applicationName: "StockIt",
  description:
    "투자의 시작, 스톡잇으로 완벽하게. 실시간 시세 기반의 모의투자와 가이드 미션, 자유롭게 만들고 참여하는 대회로 주식 투자에 입문하세요!",
  manifest: "/manifest.json",
  icons: {
    // icon을 배열로 바꿔서 두 가지 사이즈를 모두 제공합니다.
    icon: [
      { url: "/favicon.png", sizes: "64x64" }, // 브라우저 탭용 (기존 유지)
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" }, // 구글 검색용 (48 배수) <- 이게 핵심입니다!
    ],
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon.png",
    },
  },
  openGraph: {
    siteName: "StockIt",
    title: "스톡잇!",
    description:
      "투자의 시작, 스톡잇으로 완벽하게. 실시간 시세 기반의 모의투자와 가이드 미션, 자유롭게 만들고 참여하는 대회로 주식 투자에 입문하세요!",
    type: "website",
    locale: "ko_KR",
    url: "https://www.stockit.live",
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "스톡잇!",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    // globals.css의 :root { --bg-primary: #f7f9fb } 값과 일치
    { media: "(prefers-color-scheme: light)", color: "#f7f9fb" },
    // globals.css의 .dark { --bg-primary: #121212 } 값과 일치
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "StockIt", // 검색 결과 윗줄에 표시될 이름
    applicationCategory: "FinanceApplication",
    alternateName: "스톡잇", // 대체 이름
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    url: "https://www.stockit.live/",
    description:
      "리스크 없는 모의투자와 흥미진진한 대회. 실시간 시세 기반의 주식 투자 시뮬레이션 플랫폼.",
    image: "https://www.stockit.live/new_logo.png",
    author: {
      "@type": "Organization",
      name: "Team GRIT",
      url: "https://www.stockit.live",
    },
  };
  return (
    <html lang="ko" className={`${pretendard.variable}`}>
      <body className={`${pretendard.className} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.9/kakao.min.js"
          integrity="sha384-JpLApTkB8lPskhVMhT+m5Ln8aHlnS0bsIexhaak0jOhAkMYedQoVghPfSpjNi9K1"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <PreventContextMenu />
        <SpeedInsights />
        <Analytics />
        <QueryProvider>
          <ThemeManager />
          <PWARegistry />
          <CapacitorManager />
          <PostHogProvider>{children}</PostHogProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
