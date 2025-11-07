"use client";

import React, { useState } from "react";
import { Competition } from "@/lib/types/types";
import {
  ChevronLeftIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  MegaphoneIcon,
} from "@/components/icons/Icons";
import CompetitionParticipantsTab from "./CompetitionParticipantsTab";
import CompetitionLogsTab from "./CompetitionLogsTab";
import CompetitionSettingsTab from "./CompetitionSettingsTab";
import CompetitionAnnouncementsTab from "./CompetitionAnnouncementsTab";

interface CompetitionAdminScreenProps {
  competition: Competition;
  onBack: () => void;
}

type AdminTab = "participants" | "logs" | "settings" | "announcements";

const CompetitionAdminScreen: React.FC<CompetitionAdminScreenProps> = ({
  competition,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("participants");

  const tabs = [
    { id: "participants" as AdminTab, label: "참가자", icon: UsersIcon },
    { id: "logs" as AdminTab, label: "기록", icon: ClipboardDocumentListIcon },
    { id: "settings" as AdminTab, label: "설정", icon: CogIcon },
    { id: "announcements" as AdminTab, label: "공지", icon: MegaphoneIcon },
  ];

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg-primary/95 backdrop-blur-lg border-b border-border-color">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-bg-secondary rounded-full transition-colors"
          >
            <ChevronLeftIcon className="w-6 h-6 text-text-primary" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-text-primary">
              {competition.name}
            </h1>
            <p className="text-sm text-text-secondary">대회 관리</p>
          </div>
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
            관리자
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-bg-secondary text-text-secondary hover:bg-border-color"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === "participants" && (
          <CompetitionParticipantsTab competitionId={competition.id} />
        )}
        {activeTab === "logs" && (
          <CompetitionLogsTab competitionId={competition.id} />
        )}
        {activeTab === "settings" && (
          <CompetitionSettingsTab competition={competition} />
        )}
        {activeTab === "announcements" && (
          <CompetitionAnnouncementsTab competitionId={competition.id} />
        )}
      </div>
    </div>
  );
};

export default CompetitionAdminScreen;
