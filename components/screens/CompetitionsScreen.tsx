"use client";
import React, { useState } from 'react';
import { MOCK_COMPETITIONS } from '@/lib/constants';
import CompetitionCard from '@/components/CompetitionCard';
import CreateCompetitionScreen from './CreateCompetitionScreen';
import { PlusCircleIcon } from '@/components/icons/Icons';

const CompetitionsScreen: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [view, setView] = useState<'ongoing' | 'finished'>('ongoing');

  if (showCreate) {
    return <CreateCompetitionScreen onBack={() => setShowCreate(false)} />;
  }

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

      {/* Tab Switcher with improved design */}
      <div className="flex bg-bg-secondary p-1.5 rounded-2xl shadow-sm border border-border-color animate-fadeInScale">
        <button
          onClick={() => setView('ongoing')}
          className={`w-1/2 py-3 text-sm font-bold rounded-xl transition-all duration-300 relative overflow-hidden ${
            view === 'ongoing' 
              ? 'bg-bg-primary text-text-primary shadow-sm transform scale-[1.02]' 
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary/50'
          }`}
        >
          {view === 'ongoing' && (
            <div className="absolute inset-0 animate-shimmer" />
          )}
          <span className="relative z-10">진행중인 대회</span>
        </button>
        <button
          onClick={() => setView('finished')}
          className={`w-1/2 py-3 text-sm font-bold rounded-xl transition-all duration-300 relative overflow-hidden ${
            view === 'finished' 
              ? 'bg-bg-primary text-text-primary shadow-sm transform scale-[1.02]' 
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary/50'
          }`}
        >
          {view === 'finished' && (
            <div className="absolute inset-0 animate-shimmer" />
          )}
          <span className="relative z-10">종료된 대회</span>
        </button>
      </div>
      
      {/* Competition cards with stagger animation */}
      <div className="space-y-4">
        {MOCK_COMPETITIONS.map((comp, index) => (
          <div 
            key={comp.id} 
            className="animate-fadeInUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CompetitionCard competition={comp} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitionsScreen;
