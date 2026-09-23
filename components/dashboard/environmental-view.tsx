'use client';

import React from 'react';
import { useSentinel } from '@/context/sentinel-context';
import { MetricCard } from '@/components/ui/metric-card';
import { TrendChart } from '@/components/ui/trend-chart';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatTime } from '@/lib/utils';
import { 
  Thermometer, 
  Droplets, 
  Waves, 
  Ruler, 
  Wind, 
  Flame, 
  Eye, 
  RotateCw, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  Pause
} from 'lucide-react';

export function EnvironmentalView() {
  const {
    telemetry,
    history,
    settings,
    manualRefresh,
    liveJitterEnabled,
    toggleLiveJitter,
  } = useSentinel();

  // Historical data series
  const tempSeries = history.map(h => ({ label: h.time, value: h.temperature }));
  const humSeries = history.map(h => ({ label: h.time, value: h.humidity }));
  const gasSeries = history.map(h => ({ label: h.time, value: h.gasLevel }));
  const distSeries = history.map(h => ({ label: h.time, value: h.distance }));

  const distanceDelta = Math.max(0, telemetry.baselineDistance - telemetry.ultrasonicDistance);
  const isDistanceWarning = distanceDelta >= 0.5; // > 5mm accumulation

  return (
    <div className="space-y-6">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              TELEMETRY BUS 01
            </span>
            <span className="text-xs font-mono text-slate-400">
              ESP32 GPIO & ADC Stream
            </span>
          </div>
          <h2 className="text-xl font-bold font-mono tracking-wide text-white mt-1">
            Environmental Telemetry & Sensor Suite
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Real-time multisensor acquisition monitoring Chang La Pass ambient atmospheric and physical surface metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Live Jitter Toggle */}
          <button
            onClick={toggleLiveJitter}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
              liveJitterEnabled
                ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            {liveJitterEnabled ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>Simulated Live Stream: {liveJitterEnabled ? 'ACTIVE' : 'PAUSED'}</span>
          </button>

          {/* Manual Refresh */}
          <button
            onClick={manualRefresh}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Manual Poll</span>
          </button>

          <div className="text-[11px] font-mono text-slate-400">
            Updated: <strong className="text-white" suppressHydrationWarning>{formatTime(telemetry.timestamp)}</strong>
          </div>
        </div>
      </div>

      {/* Sensor Health Diagnostic Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { name: 'DHT11 Temp', pin: 'GPIO 14', status: 'HEALTHY' },
          { name: 'DHT11 Hum', pin: 'GPIO 14', status: 'HEALTHY' },
          { name: 'Water Sensor', pin: 'ADC 35', status: telemetry.moistureDetected ? 'WET TRIGGER' : 'HEALTHY' },
          { name: 'Ultrasonic', pin: 'TRIG/ECHO', status: isDistanceWarning ? 'ACCRETION' : 'HEALTHY' },
          { name: 'MQ-2 Gas', pin: 'ADC 34', status: telemetry.gasLevel > 2500 ? 'INTERLOCK' : 'HEALTHY' },
          { name: 'Flame Sensor', pin: 'GPIO 27', status: telemetry.fireDetected ? 'FIRE DETECTED' : 'HEALTHY' },
          { name: 'PIR Motion', pin: 'GPIO 13', status: telemetry.motionDetected ? 'DETECTED' : 'STANDBY' },
        ].map((sensor) => (
          <div
            key={sensor.name}
            className="p-3 rounded-lg border border-slate-800 bg-slate-950/70 font-mono text-[11px] space-y-1"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="truncate">{sensor.name}</span>
              <span className="text-[9px] text-slate-500">{sensor.pin}</span>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  sensor.status === 'HEALTHY' || sensor.status === 'STANDBY' ? 'bg-emerald-400' :
                  sensor.status === 'FIRE DETECTED' || sensor.status === 'INTERLOCK' ? 'bg-red-500 animate-ping' :
                  'bg-amber-400 animate-pulse'
                }`}
              />
              <span
                className={`text-[10px] font-semibold truncate ${
                  sensor.status === 'HEALTHY' || sensor.status === 'STANDBY' ? 'text-emerald-400' :
                  sensor.status === 'FIRE DETECTED' || sensor.status === 'INTERLOCK' ? 'text-red-400' :
                  'text-amber-400'
                }`}
              >
                {sensor.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Sensor Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sensor 1: Temperature */}
        <MetricCard
          title="Ambient Temperature"
          value={telemetry.temperature}
          unit="°C"
          statusText={telemetry.temperature <= settings.tempCriticalThreshold ? 'CRITICAL FREEZE' : telemetry.temperature <= settings.tempLowWarningThreshold ? 'SUB-ZERO' : 'NORMAL'}
          statusVariant={telemetry.temperature <= settings.tempCriticalThreshold ? 'critical' : telemetry.temperature <= settings.tempLowWarningThreshold ? 'warning' : 'safe'}
          accent={telemetry.temperature <= 0 ? 'blue' : 'emerald'}
          icon={<Thermometer className="w-5 h-5" />}
          subtitle={`Freezing Threshold: ${settings.tempLowWarningThreshold}°C | Critical: ${settings.tempCriticalThreshold}°C`}
        >
          <div className="space-y-3">
            <TrendChart
              data={tempSeries}
              color={telemetry.temperature <= 0 ? 'blue' : 'emerald'}
              height={110}
              unit="°C"
              threshold={settings.tempLowWarningThreshold}
              thresholdLabel="Warning Line"
            />
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-xs font-mono flex items-center justify-between text-slate-300">
              <span>Risk Status:</span>
              <span className="text-cyan-400">
                {telemetry.temperature > 5 ? 'Low Thermal Risk' : telemetry.temperature >= 0 ? 'Moderate (0°C to 5°C)' : telemetry.temperature >= -10 ? 'High Nucleation (-10°C to 0°C)' : 'Severe Sub-Zero Freeze (<-10°C)'}
              </span>
            </div>
          </div>
        </MetricCard>

        {/* Sensor 2: Relative Humidity */}
        <MetricCard
          title="Relative Humidity"
          value={telemetry.humidity}
          unit="%"
          statusText={telemetry.humidity >= settings.humidityCriticalThreshold ? 'CRITICAL SATURATION' : telemetry.humidity >= settings.humidityWarningThreshold ? 'HIGH HUMIDITY' : 'NORMAL'}
          statusVariant={telemetry.humidity >= settings.humidityCriticalThreshold ? 'critical' : telemetry.humidity >= settings.humidityWarningThreshold ? 'warning' : 'safe'}
          accent="cyan"
          icon={<Droplets className="w-5 h-5" />}
          subtitle={`Warning Threshold: ${settings.humidityWarningThreshold}% | Dew Point Supercooling Factor`}
        >
          <div className="space-y-3">
            <TrendChart
              data={humSeries}
              color="cyan"
              height={110}
              unit="%"
              threshold={settings.humidityWarningThreshold}
              thresholdLabel="Saturation Limit"
            />
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-xs font-mono flex items-center justify-between text-slate-300">
              <span>Moisture Capacity:</span>
              <span className="text-cyan-400">
                {telemetry.humidity > 90 ? 'Supercooled Cloud Droplets Present' : telemetry.humidity > 75 ? 'Elevated Condensation Potential' : 'Dry Atmospheric Buffer'}
              </span>
            </div>
          </div>
        </MetricCard>

        {/* Sensor 3: Water/Moisture Sensor */}
        <MetricCard
          title="Feed Horn Water & Moisture Sensor"
          value={telemetry.moistureDetected ? 'WET' : 'DRY'}
          statusText={telemetry.moistureDetected ? 'MOISTURE DETECTED' : 'DRY'}
          statusVariant={telemetry.moistureDetected ? 'warning' : 'dry'}
          accent={telemetry.moistureDetected ? 'blue' : 'emerald'}
          icon={<Waves className="w-5 h-5" />}
          subtitle="Analog resistive PCB grid mounted on antenna feed aperture (Pin 35)"
        >
          <div className="space-y-3 text-xs font-mono">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">RAW ADC VALUE</span>
                <span className="text-xl font-bold text-white">{telemetry.waterRawValue} <span className="text-xs font-normal text-slate-500">/ 4095</span></span>
              </div>
              <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">LAST EVENT</span>
                <span className="text-sm font-semibold text-cyan-300">{telemetry.lastMoistureTimestamp}</span>
              </div>
            </div>

            <div className="p-3 rounded bg-slate-900/60 border border-slate-800 text-slate-300 flex items-center justify-between">
              <span>Automated Response:</span>
              <span className={telemetry.moistureDetected ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                {telemetry.moistureDetected ? 'Triggered 180° Radome Cover Closure' : 'Standby - Surface is clean'}
              </span>
            </div>
          </div>
        </MetricCard>

        {/* Sensor 4: Ultrasonic Surface Accumulation Sensor */}
        <MetricCard
          title="Ultrasonic Surface Accumulation Sensor"
          value={`${telemetry.ultrasonicDistance} cm`}
          statusText={isDistanceWarning ? 'ACCRETION WARNING' : 'NOMINAL CLEARANCE'}
          statusVariant={isDistanceWarning ? 'high' : 'safe'}
          accent={isDistanceWarning ? 'amber' : 'purple'}
          icon={<Ruler className="w-5 h-5" />}
          subtitle={`Baseline Distance: ${telemetry.baselineDistance} cm | Distance changes indicate snow/ice accretion`}
        >
          <div className="space-y-3">
            <TrendChart
              data={distSeries}
              color="purple"
              height={90}
              unit=" cm"
              threshold={telemetry.baselineDistance - 0.5}
              thresholdLabel="Accretion Threshold"
            />
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">BASELINE</span>
                <span className="font-bold text-white">{telemetry.baselineDistance} cm</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">CURRENT</span>
                <span className="font-bold text-cyan-300">{telemetry.ultrasonicDistance} cm</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">EST. ACCRETION</span>
                <span className={`font-bold ${telemetry.surfaceAccumulation > 5 ? 'text-orange-400' : 'text-emerald-400'}`}>
                  {telemetry.surfaceAccumulation} mm
                </span>
              </div>
            </div>
          </div>
        </MetricCard>

        {/* Sensor 5: MQ-2 Combustible Gas Sensor */}
        <MetricCard
          title="MQ-2 Combustible Gas & Smoke Sensor"
          value={telemetry.gasLevel}
          unit="ADC"
          statusText={telemetry.gasLevel > 2500 ? 'CRITICAL LEVEL' : telemetry.gasLevel > 1000 ? 'ELEVATED' : 'NORMAL'}
          statusVariant={telemetry.gasLevel > 2500 ? 'critical' : telemetry.gasLevel > 1000 ? 'warning' : 'safe'}
          accent={telemetry.gasLevel > 2500 ? 'red' : 'emerald'}
          icon={<Wind className="w-5 h-5" />}
          subtitle="Monitors hydrogen, LPG, smoke, and generator exhaust gas in enclosure (Pin 34)"
        >
          <div className="space-y-3">
            <TrendChart
              data={gasSeries}
              color={telemetry.gasLevel > 2500 ? 'red' : 'emerald'}
              height={90}
              unit=" ADC"
              threshold={2500}
              thresholdLabel="Interlock Cutoff"
            />
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-xs font-mono flex items-center justify-between text-slate-300">
              <span>Safety Interlock Status:</span>
              <span className={telemetry.gasLevel > 2500 ? 'text-red-400 font-bold' : 'text-emerald-400 font-semibold'}>
                {telemetry.gasLevel > 2500 ? 'TRIPPED - Thermal Relays Isolated' : 'ARMED & MONITORING'}
              </span>
            </div>
          </div>
        </MetricCard>

        {/* Sensor 6: Flame Sensor & Sensor 7: PIR Motion */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Sensor 6: Fire Sensor */}
          <MetricCard
            title="Optical Flame / Fire Sensor"
            value={telemetry.fireDetected ? 'FIRE DETECTED' : 'NO FIRE'}
            statusText={telemetry.fireDetected ? 'EMERGENCY' : 'SAFE'}
            statusVariant={telemetry.fireDetected ? 'critical' : 'safe'}
            accent={telemetry.fireDetected ? 'red' : 'emerald'}
            icon={<Flame className="w-5 h-5" />}
            subtitle="Infrared flame detection module (Pin 27, Active LOW)"
          >
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">SHUTDOWN RELAY:</span>
                <span className={telemetry.fireDetected ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                  {telemetry.fireDetected ? 'TRIPPED (Immediate Cutoff)' : 'ENGAGED / NOMINAL'}
                </span>
              </div>
            </div>
          </MetricCard>

          {/* Sensor 7: PIR Motion Sensor */}
          <MetricCard
            title="PIR Motion Security Sensor"
            value={telemetry.motionDetected ? 'MOTION' : 'CLEAR'}
            statusText={telemetry.motionDetected ? 'DETECTED' : 'STANDBY'}
            statusVariant={telemetry.motionDetected ? 'warning' : 'safe'}
            accent="blue"
            icon={<Eye className="w-5 h-5" />}
            subtitle="Perimeter physical movement sensor (Pin 13)"
          >
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">LAST SECURITY EVENT:</span>
                <span className="text-slate-200">{telemetry.lastMotionTimestamp}</span>
              </div>
            </div>
          </MetricCard>
        </div>
      </div>
    </div>
  );
}
