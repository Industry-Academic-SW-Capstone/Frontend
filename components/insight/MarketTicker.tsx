"use client";
import React from "react";

interface MarketTickerProps {
  rawData?: {
    market?: {
      kospi?: { index: string; change: string; changeRate: string };
      kosdaq?: { index: string; change: string; changeRate: string };
      usIndices?: {
        nasdaq?: string;
        snp500?: string;
      };
      exchangeRate?: string;
    };
  };
}

export const MarketTicker: React.FC<MarketTickerProps> = ({ rawData }) => {
  if (!rawData?.market) return null;

  const { kospi, kosdaq, usIndices, exchangeRate } = rawData.market;

  // Mock events for now (In real app, fetch from calendar API)
  const events = [
    { dDay: "오늘", title: "미국 FOMC 의사록 공개" },
    { dDay: "2일 뒤", title: "ISM 제조업 구매관리자지수 발표" },
  ];

  const items = [
    ...events.map((e) => ({ type: "event", ...e })),
    {
      type: "index",
      name: "코스피",
      value: kospi?.index,
      change: kospi?.changeRate,
    },
    {
      type: "index",
      name: "코스닥",
      value: kosdaq?.index,
      change: kosdaq?.changeRate,
    },
    {
      type: "index",
      name: "나스닥",
      value: usIndices?.nasdaq,
      change: "+0.0%", // Placeholder as we only have index value in current fetcher
    },
    {
      type: "index",
      name: "환율",
      value: exchangeRate,
      change: "",
    },
  ];

  return (
    <div className="w-full overflow-x-auto hide-scrollbar py-2 mb-2">
      <div className="flex items-center gap-4 px-5 min-w-max">
        {items.map((item: any, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col justify-center h-10">
              {item.type === "event" ? (
                <>
                  <span className="text-[10px] text-text-third font-medium mb-0.5">
                    {item.dDay} 이벤트
                  </span>
                  <span className="text-sm font-bold text-text-primary leading-none">
                    {item.title}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[10px] text-text-third font-medium mb-0.5">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-text-primary leading-none">
                      {item.value}
                    </span>
                    {item.change && (
                      <span
                        className={`text-xs font-medium ${
                          item.change.includes("+")
                            ? "text-toss-red"
                            : item.change.includes("-")
                            ? "text-toss-blue"
                            : "text-text-third"
                        }`}
                      >
                        {item.change}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
            {index < items.length - 1 && (
              <div className="w-px h-8 bg-border-color mx-1" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
