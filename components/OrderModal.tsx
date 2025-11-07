"use client";
import React, { useState } from "react";
import { StockDetailInfo, StockDetailMockType } from "@/lib/types/types";
import { XMarkIcon } from "./icons/Icons";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: StockDetailInfo;
  orderType: "buy" | "sell";
  cashBalance: number;
}

const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  stock,
  orderType,
  cashBalance,
}) => {
  const [selectedOrderType, setSelectedOrderType] = useState<
    "market" | "limit"
  >("market");
  const [quantity, setQuantity] = useState("");
  const [limitPrice, setLimitPrice] = useState("");

  if (!isOpen) return null;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setQuantity(value);
  };

  const handleLimitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setLimitPrice(value);
  };

  const totalOrderValue =
    selectedOrderType === "market"
      ? stock.currentPrice * Number(quantity)
      : Number(limitPrice) * Number(quantity);

  const maxBuyableShares = Math.floor(cashBalance / stock.currentPrice);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-bg-secondary rounded-2xl m-4 p-6 transform transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-2xl font-bold ${
              orderType === "buy" ? "text-positive" : "text-negative"
            }`}
          >
            {stock.stockName} {orderType === "buy" ? "매수" : "매도"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-border-color"
          >
            <XMarkIcon className="w-6 h-6 text-text-secondary" />
          </button>
        </div>

        <div className="flex bg-bg-primary p-1 rounded-lg mb-4">
          <button
            onClick={() => setSelectedOrderType("market")}
            className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${
              selectedOrderType === "market"
                ? "bg-bg-secondary shadow-sm text-text-primary"
                : "text-text-secondary"
            }`}
          >
            시장가
          </button>
          <button
            onClick={() => setSelectedOrderType("limit")}
            className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${
              selectedOrderType === "limit"
                ? "bg-bg-secondary shadow-sm text-text-primary"
                : "text-text-secondary"
            }`}
          >
            지정가
          </button>
        </div>

        <div className="space-y-4">
          {selectedOrderType === "limit" && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                주문 가격
              </label>
              <input
                type="text"
                value={limitPrice.toLocaleString()}
                onChange={handleLimitPriceChange}
                placeholder="희망 가격 입력"
                className="w-full bg-bg-primary border border-border-color rounded-lg p-3 text-right font-mono"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              주문 수량
            </label>
            <input
              type="text"
              value={quantity}
              onChange={handleQuantityChange}
              placeholder="주문할 수량 입력"
              className="w-full bg-bg-primary border border-border-color rounded-lg p-3 text-right font-mono"
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-bg-primary rounded-lg text-sm space-y-1">
          {orderType === "buy" ? (
            <>
              <div className="flex justify-between">
                <span className="text-text-secondary">주문 가능 금액</span>
                <span className="font-semibold text-text-primary">
                  {cashBalance.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">최대 주문 가능 수량</span>
                <span className="font-semibold text-text-primary">
                  {maxBuyableShares.toLocaleString()}주
                </span>
              </div>
            </>
          ) : (
            <div className="flex justify-between">
              <span className="text-text-secondary">주문 가능 수량</span>
              <span className="font-semibold text-text-primary">
                {/* {stock.shares.toLocaleString()}주 */}
                {"3주"}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center font-bold">
            <span>총 주문 금액</span>
            <span>{totalOrderValue.toLocaleString()}원</span>
          </div>
          <button
            onClick={onClose}
            className={`w-full mt-2 py-3 rounded-lg font-bold text-white transition-colors ${
              orderType === "buy"
                ? "bg-positive hover:bg-positive/90"
                : "bg-negative hover:bg-negative/90"
            }`}
          >
            {orderType === "buy"
              ? `${quantity || 0}주 매수하기`
              : `${quantity || 0}주 매도하기`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
