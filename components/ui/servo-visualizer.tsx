'use client';

import React from 'react';
import { CoverStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { StatusBadge } from './status-badge';
import { Radio, ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';

interface ServoVisualizerProps {
  position: number; // 0 to 180
  status: CoverStatus;
  className?: string;
  isMoving?: boolean;
}

export function ServoVisualizer({
  position,
  status,
  className,
  isMoving = false,
}: ServoVisualizerProps) {
  const clampedAngle = Math.max(0, Math.min(180, position));

  // Determine coverage percentage: 0° is 0% covered, 180° is 100% covered
  const coverPct = Math.round((clampedAngle / 180) * 100);

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-between p-5 rounded-xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl',
        className
      )}
    >
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan-500/40" />
      <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan-500/40" />
      <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan-500/40" />
      <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan-500/40" />

      {/* Top Header */}
      <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
        <span className="flex items-center gap-1.5 uppercase text-slate-300">
          <Radio className="w-4 h-4 text-cyan-400" />
          <span>RADOME PROTECTIVE COVER</span>
        </span>
        <StatusBadge
          status={status}
          variant={status === 'CLOSED' ? 'closed' : status === 'OPEN' ? 'open' : 'moving'}
          size="sm"
        />
      </div>

      {/* 2D Schematic Visualizer */}
      <div className="relative w-full h-44 flex items-center justify-center my-2">
        <svg viewBox="0 0 240 160" className="w-full h-full max-w-[260px] overflow-visible">
          <defs>
            <linearGradient id="dish-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="cover-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
            <filter id="shield-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Pedestal / Ground Base */}
          <rect x="95" y="130" width="50" height="18" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
          <line x1="80" y1="148" x2="160" y2="148" stroke="#475569" strokeWidth="2" />
          <line x1="120" y1="95" x2="120" y2="130" stroke="#0ea5e9" strokeWidth="4" />

          {/* Parabolic Antenna Dish Base (Stationary) */}
          <path
            d="M 50 95 Q 120 125 190 95"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 55 95 Q 120 120 185 95"
            fill="url(#dish-grad)"
            opacity="0.3"
          />

          {/* Feed Horn Stanchion */}
          <line x1="120" y1="108" x2="120" y2="60" stroke="#94a3b8" strokeWidth="2" strokeDasharray="2 2" />
          <polygon points="115,60 125,60 120,50" fill="#38bdf8" />
          <circle cx="120" cy="50" r="3" fill="#22d3ee" className="animate-pulse" />

          {/* Degree Arc Track */}
          <path
            d="M 40 95 A 80 80 0 0 1 200 95"
            fill="none"
            stroke="#1e293b"
            strokeWidth="6"
            strokeDasharray="4 4"
          />

          {/* Motorized Cover Shutter Dome */}
          {/* Rotates from 0° (tucked at 40,95) to 180° (arching completely over dish) */}
          <g
            style={{
              transformOrigin: '120px 95px',
              transform: `rotate(${clampedAngle - 90}deg)`,
              transition: isMoving ? 'transform 0.1s linear' : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Actuator arm */}
            <line x1="120" y1="95" x2="120" y2="20" stroke="#a855f7" strokeWidth="2.5" />
            <circle cx="120" cy="20" r="5" fill="#c084fc" filter="url(#shield-glow)" />

            {/* Protective Shutter Visor Arc */}
            <path
              d="M 50 95 A 75 75 0 0 1 120 20"
              fill="none"
              stroke="#a855f7"
              strokeWidth="5"
              strokeLinecap="round"
              filter="url(#shield-glow)"
              opacity={coverPct > 10 ? 0.9 : 0.2}
            />
          </g>

          {/* Central Servo Motor Gear */}
          <circle cx="120" cy="95" r="10" fill="#0f172a" stroke="#a855f7" strokeWidth="2.5" />
          <circle cx="120" cy="95" r="4" fill="#c084fc" />

          {/* Angle Tick Indicators */}
          <text x="35" y="110" fill="#64748b" fontSize="8" fontFamily="monospace">0° (OPEN)</text>
          <text x="120" y="14" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">90° (VENT)</text>
          <text x="205" y="110" fill="#64748b" fontSize="8" fontFamily="monospace">180° (SEALED)</text>
        </svg>

        {/* Live Angle Floating Pill */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-purple-950/70 border border-purple-800/60 text-purple-300 font-mono text-[10px]">
          ANGLE: {clampedAngle}°
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-400 flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5 text-slate-500" />
          <span>SERVO PIN 18</span>
        </span>
        <span className="text-cyan-400 font-semibold">
          {coverPct}% PROTECTED
        </span>
      </div>
    </div>
  );
}
