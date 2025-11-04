"use client";

import React, { useState } from 'react';
import { CompetitionAnnouncement } from '@/lib/types';
import { PlusCircleIcon, MegaphoneIcon, PencilSquareIcon, XMarkIcon } from '@/components/icons/Icons';

interface CompetitionAnnouncementsTabProps {
  competitionId: string;
}

// Mock data
const MOCK_ANNOUNCEMENTS: CompetitionAnnouncement[] = [
  {
    id: '1',
    title: '대회 규칙 변경 안내',
    content: '종목당 최대 투자 금액이 200만원에서 300만원으로 변경되었습니다.',
    createdAt: new Date('2024-01-15T10:00:00'),
    isPinned: true,
    readBy: ['user1', 'user2'],
  },
  {
    id: '2',
    title: '중간 순위 발표',
    content: '현재까지의 순위를 확인하고 남은 기간 동안 전략을 세워보세요!',
    createdAt: new Date('2024-01-14T15:30:00'),
    isPinned: false,
    readBy: ['user1'],
  },
];

const CompetitionAnnouncementsTab: React.FC<CompetitionAnnouncementsTabProps> = ({
  competitionId,
}) => {
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    isPinned: false,
  });

  const handleCreate = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return;

    const announcement: CompetitionAnnouncement = {
      id: Date.now().toString(),
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      createdAt: new Date(),
      isPinned: newAnnouncement.isPinned,
      readBy: [],
    };

    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({ title: '', content: '', isPinned: false });
    setShowCreateModal(false);
  };

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  const togglePin = (id: string) => {
    setAnnouncements(
      announcements.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-text-primary">공지사항</h2>
          <p className="text-sm text-text-secondary">참가자들에게 메시지를 전달하세요</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          <PlusCircleIcon className="w-5 h-5" />
          작성
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-bg-secondary border border-border-color rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-text-primary">{announcements.length}</p>
          <p className="text-xs text-text-secondary mt-1">전체 공지</p>
        </div>
        <div className="bg-bg-secondary border border-border-color rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">
            {announcements.filter((a) => a.isPinned).length}
          </p>
          <p className="text-xs text-text-secondary mt-1">고정된 공지</p>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {sortedAnnouncements.map((announcement, index) => (
          <div
            key={announcement.id}
            className={`bg-bg-secondary border rounded-xl p-5 hover:shadow-md transition-all animate-fadeInUp ${
              announcement.isPinned ? 'border-primary shadow-sm' : 'border-border-color'
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg ${
                  announcement.isPinned ? 'bg-primary/10' : 'bg-accent/10'
                }`}
              >
                <MegaphoneIcon
                  className={`w-5 h-5 ${
                    announcement.isPinned ? 'text-primary' : 'text-accent'
                  }`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-text-primary">{announcement.title}</h3>
                    {announcement.isPinned && (
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-bold">
                        고정
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="p-1 hover:bg-negative/10 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4 text-negative" />
                  </button>
                </div>
                <p className="text-text-secondary text-sm mb-3">{announcement.content}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">{formatDate(announcement.createdAt)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-text-secondary">읽음: {announcement.readBy.length}명</span>
                    <button
                      onClick={() => togglePin(announcement.id)}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                        announcement.isPinned
                          ? 'bg-primary/10 text-primary'
                          : 'bg-bg-primary text-text-secondary hover:bg-border-color'
                      }`}
                    >
                      {announcement.isPinned ? '고정 해제' : '고정'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {announcements.length === 0 && (
        <div className="text-center py-12">
          <MegaphoneIcon className="w-16 h-16 text-text-secondary mx-auto mb-3 opacity-50" />
          <p className="text-text-secondary">작성된 공지사항이 없습니다</p>
          <p className="text-text-secondary text-sm mt-1">새 공지사항을 작성해보세요</p>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center animate-fadeIn"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-bg-primary w-full max-w-md rounded-t-3xl p-6 animate-slideInUp"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-text-primary mb-6">새 공지사항</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">
                  제목
                </label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                  }
                  placeholder="공지사항 제목을 입력하세요"
                  className="w-full px-4 py-3 bg-bg-secondary border border-border-color rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">
                  내용
                </label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, content: e.target.value })
                  }
                  placeholder="공지사항 내용을 입력하세요"
                  rows={5}
                  className="w-full px-4 py-3 bg-bg-secondary border border-border-color rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={newAnnouncement.isPinned}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, isPinned: e.target.checked })
                  }
                  className="w-5 h-5 text-primary bg-bg-secondary border-border-color rounded focus:ring-primary"
                />
                <label htmlFor="isPinned" className="text-sm font-semibold text-text-primary">
                  상단에 고정
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-bg-secondary text-text-secondary px-4 py-3 rounded-xl font-semibold border border-border-color hover:bg-border-color transition-all"
                >
                  취소
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newAnnouncement.title || !newAnnouncement.content}
                  className="flex-1 bg-primary text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  작성
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitionAnnouncementsTab;
