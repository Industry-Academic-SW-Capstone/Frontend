"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FireIcon,
  BookmarkIcon,
} from "@/components/icons/Icons";
import {
  Sector,
  BasicStockInfoMockType,
  PopularStockCategory,
  BasicStockInfo,
} from "@/lib/types/types";
import {
  MOCK_SECTORS,
  MOCK_POPULAR_STOCKS,
  MOCK_FAVORITE_STOCKS,
} from "@/lib/constants";
import { useTopStocks } from "@/lib/hooks/stock/useTopStocks";
import { useIndustriesTopStocks } from "@/lib/hooks/stock/useIndustriesTopStocks";
import { generateLogo } from "@/lib/utils";

interface ExploreScreenProps {
  onSelectStock: (ticker: string) => void;
}

const StockRow: React.FC<{
  stock: BasicStockInfo;
  onClick: () => void;
}> = ({ stock, onClick }) => {
  const isPositive = stock.changeRate >= 0;
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-border-color/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <img
          src={generateLogo(stock)}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = generateLogo(stock, true);
          }}
          alt={`${stock.stockName} logo`}
          className="w-10 h-10 rounded-full bg-white object-cover"
        />
        <div>
          <p className="font-bold text-text-primary text-left">
            {stock.stockName}
          </p>
          <p className="text-sm text-text-secondary text-left">
            {stock.stockCode}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-text-primary">
          {stock.currentPrice.toLocaleString()}원
        </p>
        <div
          className={`flex items-center justify-end gap-1 text-sm font-semibold ${
            isPositive ? "text-positive" : "text-negative"
          }`}
        >
          {isPositive ? (
            <ArrowTrendingUpIcon className="w-4 h-4" />
          ) : (
            <ArrowTrendingDownIcon className="w-4 h-4" />
          )}
          <span>
            {isPositive ? "+" : ""}
            {stock.changeRate}%
          </span>
        </div>
      </div>
    </button>
  );
};

const PopularStockCard: React.FC<{
  stock: BasicStockInfo;
  onClick: () => void;
}> = ({ stock, onClick }) => {
  const isPositive = stock.changeRate >= 0;
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-36 bg-bg-secondary border border-border-color rounded-2xl p-4 flex flex-col justify-between"
    >
      <div className="flex justify-center">
        <img
          src={generateLogo(stock)}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = generateLogo(stock, true);
          }}
          alt={stock.stockName}
          className="w-16 h-16 rounded-3xl mb-2 bg-white object-cover"
        />
      </div>

      <p className="font-bold text-sm text-text-primary truncate">
        {stock.stockName}
      </p>
      <div>
        <p className="font-semibold text-text-primary">
          {stock.currentPrice.toLocaleString()}원
        </p>
        <p
          className={`font-semibold text-xs ${
            isPositive ? "text-positive" : "text-negative"
          }`}
        >
          {isPositive ? "▲" : "▼"} {stock.changeRate}%
        </p>
      </div>
    </button>
  );
};

