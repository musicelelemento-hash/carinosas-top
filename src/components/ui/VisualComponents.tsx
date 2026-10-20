"use client";

import React from "react";
import Image from "next/image";
import { BadgeCheck, MapPin, Navigation, MessageCircle, Crown, Sparkles } from "lucide-react";

/* ============================================================================
   SKELETON DE PERFIL (feed/grid)
   ============================================================================ */
export function ProfileSkeleton({ layout = "grid" }: { layout?: "grid" | "feed" }) {
  const isFeed = layout === "feed";
  return (
    <div className="overflow-hidden border border-white/[0.07] bg-[#101014] rounded-[20px] animate-pulse">
      <div className="relative overflow-hidden skeleton-img" style={isFeed ? { height: 250 } : { aspectRatio: "4/5" }} />
      <div className="px-3.5 py-3 flex items-center justify-between border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="skeleton-text skeleton-line" style={{ width: "40%", height: "14px" }} />
          <div className="skeleton-circle w-5 h-5" />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 rounded-xl skeleton-img" style={isFeed ? { minHeight: 44 } : { minHeight: 36 }} />
      </div>
    </div>
  );
}

/* ============================================================================
   ESTADO VACÍO HONESTO
   ============================================================================ */
export interface EmptyStateProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, subtitle, icon, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {icon || <MapPin size={28} className="text-brand-gold" />}
      </div>
      <h3>{title}</h3>
      <p>{subtitle}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-gold-premium px-8 py-3 text-xs"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

/* ============================================================================
   BOTÓN GRADIENTE DORADO PREMIUM (reutilizable)
   ============================================================================ */
export interface GradientButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function GradientButton({ children, onClick, disabled, className }: GradientButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn-gold-premium px-8 py-3 text-xs ${className || ""}`}
    >
      {children}
    </button>
  );
}

/* ============================================================================
   PROFILE CARD SKELETON LIST (para estados de carga del feed)
   ============================================================================ */
export function ProfileSkeletonList({ count = 6, layout = "grid" }: { count?: number; layout?: "grid" | "feed" }) {
  return (
    <div className="grid lg:grid-cols-3 lg:gap-x-[18px] lg:gap-y-[18px]">
      {Array.from({ length: count }).map((_, i) => (
        <ProfileSkeleton key={i} layout={layout} />
      ))}
    </div>
  );
}
