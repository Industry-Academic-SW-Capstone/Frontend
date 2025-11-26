import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon } from "@/components/icons/Icons";
import { usePortfolioOrders } from "@/lib/hooks/useOrders";

interface PortfolioOrderHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

const PortfolioOrderHistory: React.FC<PortfolioOrderHistoryProps> = ({
  isOpen,
  onClose,
}) => {
  const [includeCancelled, setIncludeCancelled] = useState(true);
  const { data, isLoading } = usePortfolioOrders(includeCancelled);

  // Helper to format date (e.g., "11.25")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}.${date.getDate()}`;
  };

  // Helper to format price
  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-0 z-50 bg-bg-primary flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-border-color">
            <button onClick={onClose} className="p-2 -ml-2">
              <ChevronLeftIcon className="w-6 h-6 text-text-primary" />
            </button>
            <h2 className="text-lg font-bold text-text-primary">주문내역</h2>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex gap-4">
                    <div className="w-10 h-4 bg-bg-secondary rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="w-20 h-5 bg-bg-secondary rounded" />
                      <div className="w-32 h-4 bg-bg-secondary rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {!data?.ordersByDate || data.ordersByDate.length === 0 ? (
                  <div className="text-center py-20 text-text-secondary">
                    주문 내역이 없습니다.
                  </div>
                ) : (
                  data?.ordersByDate.map((group) => (
                    <div key={group.date} className="flex gap-4">
                      {/* Date Column */}
                      <div className="w-12 pt-1">
                        <span className="text-text-secondary font-medium sticky top-4">
                          {formatDate(group.date)}
                        </span>
                      </div>

                      {/* Orders Column */}
                      <div className="flex-1 space-y-6">
                        {group.orders.map((order) => (
                          <div
                            key={order.orderId}
                            className="flex justify-between items-center"
                          >
                            <div className="flex flex-col">
                              <span className="text-text-primary font-semibold text-lg mb-0.5">
                                {order.stockName}
                              </span>
                              <span
                                className={
                                  "text-text-secondary font-medium text-md"
                                }
                              >
                                {order.stockCode}
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex flex-col items-end gap-1">
                                <span className="text-text-secondary text-sm">
                                  {order.executionPrice
                                    ? "주당 " +
                                      Number(
                                        order.executionPrice
                                      ).toLocaleString() +
                                      "원"
                                    : order.orderPrice
                                    ? Number(
                                        order.orderPrice
                                      ).toLocaleString() + "원"
                                    : "시장가"}
                                </span>

                                <span
                                  className={
                                    order.status === "CANCELLED"
                                      ? "text-text-secondary"
                                      : order.orderMethod === "BUY"
                                      ? "text-[#ea4f4f]"
                                      : "text-[#335eea]"
                                  }
                                >
                                  {order.orderMethod === "BUY"
                                    ? "구매"
                                    : "판매"}{" "}
                                  {order.status === "FILLED" ? "완료" : "취소"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PortfolioOrderHistory;
