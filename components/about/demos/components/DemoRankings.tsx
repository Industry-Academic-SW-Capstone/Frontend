import React from "react";

export const DemoRankings: React.FC = () => {
  const topRankings = [
    { rank: 1, nickname: "워렌버핏", balance: 15000000 },
    { rank: 2, nickname: "찰리멍거", balance: 12000000 },
    { rank: 3, nickname: "피터린치", balance: 10000000 },
  ];
  const myRankEntry = { rank: 15, nickname: "투자자", balance: 1250000 };

  return (
    <div className="bg-bg-secondary rounded-2xl p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-text-primary">실시간 랭킹</h2>
        <button className="text-xs text-text-secondary hover:text-primary transition-colors">
          더보기
        </button>
      </div>
      <div className="space-y-4">
        {topRankings.map((rank, index) => (
          <div key={rank.rank} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`w-6 text-center font-bold ${
                  index === 0
                    ? "text-yellow-500 text-lg"
                    : index === 1
                    ? "text-gray-400 text-lg"
                    : index === 2
                    ? "text-orange-400 text-lg"
                    : "text-text-secondary"
                }`}
              >
                {rank.rank}
              </span>
              <p className="font-bold text-text-primary text-sm">
                {rank.nickname}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-text-primary text-sm">
                {Number(rank.balance).toLocaleString()}원
              </p>
            </div>
          </div>
        ))}

        {/* My Ranking Separator and Item */}
        <div className="h-px bg-border-color my-2" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-6 text-center font-bold text-primary text-lg">
              {myRankEntry.rank}
            </span>
            <p className="font-bold text-text-primary text-sm">
              {myRankEntry.nickname} (나)
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-text-primary text-sm">
              {Number(myRankEntry.balance).toLocaleString()}원
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
