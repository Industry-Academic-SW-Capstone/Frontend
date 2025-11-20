import React from "react";
import { Metadata } from "next";
import { Header } from "@/components/about/Header";
import { Hero } from "@/components/about/sections/Hero";
import { Features } from "@/components/about/sections/Features";
import { AppDemo } from "@/components/about/sections/AppDemo";
import { Team } from "@/components/about/sections/Team";
import { Footer } from "@/components/about/Footer";
import { InstallModal } from "@/components/about/modals/InstallModal";
import { InstallModalProvider } from "@/components/about/context/InstallModalContext";

export const metadata: Metadata = {
  title: "StockIt! - 주식 투자 시뮬레이션",
  description:
    "리스크 없는 모의투자와 흥미진진한 대회. 초보자도 쉽고 재미있게 주식 시장을 경험해보세요.",
  openGraph: {
    title: "StockIt! - 주식 투자 시뮬레이션",
    description:
      "리스크 없는 모의투자와 흥미진진한 대회. 초보자도 쉽고 재미있게 주식 시장을 경험해보세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "StockIt!",
  },
  twitter: {
    card: "summary_large_image",
    title: "StockIt! - 주식 투자 시뮬레이션",
    description:
      "리스크 없는 모의투자와 흥미진진한 대회. 초보자도 쉽고 재미있게 주식 시장을 경험해보세요.",
  },
};

export default function AboutPage() {
  return (
    <InstallModalProvider>
      <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
        <Header />

        <main>
          <Hero />
          <Features />
          <AppDemo />
          <Team />
        </main>

        <Footer />

        <InstallModal />
      </div>
    </InstallModalProvider>
  );
}
