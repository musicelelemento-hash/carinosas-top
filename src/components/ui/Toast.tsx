"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { type Toast, type ToastType } from "./useToast";

const toastIcons: Record<ToastType, React.ComponentType<{ size?: number; className?: string }>> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastColors: Record<ToastType, { bg: string; border: string; icon: string; text: string }> = {
  success: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: "text-emerald-400",
    text: "text-emerald-100",
  },
  error: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    icon: "text-rose-400",
    text: "text-rose-100",
  },
  warning: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: "text-amber-400",
    text: "text-amber-100",
  },
  info: {
    bg: "bg-brand-gold/10",
    border: "border-brand-gold/30",
    icon: "text-brand-gold",
    text: "text-white",
  },
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const { type, title, description, action } = toast;
  const colors = toastColors[type];
  const Icon = toastIcons[type];

  const timerRef = useRef<number | null>(null);

  const handleDismiss = useCallback(() => {
    onDismiss(toast.id);
  }, [toast.id, onDismiss]);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      timerRef.current = window.setTimeout(handleDismiss, toast.duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.duration, handleDismiss]);

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl ${colors.bg} ${colors.border} shadow-xl border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-right-4`}
      role="alert"
      aria-live="polite"
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${colors.icon} bg-[${colors.bg === "bg-brand-gold/10" ? "rgba(212,168,67,0.2)" : "inherit"}]`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-white">{title}</h4>
        {description && (
          <p className="text-xs text-white/70 mt-1 leading-relaxed">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0 ml-3">
        <button
          onClick={handleDismiss}
          className="w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Cerrar notificación"
        >
          <X size={14} />
        </button>
        {action && (
          <button
            onClick={() => {
              action.onClick();
              onDismiss(toast.id);
            }}
            className="mt-2 w-full rounded-lg px-3 py-1.5 text-xs font-bold bg-white text-brand-black hover:bg-brand-gold transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div
      className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none"
      aria-label="Notificaciones"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
