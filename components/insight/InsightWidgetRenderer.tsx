import React, { useState } from "react";
import { HeroHeader } from "./HeroHeader";
import MarketGauge from "./MarketGauge";
import SectorHeatmap from "./SectorHeatmap";
import SupplyTrend from "./SupplyTrend";
import StockCarousel from "./StockCarousel";
import { NewsBrief } from "./NewsBrief";
import DartSignal from "./DartSignal";
import MarketNarrative from "./MarketNarrative";
import AnalystNote from "./AnalystNote";
import { InformationCircleIcon, XMarkIcon } from "@/components/icons/Icons";
import { AnimatePresence, motion } from "framer-motion";

interface InsightWidgetRendererProps {
  type: string;
  data: any;
  rawData?: any;
}

export const InsightWidgetRenderer: React.FC<InsightWidgetRendererProps> = ({
  type,
  data,
  rawData,
}) => {
  const [showInfo, setShowInfo] = useState(false);

  const renderWidget = () => {
    switch (type) {
      case "HeroHeader":
        return <HeroHeader data={data} />;
      case "MarketGauge":
        return <MarketGauge data={data} rawData={rawData} />;
      case "SectorHeatmap":
        return <SectorHeatmap data={data} />;
      case "SupplyTrend":
        return <SupplyTrend data={data} rawData={rawData} />;
      case "StockCarousel":
        return <StockCarousel data={data} />;
      case "NewsBrief":
        return <NewsBrief data={data} />;
      case "DartSignal":
        return <DartSignal data={data} />;
      case "MarketNarrative":
        return <MarketNarrative data={data} />;
      case "AnalystNote":
        return <AnalystNote data={data} />;
      default:
        return null;
    }
  };

  // HeroHeader has its own style, so we might not want to wrap it in the standard card
  if (type === "HeroHeader") {
    return renderWidget();
  }

  return (
    <div className="relative group">
      {/* Widget Content */}
      {renderWidget()}

      {/* Info Button (Visible on hover or always visible but subtle) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowInfo(true);
        }}
        className="absolute top-4 right-4 text-text-third hover:text-text-primary transition-colors p-1"
      >
        <InformationCircleIcon className="w-5 h-5" />
      </button>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowInfo(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-bg-secondary w-full max-w-sm rounded-2xl p-6 shadow-xl z-10"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-text-primary">
                  위젯 정보
                </h3>
                <button
                  onClick={() => setShowInfo(false)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="text-text-secondary text-sm leading-relaxed mb-6">
                {/* Dynamic description based on widget type */}
                {getWidgetDescription(type)}
              </div>

              <div className="pt-4 border-t border-border-color">
                <p className="text-xs text-text-third">
                  AI가 실시간 데이터를 기반으로 분석한 내용입니다.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

function getWidgetDescription(type: string): string {
  switch (type) {
    case "MarketGauge":
      return "현재 시장의 공포/탐욕 지수를 나타냅니다. 변동성, 거래량, 모멘텀 등을 종합하여 산출됩니다.";
    case "SectorHeatmap":
      return "오늘 시장에서 가장 강세를 보이는 섹터와 약세를 보이는 섹터를 한눈에 파악할 수 있습니다.";
    case "SupplyTrend":
      return "외국인과 기관 투자자의 순매수/순매도 현황을 보여줍니다. 수급 주체의 움직임을 파악해보세요.";
    case "NewsBrief":
      return "오늘의 주요 증시 뉴스를 요약해서 보여줍니다. 클릭하면 원본 기사로 이동합니다.";
    case "DartSignal":
      return "전자공시시스템(DART)에 올라온 주요 공시 중 투자에 참고할 만한 내용을 선별했습니다.";
    default:
      return "시장의 주요 흐름을 파악하는 데 도움이 되는 데이터입니다.";
  }
}

export default InsightWidgetRenderer;
