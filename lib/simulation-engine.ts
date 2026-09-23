import { 
  TelemetryData, 
  RiskFactorBreakdown, 
  IcingRiskCategory, 
  ScenarioPreset, 
  AutomationRule, 
  AlertItem, 
  EventLogItem, 
  SystemSettings 
} from './types';

export const INITIAL_SETTINGS: SystemSettings = {
  tempLowWarningThreshold: 0,
  tempCriticalThreshold: -10,
  humidityWarningThreshold: 75,
  humidityCriticalThreshold: 90,
  moistureDetectionEnabled: true,
  automaticHeatingEnabled: true,
  autoCloseCoverOnMoisture: true,
  autoOpenCoverAfterNormal: true,
  fireSensorInterlockEnabled: true,
  gasSensorInterlockEnabled: true,
  emergencyShutdownEnabled: true,
  cooldownDelaySeconds: 45,
  esp32Host: '192.168.1.140',
  esp32Port: 8080,
  mqttBroker: 'mqtt://sentinel-hub.local:1883',
  wifiSSID: 'SENTINEL-ANT-LDK',
  cloudEndpoint: 'https://telemetry.electronauts-sentinel.io/v1/feed',
};

export function calculateIcingRisk(
  temperature: number,
  humidity: number,
  moistureDetected: boolean,
  ultrasonicDistance: number,
  baselineDistance = 15.0
): { score: number; level: IcingRiskCategory; breakdown: RiskFactorBreakdown } {
  // 1. Temperature Risk
  let tempRisk = 10;
  if (temperature > 5) {
    tempRisk = 10;
  } else if (temperature >= 0) {
    tempRisk = 40;
  } else if (temperature >= -10) {
    tempRisk = 75;
  } else {
    tempRisk = 95;
  }

  // 2. Humidity Risk
  let humRisk = 15;
  if (humidity < 60) {
    humRisk = 15;
  } else if (humidity <= 80) {
    humRisk = 45;
  } else if (humidity <= 90) {
    humRisk = 75;
  } else {
    humRisk = 95;
  }

  // 3. Moisture Risk
  const moistureRisk = moistureDetected ? 92 : 12;

  // 4. Surface Accumulation Risk (Baseline vs Current Distance)
  // If sensor is mounted above antenna, snow/ice buildup shortens distance
  const distanceDelta = Math.max(0, baselineDistance - ultrasonicDistance);
  const accumulationMm = distanceDelta * 10; // convert cm delta to mm
  let surfaceRisk = 10;
  if (accumulationMm < 1.0) {
    surfaceRisk = 10;
  } else if (accumulationMm <= 5.0) {
    surfaceRisk = 60;
  } else {
    surfaceRisk = 92;
  }

  // Prototype Rule-Based Weighted Score
  const rawScore = (tempRisk * 0.35) + (humRisk * 0.30) + (moistureRisk * 0.25) + (surfaceRisk * 0.10);
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  let level: IcingRiskCategory = 'LOW';
  if (score >= 80) {
    level = 'CRITICAL';
  } else if (score >= 56) {
    level = 'HIGH';
  } else if (score >= 26) {
    level = 'MODERATE';
  } else {
    level = 'LOW';
  }

  // Recommendations
  let recommendedAction = 'Maintain passive monitoring. Ambient conditions are within operational limits.';
  if (level === 'CRITICAL') {
    recommendedAction = 'IMMEDIATE ACTION: Activate full thermal heating cycle and seal protective radome cover.';
  } else if (level === 'HIGH') {
    recommendedAction = 'HIGH RISK: Pre-emptive anti-icing heating recommended. Prepare protective cover.';
  } else if (level === 'MODERATE') {
    recommendedAction = 'ADVISORY: Monitor sub-zero humidity shifts; keep thermal coil in warm standby.';
  }

  const breakdown: RiskFactorBreakdown = {
    temperatureRisk: tempRisk,
    humidityRisk: humRisk,
    moistureRisk: moistureRisk,
    surfaceAccumulationRisk: surfaceRisk,
    confidencePercentage: 94,
    formulaExplanation: 'Score = (Temp × 0.35) + (Humidity × 0.30) + (Moisture × 0.25) + (Accumulation × 0.10)',
    recommendedAction,
  };

  return { score, level, breakdown };
}

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'scenario-normal',
    name: 'Scenario 1: Normal Operation',
    category: 'Normal',
    description: 'Crisp clear high-altitude daylight conditions. Safe ambient parameters.',
    expectedOutcome: 'Low icing risk (18%), Heater OFF, Cover OPEN (0°), System SAFE.',
    state: {
      temperature: 7.2,
      humidity: 42,
      moistureDetected: false,
      waterRawValue: 240,
      ultrasonicDistance: 15.0,
      surfaceAccumulation: 0.0,
      gasLevel: 145,
      fireDetected: false,
      motionDetected: false,
      heaterStatus: false,
      heaterDutyCycle: 0,
      heaterReason: 'Standby - Nominal weather',
      servoPosition: 0,
      protectiveCover: 'OPEN',
      systemStatus: 'ONLINE',
      safetyStatus: 'SAFE',
      emergencyShutdown: false,
    },
  },
  {
    id: 'scenario-extreme-cold',
    name: 'Scenario 2: Extreme Cold + High Humidity',
    category: 'Weather',
    description: 'Sub-zero alpine freeze with saturated cloud cover over Chang La Pass.',
    expectedOutcome: 'Icing risk HIGH (77%), Pre-emptive heating simulation ON, Warning alert raised.',
    state: {
      temperature: -8.5,
      humidity: 88,
      moistureDetected: false,
      waterRawValue: 560,
      ultrasonicDistance: 14.8,
      surfaceAccumulation: 2.0,
      gasLevel: 190,
      fireDetected: false,
      motionDetected: false,
      heaterStatus: true,
      heaterDutyCycle: 75,
      heaterReason: 'Rule 1: Pre-emptive heating triggered by sub-zero temp & high humidity',
      servoPosition: 45,
      protectiveCover: 'MOVING',
      systemStatus: 'ONLINE',
      safetyStatus: 'WARNING',
      emergencyShutdown: false,
    },
  },
  {
    id: 'scenario-moisture-detected',
    name: 'Scenario 3: Moisture Detected (Freezing Sleet)',
    category: 'Weather',
    description: 'Active liquid moisture / freezing precipitation detected on antenna feed horn.',
    expectedOutcome: 'Moisture alert, Heating simulation ON (100%), Protective cover CLOSED (180°), Event logged.',
    state: {
      temperature: -3.8,
      humidity: 93,
      moistureDetected: true,
      waterRawValue: 2850,
      ultrasonicDistance: 14.1,
      surfaceAccumulation: 9.0,
      gasLevel: 210,
      fireDetected: false,
      motionDetected: false,
      heaterStatus: true,
      heaterDutyCycle: 100,
      heaterReason: 'Rule 2: Anti-icing response active - Moisture detected on feed surface',
      servoPosition: 180,
      protectiveCover: 'CLOSED',
      systemStatus: 'ONLINE',
      safetyStatus: 'WARNING',
      emergencyShutdown: false,
    },
  },
  {
    id: 'scenario-fire-emergency',
    name: 'Scenario 4: Fire Emergency',
    category: 'Hazards',
    description: 'Optical flame sensor tripped. High thermal combustion risk in electronics bay.',
    expectedOutcome: 'CRITICAL alert, Heating simulation forced OFF, Emergency shutdown ON, Cover moves to 90° safe position.',
    state: {
      temperature: 42.0,
      humidity: 28,
      moistureDetected: false,
      waterRawValue: 120,
      ultrasonicDistance: 15.0,
      surfaceAccumulation: 0.0,
      gasLevel: 2890,
      fireDetected: true,
      motionDetected: true,
      heaterStatus: false,
      heaterDutyCycle: 0,
      heaterReason: 'Rule 3: INTERLOCK SHUTDOWN - Active flame detected in radome enclosure',
      servoPosition: 90,
      protectiveCover: 'MOVING',
      systemStatus: 'DEGRADED',
      safetyStatus: 'EMERGENCY SHUTDOWN',
      emergencyShutdown: true,
    },
  },
  {
    id: 'scenario-normalized',
    name: 'Scenario 5: Conditions Normalized',
    category: 'Normal',
    description: 'Post-icing event stabilization. Sunshine returns; frost evaporated.',
    expectedOutcome: 'Risk returns to LOW (19%), Heater OFF after delay, Cover returns to OPEN, SAFE.',
    state: {
      temperature: 6.5,
      humidity: 48,
      moistureDetected: false,
      waterRawValue: 310,
      ultrasonicDistance: 15.0,
      surfaceAccumulation: 0.0,
      gasLevel: 160,
      fireDetected: false,
      motionDetected: false,
      heaterStatus: false,
      heaterDutyCycle: 0,
      heaterReason: 'Rule 4: Thermal deactivation complete - Normal parameters restored',
      servoPosition: 0,
      protectiveCover: 'OPEN',
      systemStatus: 'ONLINE',
      safetyStatus: 'SAFE',
      emergencyShutdown: false,
    },
  },
  {
    id: 'preset-accumulation',
    name: 'Preset: Surface Ice Accumulation',
    category: 'Weather',
    description: 'Ultrasonic depth measurement detects 12mm rime frost accumulation.',
    expectedOutcome: 'High accretion alert, ultrasonic deviation warning, heater pulse triggered.',
    state: {
      temperature: -11.2,
      humidity: 84,
      moistureDetected: false,
      waterRawValue: 480,
      ultrasonicDistance: 13.8,
      surfaceAccumulation: 12.0,
      gasLevel: 155,
      fireDetected: false,
      motionDetected: false,
      heaterStatus: true,
      heaterDutyCycle: 90,
      heaterReason: 'Accretion detected: Ultrasonic surface delta 12.0mm exceeds threshold',
      servoPosition: 180,
      protectiveCover: 'CLOSED',
      systemStatus: 'ONLINE',
      safetyStatus: 'WARNING',
      emergencyShutdown: false,
    },
  },
  {
    id: 'preset-gas-warning',
    name: 'Preset: Dangerous Gas Leak (MQ-2)',
    category: 'Hazards',
    description: 'Battery / backup generator combustible gas level exceeds safety threshold.',
    expectedOutcome: 'Gas interlock triggered, heating inhibited, vent servo opened.',
    state: {
      temperature: 4.1,
      humidity: 50,
      moistureDetected: false,
      waterRawValue: 220,
      ultrasonicDistance: 15.0,
      surfaceAccumulation: 0.0,
      gasLevel: 3120,
      fireDetected: false,
      motionDetected: false,
      heaterStatus: false,
      heaterDutyCycle: 0,
      heaterReason: 'Safety Interlock: Combustible gas level (3120 PPM) exceeds limit',
      servoPosition: 90,
      protectiveCover: 'MOVING',
      systemStatus: 'DEGRADED',
      safetyStatus: 'EMERGENCY SHUTDOWN',
      emergencyShutdown: true,
    },
  },
  {
    id: 'preset-comm-failure',
    name: 'Preset: Communication Failure',
    category: 'Failure',
    description: 'ESP32 telemetry link packet drop simulation.',
    expectedOutcome: 'System DEGRADED banner, connection retry timer, offline contingency active.',
    state: {
      temperature: -2.0,
      humidity: 70,
      moistureDetected: false,
      waterRawValue: 300,
      ultrasonicDistance: 15.0,
      surfaceAccumulation: 0.0,
      gasLevel: 150,
      fireDetected: false,
      motionDetected: false,
      heaterStatus: false,
      heaterDutyCycle: 0,
      heaterReason: 'Heartbeat timeout - Telemetry link packet loss',
      servoPosition: 0,
      protectiveCover: 'OPEN',
      systemStatus: 'DEGRADED',
      safetyStatus: 'WARNING',
      emergencyShutdown: false,
    },
  }
];

