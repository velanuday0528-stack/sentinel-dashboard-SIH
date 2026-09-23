'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  TelemetryData, 
  RiskFactorBreakdown, 
  OperatingMode, 
  AlertItem, 
  EventLogItem, 
  AutomationRule, 
  SystemSettings, 
  HistoricalDataPoint,
  CoverStatus
} from '@/lib/types';
import { 
  calculateIcingRisk, 
  INITIAL_SETTINGS, 
  SCENARIO_PRESETS, 
  INITIAL_RULES, 
  INITIAL_ALERTS, 
  INITIAL_LOGS 
} from '@/lib/simulation-engine';

interface SentinelContextType {
  telemetry: TelemetryData;
  history: HistoricalDataPoint[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  operatingMode: OperatingMode;
  setOperatingMode: (mode: OperatingMode) => void;
  simulationEnabled: boolean;
  setSimulationEnabled: (val: boolean) => void;
  activeScenarioId: string | null;
  loadScenario: (scenarioId: string) => void;
  alerts: AlertItem[];
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  clearResolvedAlerts: () => void;
  logs: EventLogItem[];
  addLog: (log: Omit<EventLogItem, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  rules: AutomationRule[];
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  manualHeaterToggle: () => void;
  manualSetServoPosition: (pos: number) => void;
  manualOpenCover: () => void;
  manualCloseCover: () => void;
  manualStopServo: () => void;
  triggerEmergencyShutdown: () => void;
  resetEmergencyShutdown: () => void;
  riskBreakdown: RiskFactorBreakdown;
  liveJitterEnabled: boolean;
  toggleLiveJitter: () => void;
  manualRefresh: () => void;
  scenarioModalOpen: boolean;
  setScenarioModalOpen: (open: boolean) => void;
}

const SentinelContext = createContext<SentinelContextType | undefined>(undefined);

// Generate initial 20 historical points for charts
function generateInitialHistory(): HistoricalDataPoint[] {
  const points: HistoricalDataPoint[] = [];
  const now = Date.now();
  for (let i = 19; i >= 0; i--) {
    const t = new Date(now - i * 60000);
    const timeStr = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // gradual descent into cold weather
    const baseTemp = -4.0 - Math.sin(i / 3) * 4.5;
    const baseHum = 75 + Math.cos(i / 2.5) * 14;
    points.push({
      time: timeStr,
      temperature: Number(baseTemp.toFixed(1)),
      humidity: Math.min(98, Math.max(40, Math.round(baseHum))),
      riskScore: Math.round(Math.min(95, Math.max(20, 60 + Math.sin(i / 2) * 25))),
      heaterStatus: baseTemp < -2 ? 1 : 0,
      gasLevel: 150 + Math.floor(Math.random() * 40),
      distance: Number((15.0 - (baseTemp < -3 ? 0.8 : 0.1)).toFixed(2)),
    });
  }
  return points;
}

export function SentinelProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [simulationEnabled, setSimulationEnabled] = useState<boolean>(true);
  const [liveJitterEnabled, setLiveJitterEnabled] = useState<boolean>(true);
  const [operatingMode, setOperatingMode] = useState<OperatingMode>('AUTO PROTECTION');
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>('scenario-extreme-cold');
  const [scenarioModalOpen, setScenarioModalOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [logs, setLogs] = useState<EventLogItem[]>(INITIAL_LOGS);
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_RULES);
  const [history, setHistory] = useState<HistoricalDataPoint[]>(generateInitialHistory);

  // Initial Telemetry - represents high altitude cold scenario
  const [telemetry, setTelemetry] = useState<TelemetryData>(() => {
    const initialCalc = calculateIcingRisk(-8.5, 87, true, 14.2, 15.0);
    return {
      temperature: -8.5,
      humidity: 87,
      moistureDetected: true,
      waterRawValue: 2450,
      ultrasonicDistance: 14.2,
      baselineDistance: 15.0,
      surfaceAccumulation: 8.0,
      gasLevel: 185,
      fireDetected: false,
      motionDetected: false,
      icingRiskScore: initialCalc.score,
      icingRiskLevel: initialCalc.level,
      heaterStatus: true,
      heaterDutyCycle: 85,
      heaterDurationSeconds: 142,
      heaterReason: 'Rule 2: Anti-icing thermal response active (Moisture detected on feed horn)',
      servoPosition: 180,
      protectiveCover: 'CLOSED',
      systemStatus: 'ONLINE',
      safetyStatus: 'WARNING',
      emergencyShutdown: false,
      timestamp: new Date().toISOString(),
      lastMotionTimestamp: '10 mins ago',
      lastMoistureTimestamp: 'Just now',
      controller: 'ESP32 Node (WROOM-32)',
      connectionMode: 'Prototype Simulation',
    };
  });

  // Calculate dynamic risk breakdown from current telemetry
  const riskBreakdown = useMemo(() => {
    const calc = calculateIcingRisk(
      telemetry.temperature,
      telemetry.humidity,
      telemetry.moistureDetected,
      telemetry.ultrasonicDistance,
      telemetry.baselineDistance
    );
    return calc.breakdown;
  }, [telemetry.temperature, telemetry.humidity, telemetry.moistureDetected, telemetry.ultrasonicDistance, telemetry.baselineDistance]);

  // Helper to add log
  const addLog = useCallback((item: Omit<EventLogItem, 'id' | 'timestamp'>) => {
    const newLog: EventLogItem = {
      ...item,
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setLogs(prev => [newLog, ...prev.slice(0, 99)]);
  }, []);

  // Helper to add alert
  const raiseAlert = useCallback((alert: Omit<AlertItem, 'id' | 'timestamp' | 'acknowledged' | 'resolved'>) => {
    setAlerts(prev => {
      // Check if duplicate unresolved alert exists
      const exists = prev.some(a => a.title === alert.title && !a.resolved);
      if (exists) return prev;
      const newAlert: AlertItem = {
        ...alert,
        id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: new Date().toLocaleTimeString(),
        acknowledged: false,
        resolved: false,
      };
      return [newAlert, ...prev];
    });
  }, []);

  // Rule Evaluator (Sense -> Analyse -> Decide -> Actuate -> Verify -> Report)
  const evaluateAutomationRules = useCallback((data: TelemetryData) => {
    const isAuto = operatingMode === 'AUTO PROTECTION';
    const nowTime = new Date().toLocaleTimeString();

    // RULE 3: Fire or Gas Emergency Interlock (always evaluated for safety)
    if (data.fireDetected || (settings.gasSensorInterlockEnabled && data.gasLevel > 2500)) {
      setRules(prev => prev.map(r => r.id === 'RULE-03' ? { ...r, lastTriggered: nowTime, lastResult: 'INTERLOCKED' } : r));
      
      const reason = data.fireDetected ? 'FIRE DETECTED by Optical Sensor' : `DANGEROUS GAS LEVEL (${data.gasLevel} ADC) detected by MQ-2`;
      
      setTelemetry(prev => ({
        ...prev,
        heaterStatus: false,
        heaterDutyCycle: 0,
        heaterReason: `SAFETY INTERLOCK CUTOFF: ${reason}`,
        servoPosition: 90,
        protectiveCover: 'MOVING',
        systemStatus: 'DEGRADED',
        safetyStatus: 'EMERGENCY SHUTDOWN',
        emergencyShutdown: true,
      }));

      raiseAlert({
        severity: 'CRITICAL',
        title: data.fireDetected ? 'Emergency: Fire Detected on Radar Enclosure!' : 'Emergency: Dangerous Combustible Gas Level!',
        description: `${reason}. Heating simulation immediately suspended. Safety interlocks engaged.`,
        sensorSource: data.fireDetected ? 'Flame Sensor (Pin 27)' : 'MQ-2 Gas Sensor (Pin 34)',
        recommendedAction: 'Engage fire suppression / site inspection immediately. Do NOT re-enable heater without clearance.',
      });

      addLog({
        eventType: 'Emergency Safety Interlock',
        sensor: data.fireDetected ? 'Flame Sensor' : 'MQ-2 Gas Sensor',
        previousState: 'HEATER_ACTIVE',
        newState: 'EMERGENCY_SHUTDOWN',
        actionTaken: 'FORCED heater OFF, positioned cover to 90° vent, tripped interlock',
        severity: 'CRITICAL',
        status: 'EXECUTED',
      });
      return;
    }

    if (!isAuto) return; // if manual or emergency, don't execute normal auto rules

    // RULE 2: Moisture Reactive Protection & Radome Closure
    if (data.moistureDetected && settings.moistureDetectionEnabled) {
      setRules(prev => prev.map(r => r.id === 'RULE-02' ? { ...r, lastTriggered: nowTime, lastResult: 'ACTIVE' } : r));
      
      setTelemetry(prev => ({
        ...prev,
        heaterStatus: true,
        heaterDutyCycle: 100,
        heaterReason: 'Rule 2: Anti-icing response active - Liquid moisture on feed horn',
        servoPosition: 180,
        protectiveCover: 'CLOSED',
        safetyStatus: 'WARNING',
      }));

      raiseAlert({
        severity: 'HIGH',
        title: 'Moisture Detected on Antenna Surface',
        description: 'Moisture sensor detected condensation or freezing sleet. Radome cover closed and heater max power engaged.',
        sensorSource: 'Water Sensor (Pin 35)',
        recommendedAction: 'Verify thermal heating response and monitor surface accumulation sensor.',
      });

      addLog({
        eventType: 'Moisture Reactive Response',
        sensor: 'Water Sensor',
        previousState: 'DRY',
        newState: 'MOISTURE DETECTED',
        actionTaken: 'Heater activated 100%, servo moved to 180° (Cover Closed)',
        severity: 'HIGH',
        status: 'EXECUTED',
      });
      return;
    }

    // RULE 1: Pre-emptive Anti-Icing Thermal Activation
    const isCold = data.temperature <= settings.tempLowWarningThreshold;
    const isHumid = data.humidity >= settings.humidityWarningThreshold;

    if (isCold && isHumid && settings.automaticHeatingEnabled) {
      setRules(prev => prev.map(r => r.id === 'RULE-01' ? { ...r, lastTriggered: nowTime, lastResult: 'ACTIVE' } : r));
      
      setTelemetry(prev => ({
        ...prev,
        heaterStatus: true,
        heaterDutyCycle: 75,
        heaterReason: `Rule 1: Pre-emptive heating triggered (Temp ${data.temperature}°C ≤ ${settings.tempLowWarningThreshold}°C, Hum ${data.humidity}% ≥ ${settings.humidityWarningThreshold}%)`,
        safetyStatus: 'WARNING',
      }));

      raiseAlert({
        severity: 'WARNING',
        title: 'High Icing Risk: Pre-emptive Heating Activated',
        description: `Atmospheric conditions favor riming (T=${data.temperature}°C, RH=${data.humidity}%). Anti-icing thermal heating running at 75%.`,
        sensorSource: 'DHT11 Environmental Sensor',
        recommendedAction: 'Observe surface accumulation trends; verify antenna telemetry.',
      });

      addLog({
        eventType: 'Pre-emptive Heating Activated',
        sensor: 'DHT11 Sensor',
        previousState: 'HEATER_OFF',
        newState: 'HEATER_ON_75%',
        actionTaken: 'Pre-emptive thermal cycle initialized to inhibit ice nucleation',
        severity: 'WARNING',
        status: 'EXECUTED',
      });
      return;
    }

    // RULE 4: Conditions Normalized
    if (data.temperature > settings.tempLowWarningThreshold && data.humidity < settings.humidityWarningThreshold && !data.moistureDetected) {
      setRules(prev => prev.map(r => r.id === 'RULE-04' ? { ...r, lastTriggered: nowTime, lastResult: 'NORMAL' } : r));
      
      setTelemetry(prev => ({
        ...prev,
        heaterStatus: false,
        heaterDutyCycle: 0,
        heaterReason: 'Rule 4: Thermal deactivation complete - Ambient parameters restored to safe levels',
        servoPosition: settings.autoOpenCoverAfterNormal ? 0 : prev.servoPosition,
        protectiveCover: settings.autoOpenCoverAfterNormal ? 'OPEN' : prev.protectiveCover,
        safetyStatus: 'SAFE',
        emergencyShutdown: false,
      }));

      addLog({
        eventType: 'Normalization & Thermal Deactivation',
        sensor: 'Sensor Suite',
        previousState: 'ELEVATED_RISK',
        newState: 'NOMINAL',
        actionTaken: 'Heater relay de-energized, protective radome opened to 0°',
        severity: 'INFO',
        status: 'EXECUTED',
      });
    }
  }, [operatingMode, settings, raiseAlert, addLog]);

  // Load a demo scenario preset
  const loadScenario = useCallback((scenarioId: string) => {
    const scenario = SCENARIO_PRESETS.find(s => s.id === scenarioId);
    if (!scenario) return;

    setActiveScenarioId(scenarioId);

    // Apply scenario state
    const newTemp = scenario.state.temperature ?? telemetry.temperature;
    const newHum = scenario.state.humidity ?? telemetry.humidity;
    const newMoist = scenario.state.moistureDetected ?? false;
    const newDist = scenario.state.ultrasonicDistance ?? 15.0;
    const baseline = telemetry.baselineDistance;
    const accum = Number((Math.max(0, baseline - newDist) * 10).toFixed(1));

    const riskCalc = calculateIcingRisk(newTemp, newHum, newMoist, newDist, baseline);

    const updated: TelemetryData = {
      ...telemetry,
      ...scenario.state,
      surfaceAccumulation: accum,
      icingRiskScore: riskCalc.score,
      icingRiskLevel: riskCalc.level,
      timestamp: new Date().toISOString(),
    };

    setTelemetry(updated);

    // Append to historical trend
    setHistory(prev => [
      ...prev.slice(1),
      {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temperature: newTemp,
        humidity: newHum,
        riskScore: riskCalc.score,
        heaterStatus: updated.heaterStatus ? 1 : 0,
        gasLevel: updated.gasLevel,
        distance: newDist,
      }
    ]);

    // Log the scenario execution
    addLog({
      eventType: `Scenario: ${scenario.name}`,
      sensor: 'Simulation Engine',
      previousState: telemetry.icingRiskLevel,
      newState: riskCalc.level,
      actionTaken: scenario.expectedOutcome,
      severity: scenario.state.fireDetected || (scenario.state.gasLevel ?? 0) > 2500 ? 'CRITICAL' : riskCalc.level === 'HIGH' ? 'HIGH' : 'INFO',
      status: 'EXECUTED',
    });

    // Evaluate rules on new scenario
    evaluateAutomationRules(updated);
  }, [telemetry, addLog, evaluateAutomationRules]);

  // Subtle real-time jitter when live simulation is enabled
  useEffect(() => {
    if (!simulationEnabled || !liveJitterEnabled) return;

    const interval = setInterval(() => {
      setTelemetry(prev => {
        // Do not jitter during emergency shutdown
        if (prev.emergencyShutdown) {
          return {
            ...prev,
            heaterDurationSeconds: prev.heaterStatus ? prev.heaterDurationSeconds + 3 : 0,
            timestamp: new Date().toISOString(),
          };
        }

        // small natural fluctuations
        const tempJitter = Number(((Math.random() - 0.5) * 0.2).toFixed(2));
        const humJitter = Math.floor((Math.random() - 0.5) * 2);
        const gasJitter = Math.floor((Math.random() - 0.5) * 6);
        const distJitter = Number(((Math.random() - 0.5) * 0.04).toFixed(2));

        const nextTemp = Number((prev.temperature + tempJitter).toFixed(1));
        const nextHum = Math.min(100, Math.max(15, prev.humidity + humJitter));
        const nextGas = Math.max(80, prev.gasLevel + gasJitter);
        const nextDist = Number(Math.max(5.0, Math.min(prev.baselineDistance, prev.ultrasonicDistance + distJitter)).toFixed(2));
        const nextAccum = Number((Math.max(0, prev.baselineDistance - nextDist) * 10).toFixed(1));

        const nextRisk = calculateIcingRisk(nextTemp, nextHum, prev.moistureDetected, nextDist, prev.baselineDistance);

        return {
          ...prev,
          temperature: nextTemp,
          humidity: nextHum,
          gasLevel: nextGas,
          ultrasonicDistance: nextDist,
          surfaceAccumulation: nextAccum,
          icingRiskScore: nextRisk.score,
          icingRiskLevel: nextRisk.level,
          heaterDurationSeconds: prev.heaterStatus ? prev.heaterDurationSeconds + 3 : 0,
          timestamp: new Date().toISOString(),
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [simulationEnabled, liveJitterEnabled]);

  // Manual Controls
  const manualHeaterToggle = useCallback(() => {
    if (telemetry.emergencyShutdown) {
      alert('CANNOT TOGGLE HEATER: Emergency shutdown or safety interlock is currently active. Clear emergency first.');
      return;
    }

    setOperatingMode('MANUAL CONTROL');
    setTelemetry(prev => {
      const nextStatus = !prev.heaterStatus;
      const updated: TelemetryData = {
        ...prev,
        heaterStatus: nextStatus,
        heaterDutyCycle: nextStatus ? 100 : 0,
        heaterDurationSeconds: nextStatus ? 1 : 0,
        heaterReason: nextStatus ? 'Manual Override by Operator' : 'Manual Standby - Heater switched OFF',
      };

      addLog({
        eventType: 'Manual Heater Override',
        sensor: 'Relay 1 (Heater)',
        previousState: prev.heaterStatus ? 'ON' : 'OFF',
        newState: nextStatus ? 'ON (100%)' : 'OFF',
        actionTaken: nextStatus ? 'Operator manually forced heating ON' : 'Operator manually turned heating OFF',
        severity: 'WARNING',
        status: 'EXECUTED',
      });

      return updated;
    });
  }, [telemetry.emergencyShutdown, addLog]);

  const manualSetServoPosition = useCallback((pos: number) => {
    const clamped = Math.max(0, Math.min(180, Math.round(pos)));
    setOperatingMode('MANUAL CONTROL');
    setTelemetry(prev => {
      const coverState: CoverStatus = clamped >= 160 ? 'CLOSED' : clamped <= 20 ? 'OPEN' : 'MOVING';
      const updated: TelemetryData = {
        ...prev,
        servoPosition: clamped,
        protectiveCover: coverState,
      };

      addLog({
        eventType: 'Manual Servo Angle Commanded',
        sensor: 'Servo Motor (Pin 18)',
        previousState: `${prev.servoPosition}° (${prev.protectiveCover})`,
        newState: `${clamped}° (${coverState})`,
        actionTaken: `Angle manually adjusted to ${clamped}°`,
        severity: 'INFO',
        status: 'EXECUTED',
      });

      return updated;
    });
  }, [addLog]);

  const manualOpenCover = useCallback(() => {
    manualSetServoPosition(0);
  }, [manualSetServoPosition]);

  const manualCloseCover = useCallback(() => {
    manualSetServoPosition(180);
  }, [manualSetServoPosition]);

  const manualStopServo = useCallback(() => {
    setOperatingMode('MANUAL CONTROL');
    addLog({
      eventType: 'Servo Motor Motion Stopped',
      sensor: 'Servo Motor (Pin 18)',
      previousState: `${telemetry.servoPosition}°`,
      newState: `${telemetry.servoPosition}° (HALTED)`,
      actionTaken: 'Operator commanded immediate servo freeze',
      severity: 'WARNING',
      status: 'EXECUTED',
    });
  }, [telemetry.servoPosition, addLog]);

  const triggerEmergencyShutdown = useCallback(() => {
    setOperatingMode('EMERGENCY SHUTDOWN');
    setTelemetry(prev => ({
      ...prev,
      heaterStatus: false,
      heaterDutyCycle: 0,
      heaterReason: 'MANUAL EMERGENCY SHUTDOWN ACTIVATED',
      servoPosition: 90,
      protectiveCover: 'MOVING',
      systemStatus: 'DEGRADED',
      safetyStatus: 'EMERGENCY SHUTDOWN',
      emergencyShutdown: true,
    }));

    raiseAlert({
      severity: 'CRITICAL',
      title: 'Emergency Shutdown Activated Manually',
      description: 'Operator pressed the Emergency Master Interlock. All thermal elements de-energized.',
      sensorSource: 'Operator Console',
      recommendedAction: 'Inspect system physical state before disengaging interlock.',
    });

    addLog({
      eventType: 'Manual Emergency Interlock Tripped',
      sensor: 'Master Console',
      previousState: 'NORMAL',
      newState: 'EMERGENCY_SHUTDOWN',
      actionTaken: 'Heaters isolated, vents locked at 90°, interlock latched',
      severity: 'CRITICAL',
      status: 'EXECUTED',
    });
  }, [raiseAlert, addLog]);

  const resetEmergencyShutdown = useCallback(() => {
    setOperatingMode('AUTO PROTECTION');
    setTelemetry(prev => ({
      ...prev,
      fireDetected: false,
      gasLevel: Math.min(200, prev.gasLevel),
      emergencyShutdown: false,
      systemStatus: 'ONLINE',
      safetyStatus: 'SAFE',
      heaterReason: 'System cleared from emergency shutdown. Returning to Auto Mode.',
    }));

    addLog({
      eventType: 'Emergency Shutdown Cleared',
      sensor: 'Master Console',
      previousState: 'EMERGENCY_SHUTDOWN',
      newState: 'ONLINE',
      actionTaken: 'Interlock reset, automatic protection restored',
      severity: 'INFO',
      status: 'EXECUTED',
    });
  }, [addLog]);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  }, []);

  const resolveAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true, acknowledged: true } : a));
  }, []);

  const clearResolvedAlerts = useCallback(() => {
    setAlerts(prev => prev.filter(a => !a.resolved));
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const toggleLiveJitter = useCallback(() => {
    setLiveJitterEnabled(prev => !prev);
  }, []);

  const manualRefresh = useCallback(() => {
    setTelemetry(prev => ({ ...prev, timestamp: new Date().toISOString() }));
  }, []);

  return (
    <SentinelContext.Provider value={{
      telemetry,
      history,
      activeTab,
      setActiveTab,
      operatingMode,
      setOperatingMode,
      simulationEnabled,
      setSimulationEnabled,
      activeScenarioId,
      loadScenario,
      alerts,
      acknowledgeAlert,
      resolveAlert,
      clearResolvedAlerts,
      logs,
      addLog,
      clearLogs,
      rules,
      settings,
      updateSettings,
      manualHeaterToggle,
      manualSetServoPosition,
      manualOpenCover,
      manualCloseCover,
      manualStopServo,
      triggerEmergencyShutdown,
      resetEmergencyShutdown,
      riskBreakdown,
      liveJitterEnabled,
      toggleLiveJitter,
      manualRefresh,
      scenarioModalOpen,
      setScenarioModalOpen,
    }}>
      {children}
    </SentinelContext.Provider>
  );
}

export function useSentinel() {
  const context = useContext(SentinelContext);
  if (!context) {
    throw new Error('useSentinel must be used within a SentinelProvider');
  }
  return context;
}
