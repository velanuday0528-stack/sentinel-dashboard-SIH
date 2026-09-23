'use client';

import React, { useState, useId } from 'react';
import { cn } from '@/lib/utils';

interface DataPoint {
  label: string;
  value: number;
}

interface TrendChartProps {
  data: DataPoint[];
  color?: 'cyan' | 'blue' | 'amber' | 'emerald' | 'red' | 'purple';
  height?: number;
  unit?: string;
  threshold?: number;
  thresholdLabel?: string;
  minVal?: number;
  maxVal?: number;
  showGrid?: boolean;
  className?: string;
}

export function TrendChart({
  data,
  color = 'cyan',
  height = 90,
  unit = '',
  threshold,
  thresholdLabel,
  minVal: forcedMin,
  maxVal: forcedMax,
  showGrid = true,
  className,
}: TrendChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const chartId = useId();

  if (!data || data.length < 2) {
    return (
      <div className="h-16 flex items-center justify-center text-xs text-slate-500 font-mono">
        Collecting telemetry samples...
      </div>
    );
  }

  const values = data.map(d => d.value);
  const computedMin = Math.min(...values);
  const computedMax = Math.max(...values);
  
  const min = forcedMin !== undefined ? forcedMin : Math.floor(computedMin - (computedMax === computedMin ? 5 : 2));
  const max = forcedMax !== undefined ? forcedMax : Math.ceil(computedMax + (computedMax === computedMin ? 5 : 2));
  const range = max - min || 1;

  const width = 300;
  const paddingY = 8;
  const chartHeight = height - paddingY * 2;

  // Generate SVG coordinates
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const normalizedY = 1 - (d.value - min) / range;
    const y = paddingY + normalizedY * chartHeight;
    return { x, y, value: d.value, label: d.label };
  });

  const linePath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  // Color mappings
  const colorMap = {
    cyan: {
      stroke: '#06b6d4',
      glow: 'rgba(6,182,212,0.3)',
      gradientStart: 'rgba(6,182,212,0.25)',
      gradientEnd: 'rgba(6,182,212,0.0)',
      text: 'text-cyan-400',
    },
    blue: {
      stroke: '#3b82f6',
      glow: 'rgba(59,130,246,0.3)',
      gradientStart: 'rgba(59,130,246,0.25)',
      gradientEnd: 'rgba(59,130,246,0.0)',
      text: 'text-blue-400',
    },
    amber: {
      stroke: '#f59e0b',
      glow: 'rgba(245,158,11,0.3)',
      gradientStart: 'rgba(245,158,11,0.25)',
      gradientEnd: 'rgba(245,158,11,0.0)',
      text: 'text-amber-400',
    },
    emerald: {
      stroke: '#10b981',
      glow: 'rgba(16,185,129,0.3)',
      gradientStart: 'rgba(16,185,129,0.25)',
      gradientEnd: 'rgba(16,185,129,0.0)',
      text: 'text-emerald-400',
    },
    red: {
      stroke: '#ef4444',
      glow: 'rgba(239,68,68,0.35)',
      gradientStart: 'rgba(239,68,68,0.3)',
      gradientEnd: 'rgba(239,68,68,0.0)',
      text: 'text-red-400',
    },
    purple: {
      stroke: '#a855f7',
      glow: 'rgba(168,85,247,0.3)',
      gradientStart: 'rgba(168,85,247,0.25)',
      gradientEnd: 'rgba(168,85,247,0.0)',
      text: 'text-purple-400',
    },
  }[color];

  // Calculate threshold line Y if applicable
  const thresholdY = threshold !== undefined 
    ? paddingY + (1 - (threshold - min) / range) * chartHeight
    : null;

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : points[points.length - 1];

  return (
    <div className={cn('relative w-full select-none', className)}>
      {/* Top micro readout */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colorMap.stroke }} />
          <span>{activePoint.label}</span>
        </span>
        <span className={cn('font-semibold', colorMap.text)}>
          {activePoint.value} {unit}
        </span>
      </div>

      <div className="relative w-full" style={{ height: `${height}px` }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            <linearGradient id={`grad-${chartId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorMap.gradientStart} />
              <stop offset="100%" stopColor={colorMap.gradientEnd} />
            </linearGradient>
            <filter id={`glow-${chartId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines */}
          {showGrid && (
            <g className="opacity-20">
              <line x1="0" y1={paddingY} x2={width} y2={paddingY} stroke="#94a3b8" strokeDasharray="3 3" />
              <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#94a3b8" strokeDasharray="3 3" />
              <line x1="0" y1={height - paddingY} x2={width} y2={height - paddingY} stroke="#94a3b8" strokeDasharray="3 3" />
            </g>
          )}

          {/* Critical Threshold Line */}
          {thresholdY !== null && thresholdY >= 0 && thresholdY <= height && (
            <g>
              <line
                x1="0"
                y1={thresholdY}
                x2={width}
                y2={thresholdY}
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="4 2"
                opacity="0.8"
              />
              {thresholdLabel && (
                <text
                  x={width - 4}
                  y={Math.max(12, thresholdY - 3)}
                  textAnchor="end"
                  fill="#f59e0b"
                  fontSize="8"
                  fontFamily="monospace"
                  opacity="0.8"
                >
                  {thresholdLabel} ({threshold}{unit})
                </text>
              )}
            </g>
          )}

          {/* Area Fill */}
          <path d={areaPath} fill={`url(#grad-${chartId})`} />

          {/* Glowing Line */}
          <path
            d={linePath}
            fill="none"
            stroke={colorMap.stroke}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#glow-${chartId})`}
          />

          {/* Interactive hover points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === i ? 4 : 2}
                fill={hoveredIdx === i ? '#ffffff' : colorMap.stroke}
                stroke={colorMap.stroke}
                strokeWidth="1.5"
                className="transition-all duration-100"
              />
              {/* Invisible wider hit target */}
              <rect
                x={p.x - width / data.length / 2}
                y="0"
                width={width / data.length}
                height={height}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Bottom Range Labels */}
      <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-1">
        <span>Min: {computedMin}{unit}</span>
        <span>Max: {computedMax}{unit}</span>
      </div>
    </div>
  );
}
