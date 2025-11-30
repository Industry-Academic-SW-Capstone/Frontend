"use client";
import React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { XMarkIcon } from "@/components/icons/Icons";

interface GuruReportScreenProps {
  report: any;
  onClose: () => void;
}

export const GuruReportScreen: React.FC<GuruReportScreenProps> = ({
  report,
  onClose,
}) => {
  if (!report) return null;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-white flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex flex-col">
          <span className="text-xs text-blue-600 font-bold mb-0.5">
            INVESTMENT NOTE
          </span>
          <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
            {report.title}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <XMarkIcon className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 pb-20">
        {/* Summary Card */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-2">💡 3줄 요약</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {report.summary}
          </p>
        </div>

        {/* Markdown Body */}
        <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-7 prose-strong:text-blue-600">
          <ReactMarkdown>{report.full_content}</ReactMarkdown>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            * 본 리포트는 AI 페르소나가 생성한 가상 분석이며, 실제 투자 권유가
            아닙니다.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
