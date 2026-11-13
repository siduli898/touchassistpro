import React, { useState } from 'react';
import {
  Clock,
  Laptop,
  Zap,
  Smartphone,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

export const RealmeEmergencyGuide: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<number>(1);

  const copyToClipboard = (text: string) => {
    soundEffects.playClick();
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const toggleSection = (idx: number) => {
    soundEffects.playClick();
    setOpenSection(openSection === idx ? 0 : idx);
  };

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 text-slate-100">
      {/* Header */}
      <div className="flex items-start gap-3 pb-4 border-b border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">
            Emergency Hardware Revival Playbook
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Proven methods to power on your Android / Oppo phone if the battery drains completely and physical buttons are non-functional.
          </p>
        </div>
      </div>

      {/* Method 1: Scheduled Auto Power-On */}
      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden">
        <button
          onClick={() => toggleSection(1)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Schedule Auto Power-On (Best Lifeline)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automatically powers the phone ON at a set daily time
              </p>
            </div>
          </div>
          {openSection === 1 ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSection === 1 && (
          <div className="p-4 pt-1 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed space-y-2.5">
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-200">
              <strong>Why this is your ultimate safeguard:</strong>
              <br />
              Oppo, Realme, and ColorOS phones feature a hardware RTC timer. Even if the phone dies from 0% battery, plugging in the charger ensures the device turns itself ON at your scheduled time without pressing any physical buttons!
            </div>

            <p className="font-semibold text-white">Setup Instructions (Do this once):</p>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
              <li>Open your phone's <strong>Settings</strong> app.</li>
              <li>Tap <strong>Additional Settings</strong> (or <strong>System Settings</strong>).</li>
              <li>Select <strong>Schedule Power On/Off</strong> (or <em>Automatic On/Off</em>).</li>
              <li>Toggle <strong>Auto Power ON</strong> to ON and set a morning time (e.g., 07:00 AM) repeating Everyday.</li>
            </ol>
            <p className="text-[11px] text-emerald-400 italic">
              Result: If power ever cuts out, connecting the charger will boot the phone automatically at that scheduled time.
            </p>
          </div>
        )}
      </div>

      {/* Method 2: PC USB 1-Click ADB Reboot */}
      <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden">
        <button
          onClick={() => toggleSection(2)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Laptop className="w-4 h-4 text-cyan-400" />
                PC / Laptop USB 1-Click Boot
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Send an instant boot signal through Windows Command Prompt
              </p>
            </div>
          </div>
          {openSection === 2 ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSection === 2 && (
          <div className="p-4 pt-1 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed space-y-2.5">
            <p>
              Connect your phone to any Windows PC or laptop using a standard USB cable, open Command Prompt (CMD) or run our downloadable `.bat` script, and execute:
            </p>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-cyan-300">
              <code>adb reboot</code>
              <button
                onClick={() => copyToClipboard('adb reboot')}
                className="px-2.5 py-1 rounded-md bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 text-xs flex items-center gap-1 transition-colors"
              >
                {copiedCmd === 'adb reboot' ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              For Fastboot Mode:
            </p>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-cyan-300">
              <code>fastboot reboot</code>
              <button
                onClick={() => copyToClipboard('fastboot reboot')}
                className="px-2.5 py-1 rounded-md bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 text-xs flex items-center gap-1 transition-colors"
              >
                {copiedCmd === 'fastboot reboot' ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Method 3: Wall Charger Power Trick */}
      <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden">
        <button
          onClick={() => toggleSection(3)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Charger Plug-In Timing Sequence
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Reviving from 0% battery state without buttons
              </p>
            </div>
          </div>
          {openSection === 3 ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSection === 3 && (
          <div className="p-4 pt-1 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed space-y-2.5">
            <ul className="list-disc list-inside space-y-1.5 pl-1">
              <li>
                Plug your phone into its original charger for at least 15-20 minutes uninterrupted.
              </li>
              <li>
                Once the battery charging animation appears on screen, disconnecting and swiftly re-plugging the cable wakes the system bootloader.
              </li>
              <li>
                If a SIM ejector tool is available, you can gently click the internal tactile switch behind the damaged power button housing to trigger standard power-on.
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Method 4: Native ColorOS Settings */}
      <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden">
        <button
          onClick={() => toggleSection(4)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-400" />
                Native Assistive Ball & Double-Tap to Wake
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Built-in ColorOS & Android accessibility tools
              </p>
            </div>
          </div>
          {openSection === 4 ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSection === 4 && (
          <div className="p-4 pt-1 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed space-y-2.5">
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <strong className="text-white block mb-1">A. Enable Native Assistive Ball:</strong>
                <p className="text-slate-400">
                  Settings → Smart & Convenient (or Special Features) → <strong>Assistive Ball</strong> → toggle ON. Provides persistent OS-level Home, Lock Screen, and Back gestures.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <strong className="text-white block mb-1">B. Screen-Off Double-Tap to Wake:</strong>
                <p className="text-slate-400">
                  Settings → Smart & Convenient → Gesture & Motion → <strong>Screen-off Gestures</strong> → toggle <strong>Double tap to turn screen on</strong>. Allows waking your locked phone screen by double-tapping!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Safety Summary Callout */}
      <div className="mt-4 p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-800/50 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
        <p className="text-xs text-cyan-200">
          <strong>Key Reminder:</strong> Keeping TouchAssist Pro installed and the Battery Guardian active ensures you receive loud alerts at 20% and 10% before your phone can ever run out of power!
        </p>
      </div>
    </div>
  );
};
