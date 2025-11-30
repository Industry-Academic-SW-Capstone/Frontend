"use client";
import React from "react";

interface DartItem {
  corpName: string;
  title: string;
  time: string;
}

interface DartSignalProps {
  data: {
    items: DartItem[];
  };
}

const DartSignal: React.FC<DartSignalProps> = ({ data }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold text-text-primary px-1 mb-2">
        실시간 공시
      </h3>
      <div className="space-y-2">
        {data.items.map((item, index) => (
          <div
            key={index}
            className="p-4 bg-bg-secondary rounded-xl flex justify-between items-center"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-toss-blue bg-blue-50 px-1.5 py-0.5 rounded">
                  공시
                </span>
                <span className="text-sm font-bold text-text-primary">
                  {item.corpName}
                </span>
              </div>
              <div className="text-xs text-text-secondary truncate max-w-[200px]">
                {item.title}
              </div>
            </div>
            <span className="text-xs text-gray-400">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DartSignal;
