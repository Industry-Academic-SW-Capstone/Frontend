import React from "react";
import { Metadata } from "next";
import { Header } from "@/components/about/Header";
import { Hero } from "@/components/about/sections/Hero";
import { Features } from "@/components/about/sections/Features";
import { AppDemo } from "@/components/about/sections/AppDemo";
import { Team } from "@/components/about/sections/Team";
import { Footer } from "@/components/about/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://stockit.live"),
  title: "StockIt! - 주식 투자 시뮬레이션 & 대회 플랫폼",
  description:
    "리스크 없는 모의투자와 흥미진진한 대회. 실시간 시세 기반의 주식 투자 시뮬레이션으로 초보자도 쉽고 재미있게 주식 시장을 경험해보세요.",
  keywords: [
    "주식",
    "모의투자",
    "주식대회",
    "투자연습",
    "StockIt",
    "스톡잇",
    "금융교육",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "StockIt! - 주식 투자 시뮬레이션",
    description:
      "리스크 없는 모의투자와 흥미진진한 대회. 실시간 시세 기반의 주식 투자 시뮬레이션으로 초보자도 쉽고 재미있게 주식 시장을 경험해보세요.",
    url: "/about",
    siteName: "StockIt!",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "StockIt Preview",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "StockIt!",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  description:
    "리스크 없는 모의투자와 흥미진진한 대회. 실시간 시세 기반의 주식 투자 시뮬레이션 플랫폼.",
  image: "https://stockit.live/logo.png",
  author: {
    "@type": "Organization",
    name: "Team GRIT",
    url: "https://stockit.live",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main>
        <Hero />
        <Features />
        <AppDemo />
        <Team />
      </main>

      <Footer />
    </div>
  );
}
