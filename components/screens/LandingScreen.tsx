"use client";
import React, { useEffect, useState } from "react";
import { StonkIcon, PencilSquareIcon } from "@/components/icons/Icons";

const LandingScreen: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    const ua = navigator.userAgent || "";
    const isIos = /iphone|ipad|ipod/i.test(ua);
    const isInStandalone =
      ("standalone" in window.navigator &&
        (window as any).navigator.standalone) ||
      (window.matchMedia &&
        window.matchMedia("(display-mode: standalone)").matches);

    // If iOS and not installed, show our iOS-styled install button (will show modal with instructions)
    if (isIos && !isInStandalone) {
      setShowInstallButton(true);
    }

    // Capture beforeinstallprompt for supported browsers (Android/desktop)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handler as EventListener
      );
    };
  }, []);

  const handleInstallClick = async () => {
    // If we have a beforeinstallprompt saved, use it
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        // hide the button after response (accepted or dismissed)
        setShowInstallButton(false);
        setDeferredPrompt(null);
      } catch (err) {
        // ignore errors
      }
      return;
    }

    // Fallback: open iOS instructions modal
    setShowIosModal(true);
  };

  return (
    <div className="min-h-screen-safe bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 bg-primary text-white rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-lg">
        <StonkIcon className="w-14 h-14" />
      </div>
      <h1 className="text-5xl font-extrabold text-slate-900">스톡잇!</h1>
      <p className="text-slate-600 mt-4 text-lg max-w-2xl">
        A gamified stock simulation platform for beginners, combining casual
        gameplay with real-world market data to make learning about investing
        fun and accessible.
      </p>
      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <a
          href="/?view=app"
          className="group flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-xl text-lg shadow-md hover:bg-primary/90 transition-transform hover:scale-105"
        >
          <span>🚀</span>
          <span>Launch App</span>
        </a>
        {/* PWA Install button (iOS-styled) */}
        {showInstallButton && (
          <button
            onClick={handleInstallClick}
            className="group flex items-center justify-center gap-3 px-6 py-3 bg-white text-slate-800 font-semibold rounded-2xl text-lg shadow-sm border border-slate-200 hover:scale-[1.02] transition-transform"
            aria-label="Install app"
          >
            <svg
              className="w-5 h-5 text-slate-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M12 3v10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 8l5-5 5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 21H3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Install App</span>
          </button>
        )}
        <a
          href="/?spec=true"
          className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-700 font-bold rounded-xl text-lg shadow-md border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-transform hover:scale-105"
        >
          <PencilSquareIcon className="w-6 h-6 text-slate-500 group-hover:text-primary transition-colors" />
          <span>View UI Design System</span>
        </a>
      </div>

      {/* iOS install instruction modal */}
      {showIosModal && (
        <div className="fixed inset-0 z-40 flex items-end justify-center px-4 pb-8 sm:items-center sm:pb-0">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowIosModal(false)}
            aria-hidden
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-6 text-left">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center">
                  +
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Install on iPhone
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  Tap the share button in Safari (the {`⤴︎`} icon), then choose{" "}
                  <strong className="text-slate-900">Add to Home Screen</strong>
                  .
                </p>
                <div className="mt-4 flex gap-2 items-center">
                  <button
                    onClick={() => setShowIosModal(false)}
                    className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
                  >
                    Got it
                  </button>
                  <button
                    onClick={() => setShowIosModal(false)}
                    className="px-4 py-2 bg-white text-slate-700 rounded-lg border border-slate-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingScreen;
