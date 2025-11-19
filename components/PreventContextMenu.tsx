"use client";

import { useEffect } from "react";

export default function PreventContextMenu() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent | TouchEvent) => {
      e.preventDefault(); // 우클릭(롱터치) 메뉴가 뜨는 이벤트를 막음
    };

    // 전체 문서에 이벤트 리스너 등록
    document.addEventListener("contextmenu", handleContextMenu);

    // 컴포넌트 언마운트 시 리스너 제거 (Clean up)
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return null;
}
