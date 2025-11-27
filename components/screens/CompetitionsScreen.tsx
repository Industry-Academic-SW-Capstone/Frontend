"use client";
import React, { useEffect, useState } from "react";
import { Competition } from "@/lib/types/stock";
import CompetitionCard from "@/components/CompetitionCard";
import CreateCompetitionScreen from "./CreateCompetitionScreen";
import CompetitionDetailScreen from "./CompetitionDetailScreen";
import EventDescriptionScreen from "./EventDescriptionScreen";
import SlidingScreen from "@/components/navigation/SlidingScreen";
import {
  PlusCircleIcon,
  SpinnerIcon,
  ArrowPathIcon,
} from "@/components/icons/Icons";
import { useContests } from "@/lib/hooks/useContest";
import { useQueryClient } from "@tanstack/react-query";

import { useCompetitionEntryStore } from "@/lib/stores/useCompetitionEntryStore";

const CompetitionsScreen: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null);
  const [initialJoinPassword, setInitialJoinPassword] = useState<
    string | undefined
  >(undefined);
  const [view, setView] = useState<"ongoing" | "finished">("ongoing");

  // Pull to Refresh State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullStartY, setPullStartY] = useState(0);
  const [pullCurrentY, setPullCurrentY] = useState(0);
  const PULL_THRESHOLD = 80;
  const queryClient = useQueryClient();

  const { data: competitions, isFetching, error, refetch } = useContests();
  const { pendingCompetitionId, pendingPassword, clearPendingEntry } =
    useCompetitionEntryStore();

  useEffect(() => {
    if (pendingCompetitionId && competitions) {
      const targetCompetition = competitions.find(
        (c) => c.contestId === pendingCompetitionId
      );
      if (targetCompetition) {
        setSelectedCompetition(targetCompetition);
        setInitialJoinPassword(pendingPassword);
        setShowDetail(true);
        clearPendingEntry();
      }
    }
  }, [pendingCompetitionId, pendingPassword, competitions, clearPendingEntry]);

  const handleAdminClick = (competition: Competition) => {
    setSelectedCompetition(competition);
    setInitialJoinPassword(undefined);
    setShowAdmin(true);
  };

  const handleDetailClick = (competition: Competition) => {
    setSelectedCompetition(competition);
    setInitialJoinPassword(undefined);
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

  // Pull to Refresh Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const scrollContainer = e.currentTarget.closest(".overflow-y-auto");
    if (scrollContainer && scrollContainer.scrollTop === 0) {
      setPullStartY(e.touches[0].clientY);
    } else if (!scrollContainer && window.scrollY === 0) {
      setPullStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    if (pullStartY > 0 && currentY > pullStartY) {
      setPullCurrentY(currentY - pullStartY);
    }
  };

  const handleTouchEnd = async () => {
    if (pullCurrentY > PULL_THRESHOLD) {
      setIsRefreshing(true);
      try {
        await refetch();
      } catch (error) {
        console.error("Refresh failed", error);
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullStartY(0);
    setPullCurrentY(0);
  };

  return (
    <>
      {/* Floating Action Button for Creation */}
      <button
        onClick={() => setShowCreate(true)}
        className="fixed bottom-44 right-5 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center
        animate-fadeInUp
        "
        style={{ animationDelay: "0.5s" }}
        aria-label="대회 만들기"
      >
        <PlusCircleIcon className="w-6 h-6" />
      </button>
      <div
        className="space-y-6 relative min-h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Pull to Refresh Indicator */}
        <div
          className="absolute top-0 left-0 w-full flex justify-center pointer-events-none transition-all duration-300 ease-out z-10"
          style={{
            transform: `translateY(${
              pullCurrentY > 0 ? Math.min(pullCurrentY / 2, 60) : 0
            }px)`,
            opacity:
              pullCurrentY > 0 ? Math.min(pullCurrentY / PULL_THRESHOLD, 1) : 0,
          }}
        >
          <div
            className={`p-2 rounded-full bg-bg-secondary shadow-md border border-border-color flex items-center justify-center ${
              isRefreshing ? "animate-spin" : ""
            }`}
          >
            <ArrowPathIcon
              className={`w-6 h-6 text-primary ${
                pullCurrentY > PULL_THRESHOLD
                  ? "rotate-180 transition-transform duration-300"
                  : ""
              }`}
            />
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-bg-secondary/50 rounded-xl border border-border-color">
          <button
            onClick={() => setView("ongoing")}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${
              view === "ongoing"
                ? "bg-bg-primary text-text-primary shadow-sm"
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
        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-primary">
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
            {/* Event Banner */}
            <div
              onClick={() => setShowEventDetail(true)}
              className="bg-gradient-to-r from-event-start via-event-middle to-event-end rounded-2xl p-5 mb-4 active:scale-95 transition-all duration-300 ease-out text-white shadow-lg relative overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
              <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-white opacity-10 rounded-full blur-xl"></div>

              <div className="relative z-10 flex items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm uppercase tracking-wider">
                      Event
                    </span>
                    <h3 className="font-bold text-lg leading-tight">
                      이벤트 대회 진행중!
                    </h3>
                  </div>

                  <p className="text-sm text-white/90 font-medium opacity-90">
                    여기를 눌러서 자세히 알아보세요.
                  </p>
                </div>
              </div>
            </div>
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
              <div className="grid grid-cols-1 gap-4">
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
              initialPassword={initialJoinPassword}
            />
          )}
        </SlidingScreen>

        {/* 이벤트 상세 화면 - 슬라이딩 패널 */}
        <SlidingScreen
          isOpen={showEventDetail}
          onClose={() => setShowEventDetail(false)}
          depthId="event_detail"
        >
          <EventDescriptionScreen onClose={() => setShowEventDetail(false)} />
        </SlidingScreen>
      </div>
    </>
  );
};

export default CompetitionsScreen;
