export type IcingRiskCategory = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type OperatingMode = 
  | 'AUTO PROTECTION' 
  | 'MANUAL CONTROL' 
  | 'SAFE MODE' 
  | 'EMERGENCY SHUTDOWN';

export type SystemStatus = 'ONLINE' | 'OFFLINE' | 'DEGRADED';
export type SafetyStatus = 'SAFE' | 'WARNING' | 'EMERGENCY SHUTDOWN';
export type CoverStatus = 'OPEN' | 'CLOSED' | 'MOVING';
export type MoistureState = 'DRY' | 'MOISTURE DETECTED' | 'WATER/CONDENSATION WARNING';
export type AlertSeverity = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';

export interface TelemetryData {
  temperature: number;             // °C
  humidity: number;                // %
  moistureDetected: boolean;       // water sensor
  waterRawValue: number;           // ADC value 0-4095
  ultrasonicDistance: number;      // cm
  baselineDistance: number;        // cm (default 15.0 cm)
  surfaceAccumulation: number;     // mm calculated (baseline - current) * 10
  gasLevel: number;                // MQ-2 ADC value (0-4095)
  fireDetected: boolean;           // Flame sensor (active LOW)
  motionDetected: boolean;         // PIR sensor
  icingRiskScore: number;          // 0-100
  icingRiskLevel: IcingRiskCategory;
  heaterStatus: boolean;           // Relay 1
  heaterDutyCycle: number;         // 0-100% simulated power
  heaterDurationSeconds: number;   // active heating duration
  heaterReason: string;            // Operating reason
  servoPosition: number;           // 0-180 degrees
  protectiveCover: CoverStatus;    // OPEN / CLOSED / MOVING
  systemStatus: SystemStatus;
  safetyStatus: SafetyStatus;
  emergencyShutdown: boolean;
  timestamp: string;               // ISO timestamp
  lastMotionTimestamp: string;
  lastMoistureTimestamp: string;
  controller: string;              // "ESP32 Node (WROOM-32)"
  connectionMode: string;          // "Prototype Simulation"
}

export interface RiskFactorBreakdown {
  temperatureRisk: number;         // 0-100
  humidityRisk: number;            // 0-100
  moistureRisk: number;            // 0-100
  surfaceAccumulationRisk: number; // 0-100
  confidencePercentage: number;    // e.g. 94%
  formulaExplanation: string;
  recommendedAction: string;
}

export interface AlertItem {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  timestamp: string;
  sensorSource: string;
  recommendedAction: string;
  acknowledged: boolean;
  resolved: boolean;
}

export interface EventLogItem {
  id: string;
  timestamp: string;
  eventType: string;
  sensor: string;
  previousState: string;
  newState: string;
  actionTaken: string;
  severity: AlertSeverity;
  status: 'EXECUTED' | 'STANDBY' | 'BLOCKED_BY_SAFETY' | 'ACKNOWLEDGED';
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  triggerCondition: string;
  action: string;
  lastTriggered: string | null;
  lastResult: 'ACTIVE' | 'NORMAL' | 'INTERLOCKED' | 'PENDING';
  state: 'ENABLED' | 'DISABLED';
}

export interface SystemSettings {
  tempLowWarningThreshold: number;     // °C (default 0)
  tempCriticalThreshold: number;        // °C (default -10)
  humidityWarningThreshold: number;     // % (default 75)
  humidityCriticalThreshold: number;    // % (default 90)
  moistureDetectionEnabled: boolean;
  automaticHeatingEnabled: boolean;
  autoCloseCoverOnMoisture: boolean;
  autoOpenCoverAfterNormal: boolean;
  fireSensorInterlockEnabled: boolean;
  gasSensorInterlockEnabled: boolean;
  emergencyShutdownEnabled: boolean;
  cooldownDelaySeconds: number;         // seconds before shutting heater off after normal
  esp32Host: string;
  esp32Port: number;
  mqttBroker: string;
  wifiSSID: string;
  cloudEndpoint: string;
}

export interface ScenarioPreset {
  id: string;
  name: string;
  category: 'Normal' | 'Weather' | 'Hazards' | 'Failure';
  description: string;
  expectedOutcome: string;
  state: Partial<TelemetryData>;
}

export interface HistoricalDataPoint {
  time: string;
  temperature: number;
  humidity: number;
  riskScore: number;
  heaterStatus: number; // 0 or 1
  gasLevel: number;
  distance: number;
}
