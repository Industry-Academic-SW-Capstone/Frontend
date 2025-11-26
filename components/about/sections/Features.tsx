import React from "react";
import { FEATURES } from "../constants";
import { FadeIn, Stagger, StaggerItem } from "@/components/about/ui/Motion";

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-32 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -skew-x-12 translate-x-20 z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-50/50 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 z-0 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <FadeIn direction="up" duration={0.6}>
          <div className="text-center max-w-3xl mx-auto mb-24">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-bold tracking-wide uppercase mb-6">
              Why StockIt?
            </span>
            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              투자가 쉬워지는 <br />
              <span className="relative inline-block">
                <span className="relative z-10">특별한 기능들</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-100/80 -z-10 transform -rotate-1"></span>
              </span>
            </h3>
            <p className="text-slate-600 text-xl leading-relaxed font-medium">
              스톡잇은 단순한 모의투자가 아닙니다.
              <br />
              실시간 데이터와 게이미피케이션으로 완성된 최고의 투자 경험을
              제공합니다.
            </p>
          </div>
        </FadeIn>

        <Stagger
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          staggerDelay={0.1}
        >
          {FEATURES.map((feature, index) => (
            <StaggerItem key={index} direction="up" className="h-full">
              <div className="group bg-white rounded-[2rem] p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-slate-100 relative overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500 opacity-50"></div>

                <div
                  className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-blue-500/30 relative z-10"
                  aria-hidden="true"
                >
                  <feature.icon size={28} strokeWidth={2} />
                </div>

                <h4 className="text-xl font-bold text-slate-900 mb-3 relative z-10 tracking-tight group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-slate-500 leading-relaxed text-[15px] relative z-10 font-medium">
                  {feature.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
};
