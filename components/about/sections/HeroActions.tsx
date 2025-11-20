"use client";

import React from "react";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "../ui/Button";
import { useInstallModal } from "../context/InstallModalContext";
import { usePWAInstall } from "@/lib/hooks/usePWAInstall";

export const HeroActions: React.FC = () => {
  const { openInstallModal } = useInstallModal();
  const { isInstallable, promptInstall } = usePWAInstall();

  const handleStartClick = () => {
    if (isInstallable) {
      promptInstall();
    } else {
      openInstallModal();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
      <Button
        size="lg"
        variant="secondary"
        onClick={handleStartClick}
        className="font-bold"
      >
        {isInstallable ? (
          <>
            <Download className="mr-2 w-5 h-5" />앱 다운로드
          </>
        ) : (
          "지금 시작하기"
        )}
      </Button>
      <Button size="lg" variant="outline" className="group">
        기능 더보기{" "}
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};
