'use client';

import React, { useState } from 'react';
import { useSentinel } from '@/context/sentinel-context';
import { SCENARIO_PRESETS } from '@/lib/simulation-engine';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  Play, 
  X, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle, 
  ShieldAlert, 
  Radio, 
  Flame, 
  ArrowRight,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';

export function ScenarioRunnerModal() {
  const {
    scenarioModalOpen,
    setScenarioModalOpen,
    loadScenario,
    activeScenarioId,
    telemetry,
    setActiveTab,
  } = useSentinel();

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  if (!scenarioModalOpen) return null;

  // The 5 core hackathon demo scenarios
  const demoScenarios = SCENARIO_PRESETS.slice(0, 5);
  const activeScenario = demoScenarios[activeStepIndex] || demoScenarios[0];

  const handleExecuteScenario = (id: string, index: number) => {
    loadScenario(id);
    setActiveStepIndex(index);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-cyan-500/40 bg-slate-950 p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-white font-mono">
        {/* Aerospace Corner HUD Brackets */}
        <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-cyan-400" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] uppercase font-bold">
                HACKATHON JURY & DEMO RUNNER
              </span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-xs text-slate-400">Team ELECTRONAUTS</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mt-1">
              Deterministic Simulation Scenario Suite
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Execute test scenarios to demonstrate closed-loop environmental protection, rule evaluation, and actuator response.
            </p>
          </div>

          <button
            onClick={() => setScenarioModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step-by-Step Scenario Timeline Bar */}
        <div className="my-6">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>5-STEP DEMONSTRATION WORKFLOW:</span>
            <span className="text-cyan-400 font-bold">STEP {activeStepIndex + 1} OF 5</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {demoScenarios.map((scenario, idx) => {
              const isSelected = activeStepIndex === idx;
              const isCurrentActive = activeScenarioId === scenario.id;

              return (
                <button
                  key={scenario.id}
                  onClick={() => handleExecuteScenario(scenario.id, idx)}
                  className={`p-3 rounded-lg border text-left font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-cyan-400">Step {idx + 1}</span>
                    {isCurrentActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                  </div>
                  <div className="text-xs font-bold text-white truncate mt-1">
                    {scenario.name.replace(/^Scenario \d+: /, '')}
                  </div>
                  <div className="text-[9px] text-slate-500 truncate mt-0.5">
                    {scenario.category}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Scenario Inspection Card */}
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">SELECTED SCENARIO</span>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{activeScenario.name}</span>
                <StatusBadge status={activeScenario.category} size="sm" />
              </h3>
            </div>

            <button
              onClick={() => handleExecuteScenario(activeScenario.id, activeStepIndex)}
              className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wider transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer self-start sm:self-center"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>EXECUTE SCENARIO NOW</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Description */}
            <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Atmospheric & Environmental Context:</span>
              <p className="text-slate-300 font-sans leading-relaxed">
                {activeScenario.description}
              </p>
            </div>

            {/* Expected Result */}
            <div className="p-3.5 rounded-lg bg-cyan-950/30 border border-cyan-800/60 space-y-1.5">
              <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">Expected Autonomous Outcome:</span>
              <p className="text-cyan-200 font-sans leading-relaxed">
                {activeScenario.expectedOutcome}
              </p>
            </div>
          </div>

          {/* Preset Injected Telemetry Values */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Injected Physical Telemetry Setpoints:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">TEMP:</span>
                <span className="text-white font-bold">{activeScenario.state.temperature}°C</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">HUMIDITY:</span>
                <span className="text-white font-bold">{activeScenario.state.humidity}%</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">MOISTURE:</span>
                <span className={activeScenario.state.moistureDetected ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                  {activeScenario.state.moistureDetected ? 'WET DETECTED' : 'DRY'}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">FLAME / GAS:</span>
                <span className={activeScenario.state.fireDetected || (activeScenario.state.gasLevel ?? 0) > 2500 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                  {activeScenario.state.fireDetected ? 'FIRE' : (activeScenario.state.gasLevel ?? 0) > 2500 ? 'GAS LEAK' : 'NOMINAL'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Specialized Hazard Presets */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-2">
            ADDITIONAL ISOLATED HAZARD & FAILURE PRESETS:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SCENARIO_PRESETS.slice(5).map((preset) => (
              <button
                key={preset.id}
                onClick={() => loadScenario(preset.id)}
                className="p-2.5 rounded-lg border border-slate-800 hover:border-slate-600 bg-slate-900/50 hover:bg-slate-900 text-left transition-colors cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-200">{preset.name.replace(/^Preset: /, '')}</div>
                <div className="text-[10px] text-slate-400 font-sans line-clamp-1 mt-0.5">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-sans">
            Executing a scenario recalculates icing risk and evaluates all 4 deterministic rules.
          </span>
          <button
            onClick={() => {
              setScenarioModalOpen(false);
              setActiveTab('overview');
            }}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            Close & View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
