import React, { useEffect, useState } from "react";
import {
  ChevronLeftIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@/components/icons/Icons";

interface NewsItem {
  title: string;
  link: string;
  press: string;
  time: string;
  image?: string;
}

interface DailyReport {
  marketOverview: string;
  sectorAnalysis: string[];
  oneLineBriefing: string;
  news: NewsItem[];
  date: string;
}

interface DailyReportScreenProps {
  onBack: () => void;
}

const DailyReportScreen: React.FC<DailyReportScreenProps> = ({ onBack }) => {
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch("/api/daily-report");
        if (!res.ok) throw new Error("Failed to fetch report");
        const data = await res.json();
        setReport(data);
      } catch (err) {
        setError("리포트를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="flex pt-safe pb-safe flex-col h-full bg-[#191F28] text-white">
        <div className="flex items-center h-[52px] px-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <ChevronLeftIcon className="w-6 h-6 text-white" />
          </button>
          <span className="font-bold text-lg ml-2">오늘의 증시 리포트</span>
        </div>
        <div className="p-5 space-y-4 animate-pulse">
          <div className="h-40 bg-gray-800 rounded-2xl" />
          <div className="h-24 bg-gray-800 rounded-2xl" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-800 rounded w-3/4" />
                  <div className="h-4 bg-gray-800 rounded w-1/2" />
                </div>
                <div className="w-20 h-20 bg-gray-800 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex pt-safe pb-safe flex-col h-full bg-[#191F28] text-white">
        <div className="flex items-center h-[52px] px-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <ChevronLeftIcon className="w-6 h-6 text-white" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400">
          {error || "데이터가 없습니다."}
        </div>
      </div>
    );
  }

  return (
    <div className="flex pt-safe pb-safe flex-col h-full bg-[#191F28] text-white overflow-y-auto pb-10 relative">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#191F28]/90 backdrop-blur-md flex justify-between items-center pr-4">
        <div className="flex items-center h-[52px] px-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <ChevronLeftIcon className="w-6 h-6 text-white" />
          </button>
          <span className="font-bold text-lg ml-2">오늘의 증시 리포트</span>
        </div>
        <button
          onClick={() => setShowInfoModal(true)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <InformationCircleIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="p-5 space-y-8">
        {/* One Line Briefing */}
        <section>
          <span className="text-blue-400 font-bold text-sm mb-2 block">
            오늘의 한줄 요약
          </span>
          <h1 className="text-2xl font-bold leading-tight">
            {report.oneLineBriefing}
          </h1>
        </section>

        {/* Market Overview */}
        <section className="bg-[#232935] p-5 rounded-2xl">
          <h2 className="text-lg font-bold mb-3">시장 브리핑</h2>
          <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">
            {report.marketOverview}
          </p>
        </section>

        {/* Sector Analysis */}
        <section>
          <h2 className="text-lg font-bold mb-3">주요 섹터 및 테마</h2>
          <ul className="space-y-3">
            {report.sectorAnalysis.map((point, index) => (
              <li
                key={index}
                className="flex items-start gap-3 bg-[#232935] p-4 rounded-xl"
              >
                <span className="text-blue-400 font-bold mt-0.5">•</span>
                <span className="text-gray-300 text-sm leading-relaxed">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* News List */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">관련 뉴스</h2>
          </div>
          <div className="space-y-4">
            {report.news.map((news, index) => (
              <a
                key={index}
                href={news.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-between gap-4 group active:opacity-70 transition-opacity"
              >
                <div className="flex-1 flex flex-col justify-between py-1">
                  <h3 className="text-gray-100 font-medium leading-snug line-clamp-2">
                    {news.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                    <span>{news.time}</span>
                    <span>·</span>
                    <span>{news.press}</span>
                  </div>
                </div>
                {news.image ? (
                  <img
                    src={news.image}
                    alt=""
                    className="w-20 h-20 rounded-xl object-cover bg-gray-800 shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gray-800 shrink-0 flex items-center justify-center text-gray-600 text-xs">
                    No Image
                  </div>
                )}
              </a>
            ))}
          </div>
        </section>

        <div className="text-center text-xs text-gray-600 pt-8 pb-4">
          AI가 생성한 정보로 부정확할 수 있습니다.
          <br />
          투자의 책임은 본인에게 있습니다.
        </div>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowInfoModal(false)}
          />
          <div className="relative bg-[#232935] w-full max-w-sm rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">리포트 정보</h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-gray-400 mb-1">
                  분석 기준
                </h4>
                <p className="text-sm text-gray-200">
                  네이버 증권의 주요 뉴스 헤드라인을 기반으로
                  <br />
                  Gemini AI가 실시간으로 분석합니다.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-400 mb-1">
                  데이터 출처
                </h4>
                <p className="text-sm text-gray-200">
                  네이버 금융 (finance.naver.com)
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-400 mb-1">
                  생성 일시
                </h4>
                <p className="text-sm text-gray-200">
                  {new Date(report.date).toLocaleString("ko-KR")}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500 leading-relaxed">
                  본 리포트는 투자 참고용이며, AI 모델의 특성상
                  <br />
                  사실과 다른 내용이 포함될 수 있습니다.
                  <br />
                  모든 투자의 책임은 투자자 본인에게 있습니다.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyReportScreen;