export const INITIAL_RULES: AutomationRule[] = [
  {
    id: 'RULE-01',
    name: 'Rule 1: Pre-emptive Anti-Icing Thermal Activation',
    description: 'If temperature is low (≤ 0°C) and relative humidity is high (≥ 75%), activate pre-emptive heating simulation.',
    triggerCondition: 'Temperature ≤ 0°C AND Humidity ≥ 75%',
    action: 'Activate Heater Relay at 75% duty cycle to prevent ice nucleation',
    lastTriggered: null,
    lastResult: 'NORMAL',
    state: 'ENABLED',
  },
  {
    id: 'RULE-02',
    name: 'Rule 2: Moisture Reactive Protection & Radome Closure',
    description: 'If moisture / freezing sleet is detected on the feed horn, activate maximum anti-icing response and close protective cover.',
    triggerCondition: 'Moisture Sensor = DETECTED',
    action: 'Activate Heater 100% + Actuate Servo to 180° (Radome Sealed)',
    lastTriggered: null,
    lastResult: 'NORMAL',
    state: 'ENABLED',
  },
  {
    id: 'RULE-03',
    name: 'Rule 3: Fire & Combustible Gas Emergency Interlock',
    description: 'If fire or dangerous gas is detected, immediately cut off heating simulation and engage emergency shutdown.',
    triggerCondition: 'Flame Sensor = DETECTED OR MQ-2 Gas > 2500 ADC',
    action: 'FORCE Heater OFF + Engage Safety Interlock + Open Vents to 90°',
    lastTriggered: null,
    lastResult: 'NORMAL',
    state: 'ENABLED',
  },
  {
    id: 'RULE-04',
    name: 'Rule 4: Post-Icing Normalization & Cooldown Delay',
    description: 'If conditions return to normal safe thresholds, deactivate heating simulation after a 45-second cooldown cycle.',
    triggerCondition: 'Temp > 2°C AND Humidity < 70% AND Moisture = DRY',
    action: 'Ramp down Heater to 0% + Command Servo to 0° (Radome Open)',
    lastTriggered: null,
    lastResult: 'NORMAL',
    state: 'ENABLED',
  },
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'ALT-101',
    severity: 'INFO',
    title: 'Prototype Telemetry Link Initialized',
    description: 'ESP32 simulated connection online. All 7 environmental telemetry channels streaming.',
    timestamp: new Date().toLocaleTimeString(),
    sensorSource: 'ESP32 Core / Telemetry Bus',
    recommendedAction: 'Verify baseline sensor calibrations and servo radome alignment.',
    acknowledged: true,
    resolved: true,
  },
];

export const INITIAL_LOGS: EventLogItem[] = [
  {
    id: 'LOG-7001',
    timestamp: '01:45:10',
    eventType: 'System Boot',
    sensor: 'ESP32 Controller',
    previousState: 'OFFLINE',
    newState: 'ONLINE',
    actionTaken: 'Self-test completed, telemetry established',
    severity: 'INFO',
    status: 'EXECUTED',
  },
  {
    id: 'LOG-7002',
    timestamp: '01:45:12',
    eventType: 'Baseline Distance Recorded',
    sensor: 'Ultrasonic Accumulation',
    previousState: 'UNINITIALIZED',
    newState: '15.0 cm',
    actionTaken: 'Zero-ice surface baseline calibrated',
    severity: 'INFO',
    status: 'EXECUTED',
  },
  {
    id: 'LOG-7003',
    timestamp: '01:46:00',
    eventType: 'Servo Cover Initialized',
    sensor: 'Radome Servo (Pin 18)',
    previousState: 'UNKNOWN',
    newState: '0° (OPEN)',
    actionTaken: 'Calibrated to nominal open position',
    severity: 'INFO',
    status: 'EXECUTED',
  },
];
