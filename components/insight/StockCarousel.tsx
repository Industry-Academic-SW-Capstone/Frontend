"use client";
import React from "react";
import { motion } from "framer-motion";

interface StockItem {
  name: string;
  price: string;
  change: string; // e.g., "+3.5%"
}

interface StockCarouselProps {
  data: {
    title: string;
    items: StockItem[];
  };
}

const StockCarousel: React.FC<StockCarouselProps> = ({ data }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-text-primary px-1 mb-3">
        {data.title}
      </h3>
      <div className="flex overflow-x-auto pb-4 px-1 gap-3 snap-x no-scrollbar">
        {data.items.map((item, index) => {
          const isUp = item.change.startsWith("+");
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="min-w-[140px] p-4 bg-bg-secondary rounded-2xl snap-start flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                  {item.name[0]}
                </div>
                <span className="font-bold text-text-primary text-sm truncate">
                  {item.name}
                </span>
              </div>
              <div>
                <div className="text-text-primary font-bold">{item.price}</div>
                <div
                  className={`text-xs font-medium ${
                    isUp ? "text-toss-red" : "text-toss-blue"
                  }`}
                >
                  {item.change}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StockCarousel;
