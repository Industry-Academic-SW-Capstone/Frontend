import React from "react";
import { TrendingUp, Github, Twitter, Mail } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-blue-600 w-6 h-6" />
              <span className="text-xl font-bold text-gray-900">StockIt!</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              초보자를 위한 최고의 주식 모의투자 플랫폼. <br />
              실전 감각을 익히고 더 나은 투자자가 되어보세요.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">바로가기</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href="#home"
                  className="hover:text-blue-600 transition-colors"
                >
                  홈
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-blue-600 transition-colors"
                >
                  주요 기능
                </a>
              </li>
              <li>
                <a
                  href="#demo"
                  className="hover:text-blue-600 transition-colors"
                >
                  앱 미리보기
                </a>
              </li>
              <li>
                <a
                  href="#team"
                  className="hover:text-blue-600 transition-colors"
                >
                  팀 소개
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">문의하기</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Mail size={16} /> support@stockit.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © 2024 StockIt Team. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-gray-600">
              개인정보처리방침
            </a>
            <a href="#" className="hover:text-gray-600">
              이용약관
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
