"use client";

import React, { useState } from 'react';
import { Competition } from '@/lib/types';
import { PencilSquareIcon, CheckCircleIcon, XMarkIcon } from '@/components/icons/Icons';

interface CompetitionSettingsTabProps {
  competition: Competition;
}

const CompetitionSettingsTab: React.FC<CompetitionSettingsTabProps> = ({ competition }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: competition.name,
    description: competition.description,
    startDate: competition.startDate,
    endDate: competition.endDate,
    totalPrize: competition.totalPrize,
    startingCapital: competition.rules?.startingCapital || 10000000,
    maxInvestmentPerStock: competition.rules?.maxInvestmentPerStock || 2000000,
  });

  const handleSave = () => {
    // TODO: API call to save settings
    console.log('Saving settings:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: competition.name,
      description: competition.description,
      startDate: competition.startDate,
      endDate: competition.endDate,
      totalPrize: competition.totalPrize,
      startingCapital: competition.rules?.startingCapital || 10000000,
      maxInvestmentPerStock: competition.rules?.maxInvestmentPerStock || 2000000,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      {/* Edit Mode Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-text-primary">대회 설정</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <PencilSquareIcon className="w-4 h-4" />
            수정
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-bg-secondary text-text-secondary px-4 py-2 rounded-xl font-semibold border border-border-color hover:bg-border-color transition-all"
            >
              <XMarkIcon className="w-4 h-4" />
              취소
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-positive text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <CheckCircleIcon className="w-4 h-4" />
              저장
            </button>
          </div>
        )}
      </div>

      {/* Basic Info */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-5 space-y-4">
        <h3 className="font-bold text-text-primary mb-3">기본 정보</h3>

        <div>
          <label className="block text-sm font-semibold text-text-secondary mb-2">대회명</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-bg-primary border border-border-color rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          ) : (
            <p className="text-text-primary font-medium">{formData.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-secondary mb-2">설명</label>
          {isEditing ? (
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 bg-bg-primary border border-border-color rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          ) : (
            <p className="text-text-primary">{formData.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">시작일</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-bg-primary border border-border-color rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            ) : (
              <p className="text-text-primary font-medium">{formData.startDate}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">종료일</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-bg-primary border border-border-color rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            ) : (
              <p className="text-text-primary font-medium">{formData.endDate}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-secondary mb-2">총 상금</label>
          {isEditing ? (
            <input
              type="number"
              value={formData.totalPrize}
              onChange={(e) => setFormData({ ...formData, totalPrize: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 bg-bg-primary border border-border-color rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          ) : (
            <p className="text-text-primary font-medium">₩{formData.totalPrize.toLocaleString()}</p>
          )}
        </div>
      </div>

      {/* Competition Rules */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-5 space-y-4">
        <h3 className="font-bold text-text-primary mb-3">대회 규칙</h3>

        <div>
          <label className="block text-sm font-semibold text-text-secondary mb-2">초기 자본금</label>
          {isEditing ? (
            <input
              type="number"
              value={formData.startingCapital}
              onChange={(e) =>
                setFormData({ ...formData, startingCapital: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2.5 bg-bg-primary border border-border-color rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          ) : (
            <p className="text-text-primary font-medium">₩{formData.startingCapital.toLocaleString()}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-secondary mb-2">
            종목당 최대 투자 금액
          </label>
          {isEditing ? (
            <input
              type="number"
              value={formData.maxInvestmentPerStock}
              onChange={(e) =>
                setFormData({ ...formData, maxInvestmentPerStock: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2.5 bg-bg-primary border border-border-color rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          ) : (
            <p className="text-text-primary font-medium">
              ₩{formData.maxInvestmentPerStock.toLocaleString()}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-secondary mb-2">허용 섹터</label>
          <div className="flex flex-wrap gap-2">
            {(competition.rules?.allowedSectors || ['전체']).map((sector, idx) => (
              <span
                key={idx}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold"
              >
                {sector}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-negative/5 border border-negative/20 rounded-xl p-5 space-y-3">
        <h3 className="font-bold text-negative mb-2">위험 구역</h3>
        <p className="text-sm text-text-secondary mb-4">
          대회를 종료하거나 삭제하는 작업은 되돌릴 수 없습니다.
        </p>
        <div className="flex gap-3">
          <button className="flex-1 bg-bg-secondary border border-negative text-negative px-4 py-2.5 rounded-xl font-semibold hover:bg-negative/10 transition-all">
            대회 종료
          </button>
          <button className="flex-1 bg-negative text-white px-4 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all">
            대회 삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompetitionSettingsTab;
