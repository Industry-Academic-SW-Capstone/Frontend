"use client";
import { useState } from "react";
import { useInsight } from "@/lib/hooks/useInsight";
import { InsightWidgetRenderer } from "../insight/InsightWidgetRenderer";
import { motion, AnimatePresence } from "framer-motion";
import { GuruList } from "../insight/GuruList";
import { GuruReportScreen } from "./GuruReportScreen";
import { MarketTicker } from "../insight/MarketTicker";

export const InsightScreen = () => {
  const { data: snapshot, isLoading, error } = useInsight();
  const [selectedReport, setSelectedReport] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-gray-400">인사이트 분석 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        데이터를 불러오는데 실패했습니다.
      </div>
    );
  }

  if (!snapshot) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        아직 생성된 인사이트가 없습니다.
      </div>
    );
  }

  const payload = snapshot.payload as any;
  const { layout, widgets, raw_data } = payload;

  return (
    <>
      <div className="h-full overflow-y-auto pb-32 bg-bg-primary hide-scrollbar">
        {/* Header Area */}
        <div className="pt-6 pb-2 px-5 bg-bg-secondary">
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            인사이트
          </h1>
          {/* Market Ticker */}
          <MarketTicker rawData={raw_data} />
        </div>

        <div className="max-w-md mx-auto px-4 space-y-4 mt-4">
          {layout.map((widgetName: string, index: number) => {
            const widgetData = widgets[widgetName];
            if (!widgetData) return null;

            return (
              <motion.div
                key={`${widgetName}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <InsightWidgetRenderer
                  type={widgetName}
                  data={widgetData}
                  rawData={raw_data}
                />
              </motion.div>
            );
          })}

          {/* Guru Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: layout.length * 0.1 }}
            className="pt-4"
          >
            <GuruList onSelectReport={setSelectedReport} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedReport && (
          <GuruReportScreen
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default InsightScreen;
