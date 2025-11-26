// components/common/SlidingTabs.tsx
import { useMemo } from "react";

interface TabItem {
  id: string;
  label: string;
  elementId?: string;
}

interface SlidingTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  isBlack?: boolean;
}

export const SlidingTabs = ({
  tabs,
  activeTab,
  onTabChange,
  isBlack = true,
}: SlidingTabsProps) => {
  // 현재 활성화된 탭의 인덱스를 찾습니다 (0, 1, 2...)
  const activeTabIndex = useMemo(
    () => tabs.findIndex((tab) => tab.id === activeTab),
    [tabs, activeTab]
  );
  const width = useMemo(() => `calc((100% - 2rem) / ${tabs.length})`, [tabs]);
  const padding = useMemo(() => `calc(3rem / ${tabs.length})`, [tabs]);

  return (
    <div className="relative flex border-b border-border-color -mx-4 px-4 font-semibold">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          id={tab.elementId}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-2 text-sm transition-colors duration-300 ${
            activeTab === tab.id
              ? !isBlack
                ? "text-primary"
                : "text-text-primary"
              : isBlack
              ? "text-text-secondary"
              : "text-text-primary"
          }`}
        >
          {tab.label}
        </button>
      ))}

      {/* 슬라이딩 인디케이터 */}
      <div
        className="absolute bottom-0 left-4 h-0.5 transition-transform duration-300 ease-out"
        style={{
          // 탭 개수에 맞춰 너비 자동 계산: (100% - 좌우패딩 2rem) / 탭개수
          width: width,
          paddingLeft: padding,
          paddingRight: padding,
          // 인덱스에 따라 위치 이동 (0%, 100%, 200%...)
          transform: `translateX(${activeTabIndex * 100}%)`,
        }}
      >
        {/* 내부 div로 실제 색상을 표현 (필요시 패딩 등 스타일링 용이) */}
        <div
          className={
            isBlack
              ? "w-full h-full bg-text-primary"
              : "w-full h-full bg-primary"
          }
        />
      </div>
    </div>
  );
};
