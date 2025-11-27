import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Header } from "@/components/about/Header";
import { Hero } from "@/components/about/sections/Hero";
import { Footer } from "@/components/about/Footer";

// Lazy load heavy components
const Features = dynamic(
  () =>
    import("@/components/about/sections/Features").then((mod) => mod.Features),
  {
    loading: () => <div className="h-96 bg-gray-50 animate-pulse" />,
  }
);

const AppDemo = dynamic(
  () =>
    import("@/components/about/sections/AppDemo").then((mod) => mod.AppDemo),
  {
    loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
  }
);

const Team = dynamic(
  () => import("@/components/about/sections/Team").then((mod) => mod.Team),
  {
    loading: () => <div className="h-96 bg-gray-50 animate-pulse" />,
  }
);

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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "스톡잇!",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  alternateName: "스톡잇",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  description:
    "리스크 없는 모의투자와 흥미진진한 대회. 실시간 시세 기반의 주식 투자 시뮬레이션 플랫폼.",
  image: "https://www.stockit.live/new_logo.png",
  author: {
    "@type": "Organization",
    name: "Team GRIT",
    url: "https://www.stockit.live",
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
