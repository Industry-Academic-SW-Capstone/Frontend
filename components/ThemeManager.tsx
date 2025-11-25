"use client";

import { useThemeObserver } from "@/lib/hooks/useThemeObserver";

export default function ThemeManager() {
  useThemeObserver();
  return null;
}
