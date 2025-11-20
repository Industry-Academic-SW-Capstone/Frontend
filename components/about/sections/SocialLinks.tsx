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
    <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
      {github && (
        <button
          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          aria-label={`${memberName}의 Github`}
          onClick={() => {
            window.open(github, "_blank");
          }}
        >
          <Github size={18} />
        </button>
      )}
      {linkedIn && (
        <button
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          aria-label={`${memberName}의 Linkedin`}
          onClick={() => {
            window.open(linkedIn, "_blank");
          }}
        >
          <Linkedin size={18} />
        </button>
      )}
      {email && (
        <button
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          aria-label={`${memberName}에게 이메일 보내기`}
          onClick={() => {
            window.open(email, "_blank");
          }}
        >
          <Mail size={18} />
        </button>
      )}
    </div>
  );
};
