import React from 'react';
import {
  Battery,
  BatteryCharging,
  BatteryWarning,
  Volume2,
  VolumeX,
  Zap,
  ShieldCheck,
  BellRing,
  HelpCircle
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface BatteryGuardianCardProps {
  batteryLevel: number;
  isCharging: boolean;
  isAlarmActive: boolean;
  alarmLevel: number | null;
  onDismissAlarm: () => void;
  onTriggerTest: (lvl: number) => void;
  onOpenGuide: () => void;
  isSupported: boolean;
}

export const BatteryGuardianCard: React.FC<BatteryGuardianCardProps> = ({
  batteryLevel,
  isCharging,
  isAlarmActive,
  alarmLevel,
  onDismissAlarm,
  onTriggerTest,
  onOpenGuide,
  isSupported
}) => {
  const isCritical = batteryLevel <= 10;
  const isWarning = batteryLevel <= 20;

  let statusBg = 'bg-slate-900 border-slate-800';
  let badgeColor = 'text-cyan-400 bg-cyan-950 border-cyan-800/60';
  let statusText = 'Battery Safe';

  if (isCharging) {
    statusBg = 'bg-slate-900/90 border-emerald-500/30';
    badgeColor = 'text-emerald-400 bg-emerald-950 border-emerald-800/60';
    statusText = 'Charging — Safe from Shutdown';
  } else if (isCritical) {
    statusBg = 'bg-red-950/40 border-red-500/60 shadow-lg shadow-red-950/40';
    badgeColor = 'text-red-300 bg-red-950 border-red-700';
    statusText = 'CRITICAL: Plug in charger immediately!';
  } else if (isWarning) {
    statusBg = 'bg-amber-950/30 border-amber-500/50';
    badgeColor = 'text-amber-300 bg-amber-950 border-amber-700';
    statusText = 'Warning: Low Battery (Charge Soon)';
  }

  return (
    <div className={`rounded-3xl border p-5 transition-all ${statusBg}`}>
      {/* Active Siren Banner (when alarm is firing) */}
      {isAlarmActive && (
        <div className="mb-4 p-4 rounded-2xl bg-red-600 text-white animate-pulse shadow-lg flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellRing className="w-5 h-5 animate-bounce" />
              <span className="font-bold text-sm tracking-wide">
                Emergency Low-Battery Siren ({alarmLevel || batteryLevel}%)!
              </span>
            </div>
            <button
              onClick={onDismissAlarm}
              className="px-3 py-1 rounded-lg bg-black/40 hover:bg-black/60 text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all"
            >
              <VolumeX className="w-3.5 h-3.5" />
              Silence Siren
            </button>
          </div>
          <p className="text-xs text-red-100 leading-relaxed">
            Your physical power button is damaged. If the battery drains to 0%, the phone will power off and cannot be turned on with hardware buttons. Plug in your charger immediately!
          </p>
        </div>
      )}

      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isCharging
                ? 'bg-emerald-500/20 text-emerald-400'
                : isCritical
                ? 'bg-red-500/20 text-red-400 animate-pulse'
                : 'bg-cyan-500/20 text-cyan-400'
            }`}
          >
            {isCharging ? (
              <BatteryCharging className="w-6 h-6" />
            ) : isWarning ? (
              <BatteryWarning className="w-6 h-6" />
            ) : (
              <Battery className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Battery Guardian
            </h3>
            <span className="text-xs text-slate-400">
              {isSupported ? 'Hardware sensor active' : 'Battery protection active'}
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-black font-mono tabular-nums text-white">
            {batteryLevel}%
          </div>
          <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-md border ${badgeColor}`}>
            {statusText}
          </span>
        </div>
      </div>

      {/* Visual Battery Progress Bar */}
      <div className="mt-4">
        <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700/60">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCharging
                ? 'bg-linear-to-r from-emerald-500 to-teal-400'
                : isCritical
                ? 'bg-linear-to-r from-red-600 to-rose-500 animate-pulse'
                : isWarning
                ? 'bg-linear-to-r from-amber-500 to-yellow-400'
                : 'bg-linear-to-r from-cyan-500 to-blue-500'
            }`}
            style={{ width: `${Math.max(4, Math.min(100, batteryLevel))}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1.5 px-1">
          <span className="text-red-400 font-semibold">5% Shutdown</span>
          <span className="text-amber-400 font-semibold">10% Emergency Siren</span>
          <span className="text-yellow-400 font-semibold">20% Early Warning</span>
          <span className="text-emerald-400 font-semibold">100% Full</span>
        </div>
      </div>

      {/* Action Strip: Test Siren & Recovery Guide */}
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button
          onClick={() => {
            soundEffects.playClick();
            onTriggerTest(20);
          }}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold active:scale-98 transition-all"
        >
          <Volume2 className="w-4 h-4 text-cyan-400" />
          Test Siren Audio
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            onOpenGuide();
          }}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/40 border border-red-800/60 text-red-300 text-xs font-semibold active:scale-98 transition-all"
        >
          <HelpCircle className="w-4 h-4 text-red-400" />
          Dead Phone Recovery
        </button>
      </div>

      {/* Protection Note */}
      <div className="mt-3.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block mb-0.5">Accidental Shutdown Prevention:</strong>
          When battery drops to 20% and 10%, this app fires high-priority audible sirens and haptic pulses so you can plug in the charger before power runs out.
        </div>
      </div>
    </div>
  );
};
