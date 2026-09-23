'use client';

import React, { useState } from 'react';
import { useSentinel } from '@/context/sentinel-context';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  Settings, 
  Save, 
  CheckCircle2, 
  RotateCcw, 
  Sliders, 
  ShieldCheck, 
  Flame, 
  Radio, 
  Wifi, 
  Cloud, 
  Cpu,
  Info
} from 'lucide-react';
import { SystemSettings } from '@/lib/types';
import { INITIAL_SETTINGS } from '@/lib/simulation-engine';

export function SystemSettingsView() {
  const { settings, updateSettings, addLog, telemetry } = useSentinel();

  // Local state for editing
  const [formState, setFormState] = useState<SystemSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    updateSettings(formState);
    setSavedSuccess(true);
    addLog({
      eventType: 'Settings Updated',
      sensor: 'Configuration Store',
      previousState: 'CUSTOM_V1',
      newState: 'CUSTOM_V2',
      actionTaken: 'Thresholds and safety interlock toggles persisted',
      severity: 'INFO',
      status: 'EXECUTED',
    });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    setFormState(INITIAL_SETTINGS);
    updateSettings(INITIAL_SETTINGS);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 uppercase font-semibold">
              System Parameters & Policy
            </span>
            <span className="text-xs font-mono text-slate-400">
              Non-Volatile NVRAM Configuration
            </span>
          </div>
          <h2 className="text-xl font-bold font-mono tracking-wide text-white mt-1">
            System Thresholds, Interlocks & Communication Settings
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Calibrate environmental trigger setpoints, override safety interlock policies, and inspect telemetry connectivity.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={handleResetDefaults}
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            {savedSuccess ? <CheckCircle2 className="w-4 h-4 text-slate-950" /> : <Save className="w-4 h-4 text-slate-950" />}
            <span>{savedSuccess ? 'CONFIGURATION SAVED!' : 'SAVE CONFIGURATION'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl border border-emerald-500/50 bg-emerald-950/60 font-mono text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Configuration saved successfully. All operational rules refreshed immediately.</span>
        </div>
      )}

      {/* Main Settings Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Temperature & Humidity Thresholds */}
        <div className="p-6 rounded-xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>1. Environmental Thresholds</span>
          </h3>

          <div className="space-y-4 font-mono text-xs">
            {/* Temp Warning */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Low Temperature Warning Threshold:</span>
                <span className="text-cyan-400 font-bold">{formState.tempLowWarningThreshold}°C</span>
              </div>
              <input
                type="range"
                min="-20"
                max="10"
                step="1"
                value={formState.tempLowWarningThreshold}
                onChange={(e) => setFormState({ ...formState, tempLowWarningThreshold: Number(e.target.value) })}
                className="w-full accent-cyan-500 h-2 bg-slate-800 rounded cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Triggers pre-emptive heating when combined with high humidity.</span>
            </div>

            {/* Temp Critical */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Critical Temperature Threshold:</span>
                <span className="text-blue-400 font-bold">{formState.tempCriticalThreshold}°C</span>
              </div>
              <input
                type="range"
                min="-30"
                max="-5"
                step="1"
                value={formState.tempCriticalThreshold}
                onChange={(e) => setFormState({ ...formState, tempCriticalThreshold: Number(e.target.value) })}
                className="w-full accent-blue-500 h-2 bg-slate-800 rounded cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Accelerates thermal duty cycle to 100% continuous power.</span>
            </div>

            {/* Humidity Warning */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>High Humidity Warning Threshold:</span>
                <span className="text-cyan-400 font-bold">{formState.humidityWarningThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="1"
                value={formState.humidityWarningThreshold}
                onChange={(e) => setFormState({ ...formState, humidityWarningThreshold: Number(e.target.value) })}
                className="w-full accent-cyan-500 h-2 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Humidity Critical */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Critical Humidity Threshold:</span>
                <span className="text-cyan-400 font-bold">{formState.humidityCriticalThreshold}%</span>
              </div>
              <input
                type="range"
                min="75"
                max="99"
                step="1"
                value={formState.humidityCriticalThreshold}
                onChange={(e) => setFormState({ ...formState, humidityCriticalThreshold: Number(e.target.value) })}
                className="w-full accent-cyan-500 h-2 bg-slate-800 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Automation & Actuation Policies */}
        <div className="p-6 rounded-xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
            <Radio className="w-4 h-4 text-purple-400" />
            <span>2. Automation & Actuation Policies</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            {[
              {
                id: 'moistureDetectionEnabled',
                label: 'Moisture Detection Module',
                desc: 'Permits the resistive PCB sensor on feed horn to trigger de-icing logic',
                value: formState.moistureDetectionEnabled,
              },
              {
                id: 'automaticHeatingEnabled',
                label: 'Automatic Thermal Heating Cycles',
                desc: 'Enables closed-loop rule engine to energize relay simulation without human intervention',
                value: formState.automaticHeatingEnabled,
              },
              {
                id: 'autoCloseCoverOnMoisture',
                label: 'Auto-Close Radome Cover on Moisture',
                desc: 'Immediately commands servo to 180° upon moisture detection',
                value: formState.autoCloseCoverOnMoisture,
              },
              {
                id: 'autoOpenCoverAfterNormal',
                label: 'Auto-Open Cover After Normalization',
                desc: 'Restores radome cover to 0° after thermal cycle completes and weather clears',
                value: formState.autoOpenCoverAfterNormal,
              },
            ].map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-between gap-4"
              >
                <div>
                  <span className="font-semibold text-white block">{item.label}</span>
                  <span className="text-[10px] text-slate-400 font-sans">{item.desc}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormState({ ...formState, [item.id]: !item.value })}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    item.value ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      item.value ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Safety Interlocks */}
        <div className="p-6 rounded-xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
            <ShieldCheck className="w-4 h-4 text-red-400" />
            <span>3. Hardware Safety Interlocks</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            {[
              {
                id: 'fireSensorInterlockEnabled',
                label: 'Flame Sensor Hardware Interlock',
                desc: 'Optical flame trigger immediately trips thermal relay with zero delay',
                value: formState.fireSensorInterlockEnabled,
              },
              {
                id: 'gasSensorInterlockEnabled',
                label: 'MQ-2 Combustible Gas Safety Interlock',
                desc: 'Inhibits all electrical heating elements when gas level exceeds 2500 ADC',
                value: formState.gasSensorInterlockEnabled,
              },
              {
                id: 'emergencyShutdownEnabled',
                label: 'Master Emergency Stop Interlock Enabled',
                desc: 'Allows global emergency stop override from console and hardware switch',
                value: formState.emergencyShutdownEnabled,
              },
            ].map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-between gap-4"
              >
                <div>
                  <span className="font-semibold text-white block">{item.label}</span>
                  <span className="text-[10px] text-slate-400 font-sans">{item.desc}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormState({ ...formState, [item.id]: !item.value })}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    item.value ? 'bg-red-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      item.value ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Communication & Telemetry Interfaces */}
        <div className="p-6 rounded-xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>4. Hardware & Cloud Telemetry Bus</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px]">ESP32 CONTROLLER LINK</span>
                <span className="text-white font-semibold">{formState.esp32Host}:{formState.esp32Port}</span>
              </div>
              <StatusBadge status="SIMULATION CONNECTED" variant="online" size="sm" />
            </div>

            <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px]">MQTT BROKER PLACEHOLDER</span>
                <span className="text-white font-semibold">{formState.mqttBroker}</span>
              </div>
              <StatusBadge status="STANDBY" variant="info" size="sm" />
            </div>

            <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px]">WI-FI TELEMETRY SSID</span>
                <span className="text-white font-semibold">{formState.wifiSSID}</span>
              </div>
              <StatusBadge status="RSSI -48 dBm" variant="safe" size="sm" />
            </div>

            <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px]">CLOUD TELEMETRY INGESTION</span>
                <span className="text-white font-semibold truncate max-w-[200px]">{formState.cloudEndpoint}</span>
              </div>
              <StatusBadge status="MOCK READY" variant="info" size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
