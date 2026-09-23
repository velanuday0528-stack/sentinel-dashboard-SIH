import React from 'react';
import { cn } from '@/lib/utils';

export type StatusVariant = 
  | 'online' 
  | 'offline' 
  | 'degraded' 
  | 'safe' 
  | 'warning' 
  | 'high' 
  | 'critical' 
  | 'open' 
  | 'closed' 
  | 'moving' 
  | 'dry' 
  | 'wet' 
  | 'info'
  | 'pending';

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  pulse?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({
  status,
  variant,
  pulse = true,
  className,
  size = 'md',
}: StatusBadgeProps) {
  // auto-detect variant if not passed explicitly
  const resolvedVariant: StatusVariant = variant || (() => {
    const s = status.toUpperCase();
    if (s.includes('ONLINE') || s.includes('SAFE') || s.includes('DRY') || s.includes('OPEN') || s.includes('LOW')) {
      return 'safe';
    }
    if (s.includes('CRITICAL') || s.includes('EMERGENCY') || s.includes('FIRE') || s.includes('OFFLINE')) {
      return 'critical';
    }
    if (s.includes('WARNING') || s.includes('HIGH') || s.includes('MOISTURE') || s.includes('WET') || s.includes('CLOSED')) {
      return 'warning';
    }
    if (s.includes('DEGRADED') || s.includes('MOVING') || s.includes('MODERATE')) {
      return 'moving';
    }
    if (s.includes('PENDING') || s.includes('NOT CONNECTED')) {
      return 'pending';
    }
    return 'info';
  })();

  const styles = {
    safe: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
    online: 'bg-cyan-950/60 text-cyan-400 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]',
    warning: 'bg-amber-950/60 text-amber-400 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
    high: 'bg-orange-950/60 text-orange-400 border-orange-500/40 shadow-[0_0_12px_rgba(249,115,22,0.2)]',
    critical: 'bg-red-950/70 text-red-400 border-red-500/50 shadow-[0_0_14px_rgba(239,68,68,0.35)]',
    offline: 'bg-zinc-900/80 text-zinc-400 border-zinc-700/50',
    degraded: 'bg-yellow-950/60 text-yellow-400 border-yellow-500/40',
    open: 'bg-blue-950/60 text-blue-400 border-blue-500/40',
    closed: 'bg-purple-950/60 text-purple-400 border-purple-500/40',
    moving: 'bg-sky-950/60 text-sky-400 border-sky-500/40',
    dry: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40',
    wet: 'bg-blue-950/70 text-blue-300 border-blue-400/50',
    info: 'bg-slate-900/80 text-slate-300 border-slate-700/60',
    pending: 'bg-zinc-900/60 text-zinc-400 border-dashed border-zinc-700/70',
  }[resolvedVariant];

  const dotColor = {
    safe: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
    online: 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]',
    warning: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]',
    high: 'bg-orange-400 shadow-[0_0_8px_#fb923c]',
    critical: 'bg-red-500 shadow-[0_0_10px_#f87171]',
    offline: 'bg-zinc-500',
    degraded: 'bg-yellow-400 shadow-[0_0_8px_#facc15]',
    open: 'bg-blue-400 shadow-[0_0_8px_#60a5fa]',
    closed: 'bg-purple-400 shadow-[0_0_8px_#c084fc]',
    moving: 'bg-sky-400 animate-spin',
    dry: 'bg-emerald-400',
    wet: 'bg-blue-400 shadow-[0_0_8px_#60a5fa]',
    info: 'bg-slate-400',
    pending: 'bg-zinc-500',
  }[resolvedVariant];

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] tracking-wider font-mono uppercase',
    md: 'px-2.5 py-1 text-xs tracking-wider font-mono uppercase',
    lg: 'px-3.5 py-1.5 text-sm tracking-wider font-mono uppercase font-semibold',
  }[size];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border font-medium transition-all backdrop-blur-md',
        styles,
        sizeStyles,
        className
      )}
    >
      <span
        className={cn(
          'inline-block h-1.5 w-1.5 rounded-full',
          dotColor,
          pulse && (resolvedVariant === 'critical' || resolvedVariant === 'warning' || resolvedVariant === 'online') && 'animate-ping'
        )}
      />
      <span>{status}</span>
    </span>
  );
}
