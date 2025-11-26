import React, { useState, useEffect } from "react";
import { X, ArrowRight, Delete } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WateringCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrice: number;
  averagePrice: number;
  currentQuantity: number;
  stockName: string;
}

const WateringCalculator: React.FC<WateringCalculatorProps> = ({
  isOpen,
  onClose,
  currentPrice,
  averagePrice,
  currentQuantity,
  stockName,
}) => {
  const [additionalQuantity, setAdditionalQuantity] = useState<string>("1");
  const [targetPrice, setTargetPrice] = useState<number>(currentPrice);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setAdditionalQuantity("1");
      setTargetPrice(currentPrice);
    }
  }, [isOpen, currentPrice]);

  const addQty = parseInt(additionalQuantity || "0", 10);
  const totalCost = targetPrice * addQty;

  // Calculation Logic
  const currentTotalValue = averagePrice * currentQuantity;
  const newTotalValue = currentTotalValue + totalCost;
  const newTotalQuantity = currentQuantity + addQty;
  const newAveragePrice =
    newTotalQuantity > 0 ? newTotalValue / newTotalQuantity : 0;

  // Return Rates
  const currentReturnRate =
    averagePrice > 0 ? ((currentPrice - averagePrice) / averagePrice) * 100 : 0;
  const newReturnRate =
    newAveragePrice > 0
      ? ((currentPrice - newAveragePrice) / newAveragePrice) * 100
      : 0;

  const handleNumberClick = (num: number) => {
    setAdditionalQuantity((prev) => {
      if (prev === "0") return num.toString();
      if (prev.length > 6) return prev; // Limit length
      return prev + num.toString();
    });
  };

  const handleBackspace = () => {
    setAdditionalQuantity((prev) => {
      if (prev.length <= 1) return "0";
      return prev.slice(0, -1);
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-0 z-50 flex flex-col bg-bg-primary"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4">
            <button onClick={onClose} className="p-2">
              <X className="w-6 h-6 text-text-primary" />
            </button>
            <span className="text-lg font-bold text-text-primary">
              {stockName}
            </span>
            <div className="w-10" /> {/* Spacer */}
          </div>

          {/* Content */}
          <div className="flex-1 px-6 pt-4 flex flex-col">
            {/* Input Display */}
            <div className="mb-8">
              <div className="flex flex-col gap-1 mb-2">
                <div className="text-2xl font-bold text-text-primary">
                  <span className="text-text-brand">
                    {targetPrice.toLocaleString()}원
                  </span>
                  으로
                </div>
                <div className="text-2xl font-bold text-text-primary flex items-center gap-1">
                  <motion.span
                    key={addQty}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-blue-500"
                  >
                    {addQty.toLocaleString()}주
                  </motion.span>
                  <span>더 구매하면</span>
                </div>
              </div>
              <div className="text-text-secondary">
                총 {totalCost.toLocaleString()}원
              </div>
            </div>

            {/* Comparison Card */}
            <div className="bg-bg-secondary rounded-2xl p-6 mb-auto">
              <div className="flex justify-between items-center">
                {/* Current */}
                <div className="flex flex-col items-center flex-1">
                  <span className="text-text-secondary text-xs mb-1">
                    현재 평균
                  </span>
                  <span
                    className={`text-lg font-bold mb-1 ${
                      currentReturnRate >= 0
                        ? "text-[#ea4f4f]"
                        : "text-[#335eea]"
                    }`}
                  >
                    {currentReturnRate > 0 ? "+" : ""}
                    {currentReturnRate.toFixed(1)}%
                  </span>
                  <span className="text-text-primary text-sm">
                    {Math.round(averagePrice).toLocaleString()}원
                  </span>
                </div>

                <ArrowRight className="w-5 h-5 text-text-tertiary mx-2" />

                {/* Expected */}
                <div className="flex flex-col items-center flex-1">
                  <span className="text-text-secondary text-xs mb-1">
                    예상 평균
                  </span>
                  <motion.div
                    key={newReturnRate}
                    initial={{ scale: 0.9, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <span
                      className={`text-lg font-bold mb-1 ${
                        newReturnRate >= 0 ? "text-[#ea4f4f]" : "text-[#335eea]"
                      }`}
                    >
                      {newReturnRate > 0 ? "+" : ""}
                      {newReturnRate.toFixed(1)}%
                    </span>
                    <span className="text-text-primary text-sm">
                      {Math.round(newAveragePrice).toLocaleString()}원
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#ea4f4f] text-white py-4 rounded-xl font-bold text-lg mb-4"
              onClick={onClose} // For now just close, ideally navigate to order
            >
              구매하러 가기
            </motion.button>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-4 pb-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <motion.button
                  key={num}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleNumberClick(num)}
                  className="py-4 text-2xl font-medium text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
                >
                  {num}
                </motion.button>
              ))}
              <div /> {/* Empty slot */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNumberClick(0)}
                className="py-4 text-2xl font-medium text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
              >
                0
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleBackspace}
                className="py-4 flex items-center justify-center text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
              >
                <Delete className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WateringCalculator;
