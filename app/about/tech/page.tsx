import React from "react";
import { Metadata } from "next";
import { Header } from "@/components/about/Header";
import { Footer } from "@/components/about/Footer";
import {
  TECH_STACK,
  SYSTEM_ARCHITECTURE,
  DEV_ENVIRONMENT,
  SERVER_LOGIC,
} from "@/components/about/constants";
import { FadeIn, Stagger, StaggerItem } from "@/components/about/ui/Motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "기술 스택 - StockIt",
  description: "StockIt이 사용하는 최신 기술 스택과 아키텍처를 소개합니다.",
  openGraph: {
    title: "기술 스택 - StockIt",
    description: "StockIt이 사용하는 최신 기술 스택과 아키텍처를 소개합니다.",
  },
};

export default function TechPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: TECH_STACK.map((tech, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: tech.name,
        description: tech.description,
        applicationCategory: tech.category,
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
              기술 스택 & 아키텍처
            </h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              안정적이고 확장 가능한 서비스를 위한 기술적 고민들을 소개합니다.
            </p>
          </div>
        </FadeIn>

        {/* Tech Stack Section */}
        <section className="mb-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
            Core Tech Stack
          </h2>
          <Stagger
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            staggerDelay={0.1}
          >
            {TECH_STACK.map((tech, index) => (
              <StaggerItem key={index} direction="up">
                <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                    <tech.icon size={28} />
                  </div>
                  <div className="mb-4">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                      {tech.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {tech.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {tech.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* System Architecture Section */}
        <section className="mb-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
            System Architecture
          </h2>
          <FadeIn direction="up" duration={0.6}>
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 transform -translate-y-1/2"></div>

                {SYSTEM_ARCHITECTURE.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center bg-white p-4 z-10"
                  >
                    <div className="w-20 h-20 rounded-full bg-gray-50 border-4 border-white shadow-lg flex items-center justify-center text-blue-600 mb-4">
                      <item.icon size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 max-w-[200px]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Server Logic Section */}
        <section className="mb-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
            Key Server Logic
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {SERVER_LOGIC.map((logic, index) => (
              <FadeIn
                key={index}
                direction="up"
                duration={0.6}
                delay={index * 0.1}
              >
                <div className="bg-gray-900 rounded-3xl p-8 text-white h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-blue-400">
                      <logic.icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold">{logic.title}</h3>
                  </div>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                    {logic.description}
                  </p>
                  <div className="space-y-4">
                    {logic.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        </div>
                        <span className="text-gray-300 text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Dev Environment Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
            Development Environment
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {DEV_ENVIRONMENT.map((env, index) => (
              <FadeIn
                key={index}
                direction="up"
                duration={0.5}
                delay={index * 0.1}
              >
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-100 transition-colors text-center group">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gray-50 group-hover:bg-blue-50 text-gray-400 group-hover:text-blue-600 flex items-center justify-center mb-4 transition-colors">
                    <env.icon size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{env.tool}</h3>
                  <p className="text-xs text-gray-500">{env.purpose}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
