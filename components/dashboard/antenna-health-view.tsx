'use client';

import React from 'react';
import { useSentinel } from '@/context/sentinel-context';
import { MetricCard } from '@/components/ui/metric-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  Radio, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Cpu, 
  AlertCircle, 
  Activity, 
  Layers, 
  Compass, 
  Calendar,
  Sparkles,
  Zap,
  CloudRain,
  WifiOff
} from 'lucide-react';

export function AntennaHealthView() {
  const { telemetry } = useSentinel();

  // Future RF parameters list with STRICT "RF sensor integration pending" badge
  const rfPlaceholders = [
    { name: 'VSWR (Voltage Standing Wave Ratio)', code: 'VSWR', desc: 'Impedance matching reflection' },
    { name: 'Return Loss (S11)', code: 'RL_S11', desc: 'Reflected power measurement (dB)' },
    { name: 'Received Signal Strength (RSSI)', code: 'RSSI', desc: 'Carrier signal strength (dBm)' },
    { name: 'Received Signal Quality (SINR)', code: 'SINR', desc: 'Signal to interference plus noise ratio' },
    { name: 'RF Path Attenuation', code: 'ATTN', desc: 'Atmospheric & dielectric insertion loss' },
  ];

  const roadmapItems = [
    {
      phase: 'Phase 1',
      title: 'NanoVNA / Embedded RF Directional Coupler',
      desc: 'Interface portable Vector Network Analyzer over SPI/UART to capture true empirical S11 return loss without interfering with communication links.',
      status: 'In Prototyping',
      icon: <Radio className="w-4 h-4 text-cyan-400" />,
    },
    {
      phase: 'Phase 2',
      title: 'Multi-Point PT100 Surface Thermistors',
      desc: 'Deploy 4-wire RTD surface thermistors directly across the parabolic reflector face and sub-reflector feed assembly.',
      status: 'Hardware Selected',
      icon: <Activity className="w-4 h-4 text-blue-400" />,
    },
    {
      phase: 'Phase 3',
      title: 'Industrial PTC Conductive Heating Elements',
      desc: 'Upgrade relay simulation to closed-loop pulse-width modulated (PWM) PTC ceramic thermal jackets rated for -50°C military standards.',
      status: 'Schematic Ready',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
    },
    {
      phase: 'Phase 4',
      title: 'Micro-Weather API & Meso-scale Forecasts',
      desc: 'Incorporate live Indian Meteorological Department (IMD) Ladakh regional feeds and ECMWF high-altitude numerical models.',
      status: 'API Spec Drafted',
      icon: <CloudRain className="w-4 h-4 text-emerald-400" />,
    },
    {
      phase: 'Phase 5',
      title: 'Dual-Redundant Cloud Telemetry (Iridium / LTE)',
      desc: 'Failover satellite modem integration ensures zero data drop during severe blizzards when terrestrial cellular towers freeze.',
      status: 'Planned',
      icon: <Cpu className="w-4 h-4 text-purple-400" />,
    },
    {
      phase: 'Phase 6',
      title: 'Physics-Informed Predictive Neural Network',
      desc: 'Train an edge ML model on atmospheric supercooling dynamics to initiate pre-nucleation heating 40 minutes ahead of blizzard strikes.',
      status: 'Research Phase',
      icon: <Sparkles className="w-4 h-4 text-pink-400" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 uppercase font-semibold">
              Asset ID: STNL-LDK-704
            </span>
            <span className="text-xs font-mono text-slate-400">
              High-Altitude Defense & Telecom Radome
            </span>
          </div>
          <h2 className="text-xl font-bold font-mono tracking-wide text-white mt-1">
            Antenna Physical Infrastructure & RF Readiness
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Hardware health diagnostics, physical surface status, and pending RF coupling integration roadmap.
          </p>
        </div>

        <StatusBadge
          status="ASSET HEALTHY"
          variant="safe"
          size="md"
        />
      </div>

      {/* Infrastructure Telemetry Specs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 backdrop-blur-md space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] uppercase tracking-wider">INSTALLATION LOCATION</span>
          </div>
          <div className="text-base font-bold text-white">Chang La Pass, Ladakh</div>
          <div className="text-[11px] text-slate-400">Coordinates: 34.0478° N, 77.9304° E | 5,360m ASL</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 backdrop-blur-md space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Compass className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] uppercase tracking-wider">ENVIRONMENTAL EXPOSURE</span>
          </div>
          <div className="text-base font-bold text-cyan-300">Alpine Sub-Zero Grade 4</div>
          <div className="text-[11px] text-slate-400">Extreme rime ice, gale winds up to 140 km/h</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 backdrop-blur-md space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] uppercase tracking-wider">LAST MAINTENANCE</span>
          </div>
          <div className="text-base font-bold text-white">2026-08-15</div>
          <div className="text-[11px] text-slate-400">Scheduled Inspection: Bi-annual Alpine Protocol</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 backdrop-blur-md space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] uppercase tracking-wider">SYSTEM UPTIME</span>
          </div>
          <div className="text-base font-bold text-emerald-400">99.85% Nominal</div>
          <div className="text-[11px] text-slate-400">Zero uncommanded power interrupts (3,420 hrs)</div>
        </div>
      </div>

      {/* Surface Condition & Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 backdrop-blur-md space-y-1.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">SURFACE CONDITION</span>
          <div className="text-lg font-bold text-white">
            {telemetry.surfaceAccumulation > 5 ? 'Accumulated Rime Frost' : telemetry.surfaceAccumulation > 0 ? 'Thin Frost Nucleation' : 'Clear & Unobstructed'}
          </div>
          <span className="text-[11px] text-slate-400">Estimated Depth: {telemetry.surfaceAccumulation} mm</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 backdrop-blur-md space-y-1.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">PROTECTIVE COVER POSITION</span>
          <div className="text-lg font-bold text-purple-400">
            {telemetry.servoPosition}° ({telemetry.protectiveCover})
          </div>
          <span className="text-[11px] text-slate-400">Actuator: Servo Pin 18</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 backdrop-blur-md space-y-1.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">MOISTURE EXPOSURE</span>
          <div className={`text-lg font-bold ${telemetry.moistureDetected ? 'text-amber-400' : 'text-emerald-400'}`}>
            {telemetry.moistureDetected ? 'ACTIVE MOISTURE ON FEED' : 'NOMINAL DRY SURFACE'}
          </div>
          <span className="text-[11px] text-slate-400">Sensor: Analog Grid (ADC {telemetry.waterRawValue})</span>
        </div>
      </div>

      {/* SECTION: Future RF Parameters (Strictly marked "RF sensor integration pending") */}
      <div className="p-6 rounded-xl border border-dashed border-slate-800 bg-slate-950/60 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              <WifiOff className="w-5 h-5 text-amber-400/80" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-mono text-white tracking-wide">
                  RF Telemetry Layer (Coupler & Reflectometer)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/80 border border-amber-500/50 text-amber-300 font-bold uppercase">
                  RF SENSOR INTEGRATION PENDING
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Physical RF sensors (NanoVNA / directional couplers) are scheduled for Phase 1 hardware integration. No synthetic RF data is generated.
              </p>
            </div>
          </div>
        </div>

        {/* 5 RF Parameter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
          {rfPlaceholders.map((rf) => (
            <div
              key={rf.code}
              className="p-4 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/60 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider">
                  <span>{rf.code}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                </div>
                <h4 className="text-xs font-bold text-slate-300 mt-1 line-clamp-1">
                  {rf.name}
                </h4>
                <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                  {rf.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-800/80">
                <span className="text-xs font-semibold text-zinc-400 block font-mono">
                  Not Connected
                </span>
                <span className="text-[9px] text-amber-500/90 font-mono tracking-wider uppercase">
                  Pending Integration
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Explicit Honest Engineering Note */}
        <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs font-mono text-slate-400 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Honest Engineering Prototype Disclaimer:</strong> The current demonstration console interfaces environmental sensors (DHT11, Ultrasonic, MQ-2, Flame, PIR, Water) and relays. Direct RF parameter acquisition requires calibration with certified inline couplers.
          </span>
        </div>
      </div>

      {/* Future Integration Roadmap */}
      <div className="p-6 rounded-xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl space-y-4">
        <div className="pb-3 border-b border-slate-800">
          <h3 className="text-base font-bold font-mono tracking-wide text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Future Hardware & Intelligence Integration Roadmap</span>
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Planned phased expansion to advance the SENTINEL prototype from TRL 4 (Laboratory / Bench Validation) to TRL 7 (Field Prototyping in Ladakh).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          {roadmapItems.map((item) => (
            <div
              key={item.title}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-colors space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                    {item.phase}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-300">
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    {item.icon}
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">
                    {item.title}
                  </h4>
                </div>

                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/60 text-[10px] text-slate-500 flex items-center justify-between">
                <span>Target: Q3 2026</span>
                <span className="text-cyan-400">ELECTRONAUTS R&D</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
