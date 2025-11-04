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
 * 스와이프 제스처로 닫기 지원
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
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    touchCurrentX.current = e.touches[0].clientX;
    const diff = touchCurrentX.current - touchStartX.current;
    
    // 오른쪽으로만 드래그 허용
    if (diff > 0) {
      setTranslateX(diff);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    
    isDragging.current = false;
    const diff = touchCurrentX.current - touchStartX.current;
    
    // 50픽셀 이상 드래그하면 닫기
    if (diff > 50) {
      onClose();
    } else {
      setTranslateX(0);
    }
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

      {/* Sliding Panel */}
      <div
        className={`fixed inset-0 z-50 bg-bg-primary transition-all duration-300 ease-out ${
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
    </>
  );
};

export default SlidingScreen;
