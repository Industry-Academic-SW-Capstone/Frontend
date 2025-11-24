"use client";
import React, { useState } from "react";
import Portal from "@/components/Portal";
import { MissionListItem } from "@/lib/types/mission";
import {
  useMissionList,
  useMissionTitles,
} from "@/lib/hooks/missions/useMissionList";
import { useMissionDashboard } from "@/lib/hooks/missions/useMissionDashboard";
import {
  useAttendance,
  useAnalyzePortfolio,
  useBankruptcy,
  useViewReport,
} from "@/lib/hooks/missions/useMissionActions";
import { ChevronDownIcon } from "lucide-react";

interface MissionPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const difficultyColors: Record<string, string> = {
  DAILY: "bg-green-500",
  SHORT_TERM: "bg-yellow-500",
  ACHIEVEMENT: "bg-purple-500",
};

const difficultyLabels: Record<string, string> = {
  DAILY: "일일",
  SHORT_TERM: "단기",
  ACHIEVEMENT: "업적",
};

const MissionItem: React.FC<{ mission: MissionListItem }> = ({ mission }) => {
  const progressPercent = Math.min(
    (mission.currentValue / mission.goalValue) * 100,
    100
  );
  const isCompleted = mission.completed;

  // Determine color based on track or default
  const badgeColor = difficultyColors[mission.track] || "bg-gray-500";
  const badgeLabel = difficultyLabels[mission.track] || mission.track;

  return (
    <div
      className={`p-4 border-b border-border-color transition-all hover:border-primary`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {badgeLabel !== "일일" && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${badgeColor}`}
              >
                {badgeLabel}
              </span>
            )}
            {isCompleted && (
              <span className="text-xs text-green-600 font-semibold">
                ✓ 완료
              </span>
            )}
            <h4 className="font-bold text-text-primary text-sm">
              {mission.title}
            </h4>
          </div>

          {mission.description !== mission.title && (
            <p className="text-xs text-text-secondary mt-1">
              {mission.description}
            </p>
          )}
        </div>
        <div className="text-right ml-3 min-w-[60px]">
          <p className="text-xs text-text-secondary">보상</p>
          <p className="font-bold text-primary text-sm">
            {mission.rewardMoney > 0
              ? `${mission.rewardMoney.toLocaleString()}원`
              : mission.rewardTitle || "없음"}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-text-secondary">
            {mission.currentValue}/{mission.goalValue}
          </span>
          <span className="font-semibold text-text-primary">
            {progressPercent.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${
              isCompleted ? "bg-green-500" : "bg-primary"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const MissionPanel: React.FC<MissionPanelProps> = ({ isOpen, onClose }) => {
  const { data: missions } = useMissionList();
  const { data: dashboard } = useMissionDashboard();
  const { mutate: attendance } = useAttendance();
  const { mutate: analyzePortfolio } = useAnalyzePortfolio();
  const { mutate: bankruptcy } = useBankruptcy();
  const { mutate: viewReport } = useViewReport();

  const handleAttendance = () => {
    attendance(undefined, {
      onSuccess: (data) => {
        alert(data.message);
      },
      onError: (error: any) => {
        alert(error.response?.data?.message || "출석 실패");
      },
    });
  };

  const handleAction = (
    action: () => void,
    name: string,
    confirmMsg?: string
  ) => {
    if (confirmMsg && !confirm(confirmMsg)) return;
    action();
  };

  const dailyMissions = missions?.filter(
    (mission) => mission.track === "DAILY"
  );
  const [isDailyOpen, setIsDailyOpen] = useState(true);
  const achievementMissions = missions?.filter(
    (mission) => mission.track === "ACHIEVEMENT"
  );
  const [isAchievementOpen, setIsAchievementOpen] = useState(false);

  const defaultMissions = missions?.filter(
    (mission) => mission.track !== "DAILY" && mission.track !== "ACHIEVEMENT"
  );

  const [isDefaultOpen, setIsDefaultOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <Portal>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-60 bg-black/30 backdrop-blur-sm transition-opacity duration-300 opacity-100 pointer-events-auto"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-0 z-70 flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-md h-full bg-bg-primary shadow-2xl pointer-events-auto transition-transform duration-300 ease-out overflow-y-auto translate-x-0">
          {/* Header */}
          <div className="sticky top-0 bg-bg-primary border-b border-border-color z-10 px-5 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-text-primary">미션</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-bg-primary hover:bg-bg-primary/80 transition-colors"
              >
                <span className="text-lg text-text-primary">✕</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 h-full flex flex-col justify-between">
            <div className="space-y-6">
              {/* Attendance Section */}
              <div className="bg-bg-secondary p-6 rounded-3xl">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h3 className="text-text-secondary text-sm font-medium mb-1">
                      연속 출석
                    </h3>
                    <p className="text-3xl font-bold text-primary">
                      {dashboard?.consecutiveAttendanceDays ?? 0}일째{" "}
                      <span className="text-2xl">🔥</span>
                    </p>
                  </div>
                  <button
                    onClick={handleAttendance}
                    className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors active:scale-95"
                  >
                    출석하기
                  </button>
                </div>
                <p className="text-xs text-text-secondary">
                  매일 출석하고 보상을 받아보세요!
                </p>
              </div>

              {/* Mission List */}
              <div>
                <div
                  className="flex items-center justify-between"
                  onClick={() => setIsDailyOpen(!isDailyOpen)}
                >
                  <h3 className="text-lg font-bold text-text-primary">
                    일일 미션
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm pr-4 text-text-secondary">
                      {missions?.filter(
                        (mission) =>
                          mission.track === "DAILY" && mission.completed
                      ).length ?? 0}
                      /
                      {missions?.filter((mission) => mission.track === "DAILY")
                        .length ?? 0}
                    </p>
                    <div
                      className={`p-1 rounded-full bg-bg-primary text-text-primary group-active:bg-bg-secondary transition-colors ${
                        isDailyOpen ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDownIcon className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div
                  className={`rounded-2xl border border-border-color bg-bg-secondary overflow-y-auto no-scrollbar transition-all duration-300 ${
                    isDailyOpen
                      ? "max-h-[400px] opacity-100 mt-4"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {dailyMissions?.map((mission) => (
                    <MissionItem key={mission.id} mission={mission} />
                  ))}
                  {(!dailyMissions || dailyMissions.length === 0) && (
                    <div className="text-center py-10 text-text-tertiary">
                      일일미션이 없습니다.
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div
                  className="flex items-center justify-between"
                  onClick={() => setIsDefaultOpen(!isDefaultOpen)}
                >
                  <h3 className="text-lg font-bold text-text-primary">
                    기본 미션
                  </h3>
                  <div
                    className={`p-1 rounded-full bg-bg-primary text-text-primary group-active:bg-bg-secondary transition-colors ${
                      isDefaultOpen ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDownIcon className="w-5 h-5" />
                  </div>
                </div>
                <div
                  className={`rounded-2xl border border-border-color bg-bg-secondary overflow-auto no-scrollbar transition-all duration-300 ${
                    isDefaultOpen
                      ? "max-h-[400px] opacity-100 mt-4 "
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {defaultMissions?.map((mission) => (
                    <MissionItem key={mission.id} mission={mission} />
                  ))}
                  {(!defaultMissions || defaultMissions.length === 0) && (
                    <div className="text-center py-10 text-text-tertiary">
                      기본 미션이 없습니다.
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div
                  className="flex items-center justify-between"
                  onClick={() => setIsAchievementOpen(!isAchievementOpen)}
                >
                  <h3 className="text-lg font-bold text-text-primary">
                    도전 과제
                  </h3>
                  <div
                    className={`p-1 rounded-full bg-bg-primary text-text-primary group-active:bg-bg-secondary transition-colors ${
                      isAchievementOpen ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDownIcon className="w-5 h-5" />
                  </div>
                </div>
                <div
                  className={`rounded-2xl border border-border-color bg-bg-secondary overflow-auto no-scrollbar transition-all duration-300 ${
                    isAchievementOpen
                      ? "max-h-[400px] opacity-100 mt-4"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {achievementMissions?.map((mission) => (
                    <MissionItem key={mission.id} mission={mission} />
                  ))}
                  {(!achievementMissions ||
                    achievementMissions.length === 0) && (
                    <div className="text-center py-10 text-text-tertiary">
                      도전 과제가 없습니다.
                    </div>
                  )}
                </div>
              </div>

              {/* Titles Section */}
              <TitlesSection />
            </div>

            {/* Special Actions */}
            <div className="w-full">
              <button
                onClick={() =>
                  handleAction(
                    () =>
                      bankruptcy(undefined, {
                        onSuccess: (d) => alert(d.message),
                      }),
                    "파산 신청",
                    "정말로 파산 신청을 하시겠습니까? 모든 자산이 초기화됩니다."
                  )
                }
                className="w-full p-4 mb-24 bg-red-50 rounded-2xl text-left hover:bg-red-100 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-red-900 text-sm block">
                    파산 신청 (인생 2회차)
                  </span>
                  <span className="text-xs text-red-700">
                    자산이 초기화되고 새로운 시작을 할 수 있습니다.
                  </span>
                </div>
                <span className="text-2xl">💸</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

const TitlesSection: React.FC = () => {
  const { data: titles } = useMissionTitles();

  if (!titles || titles.length === 0) return null;

  return (
    <div className="mt-6 mb-6">
      <h3 className="text-lg font-bold text-text-primary mb-3">보유 칭호</h3>
      <div className="flex flex-wrap gap-2 w-full overflow-auto no-scrollbar p-2 rounded-2xl border border-border-color bg-bg-secondary">
        {titles.map((title) => (
          <div
            key={title.titleId}
            className="px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-full text-yellow-800 text-xs font-bold"
            title={title.description}
          >
            {title.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionPanel;
