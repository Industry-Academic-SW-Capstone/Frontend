import React from "react";
import { FEATURES } from "../constants";

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-32 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50 -skew-x-12 translate-x-20 z-0"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-4 bg-blue-50 inline-block px-4 py-1 rounded-full">
            Why StockIt?
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            투자가 쉬워지는 <br />
            <span className="relative inline-block">
              <span className="relative z-10">특별한 기능들</span>
              <span className="absolute bottom-2 left-0 w-full h-4 bg-blue-100 -z-10 transform -rotate-1"></span>
            </span>
          </h3>
          <p className="text-gray-600 text-xl leading-relaxed">
            스톡잇은 단순한 모의투자가 아닙니다.
            <br />
            실시간 데이터와 게이미피케이션으로 완성된 최고의 투자 경험을
            제공합니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500"></div>

              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-blue-200 group-hover:shadow-lg relative z-10">
                <feature.icon size={32} strokeWidth={1.5} />
              </div>

              <h4 className="text-xl font-bold text-gray-900 mb-4 relative z-10">
                {feature.title}
              </h4>
              <p className="text-gray-600 leading-relaxed text-sm relative z-10">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
