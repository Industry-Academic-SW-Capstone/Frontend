"use client";

import React, { useState } from "react";
import { Mail } from "lucide-react";
import { LegalModal } from "./modals/LegalModal";
import { PrivacyPolicyContent } from "./modals/PrivacyPolicy";
import { TermsOfServiceContent } from "./modals/TermsOfService";
import Image from "next/image";

export const Footer: React.FC = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <>
      <footer className="bg-white border-t border-slate-100 pt-20 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <Image
                    src="/icon-192.png"
                    width={32}
                    height={32}
                    alt="StockIt Logo"
                  />
                </div>
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                  StockIt!
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-medium">
                초보자를 위한 최고의 주식 모의투자 플랫폼. <br />
                실전 감각을 익히고 더 나은 투자자가 되어보세요.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">바로가기</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li>
                  <a
                    href="/about"
                    className="hover:text-blue-600 transition-colors"
                  >
                    홈
                  </a>
                </li>
                <li>
                  <a
                    href="/about/tech"
                    className="hover:text-blue-600 transition-colors"
                  >
                    기술 스택
                  </a>
                </li>
                <li>
                  <a
                    href="/about/blog"
                    className="hover:text-blue-600 transition-colors"
                  >
                    블로그
                  </a>
                </li>
                <li>
                  <a
                    href="/about/announce"
                    className="hover:text-blue-600 transition-colors"
                  >
                    공지사항
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">문의하기</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li className="flex items-center gap-2">
                  <Mail size={16} /> urous3814@gmail.com
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400 font-medium">
              © 2025 StockIt Team. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-slate-400 font-medium">
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="hover:text-slate-600 transition-colors cursor-pointer"
              >
                개인정보처리방침
              </button>
              <button
                onClick={() => setShowTermsModal(true)}
                className="hover:text-slate-600 transition-colors cursor-pointer"
              >
                이용약관
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LegalModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="개인정보처리방침"
      >
        <PrivacyPolicyContent />
      </LegalModal>

      <LegalModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="이용약관"
      >
        <TermsOfServiceContent />
      </LegalModal>
    </>
  );
};
