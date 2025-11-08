"use client";

import React, { useEffect, useState } from "react";
import { Toast as ToastType, useToastStore } from "@/lib/stores/useToastStore";
import * as Icons from "@/components/icons/Icons";

interface ToastItemProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / toast.duration!) * 100);
      setProgress(remaining);
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [toast.duration]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          bg: "bg-positive/10 dark:bg-positive/20",
          border: "border-positive/30",
          icon: (
            <Icons.CheckCircleIcon className="w-5 h-5 text-positive shrink-0" />
          ),
          iconBg: "bg-positive/20",
          progressBg: "bg-positive",
        };
      case "error":
        return {
          bg: "bg-negative/10 dark:bg-negative/20",
          border: "border-negative/30",
          icon: (
            <Icons.XCircleIcon className="w-5 h-5 text-negative shrink-0" />
          ),
          iconBg: "bg-negative/20",
          progressBg: "bg-negative",
        };
      case "warning":
        return {
          bg: "bg-accent/10 dark:bg-accent/20",
          border: "border-accent/30",
          icon: (
            <Icons.ExclamationTriangleIcon className="w-5 h-5 text-accent shrink-0" />
          ),
          iconBg: "bg-accent/20",
          progressBg: "bg-accent",
        };
      case "info":
      default:
        return {
          bg: "bg-primary/10 dark:bg-primary/20",
          border: "border-primary/30",
          icon: (
            <Icons.InformationCircleIcon className="w-5 h-5 text-primary shrink-0" />
          ),
          iconBg: "bg-primary/20",
          progressBg: "bg-primary",
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border-2 backdrop-blur-sm shadow-lg
        ${styles.bg} ${styles.border}
        ${isExiting ? "animate-fadeOutDown" : "animate-slideInUp"}
        transition-all duration-300 ease-out
        max-w-md w-full
      `}
      role="alert"
      aria-live="polite"
    >
      {/* Progress bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-border-color/30">
          <div
            className={`h-full transition-all ease-linear ${styles.progressBg}`}
            style={{
              width: `${progress}%`,
              transitionDuration: "16ms",
            }}
          />
        </div>
      )}

      <div className="flex items-start gap-3 p-4 pt-5">
        {/* Icon */}
        <div className={`p-2 rounded-lg ${styles.iconBg}`}>
          {toast.icon || styles.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="text-text-primary text-sm font-medium leading-relaxed hyphens-auto">
            {toast.content}
          </div>
        </div>

        {/* Dismiss button */}
        {toast.dismissible && (
          <button
            onClick={handleDismiss}
            className="shrink-0 p-1 rounded-lg hover:bg-border-color/30 transition-colors duration-200 mt-0.5"
            aria-label="Dismiss notification"
          >
            <Icons.XMarkIcon className="w-4 h-4 text-text-secondary" />
          </button>
        )}
      </div>
    </div>
  );
};

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  // Group toasts by position
  const groupedToasts = toasts.reduce((acc, toast) => {
    const position = toast.position || "top-center";
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(toast);
    return acc;
  }, {} as Record<string, ToastType[]>);

  const getPositionClasses = (position: string) => {
    switch (position) {
      case "top-left":
        return "top-4 left-4 items-start";
      case "top-center":
        return "top-4 left-1/2 -translate-x-1/2 items-center";
      case "top-right":
        return "top-4 right-4 items-end";
      case "bottom-left":
        return "bottom-4 left-4 items-start";
      case "bottom-center":
        return "bottom-4 left-1/2 -translate-x-1/2 items-center";
      case "bottom-right":
        return "bottom-4 right-4 items-end";
      default:
        return "top-4 left-1/2 -translate-x-1/2 items-center";
    }
  };

  return (
    <>
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <div
          key={position}
          className={`fixed z-9999 flex flex-col gap-3 pointer-events-none ${getPositionClasses(
            position
          )}`}
          style={{ maxWidth: "calc(100vw - 2rem)" }}
        >
          {positionToasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <ToastItem toast={toast} onRemove={removeToast} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default Toast;
