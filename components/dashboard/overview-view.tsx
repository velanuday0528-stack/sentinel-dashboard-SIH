'use client';

import React from 'react';
import { useSentinel } from '@/context/sentinel-context';
import { MetricCard } from '@/components/ui/metric-card';
import { TrendChart } from '@/components/ui/trend-chart';
import { RiskGauge } from '@/components/ui/risk-gauge';
import { ServoVisualizer } from '@/components/ui/servo-visualizer';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatDuration, formatTime } from '@/lib/utils';
import { 
  Activity, 
  Thermometer, 
  Droplets, 
  Waves, 
  Flame, 
  ShieldCheck, 
  ShieldAlert, 
  Radio, 
  Cpu, 
  AlertTriangle,
  Play,
  RotateCw,
  ExternalLink
} from 'lucide-react';
import { SCENARIO_PRESETS } from '@/lib/simulation-engine';

export function OverviewView() {
  const {
    telemetry,
    history,
    setActiveTab,
    riskBreakdown,
    loadScenario,
    activeScenarioId,
    setScenarioModalOpen,
    manualRefresh,
    alerts
  } = useSentinel();

  // Prepare chart series from history
  const tempChartData = history.map(h => ({ label: h.time, value: h.temperature }));
  const humChartData = history.map(h => ({ label: h.time, value: h.humidity }));

  // Min / max calculation
  const temps = history.map(h => h.temperature);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);

  // Moisture state text
  const moistureStatusText = telemetry.moistureDetected
    ? 'MOISTURE DETECTED'
    : telemetry.humidity > 85
    ? 'WATER/CONDENSATION WARNING'
    : 'DRY';

  const moistureVariant = telemetry.moistureDetected
    ? 'warning'
    : telemetry.humidity > 85
    ? 'warning'
    : 'dry';

  const unresolvedAlerts = alerts.filter(a => !a.resolved);

  return (
    <div className="space-y-6">
      {/* Quick Demo Scenario Strip */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-400">
            <Play className="w-4 h-4 fill-cyan-400" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-white tracking-wider uppercase">
              HACKATHON DEMO SIMULATION ENGINE
            </span>
            <p className="text-[11px] text-slate-400 font-sans">
              Instantly simulate real-world extreme alpine weather events & safety hazard triggers.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {SCENARIO_PRESETS.slice(0, 5).map((preset) => (
            <button
              key={preset.id}
              onClick={() => loadScenario(preset.id)}
              className={`px-3 py-1.5 rounded text-xs font-mono border transition-all cursor-pointer ${
                activeScenarioId === preset.id
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
            >
              {preset.name.split(':')[0]}
            </button>
          ))}
          <button
            onClick={() => setScenarioModalOpen(true)}
            className="px-3 py-1.5 rounded text-xs font-mono bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-600/50 flex items-center gap-1 cursor-pointer"
          >
            <span>All Scenarios</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Primary 8 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI A: System Status */}
        <MetricCard
          title="System Status"
          value={telemetry.systemStatus}
          statusText={telemetry.systemStatus}
          statusVariant={telemetry.systemStatus === 'ONLINE' ? 'online' : telemetry.systemStatus === 'DEGRADED' ? 'degraded' : 'critical'}
          accent={telemetry.systemStatus === 'ONLINE' ? 'cyan' : 'amber'}
          icon={<Cpu className="w-4 h-4" />}
          subtitle={`Controller: ${telemetry.controller}`}
        >
          <div className="space-y-1.5 text-[11px] font-mono text-slate-400">
            <div className="flex justify-between">
              <span className="text-slate-500">Connection Mode:</span>
              <span className="text-cyan-400 font-semibold">{telemetry.connectionMode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Last Telemetry:</span>
              <span className="text-slate-300" suppressHydrationWarning>{formatTime(telemetry.timestamp)}</span>
            </div>
          </div>
        </MetricCard>

        {/* KPI B: Icing Risk Level */}
        <MetricCard
          title="Icing Risk Level"
          value={`${telemetry.icingRiskScore}%`}
          statusText={telemetry.icingRiskLevel}
          statusVariant={
            telemetry.icingRiskLevel === 'CRITICAL' ? 'critical' :
            telemetry.icingRiskLevel === 'HIGH' ? 'high' :
            telemetry.icingRiskLevel === 'MODERATE' ? 'moving' : 'safe'
          }
          accent={
            telemetry.icingRiskLevel === 'CRITICAL' ? 'red' :
            telemetry.icingRiskLevel === 'HIGH' ? 'amber' : 'emerald'
          }
          icon={<Activity className="w-4 h-4" />}
          subtitle="Prototype Rule-Based Risk Index"
          onClick={() => setActiveTab('icing-risk')}
        >
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 ${
                telemetry.icingRiskScore >= 80 ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' :
                telemetry.icingRiskScore >= 56 ? 'bg-orange-500 shadow-[0_0_8px_#f97316]' :
                telemetry.icingRiskScore >= 26 ? 'bg-yellow-500 shadow-[0_0_8px_#eab308]' :
                'bg-emerald-500 shadow-[0_0_8px_#10b981]'
              }`}
              style={{ width: `${telemetry.icingRiskScore}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] font-mono text-slate-400 flex justify-between">
            <span>Range: 0–100%</span>
            <span className="text-cyan-400 cursor-pointer hover:underline">View Formula Breakdown →</span>
          </div>
        </MetricCard>

        {/* KPI C: Temperature */}
        <MetricCard
          title="Ambient Temperature"
          value={telemetry.temperature}
          unit="°C"
          statusText={telemetry.temperature <= 0 ? 'SUB-ZERO FREEZING' : 'NORMAL'}
          statusVariant={telemetry.temperature <= -5 ? 'critical' : telemetry.temperature <= 0 ? 'warning' : 'safe'}
          accent={telemetry.temperature <= 0 ? 'blue' : 'emerald'}
          icon={<Thermometer className="w-4 h-4" />}
          subtitle={`Min: ${minTemp}°C | Max: ${maxTemp}°C`}
          onClick={() => setActiveTab('environmental')}
        >
          <TrendChart
            data={tempChartData}
            color={telemetry.temperature <= 0 ? 'blue' : 'emerald'}
            height={65}
            unit="°C"
            threshold={0}
            thresholdLabel="Freeze (0°C)"
          />
        </MetricCard>

        {/* KPI D: Relative Humidity */}
        <MetricCard
          title="Relative Humidity"
          value={telemetry.humidity}
          unit="%"
          statusText={telemetry.humidity >= 85 ? 'SATURATED / HIGH' : telemetry.humidity >= 70 ? 'ELEVATED' : 'NOMINAL'}
          statusVariant={telemetry.humidity >= 85 ? 'warning' : 'safe'}
          accent="cyan"
          icon={<Droplets className="w-4 h-4" />}
          subtitle="Chang La Alpine Cloud Density"
          onClick={() => setActiveTab('environmental')}
        >
          <TrendChart
            data={humChartData}
            color="cyan"
            height={65}
            unit="%"
            threshold={75}
            thresholdLabel="Warning (75%)"
          />
        </MetricCard>

        {/* KPI E: Moisture Detection */}
        <MetricCard
          title="Moisture Detection"
          value={telemetry.moistureDetected ? 'WET' : 'DRY'}
          statusText={moistureStatusText}
          statusVariant={moistureVariant}
          accent={telemetry.moistureDetected ? 'blue' : 'emerald'}
          icon={<Waves className="w-4 h-4" />}
          subtitle={telemetry.moistureDetected ? 'Active precipitation / sleet on horn' : 'Feed horn surface is dry'}
          onClick={() => setActiveTab('environmental')}
        >
          <div className="space-y-1.5 text-[11px] font-mono text-slate-400">
            <div className="flex justify-between">
              <span className="text-slate-500">Resistive Reading:</span>
              <span className="text-slate-200">{telemetry.waterRawValue} ADC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Last Detection:</span>
              <span className="text-slate-300">{telemetry.lastMoistureTimestamp}</span>
            </div>
          </div>
        </MetricCard>

        {/* KPI F: Anti-Icing Heater */}
        <MetricCard
          title="Anti-Icing Heater"
          value={telemetry.heaterStatus ? 'ACTIVE' : 'OFF'}
          statusText={telemetry.heaterStatus ? `ON (${telemetry.heaterDutyCycle}%)` : 'STANDBY'}
          statusVariant={telemetry.heaterStatus ? 'warning' : 'safe'}
          accent={telemetry.heaterStatus ? 'amber' : 'blue'}
          icon={<Flame className="w-4 h-4" />}
          subtitle={telemetry.heaterReason}
          onClick={() => setActiveTab('anti-icing')}
        >
          <div className="space-y-1.5 text-[11px] font-mono text-slate-400">
            <div className="flex justify-between">
              <span className="text-slate-500">Simulated Duty Power:</span>
              <span className="text-orange-400 font-semibold">{telemetry.heaterDutyCycle}% (~{Math.round(telemetry.heaterDutyCycle * 1.8)}W)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Active Duration:</span>
              <span className="text-slate-200">{formatDuration(telemetry.heaterDurationSeconds)}</span>
            </div>
          </div>
        </MetricCard>

        {/* KPI G: Protective Cover */}
        <MetricCard
          title="Protective Cover"
          value={telemetry.protectiveCover}
          statusText={`${telemetry.servoPosition}° ANGLE`}
          statusVariant={telemetry.protectiveCover === 'CLOSED' ? 'closed' : telemetry.protectiveCover === 'OPEN' ? 'open' : 'moving'}
          accent="purple"
          icon={<Radio className="w-4 h-4" />}
          subtitle={`Servo Angle: ${telemetry.servoPosition}°`}
          onClick={() => setActiveTab('anti-icing')}
        >
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-purple-500 transition-all duration-300 shadow-[0_0_8px_#a855f7]"
              style={{ width: `${(telemetry.servoPosition / 180) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] font-mono text-slate-400 flex justify-between">
            <span>0° (OPEN)</span>
            <span>90° (VENT)</span>
            <span>180° (SEALED)</span>
          </div>
        </MetricCard>

        {/* KPI H: Safety Status */}
        <MetricCard
          title="Safety Status"
          value={telemetry.safetyStatus}
          statusText={telemetry.safetyStatus}
          statusVariant={telemetry.safetyStatus === 'SAFE' ? 'safe' : telemetry.safetyStatus === 'WARNING' ? 'warning' : 'critical'}
          accent={telemetry.safetyStatus === 'SAFE' ? 'emerald' : telemetry.safetyStatus === 'WARNING' ? 'amber' : 'red'}
          icon={telemetry.safetyStatus === 'SAFE' ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          subtitle={telemetry.emergencyShutdown ? 'Interlock active! Heaters isolated.' : 'All sensor interlocks armed and nominal.'}
          onClick={() => setActiveTab('safety-alerts')}
        >
          <div className="space-y-1.5 text-[11px] font-mono text-slate-400">
            <div className="flex justify-between">
              <span className="text-slate-500">Flame Sensor:</span>
              <span className={telemetry.fireDetected ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                {telemetry.fireDetected ? 'FIRE DETECTED' : 'CLEAR'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">MQ-2 Combustible Gas:</span>
              <span className={telemetry.gasLevel > 2500 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                {telemetry.gasLevel} ADC ({telemetry.gasLevel > 2500 ? 'CRITICAL' : 'NORMAL'})
              </span>
            </div>
          </div>
        </MetricCard>
      </div>

      {/* Visualizers & Real-Time Intelligence Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Radial Risk Gauge */}
        <RiskGauge
          score={telemetry.icingRiskScore}
          category={telemetry.icingRiskLevel}
          confidence={riskBreakdown.confidencePercentage}
        />

        {/* Middle: 2D Servo Radome Visualizer */}
        <ServoVisualizer
          position={telemetry.servoPosition}
          status={telemetry.protectiveCover}
          isMoving={telemetry.protectiveCover === 'MOVING'}
        />

        {/* Right: Real-time Actionable Intelligence & Active Alerts */}
        <div className="flex flex-col justify-between p-6 rounded-xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-slate-300">
                <AlertTriangle className="w-4 h-4 text-cyan-400" />
                <span>INTELLIGENCE & RECOMMENDATION</span>
              </span>
              <button
                onClick={manualRefresh}
                className="text-slate-400 hover:text-cyan-400 p-1 rounded hover:bg-slate-900 transition-colors"
                title="Refresh Telemetry"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/80 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase font-semibold">
                  Rule Decision
                </span>
                <span className="text-xs font-mono text-slate-300 font-semibold truncate">
                  {telemetry.heaterReason}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {riskBreakdown.recommendedAction}
              </p>
            </div>

            {/* Quick Alert Feed */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>ACTIVE ALERTS ({unresolvedAlerts.length})</span>
                <button
                  onClick={() => setActiveTab('safety-alerts')}
                  className="text-cyan-400 hover:underline text-[11px]"
                >
                  View All Alerts →
                </button>
              </div>

              {unresolvedAlerts.slice(0, 2).map(alert => (
                <div
                  key={alert.id}
                  className="p-2.5 rounded border border-slate-800 bg-slate-900/60 flex items-start gap-2.5 text-xs font-mono"
                >
                  <StatusBadge status={alert.severity} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 font-semibold truncate">{alert.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{alert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Ultrasonic Accumulation:</span>
            <span className={telemetry.surfaceAccumulation > 5 ? 'text-orange-400 font-bold' : 'text-emerald-400'}>
              {telemetry.surfaceAccumulation} mm buildup
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
