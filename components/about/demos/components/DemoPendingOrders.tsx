import React from "react";

export const DemoPendingOrders: React.FC = () => {
  const pendingOrders = [
    {
      orderId: 1,
      stockName: "삼성전자",
      orderMethod: "BUY",
      remainingQuantity: 10,
      price: 72000,
    },
    {
      orderId: 2,
      stockName: "SK하이닉스",
      orderMethod: "SELL",
      remainingQuantity: 5,
      price: 125000,
    },
  ];

  return (
    <div className="bg-bg-secondary rounded-2xl p-5">
      <h2 className="text-lg font-bold text-text-primary mb-2">
        대기 중인 주문
      </h2>
      <div className="space-y-4">
        {pendingOrders.map((order) => (
          <div
            key={order.orderId}
            className="flex justify-between items-center cursor-pointer p-2 -mx-2 rounded-xl transition-all duration-200 hover:bg-bg-tertiary active:bg-border-color active:scale-95"
          >
            <div>
              <p className="font-bold text-text-primary text-sm">
                {order.stockName}
              </p>
              <div className="flex gap-2 text-xs mt-0.5">
                <span
                  className={`font-medium ${
                    order.orderMethod === "BUY"
                      ? "text-positive"
                      : "text-negative"
                  }`}
                >
                  {order.orderMethod === "BUY" ? "매수" : "매도"}
                </span>
                <span className="text-text-secondary">
                  {Number(order.remainingQuantity).toLocaleString()}주
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-text-primary text-sm">
                {Number(order.price).toLocaleString()}원
              </p>
              <button className="text-xs text-text-secondary bg-bg-primary px-2 py-1 rounded-lg mt-1 hover:bg-border-color transition-colors">
                취소
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
