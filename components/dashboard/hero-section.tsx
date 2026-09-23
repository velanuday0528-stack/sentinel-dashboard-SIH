'use client';

import React from 'react';
import { useSentinel } from '@/context/sentinel-context';
import { 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  Radio, 
  CheckCircle2, 
  ArrowRight, 
  Terminal, 
  Play, 
  Layers,
  ThermometerSnowflake,
  Cpu
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';

export function HeroSection() {
  const { setActiveTab, setScenarioModalOpen, telemetry } = useSentinel();

  const workflowSteps = [
    { num: '01', title: 'SENSE', desc: 'DHT11, Moisture, Ultrasonic, MQ-2, Flame' },
    { num: '02', title: 'ANALYSE', desc: 'Prototype Rule-Based Risk Engine (0–100)' },
    { num: '03', title: 'DECIDE', desc: 'Safety Interlocks & Closed-Loop Logic' },
    { num: '04', title: 'ACTUATE', desc: 'Relay Heater & 180° Radome Servo' },
    { num: '05', title: 'VERIFY', desc: 'Continuous Sensor Feedback Loop' },
    { num: '06', title: 'REPORT', desc: 'Real-time Alerts & Immutable Event Logs' },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-slate-950/90 via-slate-900/60 to-slate-950/90 p-6 lg:p-8 backdrop-blur-2xl shadow-2xl mb-8">
      {/* Decorative High-Altitude Grid & Cybernetic Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

      {/* Glowing Ambient Orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Main Pitch */}
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 uppercase font-semibold">
              Aerospace & Defense-Tech Prototype
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider bg-blue-950/80 border border-blue-500/40 text-blue-300 uppercase">
              Ladakh Extreme Altitude Testbed (5,360m ASL)
            </span>
            <StatusBadge status="PROTOTYPE SIMULATION" variant="info" size="sm" />
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono tracking-tight text-white leading-tight">
            SENTINEL protects critical antenna infrastructure against extreme environmental conditions.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed max-w-2xl">
            An intelligent closed-loop platform for environmental monitoring, icing-risk estimation, automated anti-icing response, and safety protection.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
            <button
              onClick={() => setScenarioModalOpen(true)}
              className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 group cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>RUN DEMO SCENARIO</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => setActiveTab('anti-icing')}
              className="px-4 py-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-200 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Anti-Icing Controls</span>
            </button>

            <button
              onClick={() => setActiveTab('environmental')}
              className="px-4 py-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 text-slate-200 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ThermometerSnowflake className="w-4 h-4 text-cyan-400" />
              <span>Sensor Telemetry</span>
            </button>
          </div>
        </div>

        {/* Live Hardware Node HUD Card */}
        <div className="w-full lg:w-80 shrink-0 p-4 rounded-xl border border-slate-800 bg-slate-950/80 backdrop-blur-md font-mono text-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
            <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>TELEMETRY NODE</span>
            </span>
            <span className="text-cyan-400 font-semibold">ESP32-WROOM</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">TEMP / HUM</span>
              <span className="text-white font-bold">{telemetry.temperature}°C / {telemetry.humidity}%</span>
            </div>
            <div className="p-2 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">ICING RISK</span>
              <span className={telemetry.icingRiskLevel === 'CRITICAL' ? 'text-red-400 font-bold' : telemetry.icingRiskLevel === 'HIGH' ? 'text-orange-400 font-bold' : 'text-emerald-400 font-bold'}>
                {telemetry.icingRiskScore}% ({telemetry.icingRiskLevel})
              </span>
            </div>
            <div className="p-2 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">HEATER RELAY</span>
              <span className={telemetry.heaterStatus ? 'text-orange-400 font-bold animate-pulse' : 'text-slate-400'}>
                {telemetry.heaterStatus ? `ON (${telemetry.heaterDutyCycle}%)` : 'STANDBY'}
              </span>
            </div>
            <div className="p-2 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">RADOME COVER</span>
              <span className="text-cyan-400 font-bold">{telemetry.servoPosition}° ({telemetry.protectiveCover})</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>Uptime: 99.85%</span>
            <span className="text-emerald-400">Heartbeat: Nominal</span>
          </div>
        </div>
      </div>

      {/* The 3 Core Pillars: Predict, Protect, Verify */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
        <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 backdrop-blur-md space-y-2 hover:border-cyan-500/40 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold font-mono text-white tracking-wide">
            1. Predict
          </h3>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Detect environmental conditions before icing becomes critical using rule-based sub-zero humidity, freezing sleet, and ultrasonic accretion metrics.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 backdrop-blur-md space-y-2 hover:border-orange-500/40 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-orange-950/80 border border-orange-800/60 flex items-center justify-center text-orange-400">
            <Flame className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold font-mono text-white tracking-wide">
            2. Protect
          </h3>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Activate heating simulation and protective mechanisms automatically with 180° motorized radome sealing and instant multi-sensor safety interlocks.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 backdrop-blur-md space-y-2 hover:border-emerald-500/40 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold font-mono text-white tracking-wide">
            3. Verify
          </h3>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Monitor system response and record every event in an immutable forensic audit log with exportable CSV diagnostics and telemetry verification.
          </p>
        </div>
      </div>

      {/* Closed-Loop Workflow Visualizer */}
      <div className="mt-6 pt-6 border-t border-slate-800/80">
        <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>CLOSED-LOOP OPERATIONAL WORKFLOW</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {workflowSteps.map((step, idx) => (
            <div
              key={step.num}
              className="relative p-2.5 rounded-lg border border-slate-800/80 bg-slate-950/70 text-left font-mono"
            >
              <div className="text-[10px] text-cyan-500/80 font-bold">{step.num}</div>
              <div className="text-xs font-bold text-white tracking-wider mt-0.5">{step.title}</div>
              <div className="text-[10px] text-slate-400 font-sans line-clamp-1 mt-1">{step.desc}</div>
              {idx < workflowSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-20 text-slate-600">
                  ›
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
