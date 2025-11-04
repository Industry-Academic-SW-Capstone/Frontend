"use client";
import { useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  containerId?: string;
}

/**
 * React Portal 컴포넌트
 * 자식 요소를 DOM의 최상위 레벨에 렌더링하여
 * z-index 및 stacking context 문제를 해결합니다.
 */
const Portal: React.FC<PortalProps> = ({ children, containerId = 'portal-root' }) => {
  const [mounted, setMounted] = useState(false);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Portal 컨테이너 찾기 또는 생성
    let element = document.getElementById(containerId);
    
    if (!element) {
      element = document.createElement('div');
      element.id = containerId;
      element.style.position = 'fixed';
      element.style.top = '0';
      element.style.left = '0';
      element.style.width = '100%';
      element.style.height = '100%';
      element.style.pointerEvents = 'none';
      element.style.zIndex = '9999';
      document.body.appendChild(element);
    }
    
    setPortalElement(element);

    return () => {
      // 컴포넌트 언마운트 시 자동 생성된 portal-root는 제거하지 않음
      // (다른 Portal이 사용 중일 수 있음)
    };
  }, [containerId]);

  if (!mounted || !portalElement) {
    return null;
  }

  return createPortal(children, portalElement);
};

export default Portal;
