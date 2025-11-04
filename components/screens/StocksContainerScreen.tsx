"use client";
import React, { useState } from 'react';
import StocksBottomNavBar, { StocksView } from '@/components/StocksBottomNavBar';
import PortfolioScreen from './PortfolioScreen';
import ExploreScreen from './ExploreScreen';
import AnalysisScreen from './AnalysisScreen';
import StockDetailScreen from './StockDetailScreen';

interface StocksContainerScreenProps {
  onExit: () => void;
  needHeader?: boolean;
}

const StocksContainerScreen: React.FC<StocksContainerScreenProps> = ({ onExit, needHeader = true }) => {
  const [currentView, setCurrentView] = useState<StocksView>('portfolio');
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  const handleSelectStock = (ticker: string) => {
    setSelectedTicker(ticker);
  };
  
  const handleBack = () => {
    setSelectedTicker(null);
  }

  const renderContent = () => {
    if (selectedTicker) {
      return <StockDetailScreen ticker={selectedTicker} onBack={handleBack} />;
    }

    switch (currentView) {
      case 'portfolio':
        return <PortfolioScreen onSelectStock={handleSelectStock} />;
      case 'explore':
        return <ExploreScreen onSelectStock={handleSelectStock} />;
      case 'analysis':
        return <AnalysisScreen />;
      default:
        return <PortfolioScreen onSelectStock={handleSelectStock} />;
    }
  };

  const getHeaderTitle = () => {
      if (selectedTicker) return "종목 상세";
      switch (currentView) {
          case 'portfolio': return "내 자산";
          case 'explore': return "탐색";
          case 'analysis': return "투자 분석";
          default: return "증권";
      }
  }

  return (
    <div className="h-screen flex flex-col">
       {!selectedTicker && (
           <header className="sticky top-0 z-10 bg-bg-primary/80 backdrop-blur-sm p-4">
               <h1 className="text-xl font-bold text-center text-text-primary">{getHeaderTitle()}</h1>
           </header>
       )}
      <div className={`flex-1 overflow-y-auto px-4 ${selectedTicker ? '' : 'pb-24'}`}>
        {renderContent()}
      </div>
      
      {needHeader && !selectedTicker && (
          <StocksBottomNavBar 
              currentView={currentView}
              setCurrentView={setCurrentView}
              onExit={onExit}
          />
      )}
    </div>
  );
};

export default StocksContainerScreen;
