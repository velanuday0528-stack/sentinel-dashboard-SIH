import React from 'react';
import { cn } from '@/lib/utils';
import { StatusBadge, StatusVariant } from './status-badge';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  statusText?: string;
  statusVariant?: StatusVariant;
  icon?: React.ReactNode;
  accent?: 'cyan' | 'blue' | 'emerald' | 'amber' | 'red' | 'purple';
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  badge?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  subtitle,
  statusText,
  statusVariant,
  icon,
  accent = 'cyan',
  children,
  onClick,
  className,
  badge,
}: MetricCardProps) {
  const accentGlow = {
    cyan: 'hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] focus-within:border-cyan-500/60',
    blue: 'hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] focus-within:border-blue-500/60',
    emerald: 'hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] focus-within:border-emerald-500/60',
    amber: 'hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] focus-within:border-amber-500/60',
    red: 'hover:border-red-500/60 hover:shadow-[0_0_25px_rgba(239,68,68,0.25)] focus-within:border-red-500/80',
    purple: 'hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] focus-within:border-purple-500/60',
  }[accent];

  const titleColor = {
    cyan: 'text-cyan-400',
    blue: 'text-blue-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
  }[accent];

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-lg border border-slate-800/80 bg-slate-950/70 p-5 backdrop-blur-xl transition-all duration-200',
        onClick && 'cursor-pointer hover:bg-slate-900/80',
        accentGlow,
        className
      )}
    >
      {/* Aerospace corner brackets */}
      <div className="pointer-events-none absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan-500/40" />
      <div className="pointer-events-none absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan-500/40" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan-500/40" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan-500/40" />

      {/* Subtle top indicator bar */}
      <div
        className={cn(
          'absolute top-0 left-4 right-4 h-[1px] opacity-40 transition-opacity group-hover:opacity-100',
          accent === 'cyan' && 'bg-gradient-to-r from-transparent via-cyan-400 to-transparent',
          accent === 'blue' && 'bg-gradient-to-r from-transparent via-blue-400 to-transparent',
          accent === 'emerald' && 'bg-gradient-to-r from-transparent via-emerald-400 to-transparent',
          accent === 'amber' && 'bg-gradient-to-r from-transparent via-amber-400 to-transparent',
          accent === 'red' && 'bg-gradient-to-r from-transparent via-red-500 to-transparent',
          accent === 'purple' && 'bg-gradient-to-r from-transparent via-purple-400 to-transparent'
        )}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon && (
            <div className={cn('p-1.5 rounded-md bg-slate-900/90 border border-slate-800', titleColor)}>
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase">
                {title}
              </span>
              {badge && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {badge}
                </span>
              )}
            </div>
          </div>
        </div>

        {statusText && (
          <StatusBadge status={statusText} variant={statusVariant} size="sm" />
        )}
      </div>

      {/* Primary Value Readout */}
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold font-mono tracking-tight text-white group-hover:text-cyan-100 transition-colors">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-mono font-medium text-slate-400">
            {unit}
          </span>
        )}
      </div>

      {/* Subtitle / Micro status */}
      {subtitle && (
        <p className="mt-1 text-xs text-slate-400 font-sans line-clamp-1">
          {subtitle}
        </p>
      )}

      {/* Slot for charts or additional telemetry */}
      {children && (
        <div className="mt-4 pt-3 border-t border-slate-800/60">
          {children}
        </div>
      )}
    </div>
  );
}
