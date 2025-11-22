import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import QueryProvider from "@/lib/providers/QueryProvider";
import Script from "next/script";
import PreventContextMenu from "@/components/PreventContextMenu";
import PWARegistry from "@/components/PWARegistry";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const pretendard = localFont({
  src: "../fonts/pretendard/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "스톡잇!",
  description:
    "리스크 없는 모의투자와 흥미진진한 대회. 실시간 시세 기반의 주식 투자 시뮬레이션으로 초보자도 쉽고 재미있게 주식 시장을 경험해보세요.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon.png",
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "스톡잇!",
  },
  robots: {
    index: true, // 인덱싱은 허용 (검색 결과에 뜸)
    follow: true, // 링크 따라가기도 허용 (about 등으로 흐르도록)
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable}`}>
      <body className={`${pretendard.className} antialiased`}>
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
          <PWARegistry />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
