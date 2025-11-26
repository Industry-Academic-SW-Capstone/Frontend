"use client";

import { useState } from "react";
import { TECH_STACK } from "@/components/about/constants";
import { FadeIn, Stagger, StaggerItem } from "@/components/about/ui/Motion";
import { SystemArchitectureDiagram } from "@/components/about/ui/SystemArchitectureDiagram";
import {
  Code2,
  Database,
  Globe,
  Layout,
  Lock,
  Server,
  Terminal,
  LucideIcon,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const NODE_DETAILS: Record<
  string,
  {
    title: string;
    description: string;
    tech: string;
    role: string;
    icon: LucideIcon;
  }
> = {
  User: {
    title: "User Interface",
    description:
      "사용자가 접하는 웹 및 PWA 인터페이스입니다. 반응형 디자인으로 모든 기기에서 최적화된 경험을 제공합니다.",
    tech: "Web, PWA, iOS/Android",
    role: "Client Access Point",
    icon: Smartphone,
  },
  Frontend: {
    title: "Frontend Application",
    description:
      "Next.js 14 기반의 서버 사이드 렌더링(SSR) 애플리케이션입니다. React Query로 서버 상태를 효율적으로 관리합니다.",
    tech: "Next.js, TypeScript, Tailwind CSS",
    role: "UI Rendering & State Management",
    icon: Globe,
  },
  Gateway: {
    title: "API Gateway",
    description:
      "모든 외부 요청을 처리하는 진입점입니다. 로드 밸런싱, SSL 종료, 라우팅을 담당하여 백엔드 부하를 분산합니다.",
    tech: "Traefik",
    role: "Reverse Proxy & Load Balancer",
    icon: Server,
  },
  "Core Server": {
    title: "Core Backend Server",
    description:
      "사용자 인증, 주식 거래, 포트폴리오 관리 등 핵심 비즈니스 로직을 처리하는 메인 서버입니다.",
    tech: "Spring Boot, Java",
    role: "Business Logic & Transaction",
    icon: Cpu,
  },
  "AI Server": {
    title: "AI Analysis Server",
    description:
      "주식 데이터 분석, 투자 성향 진단, 추천 알고리즘 등 고성능 연산이 필요한 작업을 전담합니다.",
    tech: "FastAPI, Python",
    role: "Data Analysis & AI Inference",
    icon: Zap,
  },
  Database: {
    title: "Primary Database",
    description:
      "사용자 정보, 거래 내역, 주식 메타데이터 등 영구적인 데이터 저장을 담당하는 관계형 데이터베이스입니다.",
    tech: "PostgreSQL",
    role: "Persistent Data Storage",
    icon: Database,
  },
  Cache: {
    title: "In-Memory Cache",
    description:
      "자주 조회되는 실시간 주가 데이터와 세션 정보를 캐싱하여 데이터베이스 부하를 줄이고 응답 속도를 높입니다.",
    tech: "Redis",
    role: "Caching & Session Store",
    icon: Activity,
  },
  "CI/CD": {
    title: "CI/CD Pipeline",
    description:
      "코드 변경 사항을 자동으로 테스트, 빌드하고 배포하는 파이프라인입니다. 안정적인 배포 프로세스를 보장합니다.",
    tech: "GitHub Actions",
    role: "Automated Deployment",
    icon: Github,
  },
  "한국투자증권 API": {
    title: "Korea Investment API",
    description:
      "실시간 주식 시세 조회와 실제 주문 체결을 위해 연동된 외부 증권사 API입니다.",
    tech: "REST API, WebSocket",
    role: "External Stock Data Provider",
    icon: Building2,
  },
  FCM: {
    title: "Firebase Cloud Messaging",
    description:
      "체결 알림, 가격 변동 알림 등 사용자에게 실시간 푸시 알림을 전송하는 서비스입니다.",
    tech: "Firebase",
    role: "Push Notification Service",
    icon: Bell,
  },
  Zustand: {
    title: "Client State Management",
    description:
      "다크 모드, 사이드바 상태 등 클라이언트 전역 상태를 가볍고 직관적으로 관리합니다.",
    tech: "Zustand",
    role: "Global Client Store",
    icon: Database,
  },
  "React Query": {
    title: "Server State Management",
    description:
      "API 데이터 캐싱, 동기화, 백그라운드 업데이트를 담당하여 복잡한 비동기 로직을 단순화합니다.",
    tech: "TanStack Query",
    role: "Async Data Management",
    icon: Activity,
  },
  API: {
    title: "Backend API",
    description:
      "프론트엔드와 통신하는 RESTful API 엔드포인트입니다. 명확한 인터페이스로 데이터를 교환합니다.",
    tech: "REST, JSON",
    role: "Data Interface",
    icon: Server,
  },
};

const TechCategorySection = ({
  title,
  icon: Icon,
  items,
  delay = 0,
  onItemClick,
}: {
  title: string;
  icon: LucideIcon;
  items: typeof TECH_STACK;
  delay?: number;
  onItemClick: (item: (typeof TECH_STACK)[0]) => void;
}) => (
  <div className="mb-12">
    <FadeIn direction="up" delay={delay}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
    </FadeIn>
    <Stagger
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
      staggerDelay={0.05}
    >
      {items.map((tech, index) => (
        <StaggerItem key={index}>
          <div
            onClick={() => onItemClick(tech)}
            className="group bg-white p-5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 h-full cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-gray-50 group-hover:bg-blue-50 rounded-xl text-gray-500 group-hover:text-blue-600 transition-colors">
                <tech.icon size={20} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full uppercase">
                {tech.category}
              </span>
            </div>
            <h4 className="font-bold text-gray-900 mb-1">{tech.name}</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              {tech.description}
            </p>
            {tech.reason && (
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-blue-600 text-white p-1.5 rounded-full">
                  <ArrowRight size={14} />
                </div>
              </div>
            )}
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  </div>
);

export function TechPageContent() {
  const [diagramMode, setDiagramMode] = useState<"full" | "frontend">("full");
  const [selectedTech, setSelectedTech] = useState<
    (typeof TECH_STACK)[0] | null
  >(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleNodeClick = (nodeLabel: string) => {
    if (NODE_DETAILS[nodeLabel]) {
      setSelectedNode(nodeLabel);
    }
  };

  const frontendStack = TECH_STACK.filter((t) => t.category === "Frontend");
  const backendStack = TECH_STACK.filter((t) => t.category === "Backend");
  const infraStack = TECH_STACK.filter(
    (t) =>
      t.category === "Infrastructure" ||
      t.category === "DevOps" ||
      t.category === "Analytics" ||
      t.category === "Security"
  );

  return (
    <div className="container mx-auto px-6">
      {/* Hero Section */}
      <FadeIn direction="up" duration={0.6}>
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6">
            <Terminal size={14} />
            <span>Engineering Blog</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Built for <span className="text-blue-600">Scale</span> &{" "}
            <span className="text-blue-600">Performance</span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            스톡잇은 최신 웹 기술과 견고한 아키텍처를 기반으로 설계되었습니다.
            <br className="hidden md:block" />
            사용자에게 최고의 경험을 제공하기 위한 우리의 기술적 고민들을
            소개합니다.
          </p>
        </div>
      </FadeIn>

      {/* System Architecture Diagram */}
      <section className="mb-32">
        <FadeIn direction="up" delay={0.2}>
          <div className="bg-white rounded-[2.5rem] p-4 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 px-4 gap-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Layout size={24} className="text-blue-600" />
                System Architecture
              </h2>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setDiagramMode("full")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    diagramMode === "full"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Full System
                </button>
                <button
                  onClick={() => setDiagramMode("frontend")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    diagramMode === "frontend"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Frontend Only
                </button>
              </div>
            </div>
            <SystemArchitectureDiagram
              mode={diagramMode}
              onNodeClick={handleNodeClick}
            />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Globe size={16} className="text-blue-500" />
                  Frontend Layer
                </h3>
                <p className="text-sm text-gray-600">
                  Next.js 기반의 SSR과 React Query를 활용한 효율적인 상태 관리로
                  빠른 초기 로딩과 부드러운 UX를 제공합니다.
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Server size={16} className="text-indigo-500" />
                  Backend Layer
                </h3>
                <p className="text-sm text-gray-600">
                  Spring Boot와 FastAPI의 MSA 구조로, 안정적인 트랜잭션 처리와
                  고성능 데이터 분석을 분리하여 운영합니다.
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Database size={16} className="text-slate-500" />
                  Data Layer
                </h3>
                <p className="text-sm text-gray-600">
                  PostgreSQL의 안정성과 Redis의 속도를 결합하여 실시간 주식
                  데이터와 랭킹 시스템을 완벽하게 지원합니다.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Tech Stack Grid */}
      <section className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Technology Stack
          </h2>
          <p className="text-gray-500">
            각 분야별 최고의 도구들을 선정하여 사용하고 있습니다.
          </p>
        </div>

        <TechCategorySection
          title="Frontend Ecosystem"
          icon={Layout}
          items={frontendStack}
          delay={0.3}
          onItemClick={setSelectedTech}
        />

        <TechCategorySection
          title="Backend & Data"
          icon={Server}
          items={backendStack}
          delay={0.4}
          onItemClick={setSelectedTech}
        />

        <TechCategorySection
          title="Infrastructure & Security"
          icon={Lock}
          items={infraStack}
          delay={0.5}
          onItemClick={setSelectedTech}
        />

        {/* Tech Detail Modal */}
        {selectedTech && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <div
              className="absolute inset-0"
              onClick={() => setSelectedTech(null)}
            />
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative z-10 animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setSelectedTech(null)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowRight className="rotate-45" size={20} />
              </button>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <selectedTech.icon size={32} />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    {selectedTech.category}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-2">
                    {selectedTech.name}
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {selectedTech.description}
              </p>

              {selectedTech.reason && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-green-500" />
                      Why we use it
                    </h4>
                    <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">
                      {selectedTech.reason}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Code2 size={18} className="text-blue-500" />
                      How we use it
                    </h4>
                    <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">
                      {selectedTech.usage}
                    </p>
                  </div>
                </div>
              )}
              {!selectedTech.reason && (
                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl">
                  <p>상세 설명이 준비 중입니다.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Node Detail Modal */}
        {selectedNode && NODE_DETAILS[selectedNode] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <div
              className="absolute inset-0"
              onClick={() => setSelectedNode(null)}
            />
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative z-10 animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setSelectedNode(null)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowRight className="rotate-45" size={20} />
              </button>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  {(() => {
                    const Icon = NODE_DETAILS[selectedNode].icon;
                    return <Icon size={32} />;
                  })()}
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    {NODE_DETAILS[selectedNode].role}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-2">
                    {NODE_DETAILS[selectedNode].title}
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {NODE_DETAILS[selectedNode].description}
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Code2 size={18} className="text-indigo-500" />
                    Technology
                  </h4>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">
                    {NODE_DETAILS[selectedNode].tech}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="mt-32 mb-10">
        <FadeIn direction="up" delay={0.6}>
          <div className="bg-gray-900 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,rgba(59,130,246,0.1)_0%,transparent_100%)]" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-6">
                함께 성장하고 싶으신가요?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                스톡잇팀은 언제나 열정적인 개발자분들을 기다리고 있습니다.
                우리의 기술 블로그에서 더 많은 이야기를 확인해보세요.
              </p>
              <a
                href="https://github.com/urous3814/stock-it"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-colors"
              >
                <Code2 size={20} />
                GitHub 구경하기
              </a>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
