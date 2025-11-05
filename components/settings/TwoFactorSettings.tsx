'use client';

import React, { useState } from 'react';
import { use2FA } from '@/lib/hooks/use2FA';
import PinInput from '@/components/auth/PinInput';
import BiometricSetup from '@/components/auth/BiometricSetup';

export default function TwoFactorSettings() {
  const { config, setupPin, setupBiometric, reset2FA } = use2FA();
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);
  const [pinStep, setPinStep] = useState<'setup' | 'confirm'>('setup');
  const [tempPin, setTempPin] = useState('');
  const [error, setError] = useState('');

  const handlePinSetupStart = () => {
    setShowPinSetup(true);
    setPinStep('setup');
    setTempPin('');
    setError('');
  };

  const handlePinSetup = (pin: string) => {
    setTempPin(pin);
    setPinStep('confirm');
  };

  const handlePinConfirm = (confirmPin: string) => {
    if (tempPin === confirmPin) {
      setupPin(tempPin);
      setShowPinSetup(false);
      setError('');
    } else {
      setError('PIN이 일치하지 않습니다');
      setTimeout(() => {
        setError('');
        setPinStep('setup');
        setTempPin('');
      }, 2000);
    }
  };

  const handleBiometricSuccess = (credentialId: string) => {
    setupBiometric(credentialId);
    setShowBiometricSetup(false);
  };

  const handleResetAll = () => {
    if (confirm('모든 2차 인증 설정을 삭제하시겠습니까?')) {
      reset2FA();
    }
  };

  // PIN 설정 모달
  if (showPinSetup) {
    if (pinStep === 'setup') {
      return (
        <div className="fixed inset-0 z-50">
          <PinInput
            title="PIN 설정"
            subtitle="6자리 보안 PIN을 입력해주세요"
            onComplete={handlePinSetup}
            error={error}
          />
          <button
            onClick={() => setShowPinSetup(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      );
    } else {
      return (
        <div className="fixed inset-0 z-50">
          <PinInput
            title="PIN 확인"
            subtitle="동일한 PIN을 다시 입력해주세요"
            onComplete={handlePinConfirm}
            error={error}
          />
          <button
            onClick={() => setShowPinSetup(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      );
    }
  }

  // 생체 인증 설정 모달
  if (showBiometricSetup) {
    return (
      <div className="fixed inset-0 z-50">
        <BiometricSetup
          onSuccess={handleBiometricSuccess}
          onSkip={() => setShowBiometricSetup(false)}
        />
        <button
          onClick={() => setShowBiometricSetup(false)}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text-primary mb-4">2차 인증</h3>

      {/* PIN 설정 */}
      <div className="bg-bg-primary rounded-2xl p-4 border border-border-color">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              config.pinEnabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
            }`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-text-primary">보안 PIN</p>
              <p className="text-xs text-text-secondary">
                {config.pinEnabled ? 'PIN이 설정되어 있습니다' : 'PIN을 설정해주세요'}
              </p>
            </div>
          </div>
          <button
            onClick={handlePinSetupStart}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
              config.pinEnabled
                ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                : 'bg-accent text-white hover:bg-accent/90'
            }`}
          >
            {config.pinEnabled ? '변경' : '설정'}
          </button>
        </div>
      </div>

      {/* 생체 인증 설정 */}
      <div className="bg-bg-primary rounded-2xl p-4 border border-border-color">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              config.biometricEnabled ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'
            }`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-text-primary">생체 인증</p>
              <p className="text-xs text-text-secondary">
                {config.biometricEnabled ? 'FaceID/TouchID 사용 가능' : '생체 인증을 설정해주세요'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowBiometricSetup(true)}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
              config.biometricEnabled
                ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                : 'bg-accent text-white hover:bg-accent/90'
            }`}
          >
            {config.biometricEnabled ? '재설정' : '설정'}
          </button>
        </div>
      </div>

      {/* 전체 초기화 */}
      {(config.pinEnabled || config.biometricEnabled) && (
        <button
          onClick={handleResetAll}
          className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 font-medium text-sm hover:bg-red-500/20 transition-all"
        >
          모든 2차 인증 설정 삭제
        </button>
      )}
    </div>
  );
}
