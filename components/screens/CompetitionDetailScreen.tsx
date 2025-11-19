"use client";
import React, { useState } from "react";
import { Competition, UpdateCompetitionRequest } from "@/lib/types/stock";
import {
  XMarkIcon,
  CalendarIcon,
  UsersIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
} from "@/components/icons/Icons";
import { useCompetitionJoin } from "@/lib/hooks/competition/useCompetitionJoin";
import { useCompetitionAdmin } from "@/lib/hooks/competition/useCompetitionAdmin";
import { useAccountStore } from "@/lib/store/useAccountStore";
import { Drawer } from "vaul";
import Portal from "@/components/Portal";

interface CompetitionDetailScreenProps {
  competition: Competition;
  onClose: () => void;
  onJoin: () => void;
}

const CompetitionDetailScreen: React.FC<CompetitionDetailScreenProps> = ({
  competition,
  onClose,
  onJoin,
}) => {
  const { selectedAccount } = useAccountStore();
  const [accountName, setAccountName] = useState("");
  const [isJoinDrawerOpen, setIsJoinDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  // Admin Form State
  const [editForm, setEditForm] = useState<UpdateCompetitionRequest>({
    contestName: competition.contestName,
    startDate: competition.startDate,
    endDate: competition.endDate,
    seedMoney: competition.seedMoney,
    commissionRate: competition.commissionRate,
    minMarketCap: competition.minMarketCap,
    maxMarketCap: competition.maxMarketCap,
    dailyTradeLimit: competition.dailyTradeLimit,
    maxHoldingsCount: competition.maxHoldingsCount,
    buyCooldownMinutes: competition.buyCooldownMinutes,
    sellCooldownMinutes: competition.sellCooldownMinutes,
  });

  const { mutate: joinCompetition, isPending: isJoining } = useCompetitionJoin({
    contestId: competition.contestId,
    onSuccess: () => {
      setIsJoinDrawerOpen(false);
      onJoin(); // Refresh parent or just close
      // Ideally we should show a success toast here
    },
  });

  const { updateCompetition, isUpdating, deleteCompetition, isDeleting } =
    useCompetitionAdmin({
      contestId: competition.contestId,
      onSuccess: () => {
        setIsEditDrawerOpen(false);
        onClose(); // Close detail screen on delete/update (or refresh)
      },
    });

  const now = new Date();
  const start = new Date(competition.startDate);
  const end = new Date(competition.endDate);
  const isActive = now >= start && now <= end;
  const isUpcoming = now < start;
  const isFinished = now > end;

  const isAdmin = selectedAccount?.memberId === competition.managerMemberId;

  const statusText = isUpcoming
    ? "대회 시작 전"
    : isActive
    ? "진행 중"
    : "종료된 대회";
  const statusColor = isUpcoming
    ? "text-primary"
    : isActive
    ? "text-positive"
    : "text-text-secondary";

  const handleJoin = () => {
    if (!accountName.trim()) return;
    joinCompetition({ accountName });
  };

  const handleDelete = () => {
    if (confirm("정말로 이 대회를 삭제하시겠습니까?")) {
      deleteCompetition();
    }
  };

  const handleUpdate = () => {
    updateCompetition(editForm);
  };

  return (
    <div className="h-full bg-bg-primary flex flex-col relative">
      {/* Header Image / Gradient Area */}
      <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 rounded-full text-white transition-colors backdrop-blur-sm z-10"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {isAdmin && (
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <button
              onClick={() => setIsEditDrawerOpen(true)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors backdrop-blur-sm"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-full text-red-500 transition-colors backdrop-blur-sm"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-bg-primary to-transparent">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-bg-primary/80 backdrop-blur-md mb-2 ${statusColor}`}
          >
            {statusText}
          </span>
          <h1 className="text-2xl font-bold text-text-primary leading-tight">
            {competition.contestName}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-bg-secondary p-4 rounded-2xl border border-border-color">
            <div className="flex items-center gap-2 text-text-secondary mb-1">
              <BanknotesIcon className="w-4 h-4" />
              <span className="text-xs font-medium">초기 자본금</span>
            </div>
            <div className="text-lg font-bold text-primary">
              {competition.seedMoney.toLocaleString()}원
            </div>
          </div>
          <div className="bg-bg-secondary p-4 rounded-2xl border border-border-color">
            <div className="flex items-center gap-2 text-text-secondary mb-1">
              <UsersIcon className="w-4 h-4" />
              <span className="text-xs font-medium">참가자</span>
            </div>
            <div className="text-lg font-bold text-text-primary">
              {competition.participants?.toLocaleString() ?? 0}명
            </div>
          </div>
        </div>

        {/* Description (if available) */}
        {competition.description && (
          <div className="text-text-secondary text-sm leading-relaxed">
            {competition.description}
          </div>
        )}

        {/* Detail Rules */}
        <div className="space-y-4">
          <h3 className="font-bold text-text-primary text-lg">대회 규칙</h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary mt-0.5">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-text-primary">진행 기간</div>
                <div className="text-sm text-text-secondary">
                  {new Date(competition.startDate).toLocaleDateString()} ~{" "}
                  {new Date(competition.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent/10 rounded-lg text-accent mt-0.5">
                <ChartBarIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-text-primary">매매 수수료</div>
                <div className="text-sm text-text-secondary">
                  {competition.commissionRate}%
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg text-secondary mt-0.5">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-text-primary">거래 제한</div>
                <div className="text-sm text-text-secondary">
                  일일 {competition.dailyTradeLimit}회 / 최대{" "}
                  {competition.maxHoldingsCount}종목 보유
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-positive/10 rounded-lg text-positive mt-0.5">
                <ClockIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-text-primary">쿨타임</div>
                <div className="text-sm text-text-secondary">
                  매수 {competition.buyCooldownMinutes}분 / 매도{" "}
                  {competition.sellCooldownMinutes}분
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="p-4 border-t border-border-color bg-bg-primary safe-area-bottom">
        <button
          onClick={() => setIsJoinDrawerOpen(true)}
          disabled={competition.isJoined || isFinished}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
            competition.isJoined
              ? "bg-bg-secondary text-text-secondary cursor-not-allowed"
              : isFinished
              ? "bg-bg-secondary text-text-secondary cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/90 active:scale-[0.98]"
          }`}
        >
          {competition.isJoined ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircleIcon className="w-6 h-6" />
              이미 참가중인 대회입니다
            </span>
          ) : isFinished ? (
            "종료된 대회입니다"
          ) : (
            "대회 참가하기"
          )}
        </button>
      </div>

      {/* Join Drawer */}
      <Drawer.Root open={isJoinDrawerOpen} onOpenChange={setIsJoinDrawerOpen}>
        <Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-100" />
          <Drawer.Content className="bg-bg-primary flex flex-col rounded-t-[10px] h-[40%] mt-24 fixed bottom-0 left-0 right-0 z-101 outline-none">
            <div className="p-4 bg-bg-primary rounded-t-[10px] flex-1">
              <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-300 mb-8" />
              <div className="max-w-md mx-auto">
                <Drawer.Title className="font-bold text-xl mb-4 text-text-primary">
                  대회 참가 계좌 만들기
                </Drawer.Title>
                <p className="text-text-secondary mb-6">
                  이 대회에서 사용할 계좌의 별칭을 입력해주세요.
                </p>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="예: 우승가자"
                  className="w-full p-4 rounded-xl bg-bg-secondary border border-border-color focus:border-primary focus:ring-1 focus:ring-primary outline-none text-text-primary mb-4"
                  autoFocus
                />
                <button
                  onClick={handleJoin}
                  disabled={!accountName.trim() || isJoining}
                  className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isJoining ? "참가 처리 중..." : "참가 완료"}
                </button>
              </div>
            </div>
          </Drawer.Content>
        </Portal>
      </Drawer.Root>

      {/* Edit Drawer */}
      <Drawer.Root open={isEditDrawerOpen} onOpenChange={setIsEditDrawerOpen}>
        <Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-100" />
          <Drawer.Content className="bg-bg-primary flex flex-col rounded-t-[10px] h-[85%] mt-24 fixed bottom-0 left-0 right-0 z-101 outline-none">
            <div className="p-4 bg-bg-primary rounded-t-[10px] flex-1 overflow-y-auto">
              <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-300 mb-8" />
              <div className="max-w-md mx-auto space-y-4 pb-8">
                <Drawer.Title className="font-bold text-xl mb-4 text-text-primary">
                  대회 정보 수정
                </Drawer.Title>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    대회명
                  </label>
                  <input
                    type="text"
                    value={editForm.contestName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, contestName: e.target.value })
                    }
                    className="w-full p-3 rounded-lg bg-bg-secondary border border-border-color"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      시작일
                    </label>
                    <input
                      type="datetime-local"
                      value={editForm.startDate.slice(0, 16)}
                      onChange={(e) =>
                        setEditForm({ ...editForm, startDate: e.target.value })
                      }
                      className="w-full p-3 rounded-lg bg-bg-secondary border border-border-color"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      종료일
                    </label>
                    <input
                      type="datetime-local"
                      value={editForm.endDate.slice(0, 16)}
                      onChange={(e) =>
                        setEditForm({ ...editForm, endDate: e.target.value })
                      }
                      className="w-full p-3 rounded-lg bg-bg-secondary border border-border-color"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    시드머니
                  </label>
                  <input
                    type="number"
                    value={editForm.seedMoney}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        seedMoney: Number(e.target.value),
                      })
                    }
                    className="w-full p-3 rounded-lg bg-bg-secondary border border-border-color"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      수수료율
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={editForm.commissionRate}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          commissionRate: Number(e.target.value),
                        })
                      }
                      className="w-full p-3 rounded-lg bg-bg-secondary border border-border-color"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      일일 거래 제한
                    </label>
                    <input
                      type="number"
                      value={editForm.dailyTradeLimit}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          dailyTradeLimit: Number(e.target.value),
                        })
                      }
                      className="w-full p-3 rounded-lg bg-bg-secondary border border-border-color"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      매수 쿨타임(분)
                    </label>
                    <input
                      type="number"
                      value={editForm.buyCooldownMinutes}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          buyCooldownMinutes: Number(e.target.value),
                        })
                      }
                      className="w-full p-3 rounded-lg bg-bg-secondary border border-border-color"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      매도 쿨타임(분)
                    </label>
                    <input
                      type="number"
                      value={editForm.sellCooldownMinutes}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          sellCooldownMinutes: Number(e.target.value),
                        })
                      }
                      className="w-full p-3 rounded-lg bg-bg-secondary border border-border-color"
                    />
                  </div>
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="w-full py-4 mt-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90"
                >
                  {isUpdating ? "수정 중..." : "수정 완료"}
                </button>
              </div>
            </div>
          </Drawer.Content>
        </Portal>
      </Drawer.Root>
    </div>
  );
};

export default CompetitionDetailScreen;
