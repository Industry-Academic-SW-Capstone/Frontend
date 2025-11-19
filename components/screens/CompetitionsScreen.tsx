"use client";
import React, { useState } from "react";
import { Competition } from "@/lib/types/stock";
import CompetitionCard from "@/components/CompetitionCard";
import CreateCompetitionScreen from "./CreateCompetitionScreen";
import CompetitionDetailScreen from "./CompetitionDetailScreen";
import SlidingScreen from "@/components/navigation/SlidingScreen";
import { PlusCircleIcon, SpinnerIcon } from "@/components/icons/Icons";
import { useContests } from "@/lib/hooks/useContest";

const CompetitionsScreen: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null);
  const [view, setView] = useState<"ongoing" | "finished">("ongoing");

  const { data: competitions, isLoading, error } = useContests();

  const handleAdminClick = (competition: Competition) => {
    setSelectedCompetition(competition);
    setShowAdmin(true);
  };

  const handleDetailClick = (competition: Competition) => {
    setSelectedCompetition(competition);
    setShowDetail(true);
  };

  const handleJoinCompetition = () => {
    setShowDetail(false);
  };

  const filteredCompetitions = competitions?.filter((comp) => {
    const now = new Date();
    const endDate = new Date(comp.endDate);
    if (view === "ongoing") {
      return endDate >= now;
    } else {
      return endDate < now;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">대회</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ripple overflow-hidden relative group"
        >
          {/* Button shimmer */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
          <PlusCircleIcon className="w-5 h-5 relative z-10 transition-transform duration-300" />
          <span className="relative z-10">대회 만들기</span>
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex p-1 bg-bg-secondary/50 rounded-xl border border-border-color">
        <button
          onClick={() => setView("ongoing")}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${
            view === "ongoing"
              ? "bg-bg-primary text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          진행중인 대회
        </button>
        <button
          onClick={() => setView("finished")}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${
            view === "finished"
              ? "bg-bg-primary text-text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          종료된 대회
        </button>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-primary">
          <SpinnerIcon className="w-10 h-10 animate-spin mb-4" />
          <p className="text-sm font-medium animate-pulse">
            대회 목록을 불러오는 중...
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-error">
          <div className="bg-error/10 p-4 rounded-full mb-4">
            <PlusCircleIcon className="w-8 h-8 rotate-45" />{" "}
            {/* Using PlusCircle as X for now or generic error icon */}
          </div>
          <p className="font-bold mb-2">목록을 불러올 수 없습니다</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm underline hover:text-error/80"
          >
            다시 시도하기
          </button>
        </div>
      ) : (
        <div className="min-h-[300px]">
          {filteredCompetitions?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-bg-secondary rounded-full flex items-center justify-center mb-6">
                <PlusCircleIcon className="w-10 h-10 text-text-tertiary" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">
                {view === "ongoing"
                  ? "진행 중인 대회가 없습니다"
                  : "종료된 대회가 없습니다"}
              </h3>
              <p className="text-text-secondary text-sm max-w-xs">
                {view === "ongoing" ? "첫번째 대회를 만들어보세요!" : ""}
              </p>
              {view === "ongoing" && (
                <button
                  onClick={() => setShowCreate(true)}
                  className="mt-6 px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
                >
                  대회 만들기
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCompetitions?.map((comp, index) => (
                <div
                  key={comp.contestId}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CompetitionCard
                    competition={comp}
                    onClickDetail={handleDetailClick}
                    onAdminClick={handleAdminClick}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 대회 생성 화면 - 슬라이딩 패널 */}
      <SlidingScreen isOpen={showCreate} onClose={() => setShowCreate(false)}>
        <CreateCompetitionScreen onBack={() => setShowCreate(false)} />
      </SlidingScreen>

      {/* 대회 상세 화면 - 슬라이딩 패널 */}
      <SlidingScreen
        isOpen={showDetail}
        onClose={() => {
          setShowDetail(false);
          setSelectedCompetition(null);
        }}
      >
        {selectedCompetition && (
          <CompetitionDetailScreen
            competition={selectedCompetition}
            onClose={() => {
              setShowDetail(false);
              setSelectedCompetition(null);
            }}
            onJoin={handleJoinCompetition}
          />
        )}
      </SlidingScreen>
    </div>
  );
};

export default CompetitionsScreen;
