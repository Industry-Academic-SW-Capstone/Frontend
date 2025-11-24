export interface MissionDashboard {
  consecutiveAttendanceDays: number;
  remainingDailyMissions: number;
}

export interface MissionListItem {
  id: number;
  track: string; // "DAILY", "SHORT_TERM", "ACHIEVEMENT"
  title: string;
  description: string;
  currentValue: number;
  goalValue: number;
  completed: boolean;
  rewardMoney: number;
  rewardTitle: string | null;
}

export interface MissionProgress {
  missionId: number;
  name: string;
  description: string;
  track: string;
  status: "IN_PROGRESS" | "COMPLETED";
  currentValue: number;
  goalValue: number;
  rewardDescription: string;
}

export interface RewardResponse {
  message: string;
  moneyAmount: number;
  grantedTitleName: string | null;
}

export interface MemberTitle {
  titleId: number;
  name: string;
  description: string;
}
