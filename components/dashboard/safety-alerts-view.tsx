'use client';

import React, { useState } from 'react';
import { useSentinel } from '@/context/sentinel-context';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Flame, 
  Wind, 
  Check, 
  Filter, 
  Plus, 
  RotateCcw,
  Bell
} from 'lucide-react';
import { AlertSeverity } from '@/lib/types';

export function SafetyAlertsView() {
  const {
    alerts,
    acknowledgeAlert,
    resolveAlert,
    clearResolvedAlerts,
    telemetry,
    resetEmergencyShutdown
  } = useSentinel();

  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  // Filter alerts
  const filteredAlerts = alerts.filter(a => {
    if (selectedSeverity === 'ALL') return true;
    return a.severity === selectedSeverity;
  });

  const unresolvedCount = alerts.filter(a => !a.resolved).length;
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL' && !a.resolved).length;

  return (
    <div className="space-y-6">
      {/* Red Emergency Banner (Active if Fire or Gas is triggered) */}
      {(telemetry.fireDetected || telemetry.gasLevel > 2500 || telemetry.emergencyShutdown) && (
        <div className="relative overflow-hidden rounded-xl border border-red-500/80 bg-red-950/80 p-5 shadow-[0_0_35px_rgba(239,68,68,0.4)] backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-red-900 border border-red-500 text-white animate-pulse">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-red-300 uppercase font-bold">
                  MASTER SAFETY INTERLOCK TRIPPED
                </span>
                <h3 className="text-base font-bold font-mono text-white">
                  {telemetry.fireDetected
                    ? 'EMERGENCY: Active Flame / Combustion Tripped on Radome Enclosure!'
                    : telemetry.gasLevel > 2500
                    ? `EMERGENCY: Combustible Gas Leak (${telemetry.gasLevel} ADC) Exceeds Safety Limit!`
                    : 'EMERGENCY SHUTDOWN ENGAGED: Thermal Relays De-energized'}
                </h3>
                <p className="text-xs text-red-200 font-sans mt-0.5">
                  Automated safety interlocks have isolated all heating relays and locked radome vents into 90° safe ventilation mode.
                </p>
              </div>
            </div>

            <button
              onClick={resetEmergencyShutdown}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-red-900/40 whitespace-nowrap cursor-pointer"
            >
              CLEAR EMERGENCY LATCH
            </button>
          </div>
        </div>
      )}

      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 uppercase font-semibold">
              Mission Safety Center
            </span>
            <span className="text-xs font-mono text-slate-400">
              Active Interlocks & Prioritized Triage
            </span>
          </div>
          <h2 className="text-xl font-bold font-mono tracking-wide text-white mt-1">
            Real-Time Safety & Alert Management
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Continuous threat surveillance monitoring thermal over-temperature, freezing rime accumulation, combustible gas, and communication integrity.
          </p>
        </div>

        {/* Severity Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'CRITICAL', 'HIGH', 'WARNING', 'INFO'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-all border cursor-pointer ${
                selectedSeverity === sev
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {sev}
            </button>
          ))}

          {alerts.some(a => a.resolved) && (
            <button
              onClick={clearResolvedAlerts}
              className="px-2.5 py-1.5 rounded text-xs font-mono bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 cursor-pointer"
            >
              Clear Resolved
            </button>
          )}
        </div>
      </div>

      {/* Alerts Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/70">
          <span className="text-slate-500 block text-[10px]">TOTAL ALERTS</span>
          <span className="text-xl font-bold text-white">{alerts.length}</span>
        </div>
        <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/70">
          <span className="text-slate-500 block text-[10px]">UNRESOLVED</span>
          <span className={`text-xl font-bold ${unresolvedCount > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
            {unresolvedCount}
          </span>
        </div>
        <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/70">
          <span className="text-slate-500 block text-[10px]">CRITICAL THREATS</span>
          <span className={`text-xl font-bold ${criticalCount > 0 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
            {criticalCount}
          </span>
        </div>
        <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/70">
          <span className="text-slate-500 block text-[10px]">SAFETY INTERLOCK</span>
          <span className={`text-xl font-bold ${telemetry.emergencyShutdown ? 'text-red-400' : 'text-emerald-400'}`}>
            {telemetry.emergencyShutdown ? 'TRIPPED' : 'ARMED'}
          </span>
        </div>
      </div>

      {/* Alert Feed List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-slate-800 bg-slate-950/60 font-mono text-slate-500 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No matching alerts in queue.</p>
            <p className="text-xs">All environmental safety thresholds are currently nominal.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'CRITICAL';
            const isHigh = alert.severity === 'HIGH';
            const isWarning = alert.severity === 'WARNING';

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-xl border transition-all ${
                  alert.resolved
                    ? 'border-slate-800/60 bg-slate-950/40 opacity-60'
                    : isCritical
                    ? 'border-red-500/70 bg-red-950/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                    : isHigh
                    ? 'border-orange-500/60 bg-orange-950/20'
                    : isWarning
                    ? 'border-amber-500/50 bg-amber-950/15'
                    : 'border-slate-800 bg-slate-950/80'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={alert.severity} size="sm" />
                      <span className="text-[10px] font-mono text-slate-500">ID: {alert.id}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[10px] font-mono text-slate-400">{alert.timestamp}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[10px] font-mono text-cyan-400">Source: {alert.sensorSource}</span>
                      {alert.acknowledged && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800">
                          ACKNOWLEDGED
                        </span>
                      )}
                      {alert.resolved && (
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                          RESOLVED
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold font-mono text-white">
                      {alert.title}
                    </h4>

                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {alert.description}
                    </p>

                    <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-400">
                      <strong className="text-slate-300">Recommended Operator Protocol:</strong> {alert.recommendedAction}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 font-mono text-xs shrink-0 self-end lg:self-center">
                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Acknowledge</span>
                      </button>
                    )}

                    {!alert.resolved && (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-3 py-1.5 rounded bg-emerald-950 hover:bg-emerald-900/80 border border-emerald-600/60 text-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Resolve</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
