'use client';

import React, { useState } from 'react';
import { useSentinel } from '@/context/sentinel-context';
import { 
  Radio, 
  ShieldAlert, 
  Activity, 
  Flame, 
  Sliders, 
  FileText, 
  Settings, 
  Layers, 
  Menu, 
  X, 
  Play, 
  Cpu, 
  PowerOff,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/utils';
import { SCENARIO_PRESETS } from '@/lib/simulation-engine';

export function Header() {
  const {
    telemetry,
    activeTab,
    setActiveTab,
    operatingMode,
    simulationEnabled,
    setSimulationEnabled,
    alerts,
    loadScenario,
    activeScenarioId,
    setScenarioModalOpen,
    triggerEmergencyShutdown,
    resetEmergencyShutdown,
  } = useSentinel();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scenarioDropdownOpen, setScenarioDropdownOpen] = useState(false);

  const unreadAlertsCount = alerts.filter(a => !a.resolved).length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <Layers className="w-4 h-4" /> },
    { id: 'environmental', label: 'Environmental Monitoring', icon: <Activity className="w-4 h-4" /> },
    { id: 'icing-risk', label: 'Icing Risk Analysis', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'anti-icing', label: 'Anti-Icing Control', icon: <Flame className="w-4 h-4" /> },
    { id: 'antenna-health', label: 'Antenna Health', icon: <Radio className="w-4 h-4" /> },
    { 
      id: 'safety-alerts', 
      label: 'Safety & Alerts', 
      icon: <ShieldAlert className="w-4 h-4" />, 
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined 
    },
    { id: 'event-logs', label: 'Event Logs', icon: <FileText className="w-4 h-4" /> },
    { id: 'system-settings', label: 'System Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-slate-950/90 backdrop-blur-xl">
      {/* Top Telemetry Ticker Strip */}
      <div className="w-full bg-slate-900/90 border-b border-slate-800/80 px-4 py-1 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span className="font-bold tracking-wider">SENTINEL-LDK-704</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">Chang La Pass, Ladakh (5,360m ASL)</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>Controller: <strong className="text-slate-200">ESP32 Node</strong></span>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-400/90">Prototype Simulation</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Simulation Mode Toggle Button */}
          <button
            onClick={() => setSimulationEnabled(!simulationEnabled)}
            className={cn(
              'px-2 py-0.5 rounded text-[10px] font-mono border transition-all flex items-center gap-1.5',
              simulationEnabled 
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            )}
          >
            <span className={cn('w-1.5 h-1.5 rounded-full', simulationEnabled ? 'bg-cyan-400 animate-ping' : 'bg-slate-500')} />
            <span>Demo Simulation Mode: {simulationEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Emergency Stop / Clear Button */}
          {telemetry.emergencyShutdown ? (
            <button
              onClick={resetEmergencyShutdown}
              className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-red-600 hover:bg-red-500 text-white font-bold animate-pulse flex items-center gap-1 shadow-lg shadow-red-900/50"
            >
              <PowerOff className="w-3 h-3" />
              <span>CLEAR EMERGENCY SHUTDOWN</span>
            </button>
          ) : (
            <button
              onClick={triggerEmergencyShutdown}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950/60 hover:bg-red-900/80 border border-red-800 text-red-300 flex items-center gap-1"
            >
              <PowerOff className="w-3 h-3 text-red-400" />
              <span>EMERGENCY STOP</span>
            </button>
          )}

          {/* Quick Scenario Preset Dropdown */}
          <div className="relative">
            <button
              onClick={() => setScenarioDropdownOpen(!scenarioDropdownOpen)}
              className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-blue-950/60 hover:bg-blue-900/70 border border-blue-600/50 text-blue-300 flex items-center gap-1"
            >
              <Play className="w-3 h-3 text-blue-400" />
              <span>Scenarios</span>
              <ChevronDown className="w-3 h-3 text-blue-400 ml-0.5" />
            </button>

            {scenarioDropdownOpen && (
              <div 
                className="absolute right-0 mt-1 w-64 rounded-lg border border-slate-800 bg-slate-950/95 shadow-2xl p-1 z-50 backdrop-blur-2xl"
                onMouseLeave={() => setScenarioDropdownOpen(false)}
              >
                <div className="px-2 py-1 text-[10px] font-mono text-slate-500 border-b border-slate-800 uppercase font-semibold">
                  Select Demonstration Scenario
                </div>
                {SCENARIO_PRESETS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      loadScenario(s.id);
                      setScenarioDropdownOpen(false);
                    }}
                    className={cn(
                      'w-full text-left px-2 py-1.5 rounded text-xs font-mono transition-colors flex items-center justify-between',
                      activeScenarioId === s.id
                        ? 'bg-cyan-950 text-cyan-300 border-l-2 border-cyan-400'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    )}
                  >
                    <span className="truncate pr-1">{s.name}</span>
                    <span className="text-[9px] text-slate-500">{s.category}</span>
                  </button>
                ))}
                <div className="p-1 border-t border-slate-800/80 mt-1">
                  <button
                    onClick={() => {
                      setScenarioModalOpen(true);
                      setScenarioDropdownOpen(false);
                    }}
                    className="w-full py-1 text-center text-[10px] font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 rounded border border-cyan-800/40"
                  >
                    Open Guided Demo Runner
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Console Header */}
      <div className="mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600/30 to-blue-900/40 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div className="absolute inset-0 rounded-lg border border-cyan-400/20 animate-ping opacity-30" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black font-mono tracking-widest text-white drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                SENTINEL
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/40 text-blue-300 tracking-wider">
                v2.4 PROTOTYPE
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-cyan-400 font-medium">Team ELECTRONAUTS</span>
              <span className="text-slate-600">•</span>
              <span className="hidden sm:inline">Prototype Monitoring Console</span>
            </div>
          </div>
        </div>

        {/* Global Badges */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex flex-col items-end text-right">
            <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">OPERATING MODE</span>
            <span className="text-xs font-mono font-bold text-cyan-300">{operatingMode}</span>
          </div>

          <StatusBadge
            status={`SYSTEM ${telemetry.systemStatus}`}
            variant={telemetry.systemStatus === 'ONLINE' ? 'online' : telemetry.systemStatus === 'DEGRADED' ? 'degraded' : 'offline'}
            size="md"
          />

          <StatusBadge
            status={`SAFETY: ${telemetry.safetyStatus}`}
            variant={telemetry.safetyStatus === 'SAFE' ? 'safe' : telemetry.safetyStatus === 'WARNING' ? 'warning' : 'critical'}
            size="md"
          />
        </div>

        {/* Mobile menu trigger */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Horizontal Navigation Tabs */}
      <nav className="hidden lg:flex items-center gap-1 px-4 lg:px-8 border-t border-slate-900 overflow-x-auto no-scrollbar bg-slate-950/50">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'group relative flex items-center gap-2 px-3.5 py-2.5 text-xs font-mono tracking-wider uppercase whitespace-nowrap transition-all border-b-2',
                isActive
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20 font-semibold shadow-[0_2px_10px_rgba(6,182,212,0.2)]'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              )}
            >
              <span className={cn('transition-colors', isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300')}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-red-600 text-white font-bold animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/98 px-4 py-4 space-y-2 backdrop-blur-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Mode: {operatingMode}</span>
            <StatusBadge status={`SYSTEM ${telemetry.systemStatus}`} size="sm" />
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono text-left transition-colors',
                    isActive
                      ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'text-slate-300 hover:bg-slate-900'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-red-600 text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                setScenarioModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-cyan-900/60 hover:bg-cyan-800 text-cyan-300 rounded font-mono text-xs text-center border border-cyan-500/40"
            >
              Run Guided Hackathon Demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
