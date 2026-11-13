import { useState, useEffect, useCallback, useRef } from 'react';
import { soundEffects } from '../services/soundEffects';

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  onchargingchange: ((this: BatteryManager, ev: Event) => void) | null;
  onchargingtimechange: ((this: BatteryManager, ev: Event) => void) | null;
  ondischargingtimechange: ((this: BatteryManager, ev: Event) => void) | null;
  onlevelchange: ((this: BatteryManager, ev: Event) => void) | null;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

export function useBatteryGuardian() {
  const [level, setLevel] = useState<number>(75); // 0 - 100
  const [charging, setCharging] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isAlarmActive, setIsAlarmActive] = useState<boolean>(false);
  const [alarmLevel, setAlarmLevel] = useState<number | null>(null); // 20 or 10 or 5
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Keep track of which threshold alerts have already fired in current discharge cycle
  const firedAlertsRef = useRef<{ [key: number]: boolean }>({ 20: false, 10: false, 5: false });

  // Handle emergency siren based on battery state
  const checkBatteryThresholds = useCallback((currLevel: number, isCurrCharging: boolean) => {
    // If charging, immediately silence alarms and reset triggers
    if (isCurrCharging) {
      if (isAlarmActive) {
        soundEffects.stopEmergencySiren();
        setIsAlarmActive(false);
        setAlarmLevel(null);
      }
      firedAlertsRef.current = { 20: false, 10: false, 5: false };
      return;
    }

    // Discharging triggers
    if (currLevel <= 5 && !firedAlertsRef.current[5]) {
      firedAlertsRef.current[5] = true;
      setAlarmLevel(5);
      setIsAlarmActive(true);
      if (!isMuted) soundEffects.startEmergencySiren();
    } else if (currLevel <= 10 && !firedAlertsRef.current[10]) {
      firedAlertsRef.current[10] = true;
      setAlarmLevel(10);
      setIsAlarmActive(true);
      if (!isMuted) soundEffects.startEmergencySiren();
    } else if (currLevel <= 20 && !firedAlertsRef.current[20]) {
      firedAlertsRef.current[20] = true;
      setAlarmLevel(20);
      setIsAlarmActive(true);
      if (!isMuted) soundEffects.startEmergencySiren();
    }
  }, [isAlarmActive, isMuted]);

  useEffect(() => {
    const nav = typeof navigator !== 'undefined' ? (navigator as NavigatorWithBattery) : null;
    let batteryInstance: BatteryManager | null = null;

    if (nav && typeof nav.getBattery === 'function') {
      nav.getBattery().then((battery) => {
        batteryInstance = battery;
        setIsSupported(true);
        const initialLevel = Math.round(battery.level * 100);
        setLevel(initialLevel);
        setCharging(battery.charging);
        checkBatteryThresholds(initialLevel, battery.charging);

        const handleLevelChange = () => {
          const newLevel = Math.round(battery.level * 100);
          setLevel(newLevel);
          checkBatteryThresholds(newLevel, battery.charging);
        };

        const handleChargingChange = () => {
          setCharging(battery.charging);
          checkBatteryThresholds(Math.round(battery.level * 100), battery.charging);
        };

        battery.addEventListener('levelchange', handleLevelChange);
        battery.addEventListener('chargingchange', handleChargingChange);
      }).catch(() => {
        setIsSupported(false);
      });
    }

    return () => {
      soundEffects.stopEmergencySiren();
    };
  }, [checkBatteryThresholds]);

  // Test siren alert manually
  const triggerTestAlarm = (testLvl: number = 20) => {
    setAlarmLevel(testLvl);
    setIsAlarmActive(true);
    soundEffects.startEmergencySiren();
  };

  // Silence active alarm
  const dismissAlarm = () => {
    soundEffects.stopEmergencySiren();
    setIsAlarmActive(false);
    setAlarmLevel(null);
  };

  // Set manual level (e.g. for testing when browser doesn't report battery)
  const setSimulatedLevel = (newVal: number) => {
    setLevel(newVal);
    checkBatteryThresholds(newVal, charging);
  };

  const toggleSimulatedCharging = () => {
    const nextState = !charging;
    setCharging(nextState);
    checkBatteryThresholds(level, nextState);
  };

  return {
    level,
    charging,
    isSupported,
    isAlarmActive,
    alarmLevel,
    isMuted,
    setIsMuted,
    dismissAlarm,
    triggerTestAlarm,
    setSimulatedLevel,
    toggleSimulatedCharging
  };
}
