import Image from "next/image";
import React from "react";
import { TEAM_MEMBERS } from "../constants";
import { FadeIn, Stagger, StaggerItem } from "@/components/about/ui/Motion";
import { SocialLinks } from "./SocialLinks";

export const Team: React.FC = () => {
  return (
    <section id="team" className="py-32 pb-4 bg-slate-50">
      <div className="container mx-auto px-6">
        <FadeIn direction="up" duration={0.6}>
          <div className="text-center mb-24">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-sm font-bold tracking-wide uppercase mb-6">
              Team GRIT
            </span>
            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              함께하는 사람들
            </h3>
            <p className="text-slate-600 text-xl max-w-2xl mx-auto font-medium">
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
              <div className="group bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl transform scale-125"></div>
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">
                  {member.name}
                </h3>
                <p className="text-blue-600 text-xs font-bold mb-5 uppercase tracking-wider">
                  {member.role}
                </p>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                  {member.description}
                </p>

                <SocialLinks
                  github={member.github}
                  linkedIn={member.linkedIn}
                  email={member.email}
                  memberName={member.name}
                />
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
              <div className="group bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl transform scale-125"></div>
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">
                  {member.name}
                </h3>
                <p className="text-blue-600 text-xs font-bold mb-5 uppercase tracking-wider">
                  {member.role}
                </p>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                  {member.description}
                </p>

                <SocialLinks
                  github={member.github}
                  linkedIn={member.linkedIn}
                  email={member.email}
                  memberName={member.name}
                />
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Project Intro Box */}
        <FadeIn direction="up" delay={0.2} duration={0.8}>
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl ring-1 ring-white/10">
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-5xl font-bold text-white mb-10 tracking-tight leading-tight">
                "투자는 어렵다"는 <br className="md:hidden" /> 편견을 깨다.
              </h3>
              <p className="text-slate-300 text-xl leading-relaxed mb-12 font-medium">
                스톡잇은 단순한 질문에서 시작되었습니다. <br />
                <span className="text-white font-bold">
                  "왜 주식 공부는 항상 지루하고 딱딱해야 할까?"
                </span>
                <br />
                <br />
                우리는 게임적 요소와 금융, 캐주얼한 UI를 결합하여,{" "}
                <br className="hidden md:block" />
                누구나 쉽고 재미있게 금융을 경험할 수 있는 세상을 만들고
                있습니다.
              </p>
              <div className="flex justify-center gap-4">
                <span className="px-6 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-white text-sm font-medium">
                  Since 2025
                </span>
                <span className="px-6 py-2 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 rounded-full text-blue-200 text-sm font-medium">
                  Team GRIT
                </span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
