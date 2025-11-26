"use client";

import React from "react";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "../ui/Button";
import { useInstallModal } from "../context/InstallModalContext";
import { usePWAInstall } from "@/lib/hooks/usePWAInstall";
import { useLenis } from "../ui/SmoothScroll";

export const HeroActions: React.FC = () => {
  const { openInstallModal } = useInstallModal();
  const { isInstallable, promptInstall } = usePWAInstall();
  const lenis = useLenis();

  const handleStartClick = () => {
    if (isInstallable) {
      promptInstall();
    } else {
      openInstallModal();
    }
  };

  const handleLearnMoreClick = () => {
    if (lenis) {
      lenis.scrollTo("#features");
    } else {
      document
        .getElementById("features")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
      <Button
        size="lg"
        variant="primary"
        onClick={handleStartClick}
        className="font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
      >
        {isInstallable ? (
          <>
            <Download className="mr-2 w-5 h-5" />앱 다운로드
          </>
        ) : (
          "지금 시작하기"
        )}
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="group text-white border-white/20 hover:bg-white/10 hover:border-white/40 backdrop-blur-sm"
        onClick={handleLearnMoreClick}
      >
        기능 더보기{" "}
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};
