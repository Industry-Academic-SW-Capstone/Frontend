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
  IndustriesTopStocks,
  StockSearchResult,
} from "@/lib/types/stock";
import { useTopStocks } from "@/lib/hooks/stock/useTopStocks";
import { useIndustriesTopStocks } from "@/lib/hooks/stock/useIndustriesTopStocks";
import { useFavoriteStocks } from "@/lib/hooks/stock/useFavoriteStock";
import { useStockSearch } from "@/lib/hooks/useStockSearch";
import { generateLogo } from "@/lib/utils";
import { useStockStore } from "@/lib/stores/useStockStore";
import { useWebSocket } from "@/lib/providers/SocketProvider";

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
      className="w-full flex items-center justify-between p-4 rounded-xl active:bg-border-color/50 active:scale-98 transition-all ease-in-out duration-200"
      onTouchStart={() => {}}
    >
      <div className="flex items-center gap-3">
        <img
          src={generateLogo(stock)}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = generateLogo(stock, true);
          }}
          alt={`${stock.stockName} logo`}
          className="w-10 h-10 rounded-xl bg-white object-cover"
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
      className="shrink-0 w-32 min-h-40 bg-bg-secondary border border-border-color rounded-2xl p-3 px-0 flex flex-col justify-between active:scale-98 transition-all ease-in-out duration-200"
      onTouchStart={() => {}}
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

// 섹터별/관심종목 스켈레톤 컴포넌트
const StockRowSkeleton = () => (
  <div className="w-full flex items-center justify-between p-4 rounded-xl">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse" />
      <div>
        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-1" />
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
    <div className="text-right">
      <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mb-1" />
      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto" />
    </div>
  </div>
);

const SearchResultRow: React.FC<{
  result: StockSearchResult;
  onClick: () => void;
}> = ({ result, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 hover:bg-bg-secondary/50 active:bg-bg-secondary rounded-xl transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-bg-secondary flex items-center justify-center">
          <MagnifyingGlassIcon className="w-5 h-5 text-text-secondary" />
        </div>
        <div>
          <p className="font-bold text-text-primary text-left">
            {result.stockName}
          </p>
          <p className="text-sm text-text-secondary text-left">
            {result.stockCode}
          </p>
        </div>
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

  const upsertTickers = useStockStore((state) => state.upsertTickers);
  const { data: popularStocks, isLoading: isLoadingTopStocks } =
    useTopStocks(activePopularTab);

  useEffect(() => {
    // data가 존재하면(로드 완료되면) Zustand 스토어 업데이트
    if (popularStocks) {
      upsertTickers(popularStocks);
    }
  }, [popularStocks, upsertTickers]); // data가 바뀔 때마다 실행됨

  const { data: industriesTopStocks, isLoading: isLoadingIndustries } =
    useIndustriesTopStocks(activePopularTab);

  useEffect(() => {
    // data가 존재하면(로드 완료되면) Zustand 스토어 업데이트
    if (industriesTopStocks) {
      industriesTopStocks.forEach((sector: IndustriesTopStocks) => {
        upsertTickers(sector.stocks);
      });
    }
  }, [industriesTopStocks, upsertTickers]); // data가 바뀔 때마다 실행됨

  const { data: favoriteStocks, isLoading: isLoadingFavorites } =
    useFavoriteStocks();

  useEffect(() => {
    if (favoriteStocks) {
      upsertTickers(favoriteStocks);
    }
  }, [favoriteStocks, upsertTickers]);

  const { setSubscribeSet } = useWebSocket();

  useEffect(() => {
    const tickers = new Set<string>();
    popularStocks?.forEach((stock) => tickers.add(stock.stockCode));
    industriesTopStocks?.forEach((sector) =>
      sector.stocks.forEach((stock) => tickers.add(stock.stockCode))
    );
    favoriteStocks?.forEach((stock) => tickers.add(stock.stockCode));
    setSubscribeSet(Array.from(tickers));
  }, [popularStocks, industriesTopStocks, favoriteStocks]);

  // Search Hook
  const { data: searchResults, isLoading: isSearching } =
    useStockSearch(searchTerm);

  // 인기주식 스켈레톤 컴포넌트
  const PopularStockSkeleton = () => (
    <div className="shrink-0 w-32 min-h-40 bg-bg-secondary border border-border-color rounded-2xl p-3 px-0 flex flex-col justify-between items-center animate-pulse">
      <div className="w-16 h-16 rounded-3xl mb-2 bg-gray-200" />
      <div className="h-4 bg-gray-200 rounded w-1/2 my-0.5" />
      <div className="h-5 bg-gray-200 rounded w-3/5 my-0.5" />
      <div className="h-3 bg-gray-200 rounded w-3/7 my-0.5" />
    </div>
  );

  return (
    <div className="space-y-6 relative">
      <div className="relative mt-4 z-20">
        <input
          type="text"
          placeholder="종목명 또는 티커 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-bg-secondary border border-border-color rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
      </div>

      {/* Search Results Overlay */}
      {searchTerm && (
        <div className="absolute top-16 left-0 right-0 bg-bg-primary border border-border-color rounded-xl shadow-lg z-10 max-h-[60vh] overflow-y-auto">
          {isSearching ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-full flex items-center gap-3 p-2 animate-pulse"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 bg-gray-200 rounded" />
                    <div className="h-3 w-1/4 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((result) => (
                <SearchResultRow
                  key={result.stockCode}
                  result={result}
                  onClick={() => onSelectStock(result.stockCode)}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-text-secondary">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}

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
            {isLoadingIndustries || !industriesTopStocks ? (
              // 섹터별 스켈레톤
              <>
                {[1, 2, 3].map((sectorIndex) => (
                  <div key={sectorIndex}>
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse px-2 mb-1" />
                    {[1, 2, 3].map((stockIndex) => (
                      <StockRowSkeleton key={`${sectorIndex}-${stockIndex}`} />
                    ))}
                  </div>
                ))}
              </>
            ) : industriesTopStocks.length > 0 ? (
              industriesTopStocks.map((sector) => (
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
              ))
            ) : (
              <div className="text-center py-8 bg-bg-secondary rounded-lg">
                <p className="text-text-secondary">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        )}
        {activeContentTab === "favorites" && (
          <div className="space-y-2">
            {isLoadingFavorites ? (
              // 관심종목 스켈레톤
              <>
                {[1, 2, 3].map((i) => (
                  <StockRowSkeleton key={i} />
                ))}
              </>
            ) : favoriteStocks && favoriteStocks.length > 0 ? (
              favoriteStocks.map((stock) => (
                <StockRow
                  key={stock.stockCode}
                  stock={stock}
                  onClick={() => onSelectStock(stock.stockCode)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-bg-secondary/30 rounded-2xl border border-dashed border-border-color">
                <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mb-4">
                  <BookmarkIcon className="w-8 h-8 text-text-tertiary" />
                </div>
                <p className="text-text-primary font-bold text-lg mb-1">
                  관심 종목이 없습니다
                </p>
                <p className="text-text-secondary text-sm text-center max-w-[200px]">
                  종목을 검색하고 별 아이콘을 눌러 관심 종목으로 등록해보세요.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreScreen;
