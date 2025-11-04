"use client";
import React, { useEffect, useState, useRef } from 'react';

interface SlidingScreenProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

/**
 * 오른쪽에서 나타나는 슬라이딩 스크린 컴포넌트
 * 증권 화면이나 상세 페이지 등에 사용
 * 왼쪽 가장자리(50px)에서 오른쪽으로 스와이프하여 닫기 지원
 */
const SlidingScreen: React.FC<SlidingScreenProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchCurrentX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const isEdgeSwipe = useRef<boolean>(false);
  const EDGE_THRESHOLD = 50; // 왼쪽 가장자리 영역 (픽셀)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTranslateX(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
    
    // 왼쪽 가장자리에서 시작하는지 확인
    isEdgeSwipe.current = touchStartX.current < EDGE_THRESHOLD;
    isDragging.current = isEdgeSwipe.current;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !isEdgeSwipe.current) return;
    
    touchCurrentX.current = e.touches[0].clientX;
    const diff = touchCurrentX.current - touchStartX.current;
    
    // 오른쪽으로만 드래그 허용 (닫기 방향)
    if (diff > 0) {
      setTranslateX(diff);
      // 스크롤 방지
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    
    isDragging.current = false;
    const diff = touchCurrentX.current - touchStartX.current;
    
    // 100픽셀 이상 또는 화면 너비의 1/3 이상 드래그하면 닫기
    const threshold = Math.min(100, window.innerWidth / 3);
    if (diff > threshold) {
      onClose();
    } else {
      setTranslateX(0);
    }
    
    isEdgeSwipe.current = false;
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Sliding Panel - 모바일 화면 모양의 컨테이너 */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none`}
      >
        <div
          className={`w-full max-w-md h-full bg-bg-primary shadow-2xl pointer-events-auto transition-all duration-300 ease-out ${
            isAnimating && translateX === 0 ? 'translate-x-0' : ''
          }`}
          style={{
            transform: translateX > 0 
              ? `translateX(${translateX}px)` 
              : isAnimating 
              ? 'translateX(0)' 
              : 'translateX(100%)',
            transition: translateX > 0 ? 'none' : 'transform 300ms ease-out'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 왼쪽 가장자리 스와이프 영역 힌트 */}
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-20 w-1 rounded-r-full pointer-events-none opacity-50"
            style={{
              background: 'linear-gradient(to right, rgba(var(--primary-rgb, 99, 102, 241), 0.3), transparent)'
            }}
          />
          
          {title && (
            <header className="sticky top-0 z-10 bg-bg-primary/95 backdrop-blur-sm border-b border-border-color p-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-text-primary">{title}</h1>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-bg-secondary rounded-full transition-all duration-200 active:scale-95"
                >
                  <span className="text-2xl leading-none text-text-primary">×</span>
                </button>
              </div>
            </header>
          )}
          <div className="h-full overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default SlidingScreen;
