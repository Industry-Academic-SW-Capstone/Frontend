import React from "react";

export const DemoGreeting: React.FC = () => {
  return (
    <div className="p-6 py-3 bg-bg-secondary rounded-2xl flex flex-col cursor-pointer group overflow-hidden relative transition-all duration-500">
      <h1 className="text-2xl font-bold text-text-primary">
        안녕하세요, 김토스님 👋
      </h1>
      <p className="text-text-secondary text-sm mt-1">
        오늘도 스톡잇과 함께 배워봐요!
      </p>
    </div>
  );
};
