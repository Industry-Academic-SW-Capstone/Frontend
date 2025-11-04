"use client";
import React, { useState, useEffect } from 'react';
import { User, UserGroup } from '@/lib/types';
import * as Icons from '@/components/icons/Icons';
import { 
  requestNotificationPermission, 
  registerServiceWorker, 
  subscribeToPush 
} from '@/lib/services/notificationService';

type AuthStep = 'welcome' | 'login' | 'signup' | 'pass' | 'username' | 'avatar' | 'group' | 'notification' | 'complete';

interface AuthScreenProps {
  onLoginSuccess: (newUser: Partial<User>) => void;
}

const ProgressBar: React.FC<{ step: number; totalSteps: number }> = ({ step, totalSteps }) => (
  <div className="w-full bg-border-color rounded-full h-1.5">
    <div
      className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out"
      style={{ width: `${(step / totalSteps) * 100}%` }}
    />
  </div>
);

const OAuthButtons: React.FC<{ title: string, onOAuth: () => void }> = ({ title, onOAuth }) => (
    <div className="space-y-3">
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-border-color" />
            </div>
            <div className="relative flex justify-center">
                <span className="bg-bg-primary px-2 text-sm text-text-secondary">{title}</span>
            </div>
        </div>
        <button onClick={onOAuth} className="w-full flex items-center justify-center gap-3 py-3 border border-border-color rounded-xl font-semibold hover:bg-border-color/50">
            <Icons.GoogleIcon className="w-6 h-6" />
            <span>Google로 계속하기</span>
        </button>
        <button onClick={onOAuth} className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold bg-[#FEE500] text-[#3C1E1E] hover:bg-opacity-90">
            <Icons.KakaoIcon className="w-6 h-6" />
            <span>카카오로 계속하기</span>
        </button>
         <button onClick={onOAuth} className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold bg-black text-white hover:bg-opacity-90">
            <Icons.AppleIcon className="w-6 h-6" />
            <span>Apple로 계속하기</span>
        </button>
    </div>
);

const OnboardingScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<AuthStep>('welcome');
  const [newUser, setNewUser] = useState<Partial<User>>({
    username: '',
    avatar: 'https://picsum.photos/seed/avatar1/100',
    group: undefined,
  });
  const [isVerifying, setIsVerifying] = useState(false);

  const handleNext = () => {
    switch (step) {
      case 'welcome': setStep('signup'); break;
      case 'login': onLoginSuccess({}); break; // Mock login
      case 'signup': setStep('pass'); break;
      case 'pass': setStep('username'); break;
      case 'username': setStep('avatar'); break;
      case 'avatar': setStep('group'); break;
      case 'group': setStep('notification'); break;
      case 'notification': setStep('complete'); break;
    }
  };

  const handleBack = () => {
    switch (step) {
        case 'login':
        case 'signup': setStep('welcome'); break;
        case 'pass': setStep('signup'); break;
        case 'username': setStep('pass'); break;
        case 'avatar': setStep('username'); break;
        case 'group': setStep('avatar'); break;
        case 'notification': setStep('group'); break;
    }
  };

  const handlePassVerify = () => {
      setIsVerifying(true);
      setTimeout(() => {
          setIsVerifying(false);
          handleNext();
      }, 2500);
  }
  
  useEffect(() => {
    if (step === 'complete') {
      const timer = setTimeout(() => {
        onLoginSuccess(newUser);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, newUser, onLoginSuccess]);

  const renderContent = () => {
    const avatars = Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/avatar${i + 1}/100`);
    const groups: UserGroup[] = [
        { id: 'hsu', name: '한성대학교', averageReturn: 18.5 }, { id: 'snu', name: '서울대학교', averageReturn: 22.1 },
        { id: 'ku', name: '고려대학교', averageReturn: 20.3 }, { id: 'yu', name: '연세대학교', averageReturn: 21.5 },
    ];
    
    switch (step) {
      case 'welcome':
        return (
          <div className="flex flex-col h-full p-8 text-center justify-between animate-fadeInUp">
            <div/>
            <div>
                <div className="w-24 h-24 bg-primary text-white rounded-3xl mx-auto flex items-center justify-center mb-6">
                    <Icons.StonkIcon className="w-14 h-14"/>
                </div>
                <h1 className="text-4xl font-extrabold text-text-primary">주린이 놀이터</h1>
                <p className="text-text-secondary mt-4 text-lg">게임하듯 즐겁게, 주식 투자를 마스터하세요.</p>
            </div>
            <div className="space-y-3">
              <button onClick={handleNext} className="w-full bg-primary text-white font-bold py-3.5 rounded-xl">시작하기</button>
              <button onClick={() => setStep('login')} className="w-full text-primary font-bold py-3.5 rounded-xl">이미 계정이 있어요</button>
            </div>
          </div>
        );
    case 'login':
        return (
            <div className="p-6 flex flex-col h-full animate-fadeInUp">
                <div className="mb-8">
                    <button onClick={handleBack} className="p-1 mb-4"><Icons.ArrowLeftIcon className="w-6 h-6"/></button>
                    <h2 className="text-3xl font-bold">다시 오신 것을 환영해요!</h2>
                </div>
                <div className="space-y-4">
                    <div className="relative">
                        <Icons.EnvelopeIcon className="w-5 h-5 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2"/>
                        <input type="email" placeholder="이메일" className="w-full bg-bg-secondary border-2 border-border-color rounded-lg p-3.5 pl-11 focus:border-primary outline-none"/>
                    </div>
                     <div className="relative">
                        <Icons.KeyIcon className="w-5 h-5 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2"/>
                        <input type="password" placeholder="비밀번호" className="w-full bg-bg-secondary border-2 border-border-color rounded-lg p-3.5 pl-11 focus:border-primary outline-none"/>
                    </div>
                </div>
                <button onClick={handleNext} className="w-full bg-primary text-white font-bold py-3.5 rounded-xl mt-8">로그인</button>
                <OAuthButtons title="소셜 계정으로 로그인" onOAuth={() => onLoginSuccess({})} />
                <p className="text-center text-sm mt-4">계정이 없으신가요? <button onClick={() => setStep('signup')} className="font-bold text-primary">회원가입</button></p>
            </div>
        )
     case 'signup':
        return (
             <div className="p-6 flex flex-col h-full animate-fadeInUp">
                <div className="mb-8">
                    <button onClick={handleBack} className="p-1 mb-4"><Icons.ArrowLeftIcon className="w-6 h-6"/></button>
                    <h2 className="text-3xl font-bold">계정을 만들어 보세요</h2>
                </div>
                <div className="space-y-4">
                    <div className="relative">
                        <Icons.EnvelopeIcon className="w-5 h-5 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2"/>
                        <input type="email" placeholder="이메일" className="w-full bg-bg-secondary border-2 border-border-color rounded-lg p-3.5 pl-11 focus:border-primary outline-none"/>
                    </div>
                     <div className="relative">
                        <Icons.KeyIcon className="w-5 h-5 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2"/>
                        <input type="password" placeholder="비밀번호" className="w-full bg-bg-secondary border-2 border-border-color rounded-lg p-3.5 pl-11 focus:border-primary outline-none"/>
                    </div>
                </div>
                <button onClick={handleNext} className="w-full bg-primary text-white font-bold py-3.5 rounded-xl mt-8">다음</button>
                 <p className="text-center text-sm mt-4">이미 계정이 있으신가요? <button onClick={() => setStep('login')} className="font-bold text-primary">로그인</button></p>
            </div>
        )
    case 'pass':
        return (
            <div className="p-6 flex flex-col h-full animate-fadeInUp text-center">
                <div className="mb-8 self-start">
                    <button onClick={handleBack} className="p-1"><Icons.ArrowLeftIcon className="w-6 h-6"/></button>
                </div>
                <Icons.PhoneIcon className="w-16 h-16 text-primary mx-auto"/>
                <h2 className="text-3xl font-bold mt-4">휴대폰 본인인증</h2>
                <p className="text-text-secondary mt-2 mb-8">안전한 서비스 이용을 위해<br/>PASS로 본인인증을 진행해주세요.</p>
                {isVerifying ? (
                    <div className="flex flex-col items-center justify-center h-40 bg-bg-secondary rounded-2xl">
                        <Icons.CheckCircleIcon className="w-12 h-12 text-positive animate-ping" style={{ animationDuration: '1.5s' }}/>
                        <p className="mt-4 font-semibold text-text-primary">인증이 완료되었습니다.</p>
                    </div>
                ) : (
                    <div className="h-40 bg-bg-secondary rounded-2xl p-6 flex flex-col justify-center">
                        <p className="font-semibold text-text-primary">홍길동 010-1234-5678</p>
                        <p className="text-sm text-text-secondary mt-1">본인 정보가 맞으시면 인증하기를 눌러주세요.</p>
                    </div>
                )}
                <button onClick={handlePassVerify} disabled={isVerifying} className="w-full bg-primary text-white font-bold py-3.5 rounded-xl mt-auto disabled:bg-opacity-50">
                    {isVerifying ? '인증 확인 중...' : '인증하기'}
                </button>
            </div>
        )
      case 'username':
        return (
          <div className="p-6 flex flex-col h-full animate-fadeInUp">
            <div className="mb-4"><ProgressBar step={1} totalSteps={3} /></div>
            <button onClick={handleBack} className="self-start mb-4"><Icons.ArrowLeftIcon className="w-6 h-6"/></button>
            <h2 className="text-3xl font-bold mb-4">멋진 닉네임을<br/>만들어보세요.</h2>
            <input
              type="text"
              placeholder="닉네임 입력"
              value={newUser.username}
              onChange={e => setNewUser({...newUser, username: e.target.value})}
              className="w-full bg-bg-secondary border-2 border-border-color rounded-lg p-4 text-lg focus:border-primary focus:ring-0 outline-none"
            />
            <button onClick={handleNext} disabled={!newUser.username} className="w-full bg-primary text-white font-bold py-3.5 rounded-xl mt-auto disabled:bg-opacity-50">다음</button>
          </div>
        );
      case 'avatar':
        return (
            <div className="p-6 flex flex-col h-full animate-fadeInUp">
                <div className="mb-4"><ProgressBar step={2} totalSteps={3} /></div>
                <button onClick={handleBack} className="self-start mb-4"><Icons.ArrowLeftIcon className="w-6 h-6"/></button>
                <h2 className="text-3xl font-bold mb-6">프로필 아바타를<br/>선택하세요.</h2>
                <div className="grid grid-cols-3 gap-4 mb-auto">
                    {avatars.map(avatarUrl => (
                        <button key={avatarUrl} onClick={() => setNewUser({...newUser, avatar: avatarUrl})} className={`p-2 rounded-full transition-all duration-200 ${newUser.avatar === avatarUrl ? 'ring-4 ring-primary' : ''}`}>
                            <img src={avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover"/>
                        </button>
                    ))}
                </div>
                <button onClick={handleNext} className="w-full bg-primary text-white font-bold py-3.5 rounded-xl mt-auto">다음</button>
            </div>
        );
      case 'group':
        return (
             <div className="p-6 flex flex-col h-full animate-fadeInUp">
                <div className="mb-4"><ProgressBar step={3} totalSteps={4} /></div>
                <button onClick={handleBack} className="self-start mb-4"><Icons.ArrowLeftIcon className="w-6 h-6"/></button>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">소속 그룹을<br/>선택하세요.</h2>
                    <button onClick={handleNext} className="text-sm font-semibold text-primary">나중에 할래요</button>
                </div>
                <div className="space-y-3">
                    {groups.map(group => (
                        <button key={group.id} onClick={() => setNewUser({...newUser, group})} className={`w-full text-left p-4 border-2 rounded-lg flex justify-between items-center transition-colors ${newUser.group?.id === group.id ? 'border-primary bg-primary/5' : 'border-border-color'}`}>
                            <span className="font-bold text-text-primary">{group.name}</span>
                            {newUser.group?.id === group.id && <Icons.CheckCircleIcon className="w-6 h-6 text-primary"/>}
                        </button>
                    ))}
                </div>
                <button onClick={handleNext} className="w-full bg-primary text-white font-bold py-3.5 rounded-xl mt-auto">다음</button>
            </div>
        );
      case 'notification':
        return (
            <div className="p-6 flex flex-col h-full animate-fadeInUp text-center">
                <div className="mb-4"><ProgressBar step={4} totalSteps={4} /></div>
                <button onClick={handleBack} className="self-start mb-4"><Icons.ArrowLeftIcon className="w-6 h-6"/></button>
                <Icons.BellAlertIcon className="w-20 h-20 text-primary mx-auto"/>
                <h2 className="text-3xl font-bold mt-4">실시간 알림 받기</h2>
                <p className="text-text-secondary mt-3 mb-8">
                  주문 체결, 랭킹 변동, 업적 달성 등<br/>
                  중요한 순간을 놓치지 마세요!
                </p>
                
                <div className="space-y-4 mb-auto">
                  <div className="flex items-start gap-3 p-4 bg-bg-secondary rounded-xl text-left">
                    <Icons.CheckCircleIcon className="w-6 h-6 text-positive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-text-primary mb-1">주문 체결 알림</p>
                      <p className="text-sm text-text-secondary">매수/매도 주문이 체결되면 즉시 알려드려요</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-bg-secondary rounded-xl text-left">
                    <Icons.TrophyIcon className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-text-primary mb-1">랭킹 변동 알림</p>
                      <p className="text-sm text-text-secondary">내 순위가 상승하면 바로 확인할 수 있어요</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-bg-secondary rounded-xl text-left">
                    <Icons.SparklesIcon className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-text-primary mb-1">업적 달성 알림</p>
                      <p className="text-sm text-text-secondary">새로운 업적을 달성하면 축하 메시지를 보내드려요</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <button 
                    onClick={async () => {
                      const permission = await requestNotificationPermission();
                      if (permission === 'granted') {
                        const registration = await registerServiceWorker();
                        if (registration) {
                          await subscribeToPush(registration);
                        }
                      }
                      handleNext();
                    }} 
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl"
                  >
                    알림 허용하기
                  </button>
                  <button 
                    onClick={handleNext} 
                    className="w-full text-text-secondary font-semibold py-3"
                  >
                    나중에 설정할게요
                  </button>
                </div>
            </div>
        );
      case 'complete':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fadeInUp">
            <Icons.CheckCircleIcon className="w-24 h-24 text-positive mb-6" />
            <h1 className="text-3xl font-bold">환영합니다, {newUser.username}님!</h1>
            <p className="text-text-secondary mt-2">이제 주린이 놀이터를 시작할 준비가 되었습니다.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="h-screen w-full bg-bg-primary">{renderContent()}</div>;
};

export default OnboardingScreen;
