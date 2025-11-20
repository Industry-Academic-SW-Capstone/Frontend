"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useLenis } from "../ui/SmoothScroll";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const lenis = useLenis();

  // ESC 키로 모달 닫기 및 Lenis 스크롤 제어
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      lenis?.stop(); // Lenis 스크롤 중지
    } else {
      lenis?.start(); // Lenis 스크롤 재개
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
      lenis?.start(); // 컴포넌트 언마운트 시 안전하게 스크롤 재개
    };
  }, [isOpen, onClose, lenis]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white px-8 py-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="닫기"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className="overflow-y-auto max-h-[calc(85vh-88px)] px-8 py-8"
          data-lenis-prevent // Lenis 스크롤 전파 방지
        >
          <div className="prose prose-slate max-w-none">{children}</div>
        </div>
      </div>
    </div>
  );
};
