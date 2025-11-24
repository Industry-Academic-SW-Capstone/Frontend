"use client";
import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  FireIcon,
  BookmarkIcon,
} from "@/components/icons/Icons";
import {
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
import { SlidingTabs } from "../ui/SlidingTabs";

interface ExploreScreenProps {
  onSelectStock: (ticker: string) => void;
  isActive: boolean;
}

const StockRow: React.FC<{
  stockCode: string;
  initialData?: BasicStockInfo;
  onClick: () => void;
}> = ({ stockCode, initialData, onClick }) => {
  const stock =
    useStockStore((state) => state.tickers[stockCode]) || initialData;

  if (!stock) return null;
  const isPositive = stock.changeRate >= 0;
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-2 rounded-xl active:bg-border-color/50 active:scale-98 transition-all ease-in-out duration-200"
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
        <p className="font-semibold text-text-primary text-md">
          {stock.currentPrice.toLocaleString()}원
        </p>
        <div
          className={`flex items-center justify-end gap-1 text-sm font-medium ${
            isPositive ? "text-positive" : "text-negative"
          }`}
        >
          <span>
            {isPositive ? "+" : ""}
            {stock.changeAmount.toLocaleString()}
            {" ("}
            {stock.changeRate}%{")"}
          </span>
        </div>
      </div>
    </button>
  );
};

