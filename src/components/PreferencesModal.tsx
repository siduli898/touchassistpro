import React from 'react';
import {
  X,
  Check,
  Settings,
  Layout,
  ArrowLeftRight,
  Bell,
  Smartphone,
  Eye,
  Sliders,
  Laptop,
  Moon,
  Sparkles
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

export type NavPlacementMode = 'both' | 'bottom_dock' | 'panel_only' | 'hidden';
export type NavButtonOrder = 'recent_home_back' | 'back_home_recent';
export type NavIconStyle = 'geometric' | 'standard';
export type BubbleOpacity = '60' | '80' | '100';
export type BubbleSize = 'compact' | 'standard';

export interface AppPreferences {
  // Navigation Bar
  placementMode: NavPlacementMode;
  buttonOrder: NavButtonOrder;
  iconStyle: NavIconStyle;
  // Floating Bubble
  bubbleEnabled: boolean;
  bubbleOpacity: BubbleOpacity;
  bubbleSize: BubbleSize;
  // Battery Guardian
  sirenEnabled: boolean;
  alertAt20: boolean;
  alertAt10: boolean;
  // Gestures & Screen
  doubleTapSleepEnabled: boolean;
  showStandbyClock: boolean;
  wakeLockAutoStart: boolean;
  // Navigation Tabs
  showUsbBootTab: boolean;
}

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: AppPreferences;
  onUpdatePreferences: (updated: Partial<AppPreferences>) => void;
  onResetDefaults: () => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
  onResetDefaults
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-slate-100 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Preferences & Features
              </h2>
              <p className="text-[11px] text-slate-400">
                Customize, toggle, or re-order any control
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-5 my-4 pr-1 text-xs">
          {/* SECTION 1: 3-Button Navigation Bar */}
          <div className="space-y-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Layout className="w-4 h-4 text-cyan-400" />
                3-Button Navigation Bar
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">
                {preferences.buttonOrder === 'recent_home_back' ? '■ · ● · ◀' : '◀ · ● · ■'}
              </span>
            </div>

            {/* Placement Mode */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                Placement & Visibility:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onUpdatePreferences({ placementMode: 'both' });
                  }}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    preferences.placementMode === 'both'
                      ? 'bg-cyan-950/70 border-cyan-500/70 text-cyan-200 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="block font-medium">Dual Mode</span>
                  <span className="text-[9px] text-slate-500">Bottom dock & Panel</span>
                </button>

                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onUpdatePreferences({ placementMode: 'bottom_dock' });
                  }}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    preferences.placementMode === 'bottom_dock'
                      ? 'bg-cyan-950/70 border-cyan-500/70 text-cyan-200 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="block font-medium">Bottom Dock Only</span>
                  <span className="text-[9px] text-slate-500">Fixed screen bottom</span>
                </button>

                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onUpdatePreferences({ placementMode: 'panel_only' });
                  }}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    preferences.placementMode === 'panel_only'
                      ? 'bg-cyan-950/70 border-cyan-500/70 text-cyan-200 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="block font-medium">Panel Only</span>
                  <span className="text-[9px] text-slate-500">Inside touch center</span>
                </button>

                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onUpdatePreferences({ placementMode: 'hidden' });
                  }}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    preferences.placementMode === 'hidden'
                      ? 'bg-cyan-950/70 border-cyan-500/70 text-cyan-200 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="block font-medium">Hidden</span>
                  <span className="text-[9px] text-slate-500">Turn off nav bars</span>
                </button>
              </div>
            </div>

            {/* Button Order */}
            <div className="pt-2 border-t border-slate-900">
              <label className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                Button Order:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onUpdatePreferences({ buttonOrder: 'recent_home_back' });
                  }}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    preferences.buttonOrder === 'recent_home_back'
                      ? 'bg-cyan-950/70 border-cyan-500/70 text-cyan-300 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-mono text-xs mb-0.5">■ · ● · ◀</div>
                  <span className="text-[10px]">Recents · Home · Back</span>
                </button>

                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onUpdatePreferences({ buttonOrder: 'back_home_recent' });
                  }}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    preferences.buttonOrder === 'back_home_recent'
                      ? 'bg-cyan-950/70 border-cyan-500/70 text-cyan-300 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-mono text-xs mb-0.5">◀ · ● · ■</div>
                  <span className="text-[10px]">Back · Home · Recents</span>
                </button>
              </div>
            </div>

            {/* Icon Style */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-900">
              <span className="text-slate-300">Navigation Button Style:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onUpdatePreferences({ iconStyle: 'geometric' });
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono ${
                    preferences.iconStyle === 'geometric'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  ■ ● ◀
                </button>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onUpdatePreferences({ iconStyle: 'standard' });
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    preferences.iconStyle === 'standard'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Icons
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: Floating Assistive Touch Bubble */}
          <div className="space-y-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                Floating Assistive Bubble
              </span>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onUpdatePreferences({ bubbleEnabled: !preferences.bubbleEnabled });
                }}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  preferences.bubbleEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    preferences.bubbleEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {preferences.bubbleEnabled && (
              <>
                {/* Opacity */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                  <span className="text-slate-400">Idle Translucency:</span>
                  <div className="flex gap-1">
                    {(['60', '80', '100'] as BubbleOpacity[]).map((op) => (
                      <button
                        key={op}
                        onClick={() => {
                          soundEffects.playClick();
                          onUpdatePreferences({ bubbleOpacity: op });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                          preferences.bubbleOpacity === op
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        {op === '60' ? '60% Glass' : `${op}%`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                  <span className="text-slate-400">Bubble Dimensions:</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        onUpdatePreferences({ bubbleSize: 'compact' });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        preferences.bubbleSize === 'compact'
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      Compact (42px)
                    </button>
                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        onUpdatePreferences({ bubbleSize: 'standard' });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        preferences.bubbleSize === 'standard'
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      Standard (50px)
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* SECTION 3: Battery Guardian & Siren Alerts */}
          <div className="space-y-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-emerald-400" />
                Battery Guardian & Alarm Siren
              </span>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onUpdatePreferences({ sirenEnabled: !preferences.sirenEnabled });
                }}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  preferences.sirenEnabled ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    preferences.sirenEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {preferences.sirenEnabled && (
              <div className="space-y-2 pt-2 border-t border-slate-900">
                <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                  <span>Alert at 20% Battery (First Siren)</span>
                  <input
                    type="checkbox"
                    checked={preferences.alertAt20}
                    onChange={(e) => {
                      soundEffects.playClick();
                      onUpdatePreferences({ alertAt20: e.target.checked });
                    }}
                    className="w-4 h-4 rounded bg-slate-800 accent-emerald-500"
                  />
                </label>
                <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                  <span>Alert at 10% Battery (High Emergency Siren)</span>
                  <input
                    type="checkbox"
                    checked={preferences.alertAt10}
                    onChange={(e) => {
                      soundEffects.playClick();
                      onUpdatePreferences({ alertAt10: e.target.checked });
                    }}
                    className="w-4 h-4 rounded bg-slate-800 accent-red-500"
                  />
                </label>
              </div>
            )}
          </div>

          {/* SECTION 4: Screen Sleep & Display Features */}
          <div className="space-y-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-purple-400" />
              OLED Standby & Keep-Alive
            </span>

            <div className="space-y-2 pt-1 border-t border-slate-900">
              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>Double-Tap Anywhere for OLED Sleep</span>
                <input
                  type="checkbox"
                  checked={preferences.doubleTapSleepEnabled}
                  onChange={(e) => {
                    soundEffects.playClick();
                    onUpdatePreferences({ doubleTapSleepEnabled: e.target.checked });
                  }}
                  className="w-4 h-4 rounded bg-slate-800 accent-purple-500"
                />
              </label>

              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>Show Minimal Clock on OLED Standby</span>
                <input
                  type="checkbox"
                  checked={preferences.showStandbyClock}
                  onChange={(e) => {
                    soundEffects.playClick();
                    onUpdatePreferences({ showStandbyClock: e.target.checked });
                  }}
                  className="w-4 h-4 rounded bg-slate-800 accent-purple-500"
                />
              </label>

              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>Keep Screen Awake on Launch (WakeLock)</span>
                <input
                  type="checkbox"
                  checked={preferences.wakeLockAutoStart}
                  onChange={(e) => {
                    soundEffects.playClick();
                    onUpdatePreferences({ wakeLockAutoStart: e.target.checked });
                  }}
                  className="w-4 h-4 rounded bg-slate-800 accent-cyan-500"
                />
              </label>

              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>Show PC USB Boot in Top Navigation</span>
                <input
                  type="checkbox"
                  checked={preferences.showUsbBootTab}
                  onChange={(e) => {
                    soundEffects.playClick();
                    onUpdatePreferences({ showUsbBootTab: e.target.checked });
                  }}
                  className="w-4 h-4 rounded bg-slate-800 accent-cyan-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer with Reset Defaults and Save Button */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              soundEffects.playClick();
              onResetDefaults();
            }}
            className="text-xs text-slate-400 hover:text-slate-200 underline"
          >
            Reset Defaults
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md active:scale-95 transition-all"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
