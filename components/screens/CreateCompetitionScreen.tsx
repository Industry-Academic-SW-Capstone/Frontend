"use client";
import React, { useState } from 'react';
import { ArrowLeftIcon, XMarkIcon, PencilSquareIcon, ShieldCheckIcon, FlagIcon, CheckCircleIcon } from '@/components/icons/Icons';
import { MOCK_SECTORS } from '@/lib/constants';

interface CreateCompetitionScreenProps {
  onBack: () => void;
}

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const steps = [
        { id: 1, name: '기본 정보', icon: PencilSquareIcon },
        { id: 2, name: '상세 규칙', icon: ShieldCheckIcon },
        { id: 3, name: '기간 설정', icon: FlagIcon },
    ]
    return (
        <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
                {steps.map((step, stepIdx) => (
                    <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                         {currentStep > step.id ? (
                            <>
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="h-0.5 w-full bg-primary" />
                            </div>
                            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary hover:bg-primary/90">
                                <CheckCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
                            </div>
                            </>
                        ) : currentStep === step.id ? (
                            <>
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="h-0.5 w-full bg-border-color" />
                            </div>
                            <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary bg-bg-primary" aria-current="step">
                                <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
                            </div>
                            </>
                        ) : (
                            <>
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="h-0.5 w-full bg-border-color" />
                            </div>
                            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-border-color hover:bg-border-color/80">
                                <step.icon className="h-5 w-5 text-text-secondary" aria-hidden="true" />
                            </div>
                            </>
                        )}
                         <span className={`absolute top-10 left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap ${currentStep >= step.id ? 'text-primary' : 'text-text-secondary'}`}>{step.name}</span>
                    </li>
                ))}
            </ol>
        </nav>
    )
};

const CreateCompetitionScreen: React.FC<CreateCompetitionScreenProps> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [rules, setRules] = useState({
    name: '',
    description: '',
    startingCapital: 10000000,
    maxInvestmentPerStock: 20,
    allowedSectors: [] as string[],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
  });

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));
  
  const handleSectorToggle = (sectorName: string) => {
    setRules(prev => ({
        ...prev,
        allowedSectors: prev.allowedSectors.includes(sectorName)
            ? prev.allowedSectors.filter(s => s !== sectorName)
            : [...prev.allowedSectors, sectorName]
    }));
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 bg-bg-secondary p-6 rounded-2xl">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">대회 이름</label>
              <input type="text" id="name" value={rules.name} onChange={e => setRules({...rules, name: e.target.value})} placeholder="예: 제 1회 주린이 수익률 대회" className="w-full bg-bg-primary border border-border-color rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">간단한 설명</label>
              <textarea id="description" rows={4} value={rules.description} onChange={e => setRules({...rules, description: e.target.value})} placeholder="대회에 대한 설명을 입력해주세요." className="w-full bg-bg-primary border border-border-color rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none"></textarea>
            </div>
          </div>
        );
      case 2:
        return (
            <div className="space-y-6 bg-bg-secondary p-6 rounded-2xl">
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">초기 자본금</label>
                    <div className="text-center font-bold text-2xl text-primary mb-2">{rules.startingCapital.toLocaleString()}원</div>
                    <input type="range" min="1000000" max="100000000" step="1000000" value={rules.startingCapital} onChange={e => setRules({...rules, startingCapital: parseInt(e.target.value)})} className="w-full h-2 bg-border-color rounded-lg appearance-none cursor-pointer accent-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">종목당 최대 투자 비중</label>
                    <div className="text-center font-bold text-2xl text-primary mb-2">{rules.maxInvestmentPerStock}%</div>
                    <input type="range" min="5" max="100" step="5" value={rules.maxInvestmentPerStock} onChange={e => setRules({...rules, maxInvestmentPerStock: parseInt(e.target.value)})} className="w-full h-2 bg-border-color rounded-lg appearance-none cursor-pointer accent-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">투자 허용 섹터 <span className="text-xs">(미선택 시 전체 허용)</span></label>
                    <div className="grid grid-cols-2 gap-2">
                        {MOCK_SECTORS.map(sector => (
                            <button 
                                key={sector.name} 
                                onClick={() => handleSectorToggle(sector.name)}
                                className={`p-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${rules.allowedSectors.includes(sector.name) ? 'bg-primary/20 text-primary border border-primary' : 'bg-border-color text-text-secondary'}`}
                            >
                                {rules.allowedSectors.includes(sector.name) && <CheckCircleIcon className="w-4 h-4"/>}
                                {sector.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
      case 3:
        const startDate = new Date(rules.startDate);
        const endDate = new Date(rules.endDate);
        const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

        return (
            <div className="space-y-6 bg-bg-secondary p-6 rounded-2xl">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-text-secondary mb-1">시작일</label>
                    <input type="date" id="startDate" value={rules.startDate} onChange={e => setRules({...rules, startDate: e.target.value})} className="w-full bg-bg-primary border border-border-color rounded-lg p-3" />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-text-secondary mb-1">종료일</label>
                    <input type="date" id="endDate" value={rules.endDate} onChange={e => setRules({...rules, endDate: e.target.value})} className="w-full bg-bg-primary border border-border-color rounded-lg p-3" />
                </div>
                {duration > 0 && (
                    <div className="text-center p-3 bg-primary/10 rounded-lg text-primary font-semibold">
                        총 {duration}일 동안 진행됩니다.
                    </div>
                )}
            </div>
        );
        case 4:
            return (
                <div className="text-center p-8 bg-bg-secondary rounded-2xl flex flex-col items-center">
                    <CheckCircleIcon className="w-20 h-20 text-positive mb-4"/>
                    <h2 className="text-2xl font-bold text-text-primary">대회 생성 완료!</h2>
                    <p className="text-text-secondary mt-2">"{rules.name}" 대회가 성공적으로 생성되었습니다. 친구들을 초대해 함께 즐겨보세요!</p>
                </div>
            )
      default: return null;
    }
  };

  return (
    <div className="h-full bg-bg-primary flex flex-col overflow-hidden">
      <header className="flex items-center justify-between p-4 border-b border-border-color">
        {step > 1 && step < 4 ? (
          <button onClick={handlePrev} className="p-1"><ArrowLeftIcon className="w-6 h-6 text-text-primary" /></button>
        ) : <div className="w-8"/>}
        <h1 className="text-xl font-bold text-text-primary">대회 만들기</h1>
        <button onClick={onBack} className="p-1"><XMarkIcon className="w-6 h-6 text-text-primary" /></button>
      </header>

      <div className="px-4 py-8">
        {step < 4 && <StepIndicator currentStep={step} />}
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {renderStep()}
      </div>

      <div className="p-4 border-t border-border-color bg-bg-primary">
        {step < 3 && (
          <button onClick={handleNext} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors">
            다음
          </button>
        )}
        {step === 3 && (
            <button onClick={handleNext} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                대회 생성하기
            </button>
        )}
        {step === 4 && (
            <button onClick={onBack} className="w-full bg-positive text-white font-bold py-3 px-4 rounded-lg hover:bg-positive/90 transition-colors">
                완료
            </button>
        )}
      </div>
    </div>
  );
};

export default CreateCompetitionScreen;
