import React, { useState } from 'react';
import {
  Home,
  Power,
  Volume2,
  VolumeX,
  Volume1,
  Sun,
  ShieldAlert,
  Sliders,
  X,
  Smartphone,
  ChevronLeft,
  Laptop,
  Settings,
  Layers
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';
import { NavButtonOrder } from './PreferencesModal';

interface AssistiveControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onGoHome: () => void;
  onPressBack: () => void;
  onPressRecent: () => void;
  onEnterOledSleep: () => void;
  volumeLevel: number;
  onVolumeChange: (newVol: number) => void;
  brightnessLevel: number;
  onBrightnessChange: (newVal: number) => void;
  wakeLockActive: boolean;
  onToggleWakeLock: () => void;
  onOpenGuide: () => void;
  onOpenUsbBoot: () => void;
  onOpenPreferences: () => void;
  buttonOrder: NavButtonOrder;
}

export const AssistiveControlCenter: React.FC<AssistiveControlCenterProps> = ({
  isOpen,
  onClose,
  onGoHome,
  onPressBack,
  onPressRecent,
  onEnterOledSleep,
  volumeLevel,
  onVolumeChange,
  brightnessLevel,
  onBrightnessChange,
  wakeLockActive,
  onToggleWakeLock,
  onOpenGuide,
  onOpenUsbBoot,
  onOpenPreferences,
  buttonOrder
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volumeLevel);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleVolumeUp = () => {
    const next = Math.min(100, volumeLevel + 10);
    onVolumeChange(next);
    soundEffects.playVolumeTone(next);
    setIsMuted(false);
    showToast(`Volume: ${next}%`);
  };

  const handleVolumeDown = () => {
    const next = Math.max(0, volumeLevel - 10);
    onVolumeChange(next);
    soundEffects.playVolumeTone(next);
    if (next === 0) setIsMuted(true);
    showToast(`Volume: ${next}%`);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      const restored = prevVolume > 0 ? prevVolume : 50;
      onVolumeChange(restored);
      soundEffects.playVolumeTone(restored);
      setIsMuted(false);
      showToast(`Unmuted: ${restored}%`);
    } else {
      setPrevVolume(volumeLevel);
      onVolumeChange(0);
      soundEffects.playClick();
      setIsMuted(true);
      showToast('Muted (0%)');
    }
  };

  const handleHomeClick = () => {
    soundEffects.playClick();
    onGoHome();
    onClose();
    showToast('Navigated to Home');
  };

  const handleBackClick = () => {
    soundEffects.playClick();
    onPressBack();
    onClose();
    showToast('Back executed');
  };

  const handleRecentClick = () => {
    soundEffects.playClick();
    onClose();
    onPressRecent();
  };

  const handlePowerPress = () => {
    soundEffects.playSleepTone();
    onClose();
    onEnterOledSleep();
  };

  const renderRecentTile = () => (
    <button
      onClick={handleRecentClick}
      className="flex-1 py-3 px-2 rounded-2xl bg-linear-to-b from-slate-800/90 to-slate-900/90 border border-white/[0.08] hover:border-cyan-500/50 active:scale-95 transition-all flex flex-col items-center justify-center group shadow-sm"
    >
      <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-1 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors shadow-inner">
        <Layers className="w-4.5 h-4.5" />
      </div>
      <span className="text-xs font-bold text-white">Recent Apps</span>
      <span className="text-[10px] text-slate-400">Multitask</span>
    </button>
  );

  const renderHomeTile = () => (
    <button
      onClick={handleHomeClick}
      className="flex-1 py-3 px-2 rounded-2xl bg-linear-to-b from-slate-800/90 to-slate-900/90 border border-cyan-500/40 hover:border-cyan-400 active:scale-95 transition-all flex flex-col items-center justify-center group shadow-md shadow-cyan-950/40"
    >
      <div className="w-10 h-10 rounded-xl bg-cyan-500/25 border border-cyan-400/50 text-cyan-300 flex items-center justify-center mb-1 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors shadow-inner">
        <Home className="w-4.5 h-4.5" />
      </div>
      <span className="text-xs font-bold text-cyan-300">Home</span>
      <span className="text-[10px] text-slate-400">Dashboard</span>
    </button>
  );

  const renderBackTile = () => (
    <button
      onClick={handleBackClick}
      className="flex-1 py-3 px-2 rounded-2xl bg-linear-to-b from-slate-800/90 to-slate-900/90 border border-white/[0.08] hover:border-cyan-500/50 active:scale-95 transition-all flex flex-col items-center justify-center group shadow-sm"
    >
      <div className="w-10 h-10 rounded-xl bg-slate-800/70 border border-white/[0.06] text-slate-300 flex items-center justify-center mb-1 group-hover:bg-slate-700 group-hover:text-white transition-colors shadow-inner">
        <ChevronLeft className="w-4.5 h-4.5" />
      </div>
      <span className="text-xs font-bold text-white">Back</span>
      <span className="text-[10px] text-slate-400">Previous</span>
    </button>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-slate-900/95 border border-white/[0.1] p-5 shadow-2xl text-slate-100 relative max-h-[90vh] overflow-y-auto backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Control Center
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenPreferences();
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Settings & Preferences"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                onClose();
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Temporary Toast Banner */}
        {toastMessage && (
          <div className="mt-3 px-3 py-1.5 rounded-lg bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 text-xs font-medium text-center shadow-lg">
            {toastMessage}
          </div>
        )}

        {/* 1. Android 3-Button Navigation Row */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-2 px-1">
            <span>Android Navigation:</span>
            <span className="text-[10px] text-cyan-400 font-mono">
              {buttonOrder === 'recent_home_back' ? '■ · ● · ◀' : '◀ · ● · ■'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {buttonOrder === 'recent_home_back' ? (
              <>
                {renderRecentTile()}
                {renderHomeTile()}
                {renderBackTile()}
              </>
            ) : (
              <>
                {renderBackTile()}
                {renderHomeTile()}
                {renderRecentTile()}
              </>
            )}
          </div>
        </div>

        {/* 2. Power and Volume Hardware Control Tiles */}
        <div className="grid grid-cols-3 gap-2.5 mt-3.5">
          <button
            onClick={handlePowerPress}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-linear-to-b from-slate-800/90 to-slate-900/90 border border-red-500/30 hover:border-red-400 active:scale-95 transition-all group shadow-sm shadow-red-950/20"
          >
            <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mb-1 group-hover:bg-red-500 group-hover:text-white transition-colors shadow-inner">
              <Power className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs font-bold text-red-300">Power</span>
            <span className="text-[10px] text-slate-400">OLED Sleep</span>
          </button>

          <button
            onClick={handleVolumeUp}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-linear-to-b from-slate-800/90 to-slate-900/90 border border-white/[0.08] hover:border-emerald-500/50 active:scale-95 transition-all group shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-1 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors shadow-inner">
              <Volume2 className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs font-bold text-emerald-300">Volume (+)</span>
            <span className="text-[10px] text-slate-400">Increase</span>
          </button>

          <button
            onClick={handleVolumeDown}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-linear-to-b from-slate-800/90 to-slate-900/90 border border-white/[0.08] hover:border-amber-500/50 active:scale-95 transition-all group shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-1 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors shadow-inner">
              <Volume1 className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs font-bold text-amber-300">Volume (-)</span>
            <span className="text-[10px] text-slate-400">Decrease</span>
          </button>
        </div>

        {/* 3. Fluid Volume Slider Bar with Mute Toggle */}
        <div className="mt-3.5 p-3 rounded-2xl bg-slate-950/80 border border-white/[0.06]">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Master Volume
            </span>
            <span className="font-mono text-cyan-400 tabular-nums font-bold">
              {volumeLevel}%
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-xl border transition-colors ${
                isMuted || volumeLevel === 0
                  ? 'bg-red-500/20 border-red-500/50 text-red-400'
                  : 'bg-slate-800 border-white/[0.08] text-slate-300 hover:text-white'
              }`}
              title="Mute / Unmute"
            >
              {isMuted || volumeLevel === 0 ? (
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
                onVolumeChange(val);
                soundEffects.playVolumeTone(val);
                setIsMuted(val === 0);
              }}
              className="w-full h-2 rounded-lg bg-slate-800 accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* 4. Software Screen Brightness / Dimmer */}
        <div className="mt-3 p-3 rounded-2xl bg-slate-950/80 border border-white/[0.06]">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              Screen Dimmer (Battery Saver)
            </span>
            <span className="font-mono text-amber-400 tabular-nums font-bold">
              {brightnessLevel}%
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={brightnessLevel}
            onChange={(e) => {
              const val = Number(e.target.value);
              onBrightnessChange(val);
            }}
            className="w-full h-2 rounded-lg bg-slate-800 accent-amber-400 cursor-pointer"
          />
        </div>

        {/* 5. System Shortcuts Row */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
              onOpenUsbBoot();
            }}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-cyan-950/50 border border-cyan-800/60 hover:bg-cyan-900/50 active:scale-95 transition-all text-cyan-300 text-xs font-semibold"
          >
            <Laptop className="w-3.5 h-3.5 text-cyan-400 mb-0.5" />
            <span className="text-[10px]">PC USB Boot</span>
          </button>

          <button
            onClick={onToggleWakeLock}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border active:scale-95 transition-all text-xs font-semibold ${
              wakeLockActive
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-800/70 border-white/[0.08] text-slate-400'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 mb-0.5" />
            <span className="text-[10px]">
              {wakeLockActive ? 'Screen Awake' : 'Normal Timeout'}
            </span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
              onOpenGuide();
            }}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-red-950/40 border border-red-800/50 hover:bg-red-900/40 active:scale-95 transition-all text-red-300 text-xs font-semibold"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400 mb-0.5" />
            <span className="text-[10px]">Dead Phone Tips</span>
          </button>
        </div>

        {/* Tip */}
        <p className="mt-3 text-[11px] text-slate-400 text-center leading-relaxed">
          Tip: Tap Recent Apps anytime to open the live task switcher drawer.
        </p>
      </div>
    </div>
  );
};
