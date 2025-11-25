import React from "react";
import { DemoStockLogo } from "./DemoStockLogo";

export const DemoFavorites: React.FC = () => {
  const favoriteStocks = [
    {
      stockCode: "005930",
      stockName: "삼성전자",
      currentPrice: 72500,
      changeRate: 1.2,
    },
    {
      stockCode: "035420",
      stockName: "NAVER",
      currentPrice: 215000,
      changeRate: -0.5,
    },
    {
      stockCode: "035720",
      stockName: "카카오",
      currentPrice: 54300,
      changeRate: 0.8,
    },
  ];

  return (
    <div className="bg-bg-secondary rounded-2xl p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-text-primary">관심 주식</h2>
        <button className="text-xs text-text-secondary hover:text-primary transition-colors">
          전체보기
        </button>
      </div>
      <div
        className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide swiper-no-swiping"
        data-lenis-prevent
      >
        {favoriteStocks.map((stock) => (
          <div
            key={stock.stockCode}
            className="min-w-[140px] flex flex-col gap-3 cursor-pointer group transition-all duration-200 active:scale-95"
          >
            <div className="flex items-center gap-3">
              <DemoStockLogo name={stock.stockName} />
              <div>
                <p className="font-bold text-text-primary truncate text-sm">
                  {stock.stockName}
                </p>
                <p className="text-xs text-text-secondary">{stock.stockCode}</p>
              </div>
            </div>
            <div>
              <p className="font-bold text-text-primary text-sm">
                {Number(stock.currentPrice).toLocaleString()}원
              </p>
              <p
                className={`text-xs font-medium ${
                  Number(stock.changeRate) >= 0
                    ? "text-positive"
                    : "text-negative"
                }`}
              >
                {Number(stock.changeRate) > 0 ? "+" : ""}
                {Number(stock.changeRate).toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
