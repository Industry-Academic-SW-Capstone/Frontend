"use client";

import { useEffect } from "react";

export default function PWARegistry() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      (window as any).workbox === undefined
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered: ", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed: ", error);
        });
    }
  }, []);

  return null;
}
