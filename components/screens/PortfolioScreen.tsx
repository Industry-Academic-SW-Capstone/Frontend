"use client";
import React from "react";
import {
  MOCK_STOCK_HOLDINGS,
  MOCK_ACCOUNTS,
  MOCK_PENDING_ORDERS,
  MOCK_CASH_BALANCE,
} from "@/lib/constants";
import { StockHolding, Order } from "@/lib/types/stock";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
} from "@/components/icons/Icons";
import PortfolioDonutChart from "@/components/PortfolioDonutChart";
import { generateLogo } from "@/lib/utils";

interface PortfolioScreenProps {
  onSelectStock: (ticker: string) => void;
}

const StockRow: React.FC<{ holding: StockHolding; onClick: () => void }> = ({
  holding,
  onClick,
}) => {
  const totalValue = holding.shares * holding.currentPrice;
  const isTodayPositive = holding.todayChangePercent >= 0;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-bg-secondary transition-colors"
    >
      <div className="flex items-center gap-4">
        <img
          src={generateLogo(holding)}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = generateLogo(holding, true);
          }}
          alt={`${holding.stockName} logo`}
          className="w-10 h-10 rounded-full bg-white object-cover"
        />
        <div>
          <p className="font-bold text-text-primary text-left">
            {holding.stockName}
          </p>
          <p className="text-sm text-text-secondary text-left">
            {holding.shares}주
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-text-primary">
          {totalValue.toLocaleString()}원
        </p>
        <div className="flex items-center justify-end gap-1 text-sm">
          {isTodayPositive ? (
            <ArrowTrendingUpIcon className="w-4 h-4 text-positive" />
          ) : (
            <ArrowTrendingDownIcon className="w-4 h-4 text-negative" />
          )}
          <span className={isTodayPositive ? "text-positive" : "text-negative"}>
            {holding.todayChangePercent.toFixed(2)}%
          </span>
        </div>
      </div>
    </button>
  );
};

const PendingOrderRow: React.FC<{ order: Order }> = ({ order }) => {
  return (
    <div className="w-full flex items-center justify-between p-4 rounded-xl bg-bg-secondary">
      <div className="flex items-center gap-4">
        <img
          src={generateLogo(order)}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = generateLogo(order, true);
          }}
          alt={`${order.stockName} logo`}
          className="w-10 h-10 rounded-full bg-white object-cover"
        />
        <div>
          <p className="font-bold text-text-primary text-left">
            {order.stockName}
          </p>
          <p
            className={`text-sm font-semibold ${
              order.type === "buy" ? "text-positive" : "text-negative"
            }`}
          >
            {order.orderType === "limit"
              ? `${order.price?.toLocaleString()}원`
              : "시장가"}{" "}
            / {order.shares}주
          </p>
        </div>
      </div>
      <div className="text-right">
        <button className="text-xs font-semibold bg-border-color text-text-secondary px-3 py-1.5 rounded-full hover:bg-negative hover:text-white">
          주문취소
        </button>
      </div>
    </div>
  );
};

const PortfolioScreen: React.FC<PortfolioScreenProps> = ({ onSelectStock }) => {
  const selectedAccount = MOCK_ACCOUNTS[0]; // Assuming main account for portfolio view

  return (
    <div className="space-y-6">
      <PortfolioDonutChart
        holdings={MOCK_STOCK_HOLDINGS}
        cash={MOCK_CASH_BALANCE}
      />

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-text-primary px-2">보유 종목</h3>
        {MOCK_STOCK_HOLDINGS.map((holding) => (
          <StockRow
            key={holding.stockCode}
            holding={holding}
            onClick={() => onSelectStock(holding.stockCode)}
          />
        ))}
      </div>

      {MOCK_PENDING_ORDERS.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-2">
            <ClockIcon className="w-5 h-5 text-text-secondary" />
            <h3 className="text-lg font-bold text-text-primary">대기 주문</h3>
          </div>
          {MOCK_PENDING_ORDERS.map((order) => (
            <PendingOrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioScreen;
