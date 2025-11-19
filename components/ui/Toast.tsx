"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@/components/icons/Icons";

export type ToastType = "success" | "error";

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

import { createPortal } from "react-dom";

const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 3000,
}) => {
  const [isShowing, setIsShowing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      const timer = setTimeout(() => {
        setIsShowing(false);
        setTimeout(onClose, 300); // Wait for animation to finish
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!mounted) return null;
  if (!isVisible && !isShowing) return null;

  return createPortal(
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[20000] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border transition-all duration-300 ${
        isShowing ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      } ${
        type === "success"
          ? "bg-bg-secondary border-positive/20 text-positive"
          : "bg-bg-secondary border-negative/20 text-negative"
      }`}
    >
      {type === "success" ? (
        <CheckCircleIcon className="w-5 h-5" />
      ) : (
        <XCircleIcon className="w-5 h-5" />
      )}
      <p className="font-semibold text-sm text-text-primary">{message}</p>
      <button
        onClick={() => setIsShowing(false)}
        className="ml-2 text-text-secondary hover:text-text-primary"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>,
    document.body
  );
};

export default Toast;
