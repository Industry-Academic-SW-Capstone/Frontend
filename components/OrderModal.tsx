"use client";
import React, { useState, useEffect } from "react";
import { StockDetailInfo } from "@/lib/types/stock";
import { useMarketOrder, useLimitOrder } from "@/lib/hooks/useOrder";
import Toast, { ToastType } from "@/components/ui/Toast";
import { Drawer } from "vaul";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: StockDetailInfo;
  orderType: "buy" | "sell";
  cashBalance: number;
  ownedQuantity?: number;
  accountId: number;
  selectedOrderType: "market" | "limit";
  setSelectedOrderType: (type: "market" | "limit") => void;
  limitPrice: string;
  setLimitPrice: (price: string) => void;
}

const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  stock,
  orderType,
  cashBalance,
  ownedQuantity = 0,
  accountId,
  selectedOrderType,
  setSelectedOrderType,
  limitPrice,
  setLimitPrice,
}) => {
  const [quantity, setQuantity] = useState("");
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: ToastType;
  }>({
    visible: false,
    message: "",
    type: "success",
  });

  const { mutate: marketOrder, isPending: isMarketPending } = useMarketOrder();
  const { mutate: limitOrder, isPending: isLimitPending } = useLimitOrder();

  useEffect(() => {
    if (isOpen) {
      setQuantity("");
      setLimitPrice(stock.currentPrice.toString());
    }
  }, [isOpen, stock.currentPrice]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setQuantity(value);
  };

  const handleLimitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setLimitPrice(value);
  };

  const currentPrice =
    selectedOrderType === "market" ? stock.currentPrice : Number(limitPrice);
  const totalOrderValue = currentPrice * Number(quantity);

  const maxBuyableShares = Math.floor(cashBalance / currentPrice);

  const handlePercentageClick = (percent: number) => {
    if (orderType === "buy") {
      const maxShares = Math.floor((cashBalance * percent) / currentPrice);
      setQuantity(maxShares.toString());
    } else {
      const maxShares = Math.floor(ownedQuantity * percent);
      setQuantity(maxShares.toString());
    }
  };

  const handleSubmit = () => {
    const qty = Number(quantity);
    if (qty <= 0) {
      setToast({
        visible: true,
        message: "주문 수량은 0보다 커야 합니다.",
        type: "error",
      });
      return;
    }

    if (orderType === "buy" && totalOrderValue > cashBalance) {
      setToast({
        visible: true,
        message: "주문 가능 금액을 초과했습니다.",
        type: "error",
      });
      return;
    }

    if (orderType === "sell" && qty > ownedQuantity) {
      setToast({
        visible: true,
        message: "보유 수량을 초과했습니다.",
        type: "error",
      });
      return;
    }

    const commonCallbacks = {
      onSuccess: () => {
        setToast({
          visible: true,
          message: "주문이 접수되었습니다.",
          type: "success",
        });
        setTimeout(() => {
          onClose();
        }, 1500);
      },
      onError: (error: any) => {
        setToast({
          visible: true,
          message: error.response?.data?.message || "주문 실패",
          type: "error",
        });
      },
    };

    if (selectedOrderType === "market") {
      marketOrder(
        {
          account_id: accountId,
          stock_code: stock.stockCode,
          quantity: qty,
          order_method: orderType === "buy" ? "BUY" : "SELL",
        },
        commonCallbacks
      );
    } else {
      limitOrder(
        {
          account_id: accountId,
          stock_code: stock.stockCode,
          price: Number(limitPrice),
          quantity: qty,
          order_method: orderType === "buy" ? "BUY" : "SELL",
        },
        commonCallbacks
      );
    }
  };

  const isPending = isMarketPending || isLimitPending;
  const themeColor = orderType === "buy" ? "text-positive" : "text-negative";
  const themeBg = orderType === "buy" ? "bg-positive" : "bg-negative";
  const themeBorder =
    orderType === "buy" ? "border-positive" : "border-negative";

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      handleOnly
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm" />
        <Drawer.Content
          className="fixed bottom-0 left-0 right-0 z-[10001] w-full max-w-md mx-auto bg-bg-secondary rounded-t-2xl p-6 shadow-2xl outline-none"
          style={{ touchAction: "none" }}
        >
          {/* Handle */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <div>
                <Drawer.Title
                  className={`text-2xl font-bold text-text-primary`}
                >
                  {orderType === "buy" ? "구매하기" : "판매하기"}
                </Drawer.Title>
              </div>

              <p className="text-sm text-text-secondary mt-1">
                {stock.stockName}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-bg-primary p-1 rounded-xl mb-6">
              <button
                onClick={() => setSelectedOrderType("market")}
                className={`flex-1 py-2.5 active:scale-95 duration-75 px-3 text-sm font-bold rounded-lg transition-all ${
                  selectedOrderType === "market"
                    ? "bg-bg-secondary shadow-md text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                시장가
              </button>
              <button
                onClick={() => setSelectedOrderType("limit")}
                className={`flex-1 py-2.5 active:scale-95 duration-75 px-3 text-sm font-bold rounded-lg transition-all ${
                  selectedOrderType === "limit"
                    ? "bg-bg-secondary shadow-md text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                지정가
              </button>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-6">
            <div
              className={`relative transition-all duration-400 ease-out overflow-hidden ${
                selectedOrderType === "limit" ? "max-h-30" : "max-h-0 -mt-6"
              }`}
            >
              <label className="block text-xs font-medium text-text-tertiary mb-1.5 ml-1">
                가격
              </label>
              <div
                className={`flex items-center bg-bg-primary rounded-xl border-2 focus-within:${themeBorder} transition-colors overflow-hidden`}
              >
                <input
                  type="text"
                  value={Number(limitPrice).toLocaleString()}
                  onChange={handleLimitPriceChange}
                  className="w-full bg-transparent p-4 text-xl font-bold text-right outline-none"
                  placeholder="0"
                />
                <span className="pr-4 text-text-secondary font-medium">원</span>
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-medium text-text-tertiary mb-1.5 ml-1">
                수량
              </label>
              <div
                className={`flex items-center bg-bg-primary rounded-xl border-2 focus-within:${themeBorder} transition-colors overflow-hidden`}
              >
                <input
                  type="text"
                  value={quantity ? Number(quantity).toLocaleString() : ""}
                  onChange={handleQuantityChange}
                  className="w-full bg-transparent p-4 text-xl font-bold text-right outline-none"
                  placeholder="0"
                />
                <span className="pr-4 text-text-secondary font-medium">주</span>
              </div>

              {/* Percentage Buttons */}
              <div className="flex gap-2 mt-3">
                {[0.1, 0.25, 0.5, 1].map((percent) => (
                  <button
                    key={percent}
                    onClick={() => handlePercentageClick(percent)}
                    className="flex-1 py-1.5 text-xs font-medium bg-bg-primary hover:bg-border-color rounded-lg text-text-secondary transition-colors"
                  >
                    {percent === 1 ? "최대" : `${percent * 100}%`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Info Summary */}
          <div className="mt-6 p-4 bg-bg-primary rounded-xl space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">
                {orderType === "buy" ? "주문 가능" : "보유 수량"}
              </span>
              <span className="font-bold text-text-primary">
                {orderType === "buy"
                  ? `${cashBalance.toLocaleString()}원`
                  : `${ownedQuantity.toLocaleString()}주`}
              </span>
            </div>
            {orderType === "buy" && (
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">구매 가능 수량</span>
                <span className="font-bold text-text-primary">
                  {maxBuyableShares.toLocaleString()}주
                </span>
              </div>
            )}
            <div className="h-px bg-border-color my-2" />
            <div className="flex justify-between items-center">
              <span className="font-bold text-text-primary">총 주문 금액</span>
              <span className={`text-xl font-bold ${themeColor}`}>
                {totalOrderValue.toLocaleString()}원
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className={`w-full mt-6 py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all transform active:scale-[0.98] ${themeBg} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isPending
              ? "처리중..."
              : orderType === "buy"
              ? "구매하기"
              : "판매하기"}
          </button>

          {/* Safe Area Padding for Mobile */}
          <div className="h-6" />
        </Drawer.Content>
      </Drawer.Portal>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </Drawer.Root>
  );
};

export default OrderModal;
