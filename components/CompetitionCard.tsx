"use client";


import React from 'react';
import { Competition } from '@/lib/types';
import { CalendarIcon, UsersIcon, GiftIcon } from './icons/Icons';

interface CompetitionCardProps {
  competition: Competition;
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition }) => {
  return (
    <div className="bg-bg-secondary border border-border-color rounded-2xl p-5 mb-4 shadow-lg card-hover cursor-pointer group overflow-hidden relative">
      {/* Animated background accent (flat) */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
      
      <div className="flex flex-col relative z-10">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-text-primary mb-1 transition-colors duration-300 group-hover:text-primary">
            {competition.name}
          </h3>
          <p className="text-sm text-text-secondary transition-colors duration-300 group-hover:text-text-primary">
            {competition.description}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm text-text-secondary mb-4">
          <div className="flex items-center gap-2 transition-all duration-300 hover:text-primary hover:translate-x-1">
            <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              <UsersIcon className="w-4 h-4" />
            </div>
            <span className="font-medium">{competition.participants.toLocaleString()}명 참여</span>
          </div>
          <div className="flex items-center gap-2 transition-all duration-300 hover:text-accent hover:translate-x-1">
            <div className="p-1.5 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
              <GiftIcon className="w-4 h-4" />
            </div>
            <span className="font-medium">총 {competition.totalPrize.toLocaleString()}원</span>
          </div>
          <div className="flex items-center gap-2 col-span-2 transition-all duration-300 hover:text-secondary hover:translate-x-1">
            <div className="p-1.5 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors duration-300">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <span className="font-medium">{competition.startDate} ~ {competition.endDate}</span>
          </div>
        </div>

        <button className={`w-full mt-2 py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-xl relative overflow-hidden group/btn ${
          competition.isJoined 
      ? 'bg-gray-400' 
      : 'bg-primary hover:bg-primary/90'
        }`}>
          {/* Button shimmer effect */}
          {!competition.isJoined && (
            <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 animate-shimmer" />
          )}
          <span className="relative z-10">{competition.isJoined ? '참여중' : '참가하기'}</span>
        </button>
      </div>
      
      {/* Corner accent */}
  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
    </div>
  );
};

export default CompetitionCard;
