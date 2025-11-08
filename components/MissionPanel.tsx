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
  const progress = MOCK_MISSION_PROGRESS;

  const beginnerMissions = missions.filter((m) => m.difficulty === "beginner");
  const intermediateMissions = missions.filter(
    (m) => m.difficulty === "intermediate"
  );
  const advancedMissions = missions.filter((m) => m.difficulty === "advanced");

  if (!isOpen) return null;

  return (
    <Portal>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-60 bg-black/30 backdrop-blur-sm transition-opacity duration-300 opacity-100 pointer-events-auto"
        onClick={onClose}
      />

      {/* Panel - 모바일 화면 모양의 컨테이너 */}
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
            {/* Theme Progress */}
            <div className="bg-linear-to-br from-primary to-secondary p-5 rounded-3xl text-white">
              <h3 className="text-sm font-semibold mb-1 opacity-90">
                현재 테마
              </h3>
              <p className="text-2xl font-bold mb-4">{progress.currentTheme}</p>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="opacity-90">입문 과정</span>
                    <span className="font-semibold">
                      {progress.themeMissions.beginner.completed}/
                      {progress.themeMissions.beginner.total}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (progress.themeMissions.beginner.completed /
                            progress.themeMissions.beginner.total) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="opacity-90">중급 과정</span>
                    <span className="font-semibold">
                      {progress.themeMissions.intermediate.completed}/
                      {progress.themeMissions.intermediate.total}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (progress.themeMissions.intermediate.completed /
                            progress.themeMissions.intermediate.total) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="opacity-90">고급 과정</span>
                    <span className="font-semibold">
                      {progress.themeMissions.advanced.completed}/
                      {progress.themeMissions.advanced.total}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (progress.themeMissions.advanced.completed /
                            progress.themeMissions.advanced.total) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Lists */}
            <div>
              <h3 className="text-base font-bold text-text-primary mb-3">
                입문
              </h3>
              <div className="space-y-3">
                {beginnerMissions.map((mission) => (
                  <MissionItem key={mission.id} mission={mission} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-text-primary mb-3">
                중급
              </h3>
              <div className="space-y-3">
                {intermediateMissions.map((mission) => (
                  <MissionItem key={mission.id} mission={mission} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-text-primary mb-3">
                고급
              </h3>
              <div className="space-y-3">
                {advancedMissions.map((mission) => (
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
