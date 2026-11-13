/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  Power,
  Volume2,
  Volume1,
  VolumeX,
  Sliders,
  Smartphone,
  Laptop,
  Zap,
  Download,
  Layers,
  ChevronLeft,
  Settings,
  Sparkles
} from 'lucide-react';
import { soundEffects } from './services/soundEffects';
import { useBatteryGuardian } from './hooks/useBatteryGuardian';
import { useWakeLock } from './hooks/useWakeLock';
import { FloatingTouchBubble } from './components/FloatingTouchBubble';
import { AssistiveControlCenter } from './components/AssistiveControlCenter';
import { OledSleepWakeView } from './components/OledSleepWakeView';
import { BatteryGuardianCard } from './components/BatteryGuardianCard';
import { RealmeEmergencyGuide } from './components/RealmeEmergencyGuide';
import { OppoUsbPowerHub } from './components/OppoUsbPowerHub';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { SoftwareDimmerOverlay } from './components/SoftwareDimmerOverlay';
import { TopNavigationBar, NavTabType } from './components/TopNavigationBar';
import { BottomNavigationBar } from './components/BottomNavigationBar';
import { RecentAppsDrawer } from './components/RecentAppsDrawer';
import {
  PreferencesModal,
  AppPreferences
} from './components/PreferencesModal';

