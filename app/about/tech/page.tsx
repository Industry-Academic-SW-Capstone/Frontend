import { Metadata } from "next";
import { Header } from "@/components/about/Header";
import { Footer } from "@/components/about/Footer";
import { TechPageContent } from "@/components/about/ui/TechPageContent";

export const metadata: Metadata = {
  title: "기술 스택 & 아키텍처 | StockIt",
  description:
    "스톡잇의 안정적이고 확장 가능한 시스템 아키텍처와 기술 스택을 소개합니다.",
  alternates: {
    canonical: "/about/tech",
  },
  openGraph: {
    title: "기술 스택 & 아키텍처 | StockIt",
    description:
      "스톡잇의 안정적이고 확장 가능한 시스템 아키텍처와 기술 스택을 소개합니다.",
    url: "/about/tech",
  },
};

export default function TechPage() {
  return (
    <div className="min-h-screen font-sans bg-slate-50/50">
      <Header />
      <main className="pt-32 pb-20">
        <TechPageContent />
      </main>
      <Footer />
    </div>
  );
}
