'use client';

import React from 'react';
import { IcingRiskCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { StatusBadge } from './status-badge';
import { ShieldAlert, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface RiskGaugeProps {
  score: number; // 0 - 100
  category: IcingRiskCategory;
  confidence?: number; // e.g. 94%
  className?: string;
  size?: 'md' | 'lg';
}

export function RiskGauge({
  score,
  category,
  confidence = 94,
  className,
  size = 'md',
}: RiskGaugeProps) {
  // Clamp score
  const safeScore = Math.max(0, Math.min(100, score));

  // Visual parameters for semi-circular radial gauge
  const radius = size === 'lg' ? 84 : 70;
  const strokeWidth = size === 'lg' ? 14 : 11;
  const circumference = Math.PI * radius; // 180 degree semi-circle
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  const colorConfig = {
    LOW: {
      color: '#10b981',
      gradientId: 'gauge-green',
      shadow: 'rgba(16,185,129,0.35)',
      badgeVariant: 'safe' as const,
      textColor: 'text-emerald-400',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      tag: 'NOMINAL CONDITIONS',
    },
    MODERATE: {
      color: '#eab308',
      gradientId: 'gauge-yellow',
      shadow: 'rgba(234,179,8,0.35)',
      badgeVariant: 'moving' as const,
      textColor: 'text-yellow-400',
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      tag: 'ELEVATED MONITORING',
    },
    HIGH: {
      color: '#f97316',
      gradientId: 'gauge-orange',
      shadow: 'rgba(249,115,22,0.4)',
      badgeVariant: 'high' as const,
      textColor: 'text-orange-400',
      icon: <AlertTriangle className="w-5 h-5 text-orange-400" />,
      tag: 'PRE-EMPTIVE ACTION RECOMMENDED',
    },
    CRITICAL: {
      color: '#ef4444',
      gradientId: 'gauge-red',
      shadow: 'rgba(239,68,68,0.5)',
      badgeVariant: 'critical' as const,
      textColor: 'text-red-400',
      icon: <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />,
      tag: 'ACTIVE ACCRETION RISK',
    },
  }[category];

  const svgWidth = radius * 2 + strokeWidth * 2 + 20;
  const svgHeight = radius + strokeWidth + 20;

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center p-6 rounded-xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl',
        className
      )}
    >
      {/* Corner HUD markers */}
      <div className="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-cyan-500/40" />
      <div className="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-cyan-500/40" />
      <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-cyan-500/40" />
      <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-cyan-500/40" />

      {/* Header labels */}
      <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
        <span className="flex items-center gap-1.5 uppercase tracking-wider text-slate-300">
          {colorConfig.icon}
          <span>ICING RISK ESTIMATION</span>
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60 text-cyan-400 font-mono">
          MODEL CONFIDENCE: {confidence}%
        </span>
      </div>

      {/* SVG Radial Semi-Circle */}
      <div className="relative mt-2 flex items-center justify-center">
        <svg
          width={svgWidth}
          height={svgHeight}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="gauge-track" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            <linearGradient id="gauge-green" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            <linearGradient id="gauge-yellow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="60%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            <linearGradient id="gauge-orange" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>

            <linearGradient id="gauge-red" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>

            <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background track arc */}
          <path
            d={`M ${strokeWidth + 10} ${radius + strokeWidth} A ${radius} ${radius} 0 0 1 ${svgWidth - strokeWidth - 10} ${radius + strokeWidth}`}
            fill="none"
            stroke="url(#gauge-track)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active colored arc */}
          <path
            d={`M ${strokeWidth + 10} ${radius + strokeWidth} A ${radius} ${radius} 0 0 1 ${svgWidth - strokeWidth - 10} ${radius + strokeWidth}`}
            fill="none"
            stroke={`url(#${colorConfig.gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            filter="url(#gauge-glow)"
            className="transition-all duration-700 ease-out"
          />

          {/* Scale tick marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = Math.PI - (tick / 100) * Math.PI;
            const innerR = radius - strokeWidth / 2 - 6;
            const outerR = radius - strokeWidth / 2 - 2;
            const cx = svgWidth / 2;
            const cy = radius + strokeWidth;
            const x1 = cx + innerR * Math.cos(angle);
            const y1 = cy - innerR * Math.sin(angle);
            const x2 = cx + outerR * Math.cos(angle);
            const y2 = cy - outerR * Math.sin(angle);
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#64748b"
                strokeWidth="1.5"
                opacity="0.6"
              />
            );
          })}
        </svg>

        {/* Center Readout Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 text-center">
          <span className="text-4xl font-extrabold font-mono tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]">
            {safeScore}
            <span className="text-xl font-normal text-slate-400 ml-0.5">%</span>
          </span>
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mt-0.5">
            RISK INDEX
          </span>
        </div>
      </div>

      {/* Category Pill and Subtitle */}
      <div className="mt-4 flex flex-col items-center gap-1.5 w-full">
        <StatusBadge
          status={`RISK LEVEL: ${category}`}
          variant={colorConfig.badgeVariant}
          size="lg"
          className="font-mono tracking-wider px-4 py-1"
        />

        <div className="text-[11px] font-mono text-slate-400 mt-1 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>{colorConfig.tag}</span>
        </div>

        {/* Mandatory Prototype Disclaimer Label */}
        <div className="mt-3 px-3 py-1 rounded bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-slate-400 text-center">
          Prototype Rule-Based Risk Estimation
        </div>
      </div>
    </div>
  );
}
