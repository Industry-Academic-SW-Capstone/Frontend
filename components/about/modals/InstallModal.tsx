"use client";

import React, { useEffect, useState } from "react";
import { X, Share, MoreVertical, PlusSquare, Download } from "lucide-react";
import { Button } from "../ui/Button";
import { useInstallModal } from "../context/InstallModalContext";
import { QRCodeSVG } from "qrcode.react";

export const InstallModal: React.FC = () => {
  const { isInstallModalOpen, closeInstallModal } = useInstallModal();
  const [activeTab, setActiveTab] = useState<"ios" | "android" | "pc">("ios");

  useEffect(() => {
    const ua = navigator.userAgent;

    // 1. iOS 감지 (iPhone, iPod, 그리고 데스크탑 모드 iPad)
    // iPadOS 13+부터는 'Macintosh'로 뜨기 때문에 maxTouchPoints로 구분해야 함
    const isIos =
      /iPhone|iPod/.test(ua) ||
      (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);

    // 2. Android 감지
    const isAndroid = /Android/.test(ua);

    // 3. PC 감지 (Windows 혹은 순수 Mac)
    // 위에서 iPad를 걸러냈으므로, 여기서 남은 Macintosh는 진짜 맥북/iMac임
    const isPc = /Windows|Macintosh/.test(ua) && !isIos;

    if (isIos) {
      setActiveTab("ios");
    } else if (isAndroid) {
      setActiveTab("android");
    } else {
      // Windows, Mac(순수 PC), 리눅스 등 나머지는 PC로 간주
      setActiveTab("pc");
    }
  }, []);

  if (!isInstallModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeInstallModal}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
          <div>
            <h3 className="text-xl font-bold text-gray-900">앱 설치 가이드</h3>
            <p className="text-sm text-gray-500 mt-1">
              스톡잇을 홈 화면에 추가하세요
            </p>
          </div>
          <button
            onClick={closeInstallModal}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "ios"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("ios")}
          >
            iOS (iPhone/iPad)
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "android"
                ? "text-green-600 border-b-2 border-green-600 bg-green-50/50"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("android")}
          >
            Android
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "pc"
                ? "text-red-600 border-b-2 border-red-600 bg-red-50/50"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("pc")}
          >
            데스크탑
          </button>
        </div>

        {/* Instructions */}
        <div className="p-6">
          {activeTab === "ios" ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                  <span className="font-bold">1</span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium mb-1">
                    Safari 브라우저 실행
                  </p>
                  <p className="text-sm text-gray-500">
                    반드시 Safari 브라우저에서 페이지를 열어주세요.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                  <Share size={20} />
                </div>
                <div>
                  <p className="text-gray-800 font-medium mb-1">
                    '공유' 버튼 탭하기
                  </p>
                  <p className="text-sm text-gray-500">
                    하단 메뉴 바의 중앙에 있는 공유 아이콘을 눌러주세요.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                  <PlusSquare size={20} />
                </div>
                <div>
                  <p className="text-gray-800 font-medium mb-1">
                    '홈 화면에 추가' 선택
                  </p>
                  <p className="text-sm text-gray-500">
                    메뉴를 아래로 스크롤하여 '홈 화면에 추가'를 찾아 선택하세요.
                  </p>
                </div>
              </div>
            </div>
          ) : activeTab === "android" ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                  <span className="font-bold">1</span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium mb-1">
                    Chrome 브라우저 실행
                  </p>
                  <p className="text-sm text-gray-500">
                    Chrome 브라우저에서 페이지를 열어주세요.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                  <MoreVertical size={20} />
                </div>
                <div>
                  <p className="text-gray-800 font-medium mb-1">
                    설정 메뉴 열기
                  </p>
                  <p className="text-sm text-gray-500">
                    우측 상단의 점 3개 아이콘을 눌러 메뉴를 여세요.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                  <Download size={20} />
                </div>
                <div>
                  <p className="text-gray-800 font-medium mb-1">
                    '앱 설치' 또는 '홈 화면에 추가'
                  </p>
                  <p className="text-sm text-gray-500">
                    메뉴에서 설치 옵션을 선택하여 앱처럼 사용하세요.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 space-y-6 text-center">
              <div className="p-4 bg-white border-2 border-red-100 rounded-xl">
                <QRCodeSVG
                  value={"https://stockit.live/about#install"}
                  size={160}
                  fgColor="#000000"
                  bgColor="#ffffff"
                  level="L"
                />
              </div>
              <div className="max-w-xs">
                <p className="text-gray-800 font-bold text-lg mb-2">
                  모바일 기기로 스캔하세요
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  스마트폰 카메라로 QR코드를 스캔하여 모바일 웹사이트에 접속한
                  후, 앱 설치 가이드를 따라주세요.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
          <Button
            variant="primary"
            className="w-full"
            onClick={closeInstallModal}
          >
            확인했습니다
          </Button>
        </div>
      </div>
    </div>
  );
};
