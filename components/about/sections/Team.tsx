import React from "react";
import { TEAM_MEMBERS } from "../constants";
import { Github, Linkedin, Mail } from "lucide-react";
import { FadeIn, Stagger, StaggerItem } from "@/components/about/ui/Motion";

export const Team: React.FC = () => {
  return (
    <section id="team" className="py-32 pb-4 bg-gray-50">
      <div className="container mx-auto px-6">
        <FadeIn direction="up" duration={0.6}>
          <div className="text-center mb-20">
            <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-4 bg-blue-100 inline-block px-4 py-1 rounded-full">
              Team GRIT
            </h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              함께하는 사람들
            </h3>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              스톡잇을 만들어나가는 열정적인 팀원들을 소개합니다.
            </p>
          </div>
        </FadeIn>

        <Stagger
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
          staggerDelay={0.1}
        >
          {TEAM_MEMBERS.slice(0, 3).map((member, index) => (
            <StaggerItem key={index} direction="up">
              <div className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg transform scale-110"></div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 text-xs font-bold mb-4 uppercase tracking-wider">
                  {member.role}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                  {member.description}
                </p>

                <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                    <Github size={18} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <Linkedin size={18} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                    <Mail size={18} />
                  </button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Stagger
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 max-w-4xl mx-auto"
          staggerDelay={0.1}
        >
          {TEAM_MEMBERS.slice(3, 5).map((member, index) => (
            <StaggerItem key={index} direction="up">
              <div className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg transform scale-110"></div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 text-xs font-bold mb-4 uppercase tracking-wider">
                  {member.role}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                  {member.description}
                </p>

                <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                    <Github size={18} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <Linkedin size={18} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                    <Mail size={18} />
                  </button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Project Intro Box */}
        <FadeIn direction="up" delay={0.2} duration={0.8}>
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[100px]"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">
                "투자는 어렵다"는 편견을 깨다
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-10">
                스톡잇은 단순한 질문에서 시작되었습니다.{" "}
                <br className="hidden md:block" />
                <span className="text-white font-semibold">
                  "왜 주식 공부는 항상 지루하고 딱딱해야 할까?"
                </span>
                <br />
                <br />
                우리는 강력한 서버와 직관적인 UI를 결합하여,{" "}
                <br className="hidden md:block" />
                누구나 쉽고 재미있게 금융을 경험할 수 있는 세상을 만들고
                있습니다.
              </p>
              <div className="flex justify-center gap-4">
                <span className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-white text-sm font-medium">
                  Since 2024
                </span>
                <span className="px-6 py-2 bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium">
                  Open Source
                </span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
