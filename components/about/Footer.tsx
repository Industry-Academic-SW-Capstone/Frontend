"use client";

import React, { useState } from "react";
import { TrendingUp, Mail } from "lucide-react";
import { LegalModal } from "./modals/LegalModal";
import { PrivacyPolicyContent } from "./modals/PrivacyPolicy";
import { TermsOfServiceContent } from "./modals/TermsOfService";

export const Footer: React.FC = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <>
      <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-blue-600 w-6 h-6" />
                <span className="text-xl font-bold text-gray-900">
                  StockIt!
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                초보자를 위한 최고의 주식 모의투자 플랫폼. <br />
                실전 감각을 익히고 더 나은 투자자가 되어보세요.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">바로가기</h4>
              <ul className="space-y-2 flex flex-row space-x-4 text-sm text-gray-600">
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
              <h4 className="font-bold text-gray-900 mb-4">문의하기</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Mail size={16} /> urous3814@gmail.com
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col justify-between items-center gap-4">
            <p className="text-xs text-gray-400">
              © 2025 StockIt Team. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-gray-400">
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="hover:text-gray-600 transition-colors cursor-pointer"
              >
                개인정보처리방침
              </button>
              <button
                onClick={() => setShowTermsModal(true)}
                className="hover:text-gray-600 transition-colors cursor-pointer"
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
