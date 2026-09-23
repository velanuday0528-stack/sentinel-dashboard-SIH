'use client';

import React from 'react';
import { useSentinel } from '@/context/sentinel-context';
import { RiskGauge } from '@/components/ui/risk-gauge';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  Sparkles, 
  Thermometer, 
  Droplets, 
  Waves, 
  Ruler, 
  Info, 
  ShieldAlert, 
  ArrowRight, 
  Calculator,
  CheckCircle2
} from 'lucide-react';

export function IcingRiskView() {
  const { telemetry, riskBreakdown, setActiveTab } = useSentinel();

  // Weighted contributions
  const tempWeighted = Math.round(riskBreakdown.temperatureRisk * 0.35);
  const humWeighted = Math.round(riskBreakdown.humidityRisk * 0.30);
  const moistWeighted = Math.round(riskBreakdown.moistureRisk * 0.25);
  const accumWeighted = Math.round(riskBreakdown.surfaceAccumulationRisk * 0.10);

  const factorCards = [
    {
      name: 'Temperature Factor',
      weight: '35%',
      rawScore: riskBreakdown.temperatureRisk,
      weightedScore: tempWeighted,
      value: `${telemetry.temperature}°C`,
      status: telemetry.temperature > 5 ? 'Low' : telemetry.temperature >= 0 ? 'Moderate' : telemetry.temperature >= -10 ? 'High' : 'Very High',
      color: 'border-blue-500/40 text-blue-400 bg-blue-950/20',
      icon: <Thermometer className="w-4 h-4 text-blue-400" />,
      rule: '>5°C: Low | 0-5°C: Mod | -10 to 0°C: High | <-10°C: Very High',
    },
    {
      name: 'Relative Humidity Factor',
      weight: '30%',
      rawScore: riskBreakdown.humidityRisk,
      weightedScore: humWeighted,
      value: `${telemetry.humidity}%`,
      status: telemetry.humidity < 60 ? 'Low' : telemetry.humidity <= 80 ? 'Moderate' : telemetry.humidity <= 90 ? 'High' : 'Very High',
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20',
      icon: <Droplets className="w-4 h-4 text-cyan-400" />,
      rule: '<60%: Low | 60-80%: Mod | 80-90%: High | >90%: Very High',
    },
    {
      name: 'Moisture Detection Factor',
      weight: '25%',
      rawScore: riskBreakdown.moistureRisk,
      weightedScore: moistWeighted,
      value: telemetry.moistureDetected ? 'WET DETECTED' : 'DRY',
      status: telemetry.moistureDetected ? 'High (Precipitation)' : 'Low (Dry)',
      color: telemetry.moistureDetected ? 'border-amber-500/40 text-amber-400 bg-amber-950/20' : 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
      icon: <Waves className="w-4 h-4" />,
      rule: 'Dry: Low (10) | Moisture Detected: High (90)',
    },
    {
      name: 'Surface Accretion Factor',
      weight: '10%',
      rawScore: riskBreakdown.surfaceAccumulationRisk,
      weightedScore: accumWeighted,
      value: `${telemetry.surfaceAccumulation} mm`,
      status: telemetry.surfaceAccumulation < 1.0 ? 'Low' : telemetry.surfaceAccumulation <= 5.0 ? 'Warning' : 'High',
      color: 'border-purple-500/40 text-purple-400 bg-purple-950/20',
      icon: <Ruler className="w-4 h-4 text-purple-400" />,
      rule: 'No change: Low | Moderate delta: Warning | Large delta: High',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Disclaimer Alert Banner */}
      <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/30 backdrop-blur-md flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs font-mono text-slate-300 space-y-1">
          <div className="flex items-center gap-2">
            <strong className="text-cyan-300 font-bold uppercase tracking-wider">
              Prototype Rule-Based Risk Estimation Engine
            </strong>
            <span className="px-2 py-0.2 rounded bg-slate-900 text-slate-400 text-[10px] border border-slate-700">
              Heuristic Model v1.2
            </span>
          </div>
          <p className="text-slate-400 font-sans leading-relaxed">
            This estimation uses a conceptual multi-criteria decision formula designed for demonstration purposes. It does not replace certified meteorological icing prediction systems or wind-tunnel validated aerodynamic software.
          </p>
        </div>
      </div>

      {/* Top Main Section: Gauge & Conceptual Formula */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Gauge Card */}
        <RiskGauge
          score={telemetry.icingRiskScore}
          category={telemetry.icingRiskLevel}
          confidence={riskBreakdown.confidencePercentage}
          size="lg"
          className="lg:col-span-1"
        />

        {/* Conceptual Mathematical Formulation Card */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
            <span className="flex items-center gap-2 text-slate-200 uppercase font-semibold">
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span>ALGORITHM SPECIFICATION & BREAKDOWN</span>
            </span>
            <span className="text-cyan-400 font-mono">
              TOTAL SCORE: <strong className="text-white text-base">{telemetry.icingRiskScore}</strong> / 100
            </span>
          </div>

          {/* Mathematical Formula Banner */}
          <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/90 font-mono text-xs text-cyan-300 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Conceptual Equation:</div>
            <code className="block p-2.5 rounded bg-black/60 border border-slate-800 text-white font-mono text-sm overflow-x-auto">
              icingRiskScore = (temperatureRisk × 0.35) + (humidityRisk × 0.30) + (moistureRisk × 0.25) + (surfaceAccumulationRisk × 0.10)
            </code>
            <div className="text-[11px] text-slate-400 font-sans">
              Weighted summation combining thermodynamic supercooling, atmospheric water vapor saturation, direct liquid precipitation detection, and ultrasonic surface accretion.
            </div>
          </div>

          {/* Stacked Contribution Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>CONTRIBUTION STACK</span>
              <span>{tempWeighted} + {humWeighted} + {moistWeighted} + {accumWeighted} = {telemetry.icingRiskScore}%</span>
            </div>

            <div className="w-full h-5 rounded-md overflow-hidden flex border border-slate-800 bg-slate-900">
              <div
                style={{ width: `${(tempWeighted / Math.max(1, telemetry.icingRiskScore)) * 100}%` }}
                className="bg-blue-500 h-full flex items-center justify-center text-[10px] font-mono text-white font-bold"
                title={`Temperature: ${tempWeighted} pts`}
              >
                {tempWeighted > 5 && `${tempWeighted}pt`}
              </div>
              <div
                style={{ width: `${(humWeighted / Math.max(1, telemetry.icingRiskScore)) * 100}%` }}
                className="bg-cyan-500 h-full flex items-center justify-center text-[10px] font-mono text-slate-950 font-bold"
                title={`Humidity: ${humWeighted} pts`}
              >
                {humWeighted > 5 && `${humWeighted}pt`}
              </div>
              <div
                style={{ width: `${(moistWeighted / Math.max(1, telemetry.icingRiskScore)) * 100}%` }}
                className="bg-amber-500 h-full flex items-center justify-center text-[10px] font-mono text-slate-950 font-bold"
                title={`Moisture: ${moistWeighted} pts`}
              >
                {moistWeighted > 5 && `${moistWeighted}pt`}
              </div>
              <div
                style={{ width: `${(accumWeighted / Math.max(1, telemetry.icingRiskScore)) * 100}%` }}
                className="bg-purple-500 h-full flex items-center justify-center text-[10px] font-mono text-white font-bold"
                title={`Accretion: ${accumWeighted} pts`}
              >
                {accumWeighted > 2 && `${accumWeighted}pt`}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400 pt-1">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-500" /> Temperature (35%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-cyan-500" /> Humidity (30%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> Moisture (25%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-purple-500" /> Surface Delta (10%)</span>
            </div>
          </div>

          {/* Action Recommendation Box */}
          <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                SYSTEM RECOMMENDATION
              </span>
              <button
                onClick={() => setActiveTab('anti-icing')}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Go to Anti-Icing Control</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-slate-200 font-sans">
              {riskBreakdown.recommendedAction}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Factor Cards Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {factorCards.map((f) => (
          <div
            key={f.name}
            className={`p-4 rounded-xl border bg-slate-950/70 backdrop-blur-md space-y-3 ${f.color}`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                {f.icon}
                <span>{f.name}</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px]">
                Wt: {f.weight}
              </span>
            </div>

            <div>
              <div className="text-2xl font-bold font-mono text-white">
                {f.value}
              </div>
              <div className="text-xs font-mono text-cyan-400 font-semibold mt-0.5">
                Category: {f.status}
              </div>
            </div>

            <div className="p-2 rounded bg-slate-900/80 border border-slate-800/80 text-[11px] font-mono space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Raw Factor Risk:</span>
                <span className="text-white font-semibold">{f.rawScore} / 100</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Weighted Contribution:</span>
                <span className="text-cyan-300 font-bold">+{f.weightedScore} pts</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 font-mono leading-tight">
              Logic: {f.rule}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
