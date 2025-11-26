"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PWARegistry() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      if (pathname === "/pwa") {
        if ((window as any).workbox === undefined) {
          navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
              console.log("Service Worker registered: ", registration);
              if (registration.active) {
                registration.active.postMessage({ type: "CHECK_DEPLOYMENT" });
              }
            })
            .catch((error) => {
              console.error("Service Worker registration failed: ", error);
            });
        }
      } else {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
            console.log("Service Worker unregistered");
          }
        });
      }
    }
  }, [pathname]);

  return null;
}
