"use client";

import { ChevronDown } from "lucide-react";
import { useLenis } from "./ui/SmoothScroll";

export const ScrollDown: React.FC = () => {
  const lenis = useLenis();

  return (
    <div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-bounce cursor-pointer"
      onClick={() => {
        lenis?.scrollTo(`#home`);
      }}
    >
      {/* Scroll Down Indicator */}
      <ChevronDown size={24} />
    </div>
  );
};