const ExploreScreen: React.FC<ExploreScreenProps> = ({ onSelectStock }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activePopularTab, setActivePopularTab] =
    useState<PopularStockCategory>("amount");
  const [activeContentTab, setActiveContentTab] = useState<
    "sectors" | "favorites"
  >("sectors");

  const { data: popularStocks, isLoading: isLoadingTopStocks } =
    useTopStocks(activePopularTab);
  const { data: industriesTopStocks, isLoading: isLoadingIndustries } =
    useIndustriesTopStocks(activePopularTab);

  // 인기주식 스켈레톤 컴포넌트
  const PopularStockSkeleton = () => (
    <div className="flex-shrink-0 w-36 h-28 bg-bg-secondary border border-border-color rounded-2xl p-4 flex flex-col justify-between animate-pulse">
      <div>
        <div className="w-8 h-8 rounded-full mb-2 bg-gray-200" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
      </div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-1" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );

  const filteredSectors = useMemo(() => {
    if (isLoadingIndustries || !industriesTopStocks) return [];
    if (!searchTerm) return industriesTopStocks;
    const lowercasedFilter = searchTerm.toLowerCase();
    return industriesTopStocks
      .map((sector) => {
        const filteredStocks = sector.stocks.filter(
          (stock) =>
            stock.stockName.toLowerCase().includes(lowercasedFilter) ||
            stock.stockCode.toLowerCase().includes(lowercasedFilter)
        );
        return { ...sector, stocks: filteredStocks };
      })
      .filter((sector) => sector.stocks.length > 0);
  }, [searchTerm]);

  const filteredFavorites = useMemo(() => {
    if (!searchTerm) return MOCK_FAVORITE_STOCKS;
    const lowercasedFilter = searchTerm.toLowerCase();
    return MOCK_FAVORITE_STOCKS.filter(
      (stock) =>
        stock.stockName.toLowerCase().includes(lowercasedFilter) ||
        stock.stockCode.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          placeholder="종목명 또는 티커 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-bg-secondary border border-border-color rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
      </div>

      {/* Popular Stocks */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-text-primary px-2 flex items-center gap-2">
          <FireIcon className="w-6 h-6 text-red-500" />
          지금 시장은?
        </h2>
        <div className="flex bg-bg-secondary p-1 rounded-lg">
          <button
            onClick={() => setActivePopularTab("gainers")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md ${
              activePopularTab === "gainers"
                ? "bg-bg-primary text-positive shadow"
                : "text-text-secondary"
            }`}
          >
            급등
          </button>
          <button
            onClick={() => setActivePopularTab("losers")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md ${
              activePopularTab === "losers"
                ? "bg-bg-primary text-negative shadow"
                : "text-text-secondary"
            }`}
          >
            급락
          </button>
          <button
            onClick={() => setActivePopularTab("amount")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md ${
              activePopularTab === "amount"
                ? "bg-bg-primary text-primary shadow"
                : "text-text-secondary"
            }`}
          >
            거래대금
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 swiper-no-swiping">
          {isLoadingTopStocks || !popularStocks
            ? Array.from({ length: 5 }).map((_, i) => (
                <PopularStockSkeleton key={i} />
              ))
            : popularStocks.map((stock) => (
                <PopularStockCard
                  key={stock.stockCode}
                  stock={stock}
                  onClick={() => onSelectStock(stock.stockCode)}
                />
              ))}
        </div>
      </div>

      {/* Sectors / Favorites */}
      <div className="space-y-3">
        <div className="flex border-b border-border-color">
          <button
            onClick={() => setActiveContentTab("sectors")}
            className={`py-2 px-4 text-sm font-semibold ${
              activeContentTab === "sectors"
                ? "text-primary border-b-2 border-primary"
                : "text-text-secondary"
            }`}
          >
            섹터별
          </button>
          <button
            onClick={() => setActiveContentTab("favorites")}
            className={`py-2 px-4 text-sm font-semibold ${
              activeContentTab === "favorites"
                ? "text-primary border-b-2 border-primary"
                : "text-text-secondary"
            }`}
          >
            관심 종목
          </button>
        </div>
        {activeContentTab === "sectors" && (
          <div className="space-y-4">
            {filteredSectors.map((sector) => (
              <div key={sector.industryName}>
                <h3 className="font-bold text-text-primary px-2 mb-1">
                  {sector.industryName}
                </h3>
                {sector.stocks.map((stock) => (
                  <StockRow
                    key={stock.stockCode}
                    stock={stock}
                    onClick={() => onSelectStock(stock.stockCode)}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
        {activeContentTab === "favorites" && (
          <div className="space-y-2">
            {filteredFavorites.length > 0 ? (
              filteredFavorites.map((stock) => (
                <StockRow
                  key={stock.stockCode}
                  stock={stock}
                  onClick={() => onSelectStock(stock.stockCode)}
                />
              ))
            ) : (
              <div className="text-center py-8 bg-bg-secondary rounded-lg">
                <BookmarkIcon className="w-12 h-12 text-text-secondary mx-auto mb-2" />
                <p className="text-text-secondary">관심 종목을 추가해보세요.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreScreen;
