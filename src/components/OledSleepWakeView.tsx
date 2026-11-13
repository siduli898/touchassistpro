import React, { useState, useEffect, useRef } from 'react';
import { soundEffects } from '../services/soundEffects';

interface OledSleepWakeViewProps {
  isActive: boolean;
  onWake: () => void;
  batteryLevel: number;
  isCharging: boolean;
  showMinimalClock?: boolean;
}

export const OledSleepWakeView: React.FC<OledSleepWakeViewProps> = ({
  isActive,
  onWake,
  batteryLevel,
  isCharging,
  showMinimalClock = true
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [tapHint, setTapHint] = useState<boolean>(true);
  const lastTapRef = useRef<{ time: number; x: number; y: number }>({ time: 0, x: 0, y: 0 });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isActive) {
      setTapHint(true);
      const timer = setTimeout(() => setTapHint(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!isActive) return null;

  // Unified Pointer-based double-tap wake with synthetic event filter
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary) return;
    e.stopPropagation();

    const now = Date.now();
    const prev = lastTapRef.current;
    const timeDiff = now - prev.time;
    const dist = Math.hypot(e.clientX - prev.x, e.clientY - prev.y);

    // True intentional double tap (80ms - 380ms apart, within 30px)
    if (timeDiff >= 80 && timeDiff <= 380 && dist <= 30) {
      soundEffects.playWakeTone();
      onWake();
      lastTapRef.current = { time: 0, x: 0, y: 0 };
    } else {
      lastTapRef.current = { time: now, x: e.clientX, y: e.clientY };
      // Show subtle hint if user tapped once
      setTapHint(true);
      setTimeout(() => setTapHint(false), 2200);
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      className="fixed inset-0 z-60 bg-black flex flex-col items-center justify-between p-8 select-none cursor-pointer overflow-hidden animate-fade-in"
      style={{ backgroundColor: '#000000', touchAction: 'none' }}
    >
      {/* Top minimal status bar in ultra-low brightness */}
      <div className="w-full flex items-center justify-between text-[11px] font-mono text-zinc-700/80">
        <span>OLED STANDBY</span>
        <span className="tabular-nums">
          {batteryLevel}% {isCharging ? '⚡ CHARGING' : ''}
        </span>
      </div>

      {/* Center Minimal Ambient Clock */}
      {showMinimalClock && (
        <div className="flex flex-col items-center justify-center my-auto">
          <h1 className="text-5xl font-extralight text-zinc-600/90 tracking-widest font-mono tabular-nums select-none">
            {currentTime}
          </h1>
          <p className="text-[11px] text-zinc-700 mt-2.5 font-medium tracking-wide uppercase">
            Power-Saving Standby
          </p>
        </div>
      )}

      {/* Floating Double Tap Notification Pill */}
      <div
        className={`transition-all duration-300 ${
          tapHint ? 'opacity-85 translate-y-0' : 'opacity-0 translate-y-2'
        } flex flex-col items-center gap-1.5`}
      >
        <div className="px-4 py-2 rounded-full bg-zinc-950/90 border border-zinc-800 text-zinc-400 text-xs font-medium shadow-2xl flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Double-tap anywhere to wake</span>
        </div>
      </div>

      {/* Single tap wake button fallback */}
      <div className="w-full flex justify-center pb-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            soundEffects.playWakeTone();
            onWake();
          }}
          className="text-[11px] text-zinc-800 hover:text-zinc-600 px-3 py-1 rounded-md"
        >
          [Tap to wake]
        </button>
      </div>
    </div>
  );
};
