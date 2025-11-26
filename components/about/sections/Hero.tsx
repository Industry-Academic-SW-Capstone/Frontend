import React from "react";
import { TrendingUp, Award, Zap } from "lucide-react";
import { HeroActions } from "./HeroActions";
import { FadeIn } from "@/components/about/ui/Motion";
import { ScrollDown } from "../scrollDown";
import Image from "next/image";

export const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="relative min-h-[100vh] flex items-center pt-20 overflow-hidden bg-[#0f172a]"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0f172a] to-[#0f172a] z-0"></div>

      {/* Decorative Patterns */}
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow"
          style={{ willChange: "opacity" }}
        ></div>
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"
          style={{ willChange: "opacity" }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Text Content */}
        <div className="text-center lg:text-left text-white space-y-8">
          <FadeIn direction="up" duration={0.6}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-blue-200 text-sm font-medium mb-6 hover:bg-white/10 transition-colors cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              실시간 데이터 기반 모의투자 플랫폼
            </div>

            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-extrabold leading-[1.1] tracking-tighter mb-6">
              투자의 시작, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                스톡잇
              </span>
              으로 <br />
              완벽하게
            </h1>

            <p className="text-lg lg:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              실제 시장 데이터로 경험하는 리스크 없는 투자.
              <br className="hidden lg:block" />
              친구들과 경쟁하는 리그, 매일 쏟아지는 미션으로
              <br className="hidden lg:block" />
              지루할 틈 없는 투자 라이프를 시작하세요.
            </p>
          </FadeIn>

          <FadeIn direction="up" duration={0.6} delay={0.2}>
            <HeroActions />
          </FadeIn>

          <FadeIn direction="up" duration={0.6} delay={0.4}>
            <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 border-t border-white/5 mt-8">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-2xl font-bold text-white">
                  <Zap className="text-yellow-400 fill-yellow-400" size={24} />
                  <span>Real-time</span>
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  실시간 시세 반영
                </p>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-2xl font-bold text-white">
                  <Award className="text-blue-400 fill-blue-400" size={24} />
                  <span>League</span>
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  주간 투자 대회
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Visual Area */}
        <div className="hidden lg:block relative h-[800px] perspective-1000 flex items-center justify-center">
          <FadeIn
            direction="left"
            duration={0.8}
            delay={0.2}
            className="w-full h-full flex items-center justify-center"
          >
            <div className="relative z-10 transform rotate-y-[-12deg] rotate-x-[5deg] hover:rotate-y-[-5deg] hover:rotate-x-[2deg] transition-transform duration-700 ease-out preserve-3d">
              {/* Phone Frame */}
              <div className="relative rounded-[3rem] overflow-hidden border-[8px] border-slate-800 shadow-2xl bg-slate-900 aspect-[9/19] w-[340px] mx-auto ring-1 ring-white/10">
                {/* Screen Content */}
                <div className="absolute inset-0 bg-slate-900 flex flex-col">
                  {/* Status Bar */}
                  <div className="h-14 flex items-center justify-between px-6 pt-2">
                    <div className="w-12 h-4 bg-white/10 rounded-full"></div>
                    <div className="flex gap-2">
                      <div className="w-4 h-4 bg-white/10 rounded-full"></div>
                      <div className="w-4 h-4 bg-white/10 rounded-full"></div>
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="px-6 pb-6">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl mb-4 flex items-center justify-center shadow-lg shadow-blue-500/30 overflow-hidden">
                      <Image
                        src="/icon-192.png"
                        width={40}
                        height={40}
                        alt="StockIt Logo"
                      />
                    </div>
                    <div className="w-32 h-8 bg-white/10 rounded-lg mb-2"></div>
                    <div className="w-20 h-4 bg-white/5 rounded-lg"></div>
                  </div>

                  {/* Chart Area */}
                  <div className="px-6 mb-6">
                    <div className="h-48 w-full bg-gradient-to-b from-blue-500/10 to-transparent rounded-2xl border border-blue-500/20 relative overflow-hidden p-4">
                      <div className="absolute inset-0 flex items-end">
                        <svg
                          className="w-full h-32"
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
                            strokeWidth="3"
                            strokeLinecap="round"
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
                                stopOpacity="0.4"
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
                  </div>

                  {/* List Items */}
                  <div className="flex-1 px-6 space-y-4 overflow-hidden">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            i % 2 === 0
                              ? "bg-red-500/10 text-red-500"
                              : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          {i % 2 === 0 ? (
                            <TrendingUp size={18} className="rotate-180" />
                          ) : (
                            <TrendingUp size={18} />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="w-24 h-3 bg-white/10 rounded-full"></div>
                          <div className="w-16 h-2 bg-white/5 rounded-full"></div>
                        </div>
                        <div className="w-16 h-6 bg-white/5 rounded-lg"></div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Tab */}
                  <div className="h-20 border-t border-white/5 flex items-center justify-around px-6 bg-slate-900/90 backdrop-blur-md">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-12 h-12 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors"
                      >
                        <div
                          className={`w-6 h-6 rounded-md ${
                            i === 1 ? "bg-blue-500" : "bg-white/10"
                          }`}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Badge 1 */}
              <div className="absolute top-32 -right-8 bg-slate-800/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl animate-float delay-0 transform translate-z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1">
                      이번 주 수익률 1위
                    </p>
                    <p className="text-lg font-bold text-white">워렌버핏</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute bottom-48 -left-12 bg-slate-800/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl animate-float delay-1000 transform translate-z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <Zap size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1">
                      실시간 체결 알림
                    </p>
                    <p className="text-lg font-bold text-white">
                      삼성전자 매수
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      <ScrollDown />
    </section>
  );
};
