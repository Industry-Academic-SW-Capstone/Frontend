"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // 1. Mobile Detection
    const isMobile = window.matchMedia("(pointer: coarse)").matches;

    // 2. Override global overflow styles to allow scrolling
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
    document.body.style.overscrollBehavior = "auto";

    // 3. Initialize Lenis only on desktop
    let lenisInstance: Lenis | null = null;
    let rafId: number;

    if (!isMobile) {
      lenisInstance = new Lenis({
        duration: 0.9,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.2,
      });

      setLenis(lenisInstance);

      function raf(time: number) {
        lenisInstance?.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
    }

    return () => {
      // Cleanup: Restore original styles if necessary (or just let next page handle it)
      // Ideally, we should revert to what it was, but since globals.css sets it to hidden,
      // and we want to be safe, we might want to reset it.
      // However, if we navigate to another page that expects hidden, it will be re-applied by that page's layout or globals.
      // For now, let's just clean up Lenis.
      if (rafId) cancelAnimationFrame(rafId);
      lenisInstance?.destroy();
      setLenis(null);

      // Optional: Revert styles if you want to be strict about cleanup
      // document.documentElement.style.overflow = "";
      // document.body.style.overflow = "";
      // document.body.style.overscrollBehavior = "";
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
