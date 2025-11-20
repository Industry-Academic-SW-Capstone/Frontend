import React from "react";
import { ChevronDown, TrendingUp, Award, Zap } from "lucide-react";
import { HeroActions } from "./HeroActions";

export const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 z-0"></div>

      {/* Decorative Patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-purple-500/30 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div className="text-center lg:text-left text-white space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-blue-200 text-sm font-medium mb-4 hover:bg-white/10 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            실시간 데이터 기반 모의투자 플랫폼
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight">
            투자의 시작, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-400  to-teal-300 animate-gradient-x">
              스톡잇
            </span>
            으로 완벽하게
          </h1>

          <p className="text-lg lg:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            실제 시장 데이터로 경험하는 리스크 없는 투자.
            <br className="hidden lg:block" />
            친구들과 경쟁하는 리그, 매일 쏟아지는 미션으로
            <br className="hidden lg:block" />
            지루할 틈 없는 투자 라이프를 시작하세요.
          </p>

          <HeroActions />

          <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 border-t border-white/10 mt-8">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-2xl font-bold">
                <Zap className="text-yellow-400 fill-yellow-400" size={20} />
                <span>Real-time</span>
              </div>
              <p className="text-sm text-gray-400">실시간 시세 반영</p>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-2xl font-bold">
                <Award className="text-blue-400 fill-blue-400" size={20} />
                <span>League</span>
              </div>
              <p className="text-sm text-gray-400">주간 투자 대회</p>
            </div>
          </div>
        </div>

        {/* Visual Area */}
        <div className="hidden lg:block relative h-[700px] perspective-1000">
          {/* Main App Screenshot Placeholder - Ideally this would be a real screenshot or the demo component itself if we wanted to show it here too, but let's keep it as a stylized graphic for the hero */}
          <div className="relative z-10 transform rotate-y-[-12deg] rotate-x-[5deg] hover:rotate-y-[-5deg] hover:rotate-x-[2deg] transition-transform duration-700 ease-out preserve-3d">
            <div className="relative rounded-[2.5rem] overflow-hidden border-[8px] border-slate-800 shadow-2xl bg-slate-900 aspect-[9/19] w-[320px] mx-auto">
              {/* Abstract UI Representation */}
              <div className="absolute inset-0 bg-slate-900">
                {/* Header */}
                <div className="h-14 border-b border-white/5 flex items-center justify-between px-6">
                  <div className="w-20 h-4 bg-white/10 rounded-full"></div>
                  <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                </div>
                {/* Chart */}
                <div className="mt-8 px-6">
                  <div className="w-32 h-8 bg-white/10 rounded-lg mb-2"></div>
                  <div className="w-24 h-4 bg-white/5 rounded-lg mb-8"></div>
                  <div className="h-40 w-full bg-gradient-to-b from-blue-500/20 to-transparent rounded-xl border-t border-blue-500/30 relative overflow-hidden">
                    <svg
                      className="absolute bottom-0 left-0 w-full h-full"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 100 L0 60 Q 20 40 40 70 T 80 30 L 100 50 L 100 100 Z"
                        fill="url(#grad)"
                      />
                      <path
                        d="M0 60 Q 20 40 40 70 T 80 30 L 100 50"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                      />
                      <defs>
                        <linearGradient
                          id="grad"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#3b82f6"
                            stopOpacity="0.3"
                          />
                          <stop
                            offset="100%"
                            stopColor="#3b82f6"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                {/* List Items */}
                <div className="mt-8 px-6 space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full ${
                          i % 2 === 0 ? "bg-red-500/20" : "bg-blue-500/20"
                        }`}
                      ></div>
                      <div className="flex-1 space-y-2">
                        <div className="w-24 h-3 bg-white/10 rounded-full"></div>
                        <div className="w-16 h-2 bg-white/5 rounded-full"></div>
                      </div>
                      <div className="w-16 h-6 bg-white/5 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Badge 1 */}
            <div className="absolute top-20 -right-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl animate-float delay-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">수익률 1위</p>
                  <p className="text-sm font-bold text-white">워렌버핏</p>
                </div>
              </div>
            </div>

            {/* Floating Badge 2 */}
            <div className="absolute bottom-40 -left-8 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl animate-float delay-1000">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">실시간 체결</p>
                  <p className="text-sm font-bold text-white">삼성전자 매수</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
        <ChevronDown size={24} />
      </div>
    </section>
  );
};