const PopularStockCard: React.FC<{
  type: PopularStockCategory;
  stockCode: string;
  initialData?: BasicStockInfo;
  onClick: () => void;
}> = ({ type, stockCode, initialData, onClick }) => {
  const stock =
    useStockStore((state) => state.tickers[stockCode]) || initialData;

  if (!stock) return null;
  const isPositive = stock.changeRate >= 0;
  return (
    <button
      onClick={onClick}
      id={`${type}-${stock.stockCode}`}
      className="shrink-0 w-32 min-h-40 bg-bg-secondary border border-border-color rounded-2xl p-3 px-0 flex flex-col justify-between active:scale-98 transition-all animate-fadeIn ease-in-out duration-200"
      onTouchStart={() => {}}
    >
      <div className="w-full flex justify-center">
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

      <p className="w-full font-bold text-sm text-text-primary truncate">
        {stock.stockName}
      </p>
      <div className="w-full flex flex-col">
        <p className="w-full font-semibold text-text-primary">
          {stock.currentPrice.toLocaleString()}원
        </p>
        <p
          className={`w-full font-semibold text-xs ${
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
      <div className="w-10 h-10 rounded-xl bg-bg-secondary animate-pulse" />
      <div>
        <div className="h-5 w-24 bg-bg-secondary rounded animate-pulse mb-1" />
        <div className="h-4 w-16 bg-bg-secondary rounded animate-pulse" />
      </div>
    </div>
    <div className="text-right">
      <div className="h-5 w-20 bg-bg-secondary rounded animate-pulse mb-1" />
      <div className="h-4 w-16 bg-bg-secondary rounded animate-pulse ml-auto" />
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

const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onSelectStock,
  isActive,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchModal, setSearchModal] = useState(false);
  useEffect(() => {
    if (!isActive) {
      setSearchModal(false);
    }
  }, [isActive]);
  useEffect(() => {
    if (searchModal) {
      setSearchTerm("");
    }
  }, [searchModal]);

  const [activePopularTab, setActivePopularTab] =
    useState<PopularStockCategory>("gainers");
  const [activeContentTab, setActiveContentTab] = useState<
    "sectors" | "favorites"
  >("sectors");

  const { upsertTickers } = useStockStore();
  const { data: popularStocks, isLoading: isLoadingTopStocks } =
    useTopStocks(activePopularTab);

  useEffect(() => {
    // data가 존재하면(로드 완료되면) Zustand 스토어 업데이트
    if (popularStocks && isActive) {
      upsertTickers(popularStocks);
    }
  }, [popularStocks, upsertTickers, isActive]); // data가 바뀔 때마다 실행됨

  const { data: industriesTopStocks, isLoading: isLoadingIndustries } =
    useIndustriesTopStocks(activePopularTab);

  useEffect(() => {
    // data가 존재하면(로드 완료되면) Zustand 스토어 업데이트
    if (industriesTopStocks && isActive && activeContentTab === "sectors") {
      industriesTopStocks.forEach((sector: IndustriesTopStocks) => {
        upsertTickers(sector.stocks);
      });
    }
  }, [industriesTopStocks, upsertTickers, isActive, activeContentTab]); // data가 바뀔 때마다 실행됨

  const { data: favoriteStocks, isLoading: isLoadingFavorites } =
    useFavoriteStocks();

  useEffect(() => {
    if (favoriteStocks && isActive && activeContentTab === "favorites") {
      upsertTickers(favoriteStocks);
    }
  }, [favoriteStocks, upsertTickers, isActive, activeContentTab]);

  const { setSubscribeSet } = useWebSocket();

  useEffect(() => {
    if (!isActive) return;
    const tickers = new Set<string>();
    popularStocks?.forEach((stock) => tickers.add(stock.stockCode));
    if (activeContentTab === "sectors") {
      industriesTopStocks?.forEach((sector) =>
        sector.stocks.forEach((stock) => tickers.add(stock.stockCode))
      );
    }
    if (activeContentTab === "favorites") {
      favoriteStocks?.forEach((stock) => tickers.add(stock.stockCode));
    }
    console.log("구독 항목", "인기종목", activeContentTab, Array.from(tickers));
    setSubscribeSet(Array.from(tickers));
  }, [
    popularStocks,
    industriesTopStocks,
    favoriteStocks,
    isActive,
    activeContentTab,
  ]);

  // Search Hook
  const { data: searchResults, isLoading: isSearching } =
    useStockSearch(searchTerm);

  // 인기주식 스켈레톤 컴포넌트
  const PopularStockSkeleton = () => (
    <div className="shrink-0 w-32 min-h-40 bg-bg-secondary border border-border-color rounded-2xl p-3 px-0 flex flex-col justify-between items-center animate-pulse">
      <div className="w-16 h-16 rounded-3xl mb-2 bg-bg-secondary" />
      <div className="h-4 bg-bg-secondary rounded w-1/2 my-0.5" />
      <div className="h-5 bg-bg-secondary rounded w-3/5 my-0.5" />
      <div className="h-3 bg-bg-secondary rounded w-3/7 my-0.5" />
    </div>
  );

  return (
    <div className="relative bg-bg-secondary">
      {/* Search Results Overlay */}

      {searchModal && (
        <div
          className={`fixed top-0 left-0 right-0 bg-bg-primary/35 z-10 transition-opacity duration-800 ease-in-out ${
            searchModal ? "h-full opacity-100" : "h-0 opacity-0"
          }`}
          onClick={() => setSearchModal(false)}
        >
          <div
            className="absolute top-16 left-2 right-2 bg-bg-primary border border-border-color rounded-xl shadow-lg z-20 max-h-[60vh] overflow-y-auto transition-all duration-800 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-2 z-20">
              <input
                type="text"
                placeholder="종목명 또는 티커 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-bg-secondary border border-border-color rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <MagnifyingGlassIcon className="absolute left-4.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            </div>
            {searchTerm.length > 0 ? (
              isSearching ? (
                <div className="p-4 space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-full flex items-center gap-3 p-2 animate-pulse"
                    >
                      <div className="w-10 h-10 rounded-xl bg-bg-secondary" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/3 bg-bg-secondary rounded" />
                        <div className="h-3 w-1/4 bg-bg-secondary rounded" />
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
              )
            ) : null}
          </div>
        </div>
      )}

      {/* Popular Stocks */}
      <div className="space-y-3 bg-bg-secondary -mx-4 px-4 pt-6 pb-2">
        <div className="flex items-center justify-between pb-3">
          <h2 className="text-xl font-bold text-text-primary px-2 flex items-center gap-2">
            <FireIcon className="w-6 h-6 text-red-500" />
            지금 시장은?
          </h2>
          <MagnifyingGlassIcon
            className="w-6 h-6 text-text-primary cursor-pointer"
            onClick={() => setSearchModal(true)}
          />
        </div>

        <SlidingTabs
          tabs={[
            { id: "gainers", label: "급등" },
            { id: "losers", label: "급락" },
            { id: "amount", label: "거래대금" },
          ]}
          activeTab={activePopularTab}
          onTabChange={(tabId) =>
            setActivePopularTab(tabId as "gainers" | "losers" | "amount")
          }
        />
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 -mt-3 pt-3 swiper-no-swiping bg-bg-primary">
          {isLoadingTopStocks || !popularStocks
            ? Array.from({ length: 5 }).map((_, i) => (
                <PopularStockSkeleton key={i} />
              ))
            : popularStocks.map((stock) => (
                <PopularStockCard
                  type={activePopularTab}
                  key={`${activePopularTab}-${stock.stockCode}`}
                  stockCode={stock.stockCode}
                  initialData={stock}
                  onClick={() => onSelectStock(stock.stockCode)}
                />
              ))}
        </div>
      </div>

      {/* Sectors / Favorites */}

      <div className="-mx-4 px-4 bg-bg-secondary pt-3">
        <SlidingTabs
          tabs={[
            { id: "sectors", label: "섹터별" },
            { id: "favorites", label: "관심종목" },
          ]}
          activeTab={activeContentTab}
          onTabChange={(tabId) =>
            setActiveContentTab(tabId as "sectors" | "favorites")
          }
        />
        {activeContentTab === "sectors" && (
          <div className="space-y-4 -mx-4 px-4 pt-2 ">
            {isLoadingIndustries || !industriesTopStocks ? (
              // 섹터별 스켈레톤
              <>
                {[1, 2, 3].map((sectorIndex) => (
                  <div key={sectorIndex}>
                    <div className="h-6 w-32 bg-bg-secondary rounded animate-pulse px-2 mb-1" />
                    {[1, 2, 3].map((stockIndex) => (
                      <StockRowSkeleton key={`${sectorIndex}-${stockIndex}`} />
                    ))}
                  </div>
                ))}
              </>
            ) : industriesTopStocks.length > 0 ? (
              industriesTopStocks.map((sector) => (
                <div key={sector.industryName}>
                  <h3 className="font-bold text-text-primary px-2 mb-1 ">
                    {sector.industryName}
                  </h3>
                  {sector.stocks.map((stock) => (
                    <StockRow
                      key={stock.stockCode}
                      stockCode={stock.stockCode}
                      initialData={stock}
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
                  stockCode={stock.stockCode}
                  initialData={stock}
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
