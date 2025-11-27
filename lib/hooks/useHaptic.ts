"use client";

import { useCallback } from "react";

/**
 * Haptic feedback hook using the Web Vibration API.
 * Provides methods for different types of feedback: success, error, selection, and impact.
 */
export const useHaptic = () => {
  /**
   * Triggers a vibration pattern if the browser supports it.
   * @param pattern A single number (ms) or an array of numbers (pattern).
   */
  const triggerHaptic = useCallback((pattern: number | number[]) => {
    if (
      typeof window !== "undefined" &&
      window.navigator &&
      window.navigator.vibrate
    ) {
      try {
        window.navigator.vibrate(pattern);
      } catch (e) {
        console.warn("Haptic feedback failed:", e);
      }
    }
  }, []);

  /**
   * Triggers a light tap feedback, suitable for selection or button presses.
   * Pattern: 10ms
   */
  const hapticSelection = useCallback(() => {
    triggerHaptic(10);
  }, [triggerHaptic]);

  /**
   * Triggers a success feedback.
   * Pattern: Two short vibrations (10ms, pause 50ms, 10ms)
   */
  const hapticSuccess = useCallback(() => {
    triggerHaptic([10, 50, 10]);
  }, [triggerHaptic]);

  /**
   * Triggers an error feedback.
   * Pattern: Two longer vibrations (50ms, pause 100ms, 50ms)
   */
  const hapticError = useCallback(() => {
    triggerHaptic([50, 100, 50]);
  }, [triggerHaptic]);

  /**
   * Triggers an impact feedback with varying intensity.
   * @param style 'light' | 'medium' | 'heavy'
   */
  const hapticImpact = useCallback(
    (style: "light" | "medium" | "heavy" = "medium") => {
      switch (style) {
        case "light":
          triggerHaptic(10);
          break;
        case "medium":
          triggerHaptic(20);
          break;
        case "heavy":
          triggerHaptic(40);
          break;
      }
    },
    [triggerHaptic]
  );

  return {
    triggerHaptic,
    hapticSelection,
    hapticSuccess,
    hapticError,
    hapticImpact,
  };
};
