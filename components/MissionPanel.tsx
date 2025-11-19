"use client";
import React from "react";
import { Mission, MissionProgress } from "@/lib/types/stock";
import { MOCK_MISSIONS, MOCK_MISSION_PROGRESS } from "@/lib/constants";
import Portal from "@/components/Portal";

interface MissionPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const difficultyColors = {
  beginner: "bg-green-500",
  intermediate: "bg-yellow-500",
  advanced: "bg-red-500",
};

const difficultyLabels = {
  beginner: "입문",
  intermediate: "중급",
  advanced: "고급",
};

const MissionItem: React.FC<{ mission: Mission }> = ({ mission }) => {
  const progressPercent = (mission.progress / mission.maxProgress) * 100;
  const isLocked = mission.status === "locked";
  const isCompleted = mission.status === "completed";

  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        isLocked
          ? "bg-gray-50 border-gray-200 opacity-60"
          : isCompleted
          ? "bg-green-50 border-green-200"
          : "bg-white border-border-color hover:border-primary"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${
                difficultyColors[mission.difficulty]
              }`}
            >
              {difficultyLabels[mission.difficulty]}
            </span>
            {isCompleted && (
              <span className="text-xs text-green-600 font-semibold">
                ✓ 완료
              </span>
            )}
            {isLocked && (
              <span className="text-xs text-gray-400 font-medium">🔒</span>
            )}
          </div>
          <h4 className="font-bold text-text-primary text-sm">
            {mission.title}
          </h4>
          <p className="text-xs text-text-secondary mt-1">
            {mission.description}
          </p>
        </div>
        <div className="text-right ml-3">
          <p className="text-xs text-text-secondary">보상</p>
          <p className="font-bold text-primary text-sm">
            {mission.reward.toLocaleString()}원
          </p>
        </div>
      </div>

      {!isLocked && (
        <div className="mt-3">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-text-secondary">
              {mission.progress}/{mission.maxProgress}
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
      )}
    </div>
  );
};

const MissionPanel: React.FC<MissionPanelProps> = ({ isOpen, onClose }) => {
  const missions = MOCK_MISSIONS;

  // Mock Attendance Data
  const attendance = {
    streak: 12,
    todayChecked: false,
    history: [true, true, true, true, true, false, false], // Last 7 days (reverse order or specific dates)
  };

  const days = ["월", "화", "수", "목", "금", "토", "일"];
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; // Mon=0, Sun=6

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
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <span className="text-lg text-text-primary">✕</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-6 pb-24">
            {/* Attendance Section */}
            <div className="bg-bg-secondary p-6 rounded-3xl">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="text-text-secondary text-sm font-medium mb-1">
                    연속 출석
                  </h3>
                  <p className="text-3xl font-bold text-primary">
                    {attendance.streak}일째 <span className="text-2xl">🔥</span>
                  </p>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
                  출석하기
                </button>
              </div>

              <div className="flex justify-between">
                {days.map((day, index) => {
                  const isToday = index === todayIndex;
                  const isChecked =
                    index < todayIndex ||
                    (index === todayIndex && attendance.todayChecked);

                  return (
                    <div key={day} className="flex flex-col items-center gap-2">
                      <span
                        className={`text-xs ${
                          isToday
                            ? "font-bold text-text-primary"
                            : "text-text-secondary"
                        }`}
                      >
                        {day}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                          isChecked
                            ? "bg-primary text-white"
                            : isToday
                            ? "bg-bg-primary border-2 border-primary text-primary"
                            : "bg-bg-primary text-text-tertiary"
                        }`}
                      >
                        {isChecked ? "✓" : ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mission List */}
            <div>
              <h3 className="text-lg font-bold text-text-primary mb-4">
                도전 과제
              </h3>
              <div className="space-y-3">
                {missions.map((mission) => (
                  <MissionItem key={mission.id} mission={mission} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default MissionPanel;
