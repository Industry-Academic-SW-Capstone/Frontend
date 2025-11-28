"use client";
import React, { useState } from "react";
import {
  Competition,
  JoinCompetitionRequest,
  UpdateCompetitionRequest,
} from "@/lib/types/stock";
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
  LockClosedIcon,
} from "@/components/icons/Icons";
import Toast, { ToastType } from "@/components/ui/Toast";

import { Base64 } from "js-base64";
import { useCompetitionJoin } from "@/lib/hooks/competition/useCompetitionJoin";
import { useCompetitionAdmin } from "@/lib/hooks/competition/useCompetitionAdmin";
import { useAccountStore } from "@/lib/store/useAccountStore";
import { Drawer } from "vaul";
import Portal from "@/components/Portal";
import { ChevronDownIcon, Share } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface CompetitionDetailScreenProps {
  competition: Competition;
  onClose: () => void;
  onJoin: () => void;
  initialPassword?: string;
}

const CompetitionDetailScreen: React.FC<CompetitionDetailScreenProps> = ({
  competition,
  onClose,
  onJoin,
  initialPassword,
}) => {
  const { selectedAccount } = useAccountStore();
  const [joinInfo, setJoinInfo] = useState<JoinCompetitionRequest>({
    accountName: "",
    password: initialPassword || "",
  });
  const [isJoinDrawerOpen, setIsJoinDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isShareDrawerOpen, setIsShareDrawerOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: ToastType;
  }>({
    visible: false,
    message: "",
    type: "success",
  });

  // Admin Form State
  const [editForm, setEditForm] = useState<UpdateCompetitionRequest>({
    contestName: competition.contestName,
    startDate: competition.startDate,
    endDate: competition.endDate,
    seedMoney: competition.seedMoney,
    commissionRate: competition.commissionRate,
    minMarketCap: competition.minMarketCap,
    maxMarketCap: competition.maxMarketCap,
    password: "",
    dailyTradeLimit: competition.dailyTradeLimit,
    maxHoldingsCount: competition.maxHoldingsCount,
    buyCooldownMinutes: competition.buyCooldownMinutes,
    sellCooldownMinutes: competition.sellCooldownMinutes,
  });

  const [password, setPassword] = useState("");

  const { mutate: joinCompetition, isPending: isJoining } = useCompetitionJoin({
    contestId: competition.contestId,
    onSuccess: () => {
      setIsJoinDrawerOpen(false);
      onJoin(); // Refresh parent or just close
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

  const statusBadgeClass = isUpcoming
    ? "bg-primary/10 text-primary"
    : isActive
    ? "bg-positive/10 text-positive"
    : "bg-bg-secondary text-text-secondary";

  const handleJoin = () => {
    if (!joinInfo.accountName.trim()) return;
    if (competition.isPrivate && !joinInfo.password?.trim()) return;
    joinCompetition({
      accountName: joinInfo.accountName.trim(),
      password: competition.isPrivate ? joinInfo.password?.trim() : undefined,
    });
  };

  const handleDelete = () => {
    if (confirm("정말로 이 대회를 삭제하시겠습니까?")) {
      deleteCompetition();
    }
  };

  const handleUpdate = () => {
    updateCompetition(editForm);
  };

  const InfoRow = ({
    label,
    value,
    icon: Icon,
  }: {
    label: string;
    value: React.ReactNode;
    icon?: any;
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-border-color last:border-0">
      <div className="flex items-center gap-2 text-text-secondary">
        {Icon && <Icon className="w-5 h-5" />}
        <span className="text-sm">{label}</span>
      </div>
      <div className="font-medium text-text-primary text-right">{value}</div>
    </div>
  );

  return (
    <div className="h-full bg-bg-primary flex flex-col relative">
      {/* Sticky Header */}
      <div className="sticky pt-safe top-0 z-10 bg-bg-primary/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-transparent transition-colors">
        <button
          onClick={onClose}
          className="p-2 -ml-2 rounded-full hover:bg-bg-secondary transition-colors text-text-primary"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="flex gap-1">
          <button
            onClick={() => setIsShareDrawerOpen(true)}
            className="p-2 rounded-full hover:bg-bg-secondary transition-colors text-text-primary"
          >
            <Share className="w-5 h-5" />
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => setIsEditDrawerOpen(true)}
                className="p-2 rounded-full hover:bg-bg-secondary transition-colors text-text-primary"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-full hover:bg-red-500/10 transition-colors text-red-500"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24">
        {/* Hero Section */}
        <div className="pt-2 pb-8">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${statusBadgeClass}`}
          >
            {statusText}
          </span>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-extrabold text-text-primary leading-tight">
              {competition.contestName}
            </h1>
            {competition.isPrivate && (
              <LockClosedIcon size={24} className="text-text-secondary" />
            )}
          </div>

          {competition.description && (
            <p className="text-text-secondary leading-relaxed mt-2">
              {competition.description}
            </p>
          )}
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-bg-secondary/50 p-5 rounded-2xl">
            <div className="text-text-secondary text-sm mb-1 flex items-center gap-1">
              <BanknotesIcon className="w-4 h-4" />
              초기 자본금
            </div>
            <div className="text-xl font-bold text-primary">
              {competition.seedMoney.toLocaleString()}원
            </div>
          </div>
          <div className="bg-bg-secondary/50 p-5 rounded-2xl">
            <div className="text-text-secondary text-sm mb-1 flex items-center gap-1">
              <UsersIcon className="w-4 h-4" />
              참가자
            </div>
            <div className="text-xl font-bold text-text-primary">
              {competition.participantCount?.toLocaleString() ?? 0}명
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-text-primary mb-2">
            대회 정보
          </h3>

          <InfoRow
            label="진행 기간"
            value={
              <div className="flex flex-col items-end">
                <span>
                  {new Date(competition.startDate).toLocaleDateString()} 부터
                </span>
                <span>
                  {new Date(competition.endDate).toLocaleDateString()} 까지
                </span>
              </div>
            }
            icon={CalendarIcon}
          />

          <InfoRow
            label="매매 수수료"
            value={`${competition.commissionRate}%`}
            icon={ChartBarIcon}
          />

          <InfoRow
            label="일일 거래 제한"
            value={`${competition.dailyTradeLimit}회`}
            icon={ShieldCheckIcon}
          />

          <InfoRow
            label="최대 보유 종목"
            value={`${competition.maxHoldingsCount}종목`}
            icon={ChartBarIcon}
          />

          <InfoRow
            label="매수/매도 쿨타임"
            value={`${competition.buyCooldownMinutes}분 / ${competition.sellCooldownMinutes}분`}
            icon={ClockIcon}
          />
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="fixed pb-safe bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-bg-primary via-bg-primary/95 to-transparent pt-8 safe-area-bottom z-20">
        <button
          onClick={() => setIsJoinDrawerOpen(true)}
          disabled={competition.isParticipating || isFinished}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-[0.98] ${
            competition.isParticipating
              ? "bg-bg-secondary text-text-secondary cursor-not-allowed"
              : isFinished
              ? "bg-bg-secondary text-text-secondary cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/90 shadow-primary/25"
          }`}
        >
          {competition.isParticipating ? (
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
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-100 backdrop-blur-sm" />
          <Drawer.Content className="bg-bg-primary pb-safe flex flex-col rounded-t-[20px] h-auto max-h-[85%] mt-24 fixed bottom-0 left-0 right-0 z-101 outline-none shadow-2xl">
            <div className="p-6 bg-bg-primary rounded-t-[20px] flex-1 pb-10">
              <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-300/50 mb-8" />
              <div className="max-w-md mx-auto">
                <Drawer.Title className="font-bold text-2xl mb-2 text-text-primary">
                  대회 참가하기
                </Drawer.Title>

                <div className="space-y-4">
                  <p className="text-text-secondary mb-8">
                    이 대회에서 사용할 계좌의 별칭을 입력해주세요.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      계좌 별칭
                    </label>
                    <input
                      type="text"
                      value={joinInfo.accountName}
                      onChange={(e) =>
                        setJoinInfo({
                          ...joinInfo,
                          accountName: e.target.value,
                        })
                      }
                      placeholder="예: 주식왕"
                      className="w-full p-4 rounded-xl bg-bg-secondary border border-transparent focus:border-primary focus:bg-bg-primary transition-all outline-none text-text-primary text-lg font-medium placeholder:text-text-tertiary"
                      autoFocus
                    />
                  </div>
                  {competition.isPrivate && (
                    <>
                      <p className="text-text-secondary mb-8">
                        대회 참가 코드를 입력해주세요.
                      </p>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                          참가 코드
                        </label>
                        <input
                          type="text"
                          value={joinInfo.password}
                          onChange={(e) =>
                            setJoinInfo({
                              ...joinInfo,
                              password: e.target.value,
                            })
                          }
                          placeholder="예: 주식왕"
                          className="w-full p-4 rounded-xl bg-bg-secondary border border-transparent focus:border-primary focus:bg-bg-primary transition-all outline-none text-text-primary text-lg font-medium placeholder:text-text-tertiary"
                          autoFocus
                        />
                      </div>
                    </>
                  )}
                  <button
                    onClick={handleJoin}
                    disabled={joinInfo.accountName.trim() === "" || isJoining}
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 mt-4"
                  >
                    {isJoining ? "참가 처리 중..." : "참가 완료"}
                  </button>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Portal>
      </Drawer.Root>

      {/* Edit Drawer */}
      <Drawer.Root open={isEditDrawerOpen} onOpenChange={setIsEditDrawerOpen}>
        <Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-100 backdrop-blur-sm" />
          <Drawer.Content className="bg-bg-primary pb-safe flex flex-col rounded-t-[20px] h-[90%] mt-24 fixed bottom-0 left-0 right-0 z-101 outline-none shadow-2xl">
            <div className="p-6 bg-bg-primary rounded-t-[20px] flex-1 overflow-y-auto">
              <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-300/50 mb-8" />
              <div className="max-w-md mx-auto space-y-6 pb-10">
                <Drawer.Title className="font-bold text-2xl mb-6 text-text-primary">
                  대회 정보 수정
                </Drawer.Title>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        대회명
                      </label>
                      <input
                        type="text"
                        value={editForm.contestName}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            contestName: e.target.value,
                          })
                        }
                        className="w-full p-4 rounded-xl bg-bg-secondary border border-transparent focus:border-primary focus:bg-bg-primary transition-all outline-none text-text-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
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
                        className="w-full p-4 rounded-xl bg-bg-secondary border border-transparent focus:border-primary focus:bg-bg-primary transition-all outline-none text-text-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        시작일
                      </label>
                      <input
                        type="datetime-local"
                        value={editForm.startDate.slice(0, 16)}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            startDate: e.target.value,
                          })
                        }
                        className="w-full p-3 rounded-xl bg-bg-secondary border border-transparent focus:border-primary focus:bg-bg-primary transition-all outline-none text-text-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        종료일
                      </label>
                      <input
                        type="datetime-local"
                        value={editForm.endDate.slice(0, 16)}
                        onChange={(e) =>
                          setEditForm({ ...editForm, endDate: e.target.value })
                        }
                        className="w-full p-3 rounded-xl bg-bg-secondary border border-transparent focus:border-primary focus:bg-bg-primary transition-all outline-none text-text-primary text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        수수료율 (%)
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
                        className="w-full p-4 rounded-xl bg-bg-secondary border border-transparent focus:border-primary focus:bg-bg-primary transition-all outline-none text-text-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        일일 거래 제한 (회)
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
                        className="w-full p-4 rounded-xl bg-bg-secondary border border-transparent focus:border-primary focus:bg-bg-primary transition-all outline-none text-text-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        매수 쿨타임 (분)
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
                        className="w-full p-4 rounded-xl bg-bg-secondary border border-transparent focus:border-primary focus:bg-bg-primary transition-all outline-none text-text-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        매도 쿨타임 (분)
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
                        className="w-full p-4 rounded-xl bg-bg-secondary border border-transparent focus:border-primary focus:bg-bg-primary transition-all outline-none text-text-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      {"참가코드(선택사항)"}
                    </label>
                    <input
                      type="text"
                      value={editForm.password}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          password: e.target.value,
                        })
                      }
                      className="w-full p-4 rounded-xl bg-bg-secondary border border-transparent focus:border-primary focus:bg-bg-primary transition-all outline-none text-text-primary"
                    />
                  </div>
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="w-full py-4 mt-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 shadow-lg shadow-primary/20"
                >
                  {isUpdating ? "수정 중..." : "수정 완료"}
                </button>
              </div>
            </div>
          </Drawer.Content>
        </Portal>
      </Drawer.Root>

      {/* Share Drawer */}
      <Drawer.Root open={isShareDrawerOpen} onOpenChange={setIsShareDrawerOpen}>
        <Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-100 backdrop-blur-sm" />
          <Drawer.Content className="bg-bg-primary pb-safe flex flex-col rounded-t-[20px] min-h-[200px] mt-24 fixed bottom-0 left-0 right-0 z-101 outline-none shadow-2xl">
            <div className="p-6 bg-bg-primary rounded-t-[20px] flex-1 overflow-y-auto">
              <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-300/50 mb-8" />
              <div className="max-w-md mx-auto space-y-6 pb-10">
                <Drawer.Title className="font-bold text-2xl mb-6 text-text-primary">
                  대회 공유
                </Drawer.Title>

                <div
                  className={
                    "transition-all duration-300 overflow-hidden flex items-center justify-center " +
                    (isQROpen ? "max-h-60" : "max-h-0 -mb-2")
                  }
                >
                  <QRCodeSVG
                    className="h-60 w-60"
                    value={`https://www.stockit.live/pwa#entry-${Base64.encode(
                      `${competition.contestId}-@-${password}-@-${competition.contestName}`
                    )}`}
                  />
                </div>
                <div
                  onClick={() => setIsQROpen(!isQROpen)}
                  className="flex items-center justify-between"
                >
                  <h3>QR코드 열기</h3>
                  <div
                    className={`p-1 rounded-full bg-bg-secondary text-text-secondary group-active:bg-bg-primary transition-colors ${
                      !isQROpen ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDownIcon className="w-5 h-5" />
                  </div>
                </div>

                {competition.isPrivate && (
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      참여 패스워드
                    </label>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-4 rounded-xl bg-bg-secondary border border-transparent focus:border-primary focus:bg-bg-primary transition-all outline-none text-text-primary"
                    />
                  </div>
                )}
                <input
                  type="text"
                  value={`https://www.stockit.live/pwa#entry-${Base64.encode(
                    `${competition.contestId}-@-${password}-@-${competition.contestName}`
                  )}`}
                  onClick={() =>
                    navigator.clipboard
                      .writeText(
                        `https://www.stockit.live/pwa#entry-${Base64.encode(
                          `${competition.contestId}-@-${password}-@-${competition.contestName}`
                        )}`
                      )
                      .then(() =>
                        setToast({
                          visible: true,
                          message: "공유 링크가 복사되었습니다.",
                          type: "success",
                        })
                      )
                  }
                  readOnly
                  className="w-full p-4 rounded-xl bg-bg-secondary border border-transparent focus:border-primary focus:bg-bg-primary transition-all outline-none text-text-primary"
                />

                <button
                  onClick={() =>
                    navigator.clipboard
                      .writeText(
                        `https://www.stockit.live/pwa#entry-${Base64.encode(
                          `${competition.contestId}-@-${password}-@-${competition.contestName}`
                        )}`
                      )
                      .then(() =>
                        setToast({
                          visible: true,
                          message: "공유 링크가 복사되었습니다.",
                          type: "success",
                        })
                      )
                  }
                  className="w-full py-4 mt-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 shadow-lg shadow-primary/20"
                >
                  URL 복사하기
                </button>
              </div>
            </div>
          </Drawer.Content>
        </Portal>
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.visible}
          onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
        />
      </Drawer.Root>
    </div>
  );
};

export default CompetitionDetailScreen;