const DEFAULT_PREFERENCES: AppPreferences = {
  placementMode: 'both',
  buttonOrder: 'recent_home_back',
  iconStyle: 'geometric',
  bubbleEnabled: true,
  bubbleOpacity: '60',
  bubbleSize: 'compact',
  sirenEnabled: true,
  alertAt20: true,
  alertAt10: true,
  doubleTapSleepEnabled: true,
  showStandbyClock: true,
  wakeLockAutoStart: true,
  showUsbBootTab: true
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabType>('controller');
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [isOledSleepActive, setIsOledSleepActive] = useState<boolean>(false);
  const [volumeLevel, setVolumeLevel] = useState<number>(70);
  const [brightnessLevel, setBrightnessLevel] = useState<number>(100);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // App Feature Preferences State (Persistent in localStorage)
  const [preferences, setPreferences] = useState<AppPreferences>(DEFAULT_PREFERENCES);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState<boolean>(false);
  const [isRecentsDrawerOpen, setIsRecentsDrawerOpen] = useState<boolean>(false);

  // Load preferences from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('touchassist_preferences');
        if (stored) {
          const parsed = JSON.parse(stored);
          setPreferences((prev) => ({ ...prev, ...parsed }));
        }
      } catch {
        // fallback to defaults
      }
    }
  }, []);

  const handleUpdatePreferences = (updated: Partial<AppPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...updated };
      if (typeof window !== 'undefined') {
        localStorage.setItem('touchassist_preferences', JSON.stringify(next));
      }
      return next;
    });
    showToast('Preferences updated');
  };

  const handleResetDefaults = () => {
    setPreferences(DEFAULT_PREFERENCES);
    if (typeof window !== 'undefined') {
      localStorage.setItem('touchassist_preferences', JSON.stringify(DEFAULT_PREFERENCES));
    }
    showToast('Preferences reset to default');
  };

  // Robust double-tap gesture tracking (prevents duplicate event firing & scroll false triggers)
  const lastTapRef = useRef<{ time: number; x: number; y: number }>({ time: 0, x: 0, y: 0 });

  // Battery Guardian & Screen Wake Lock
  const battery = useBatteryGuardian();
  const wakeLock = useWakeLock();

  const showToast = (text: string) => {
    setToastMsg(text);
    setTimeout(() => setToastMsg(null), 2200);
  };

  // Unified Pointer-based double-tap handler without synthetic touch/click collisions
  const handleMainPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!preferences.doubleTapSleepEnabled) return;
    if (!e.isPrimary) return;

    // Ignore interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('a') ||
      target.closest('aside') ||
      target.closest('header') ||
      target.closest('[role="button"]') ||
      target.closest('.no-double-tap')
    ) {
      return;
    }

    const now = Date.now();
    const prev = lastTapRef.current;
    const timeDiff = now - prev.time;
    const dist = Math.hypot(e.clientX - prev.x, e.clientY - prev.y);

    // True intentional double tap: 80ms - 380ms apart, within 25px radius
    if (timeDiff >= 80 && timeDiff <= 380 && dist <= 25) {
      soundEffects.playSleepTone();
      setIsOledSleepActive(true);
      lastTapRef.current = { time: 0, x: 0, y: 0 };
    } else {
      lastTapRef.current = { time: now, x: e.clientX, y: e.clientY };
    }
  };

  const handleVolumeUp = () => {
    const next = Math.min(100, volumeLevel + 10);
    setVolumeLevel(next);
    soundEffects.playVolumeTone(next);
    showToast(`Volume: ${next}%`);
  };

  const handleVolumeDown = () => {
    const next = Math.max(0, volumeLevel - 10);
    setVolumeLevel(next);
    soundEffects.playVolumeTone(next);
    showToast(`Volume: ${next}%`);
  };

  const handleMute = () => {
    if (volumeLevel === 0) {
      setVolumeLevel(50);
      soundEffects.playVolumeTone(50);
      showToast('Unmuted (50%)');
    } else {
      setVolumeLevel(0);
      soundEffects.playClick();
      showToast('Muted (0%)');
    }
  };

  const handlePressHome = () => {
    soundEffects.playClick();
    setActiveTab('controller');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsRecentsDrawerOpen(false);
    setIsPanelOpen(false);
    showToast('Home');
  };

  const handlePressBack = () => {
    soundEffects.playClick();
    if (isRecentsDrawerOpen) {
      setIsRecentsDrawerOpen(false);
      return;
    }
    if (isPanelOpen) {
      setIsPanelOpen(false);
      return;
    }
    if (activeTab !== 'controller') {
      setActiveTab('controller');
      showToast('Returned to Control Hub');
      return;
    }
    if (window.history.length > 1) {
      window.history.back();
    }
    showToast('Back');
  };

  const handlePressRecent = () => {
    soundEffects.playClick();
    setIsRecentsDrawerOpen(true);
  };

  const showBottomDock =
    preferences.placementMode === 'both' || preferences.placementMode === 'bottom_dock';

  return (
    <div
      onPointerDown={handleMainPointerDown}
      className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col relative selection:bg-cyan-500 selection:text-slate-950 font-sans"
    >
      {/* Software Screen Dimmer Overlay */}
      <SoftwareDimmerOverlay brightnessLevel={brightnessLevel} />

      {/* Top Navigation Bar with Strict 3-Zone Contract */}
      <TopNavigationBar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onEnterSleep={() => setIsOledSleepActive(true)}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        showUsbBootTab={preferences.showUsbBootTab}
      />

      {/* Main Content Area */}
      <main
        className={`flex-1 w-full max-w-4xl mx-auto px-4 py-5 space-y-5 ${
          showBottomDock ? 'pb-32' : 'pb-24'
        }`}
      >
        {/* Toast Notification Banner */}
        {toastMsg && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-slate-900/95 border border-cyan-500/50 text-cyan-200 text-xs font-semibold shadow-2xl backdrop-blur-xl animate-fade-in flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {toastMsg}
          </div>
        )}

        {/* PWA Standalone Install Banner */}
        <PWAInstallBanner />

        {/* 1. CONTROLLER TAB */}
        {activeTab === 'controller' && (
          <div className="space-y-5">
            {/* High-End Flagship Hardware Status Hub */}
            <div className="rounded-3xl bg-linear-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border border-white/[0.08] p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              {/* Subtle top ambient glow */}
              <div className="absolute top-0 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-cyan-500/40 to-transparent pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-[10px] font-bold tracking-wide uppercase">
                      TouchAssist Pro
                    </span>
                    <span className="text-xs text-slate-400">
                      Oppo CPH1909 & Android Suite
                    </span>
                  </div>
                  <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                    Full Assistive Hardware Control
                  </h1>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                    Operate Home, Power, Volume, and Navigation gestures on-screen without touching physical buttons. Double-tap anywhere to put the screen into battery-saving OLED sleep.
                  </p>
                </div>

                {/* Quick Action Chips */}
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => setIsPreferencesOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/[0.08] text-slate-200 text-xs font-semibold active:scale-95 transition-all shadow-xs"
                    title="Customize Controls"
                  >
                    <Settings className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Customize</span>
                  </button>

                  <button
                    onClick={wakeLock.toggleWakeLock}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold active:scale-95 transition-all shadow-xs ${
                      wakeLock.isActive
                        ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-800/80 border-white/[0.08] text-slate-300'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{wakeLock.isActive ? 'Screen Awake' : 'Normal Timeout'}</span>
                  </button>
                </div>
              </div>

              {/* Tactile On-Screen Buttons Strip with Neo-Skeuomorphic depth */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    Primary Navigation & Hardware Controls:
                  </span>
                  <button
                    onClick={() => setIsPreferencesOpen(true)}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-normal"
                  >
                    Reorder ({preferences.buttonOrder === 'recent_home_back' ? '■ · ● · ◀' : '◀ · ● · ■'})
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {preferences.buttonOrder === 'recent_home_back' ? (
                    <>
                      <button
                        onClick={handlePressRecent}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-linear-to-b from-slate-800/90 to-slate-900/90 border border-white/[0.08] hover:border-cyan-500/50 active:scale-95 transition-all group shadow-md"
                      >
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-2 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors shadow-inner">
                          <Layers className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-white">Recent Apps</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Task Switcher</span>
                      </button>

                      <button
                        onClick={handlePressHome}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-linear-to-b from-slate-800/90 to-slate-900/90 border border-cyan-500/40 hover:border-cyan-400 active:scale-95 transition-all group shadow-md shadow-cyan-950/40"
                      >
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/25 border border-cyan-400/50 text-cyan-300 flex items-center justify-center mb-2 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors shadow-inner">
                          <Home className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-cyan-300">Home Button</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Dashboard / Exit</span>
                      </button>

                      <button
                        onClick={handlePressBack}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-linear-to-b from-slate-800/90 to-slate-900/90 border border-white/[0.08] hover:border-cyan-500/50 active:scale-95 transition-all group shadow-md"
                      >
                        <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-white/[0.06] text-slate-300 flex items-center justify-center mb-2 group-hover:bg-slate-700 group-hover:text-white transition-colors shadow-inner">
                          <ChevronLeft className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-white">Back Button</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Previous View</span>
                      </button>

                      <button
                        onClick={() => {
                          soundEffects.playSleepTone();
                          setIsOledSleepActive(true);
                        }}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-linear-to-b from-slate-800/90 to-slate-900/90 border border-red-500/30 hover:border-red-400 active:scale-95 transition-all group shadow-md shadow-red-950/20"
                      >
                        <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mb-2 group-hover:bg-red-500 group-hover:text-white transition-colors shadow-inner">
                          <Power className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-red-300">Power Button</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Double-Tap Standby</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handlePressBack}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-linear-to-b from-slate-800/90 to-slate-900/90 border border-white/[0.08] hover:border-cyan-500/50 active:scale-95 transition-all group shadow-md"
                      >
                        <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-white/[0.06] text-slate-300 flex items-center justify-center mb-2 group-hover:bg-slate-700 group-hover:text-white transition-colors shadow-inner">
                          <ChevronLeft className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-white">Back Button</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Previous View</span>
                      </button>

                      <button
                        onClick={handlePressHome}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-linear-to-b from-slate-800/90 to-slate-900/90 border border-cyan-500/40 hover:border-cyan-400 active:scale-95 transition-all group shadow-md shadow-cyan-950/40"
                      >
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/25 border border-cyan-400/50 text-cyan-300 flex items-center justify-center mb-2 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors shadow-inner">
                          <Home className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-cyan-300">Home Button</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Dashboard / Exit</span>
                      </button>

                      <button
                        onClick={handlePressRecent}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-linear-to-b from-slate-800/90 to-slate-900/90 border border-white/[0.08] hover:border-cyan-500/50 active:scale-95 transition-all group shadow-md"
                      >
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-2 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors shadow-inner">
                          <Layers className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-white">Recent Apps</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Task Switcher</span>
                      </button>

                      <button
                        onClick={() => {
                          soundEffects.playSleepTone();
                          setIsOledSleepActive(true);
                        }}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-linear-to-b from-slate-800/90 to-slate-900/90 border border-red-500/30 hover:border-red-400 active:scale-95 transition-all group shadow-md shadow-red-950/20"
                      >
                        <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mb-2 group-hover:bg-red-500 group-hover:text-white transition-colors shadow-inner">
                          <Power className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-red-300">Power Button</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Double-Tap Standby</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Hardware Volume Control Strip (+ and -) */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={handleVolumeUp}
                  className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-slate-800/60 border border-white/[0.08] hover:border-emerald-500/50 active:scale-98 transition-all text-slate-200 shadow-sm"
                >
                  <Volume2 className="w-4.5 h-4.5 text-emerald-400" />
                  <span className="text-xs font-bold">Volume Up (+)</span>
                </button>

                <button
                  onClick={handleVolumeDown}
                  className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-slate-800/60 border border-white/[0.08] hover:border-amber-500/50 active:scale-98 transition-all text-slate-200 shadow-sm"
                >
                  <Volume1 className="w-4.5 h-4.5 text-amber-400" />
                  <span className="text-xs font-bold">Volume Down (-)</span>
                </button>
              </div>

              {/* Master Volume Controller Slider */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-950/80 border border-white/[0.06]">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-2.5">
                  <span className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    Master Audio Volume
                  </span>
                  <span className="font-mono text-cyan-400 tabular-nums text-sm font-bold">
                    {volumeLevel}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleMute}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      volumeLevel === 0
                        ? 'bg-red-500/20 border-red-500/50 text-red-400'
                        : 'bg-slate-800 border-white/[0.08] text-slate-300 hover:text-white'
                    }`}
                  >
                    {volumeLevel === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volumeLevel}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setVolumeLevel(val);
                      soundEffects.playVolumeTone(val);
                    }}
                    className="w-full h-2 rounded-lg bg-slate-800 accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Windows USB 1-Click Power-On Spotlight Card */}
            <div className="rounded-3xl bg-linear-to-r from-cyan-950/50 via-slate-900/80 to-blue-950/50 border border-cyan-500/30 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 flex items-center justify-center shrink-0">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      Windows 10 / 11 Tool
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-0.5">
                    Revive dead phone via PC USB cable with 1 click
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Downloadable 1-click batch script & direct WebUSB browser reboot tool for Oppo CPH1909 and Android phones.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab('usb_boot');
                }}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs active:scale-95 transition-all shadow-md shrink-0 whitespace-nowrap flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Open USB Boot Tool
              </button>
            </div>

            {/* Battery Guardian Section */}
            <BatteryGuardianCard
              batteryLevel={battery.level}
              isCharging={battery.charging}
              isAlarmActive={battery.isAlarmActive}
              alarmLevel={battery.alarmLevel}
              onDismissAlarm={battery.dismissAlarm}
              onTriggerTest={battery.triggerTestAlarm}
              onOpenGuide={() => setActiveTab('guide')}
              isSupported={battery.isSupported}
            />
          </div>
        )}

        {/* 2. BATTERY GUARDIAN TAB */}
        {activeTab === 'battery' && (
          <div className="space-y-5">
            <BatteryGuardianCard
              batteryLevel={battery.level}
              isCharging={battery.charging}
              isAlarmActive={battery.isAlarmActive}
              alarmLevel={battery.alarmLevel}
              onDismissAlarm={battery.dismissAlarm}
              onTriggerTest={battery.triggerTestAlarm}
              onOpenGuide={() => setActiveTab('guide')}
              isSupported={battery.isSupported}
            />

            {/* Battery Saving & Protection Tips */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 text-slate-100">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-amber-400" />
                Battery Preservation & Accidental Power-Off Prevention
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
                  <strong className="text-white block mb-1">1. Use OLED Standby:</strong>
                  Double-tap anywhere on the screen to enter OLED Standby. Black pixels consume 0 power on OLED displays, preserving battery without physically shutting down.
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
                  <strong className="text-white block mb-1">2. Charge at 20%:</strong>
                  The Battery Guardian will sound warning sirens at 20% and 10%. Connect your charger as soon as you hear the siren to avoid total power loss.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. PC USB BOOT TAB */}
        {activeTab === 'usb_boot' && (
          <div className="space-y-5">
            <OppoUsbPowerHub />
          </div>
        )}

        {/* 4. EMERGENCY GUIDE TAB */}
        {activeTab === 'guide' && (
          <div className="space-y-5">
            <RealmeEmergencyGuide />
          </div>
        )}
      </main>

      {/* Fixed Bottom Android 3-Button Navigation Bar */}
      {showBottomDock && (
        <BottomNavigationBar
          onPressRecent={handlePressRecent}
          onPressHome={handlePressHome}
          onPressBack={handlePressBack}
          onOpenSettings={() => setIsPreferencesOpen(true)}
          buttonOrder={preferences.buttonOrder}
          iconStyle={preferences.iconStyle}
        />
      )}

      {/* Compact 60% Translucent Floating Assistive Touch Bubble (if enabled) */}
      {preferences.bubbleEnabled && (
        <FloatingTouchBubble
          isOpen={isPanelOpen}
          onOpenPanel={() => setIsPanelOpen(true)}
          onQuickSleep={() => setIsOledSleepActive(true)}
          opacityMode={preferences.bubbleOpacity}
          sizeMode={preferences.bubbleSize}
        />
      )}

      {/* Expandable Assistive Control Center Modal */}
      <AssistiveControlCenter
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onGoHome={handlePressHome}
        onPressBack={handlePressBack}
        onPressRecent={handlePressRecent}
        onEnterOledSleep={() => setIsOledSleepActive(true)}
        volumeLevel={volumeLevel}
        onVolumeChange={(val) => setVolumeLevel(val)}
        brightnessLevel={brightnessLevel}
        onBrightnessChange={(val) => setBrightnessLevel(val)}
        wakeLockActive={wakeLock.isActive}
        onToggleWakeLock={wakeLock.toggleWakeLock}
        onOpenGuide={() => {
          setActiveTab('guide');
          setIsPanelOpen(false);
        }}
        onOpenUsbBoot={() => {
          setActiveTab('usb_boot');
          setIsPanelOpen(false);
        }}
        onOpenPreferences={() => {
          setIsPreferencesOpen(true);
          setIsPanelOpen(false);
        }}
        buttonOrder={preferences.buttonOrder}
      />

      {/* Recent Apps Task Switcher Drawer */}
      <RecentAppsDrawer
        isOpen={isRecentsDrawerOpen}
        onClose={() => setIsRecentsDrawerOpen(false)}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsRecentsDrawerOpen(false);
        }}
        onTriggerOledSleep={() => {
          setIsRecentsDrawerOpen(false);
          setIsOledSleepActive(true);
        }}
      />

      {/* Master Feature Preferences & Customization Modal */}
      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
        onResetDefaults={handleResetDefaults}
      />

      {/* Fullscreen AMOLED 100% Black Sleep Screen with Double-Tap Wake */}
      <OledSleepWakeView
        isActive={isOledSleepActive}
        onWake={() => setIsOledSleepActive(false)}
        batteryLevel={battery.level}
        isCharging={battery.charging}
        showMinimalClock={preferences.showStandbyClock}
      />
    </div>
  );
}
