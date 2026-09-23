'use client';

import React, { useState } from 'react';
import { useSentinel } from '@/context/sentinel-context';
import { ServoVisualizer } from '@/components/ui/servo-visualizer';
import { StatusBadge } from '@/components/ui/status-badge';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { formatDuration } from '@/lib/utils';
import { 
  Flame, 
  Radio, 
  Sliders, 
  Power, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  Pause,
  Clock,
  Zap,
  Info
} from 'lucide-react';
import { OperatingMode } from '@/lib/types';

export function AntiIcingView() {
  const {
    telemetry,
    operatingMode,
    setOperatingMode,
    rules,
    manualHeaterToggle,
    manualSetServoPosition,
    manualOpenCover,
    manualCloseCover,
    manualStopServo,
    triggerEmergencyShutdown,
    resetEmergencyShutdown,
  } = useSentinel();

  // Confirmation modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    confirmLabel: string;
    severity: 'warning' | 'danger' | 'info';
    action: () => void;
  }>({
    title: '',
    message: '',
    confirmLabel: 'CONFIRM',
    severity: 'warning',
    action: () => {},
  });

  const requestConfirmation = (
    title: string,
    message: string,
    action: () => void,
    severity: 'warning' | 'danger' | 'info' = 'warning',
    confirmLabel = 'CONFIRM ACTION'
  ) => {
    setModalConfig({ title, message, action, severity, confirmLabel });
    setModalOpen(true);
  };

  const handleHeaterButtonClick = () => {
    const nextState = !telemetry.heaterStatus;
    requestConfirmation(
      nextState ? 'Manual Heating Override (Activate)' : 'Manual Heating Override (Deactivate)',
      nextState
        ? 'WARNING: You are manually energizing the anti-icing thermal heating simulation. Verify that combustible gas and flame sensors are nominal before proceeding.'
        : 'You are de-energizing the anti-icing heater relay. This will halt active thermal surface de-icing.',
      manualHeaterToggle,
      nextState ? 'warning' : 'info',
      nextState ? 'FORCE HEATER ON' : 'TURN HEATER OFF'
    );
  };

  const handleOpenCoverClick = () => {
    requestConfirmation(
      'Command Radome Cover to 0° (Fully Open)',
      'Actuate servo motor to position 0°. This exposes the antenna aperture and feed horn to the external alpine environment.',
      manualOpenCover,
      'info',
      'OPEN RADOME COVER'
    );
  };

  const handleCloseCoverClick = () => {
    requestConfirmation(
      'Command Radome Cover to 180° (Fully Closed)',
      'Actuate servo motor to position 180°. This seals the protective radome against freezing sleet, heavy snowfall, and hail.',
      manualCloseCover,
      'warning',
      'CLOSE RADOME COVER'
    );
  };

  const handleEmergencyClick = () => {
    if (telemetry.emergencyShutdown) {
      requestConfirmation(
        'Clear Emergency Interlock',
        'Reset the master safety interlock and restore nominal automated operating mode. Ensure hazardous fire/gas conditions have been resolved.',
        resetEmergencyShutdown,
        'info',
        'RESET SAFETY INTERLOCK'
      );
    } else {
      requestConfirmation(
        'Engage Emergency Master Interlock',
        'CRITICAL: This immediately isolates all thermal relays, freezes servo actuators at 90° vent position, and latches safety interlocks.',
        triggerEmergencyShutdown,
        'danger',
        'ENGAGE EMERGENCY STOP'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Confirmation Dialog */}
      <ConfirmationModal
        isOpen={modalOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmLabel={modalConfig.confirmLabel}
        severity={modalConfig.severity}
        onConfirm={modalConfig.action}
        onCancel={() => setModalOpen(false)}
      />

      {/* Operating Mode Selector Banner */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 uppercase font-semibold">
            Actuator & Relay Command Bus
          </span>
          <h2 className="text-xl font-bold font-mono tracking-wide text-white mt-1">
            Anti-Icing Thermal & Servo Control Center
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Closed-loop physical actuators consisting of solid-state thermal heating simulation relays and motorized radome positioning.
          </p>
        </div>

        {/* Operating Modes */}
        <div className="flex flex-wrap items-center gap-2">
          {(['AUTO PROTECTION', 'MANUAL CONTROL', 'SAFE MODE', 'EMERGENCY SHUTDOWN'] as OperatingMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                if (mode === 'EMERGENCY SHUTDOWN') {
                  handleEmergencyClick();
                } else {
                  setOperatingMode(mode);
                }
              }}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all border cursor-pointer ${
                operatingMode === mode
                  ? mode === 'EMERGENCY SHUTDOWN'
                    ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                    : 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Main Actuators Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section A: Heating Simulation Control */}
        <div className="p-6 rounded-xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="flex items-center gap-2 text-sm font-bold font-mono text-white uppercase tracking-wider">
              <Flame className="w-5 h-5 text-orange-400" />
              <span>A. Thermal Heating Simulation (Relay 1)</span>
            </span>
            <StatusBadge
              status={telemetry.heaterStatus ? `HEATER ON (${telemetry.heaterDutyCycle}%)` : 'HEATER OFF'}
              variant={telemetry.heaterStatus ? 'warning' : 'safe'}
              size="md"
            />
          </div>

          {/* Thermal Telemetry Readouts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">POWER DRAW</span>
              <span className="text-xl font-bold text-white">
                {telemetry.heaterStatus ? `${Math.round(telemetry.heaterDutyCycle * 1.8)} W` : '0 W'}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">DUTY CYCLE</span>
              <span className="text-xl font-bold text-orange-400">{telemetry.heaterDutyCycle}%</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-slate-500 block text-[10px]">ACTIVE TIMER</span>
              <span className="text-xl font-bold text-cyan-300">
                {formatDuration(telemetry.heaterDurationSeconds)}
              </span>
            </div>
          </div>

          {/* Operating Reason */}
          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 font-mono text-xs space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Current Operating Rationale:</span>
            <p className="text-slate-200 font-semibold">{telemetry.heaterReason}</p>
          </div>

          {/* Action Control Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleHeaterButtonClick}
              disabled={telemetry.emergencyShutdown}
              className={`w-full py-3 px-4 rounded-lg font-mono text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                telemetry.emergencyShutdown
                  ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                  : telemetry.heaterStatus
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/30'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{telemetry.heaterStatus ? 'DEACTIVATE HEATING SIMULATION' : 'ACTIVATE HEATING SIMULATION'}</span>
            </button>
          </div>
        </div>

        {/* Section B: Servo Protective Cover Control */}
        <div className="p-6 rounded-xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="flex items-center gap-2 text-sm font-bold font-mono text-white uppercase tracking-wider">
              <Radio className="w-5 h-5 text-purple-400" />
              <span>B. Servo Protective Radome (Pin 18)</span>
            </span>
            <StatusBadge
              status={`SERVO: ${telemetry.servoPosition}° (${telemetry.protectiveCover})`}
              variant={telemetry.protectiveCover === 'CLOSED' ? 'closed' : telemetry.protectiveCover === 'OPEN' ? 'open' : 'moving'}
              size="md"
            />
          </div>

          {/* Visual Radome Angle Slider */}
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>MANUAL ANGLE COMMAND:</span>
              <span className="text-purple-400 font-bold">{telemetry.servoPosition}°</span>
            </div>

            <input
              type="range"
              min="0"
              max="180"
              step="5"
              value={telemetry.servoPosition}
              onChange={(e) => manualSetServoPosition(Number(e.target.value))}
              disabled={telemetry.emergencyShutdown}
              className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer disabled:opacity-40"
            />

            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0° (Fully Open)</span>
              <span>45° (Shield)</span>
              <span>90° (Vent)</span>
              <span>135° (Baffle)</span>
              <span>180° (Sealed)</span>
            </div>
          </div>

          {/* Quick Actuator Buttons */}
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            <button
              onClick={handleOpenCoverClick}
              disabled={telemetry.emergencyShutdown}
              className="py-2.5 px-2 rounded-lg bg-blue-950 hover:bg-blue-900/80 border border-blue-600/50 text-blue-200 font-bold transition-all disabled:opacity-40 cursor-pointer"
            >
              Open (0°)
            </button>
            <button
              onClick={handleCloseCoverClick}
              disabled={telemetry.emergencyShutdown}
              className="py-2.5 px-2 rounded-lg bg-purple-950 hover:bg-purple-900/80 border border-purple-600/50 text-purple-200 font-bold transition-all disabled:opacity-40 cursor-pointer"
            >
              Close (180°)
            </button>
            <button
              onClick={manualStopServo}
              disabled={telemetry.emergencyShutdown}
              className="py-2.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold transition-all disabled:opacity-40 cursor-pointer"
            >
              Stop Servo
            </button>
          </div>

          {/* Embedded Servo Schematic */}
          <ServoVisualizer
            position={telemetry.servoPosition}
            status={telemetry.protectiveCover}
          />
        </div>
      </div>

      {/* Section D: Automation Rules Matrix */}
      <div className="p-6 rounded-xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold font-mono tracking-wide text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>D. Deterministic Closed-Loop Automation Rules</span>
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Multi-sensor conditional triggers managing autonomous thermal cycles, mechanical closures, and emergency hazard interlocks.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            AUTO PILOT: ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {rules.map((rule) => {
            const isRuleActive = rule.lastResult === 'ACTIVE';
            const isInterlocked = rule.lastResult === 'INTERLOCKED';
            return (
              <div
                key={rule.id}
                className={`p-4 rounded-xl border bg-slate-950/80 space-y-3 transition-colors ${
                  isInterlocked ? 'border-red-500/60 bg-red-950/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]' :
                  isRuleActive ? 'border-cyan-500/60 bg-cyan-950/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]' :
                  'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white tracking-wider flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-400 text-[10px]">
                      {rule.id}
                    </span>
                    <span className="truncate">{rule.name}</span>
                  </span>
                  <StatusBadge
                    status={rule.lastResult}
                    variant={isInterlocked ? 'critical' : isRuleActive ? 'online' : 'safe'}
                    size="sm"
                  />
                </div>

                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  {rule.description}
                </p>

                <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-[11px] space-y-1">
                  <div className="text-slate-400">
                    <strong className="text-slate-300">Trigger:</strong> <code className="text-cyan-300 font-mono">{rule.triggerCondition}</code>
                  </div>
                  <div className="text-slate-400">
                    <strong className="text-slate-300">Action:</strong> <span className="text-amber-300">{rule.action}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                  <span>Last Evaluated: {rule.lastTriggered || 'At System Boot'}</span>
                  <span className="text-emerald-400">State: {rule.state}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
