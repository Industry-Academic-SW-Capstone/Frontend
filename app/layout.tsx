import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import QueryProvider from "@/lib/providers/QueryProvider";
import Script from "next/script";
import { WebSocketProvider } from "@/lib/providers/SocketProvider";
import PreventContextMenu from "@/components/PreventContextMenu";
import PWARegistry from "@/components/PWARegistry";

const pretendard = localFont({
  src: "../fonts/pretendard/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "Stock It!",
  description: "주식 투자 시뮬레이션 및 대회 플랫폼",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Stock It!",
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
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/logo.svg" color="#4f46e5" />
      </head>
      <body className={`${pretendard.className} antialiased`}>
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.9/kakao.min.js"
          integrity="sha384-JpLApTkB8lPskhVMhT+m5Ln8aHlnS0bsIexhaak0jOhAkMYedQoVghPfSpjNi9K1"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <PreventContextMenu />
        <QueryProvider>
          <PWARegistry />
          <WebSocketProvider>{children}</WebSocketProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
