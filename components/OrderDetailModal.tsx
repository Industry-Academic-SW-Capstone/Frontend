import React from "react";
import { Drawer } from "vaul";
import { XMarkIcon } from "@/components/icons/Icons";
import { generateLogo } from "@/lib/utils";
import { useOrderDetail, useCancelOrder } from "@/lib/hooks/useOrders";

interface OrderDetailModalProps {
  orderId: number | null;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  orderId,
  onClose,
}) => {
  const { data: order, isLoading } = useOrderDetail(orderId);
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  if (!orderId) return null;

  const handleCancel = () => {
    if (confirm("주문을 취소하시겠습니까?")) {
      cancelOrder(orderId, {
        onSuccess: () => {
          onClose();
        },
        onError: () => {
          alert("주문 취소에 실패했습니다.");
        },
      });
    }
  };

  return (
    <Drawer.Root
      open={!!orderId}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
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
            <Drawer.Title className="text-xl font-bold text-text-primary">
              주문 상세
            </Drawer.Title>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-text-secondary hover:bg-bg-primary rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : order ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-border-color">
                <img
                  src={generateLogo({
                    stockCode: order.stockCode,
                    marketType: "KOSPI", // Defaulting as type info might be missing in detail
                  })}
                  alt=""
                  className="w-14 h-14 rounded-full bg-gray-50 object-cover"
                />
                <div>
                  <h4 className="text-xl font-bold text-text-primary">
                    {order.stockCode}
                  </h4>
                  <p className="text-text-secondary text-sm">
                    {order.stockCode}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-secondary">주문 유형</span>
                  <span
                    className={`font-bold ${
                      order.orderMethod === "BUY"
                        ? "text-positive"
                        : "text-negative"
                    }`}
                  >
                    {order.orderMethod === "BUY" ? "매수" : "매도"} /{" "}
                    {order.orderType === "MARKET" ? "시장가" : "지정가"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-secondary">주문 가격</span>
                  <span className="font-bold text-text-primary">
                    {order.price > 0
                      ? `${order.price.toLocaleString()}원`
                      : "시장가"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-secondary">주문 수량</span>
                  <span className="font-bold text-text-primary">
                    {order.quantity}주
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-secondary">미체결</span>
                  <span className="font-bold text-text-primary">
                    {order.remainingQuantity}주
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-secondary">주문 시간</span>
                  <span className="font-medium text-text-primary text-sm">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleCancel}
                  disabled={isCancelling}
                  className="w-full py-4 rounded-2xl bg-bg-secondary text-negative font-bold text-lg hover:bg-negative/10 transition-colors disabled:opacity-50"
                >
                  {isCancelling ? "취소 중..." : "주문 취소하기"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-text-secondary">
              주문 정보를 불러올 수 없습니다.
            </div>
          )}

          {/* Safe Area Padding for Mobile */}
          <div className="h-6" />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default OrderDetailModal;
