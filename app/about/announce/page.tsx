import React from "react";
import { Metadata } from "next";
import { Header } from "@/components/about/Header";
import { Footer } from "@/components/about/Footer";
import { ANNOUNCEMENTS } from "@/components/about/constants";
import { FadeIn, Stagger, StaggerItem } from "@/components/about/ui/Motion";
import { Megaphone, Wrench, Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "공지사항 - StockIt",
  description: "StockIt의 새로운 소식과 업데이트를 확인하세요.",
  openGraph: {
    title: "공지사항 - StockIt",
    description: "StockIt의 새로운 소식과 업데이트를 확인하세요.",
  },
};

const getIcon = (type: "NOTICE" | "EVENT" | "MAINTENANCE") => {
  switch (type) {
    case "NOTICE":
      return <Megaphone className="text-blue-500" size={24} />;
    case "EVENT":
      return <Trophy className="text-yellow-500" size={24} />;
    case "MAINTENANCE":
      return <Wrench className="text-gray-500" size={24} />;
  }
};

const getLabel = (type: "NOTICE" | "EVENT" | "MAINTENANCE") => {
  switch (type) {
    case "NOTICE":
      return "공지";
    case "EVENT":
      return "이벤트";
    case "MAINTENANCE":
      return "점검";
  }
};

const getLabelColor = (type: "NOTICE" | "EVENT" | "MAINTENANCE") => {
  switch (type) {
    case "NOTICE":
      return "bg-blue-100 text-blue-700";
    case "EVENT":
      return "bg-yellow-100 text-yellow-700";
    case "MAINTENANCE":
      return "bg-gray-100 text-gray-700";
  }
};

export default function AnnouncePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: ANNOUNCEMENTS.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "NewsArticle",
        headline: item.title,
        description: item.content,
        datePublished: item.date,
      },
    })),
  };

  return (
    <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="pt-32 pb-20 container mx-auto px-6">
        <FadeIn direction="up" duration={0.6}>
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              공지사항
            </h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              StockIt의 새로운 소식들을 가장 먼저 확인하세요.
            </p>
          </div>
        </FadeIn>

        <div className="max-w-3xl mx-auto">
          <Stagger className="space-y-6" staggerDelay={0.1}>
            {ANNOUNCEMENTS.map((item) => (
              <StaggerItem key={item.id} direction="up">
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex gap-6 items-start">
                  <div className="hidden md:flex w-12 h-12 rounded-full bg-gray-50 items-center justify-center flex-shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getLabelColor(
                          item.type
                        )}`}
                      >
                        {getLabel(item.type)}
                      </span>
                      <span className="text-sm text-gray-400">{item.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </main>
      <Footer />
    </div>
  );
}
