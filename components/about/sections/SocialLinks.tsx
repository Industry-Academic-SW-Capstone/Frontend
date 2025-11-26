"use client";

import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";

interface SocialLinksProps {
  github?: string;
  linkedIn?: string;
  email?: string;
  memberName: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  github,
  linkedIn,
  email,
  memberName,
}) => {
  return (
    <div className="flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 delay-100">
      {github && (
        <button
          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md"
          aria-label={`${memberName}의 Github`}
          onClick={() => {
            window.open(github, "_blank");
          }}
        >
          <Github size={20} />
        </button>
      )}
      {linkedIn && (
        <button
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md"
          aria-label={`${memberName}의 Linkedin`}
          onClick={() => {
            window.open(linkedIn, "_blank");
          }}
        >
          <Linkedin size={20} />
        </button>
      )}
      {email && (
        <button
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md"
          aria-label={`${memberName}에게 이메일 보내기`}
          onClick={() => {
            window.open(`mailto:${email}`, "_blank");
          }}
        >
          <Mail size={20} />
        </button>
      )}
    </div>
  );
};
