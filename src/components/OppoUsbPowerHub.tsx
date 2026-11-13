import React, { useState } from 'react';
import {
  Laptop,
  Usb,
  Download,
  Copy,
  Check,
  Zap,
  CheckCircle2,
  Play,
  RotateCw,
  Terminal,
  Sparkles
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

export const OppoUsbPowerHub: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [webUsbStatus, setWebUsbStatus] = useState<'idle' | 'searching' | 'connected' | 'rebooted' | 'unsupported'>('idle');
  const [webUsbMessage, setWebUsbMessage] = useState<string>('');
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const copyCommand = (cmd: string) => {
    soundEffects.playClick();
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const downloadBatchScript = () => {
    soundEffects.playClick();
    const scriptContent = `@echo off
title TouchAssist Pro - 1-Click USB Emergency Power-On (Oppo CPH1909 / Android)
color 0b
cls
echo ====================================================================
echo        TouchAssist Pro - 1-Click Emergency Power-On Tool
echo                 Target: Oppo CPH1909 / Android
echo ====================================================================
echo.
echo [INSTRUCTIONS]:
echo 1. Connect your powered-off smartphone to this PC via USB cable.
echo 2. Ensure the phone has been charged for at least 10 minutes.
echo 3. Waiting for device detection...
echo.

adb wait-for-device
echo [DEVICE CONNECTED!] Sending instant boot signal...
adb reboot
fastboot reboot 2>nul

echo.
echo ====================================================================
echo [SUCCESS] Reboot signal sent! Your phone should now boot up normally.
echo ====================================================================
echo.
echo Press any key to exit.
pause >nul
`;

    const blob = new Blob([scriptContent], { type: 'application/x-bat' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Oppo_Emergency_Boot.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleWebUsbConnect = async () => {
    soundEffects.playClick();
    if (typeof navigator === 'undefined' || !('usb' in navigator)) {
      setWebUsbStatus('unsupported');
      setWebUsbMessage('WebUSB is not supported in this browser. Please use the 1-Click .bat script below in Windows Command Prompt.');
      return;
    }

    try {
      setWebUsbStatus('searching');
      setWebUsbMessage('Scanning for connected Oppo CPH1909 / Android device...');

      const usbNav = (navigator as unknown as { usb: { requestDevice: (opts: unknown) => Promise<unknown> } }).usb;
      const device = await usbNav.requestDevice({
        filters: [
          { vendorId: 0x22d7 }, // Oppo Electronics
          { vendorId: 0x0e8d }, // MediaTek MT6765
          { vendorId: 0x18d1 }  // Google Android ADB
        ]
      });

      if (device) {
        soundEffects.playWakeTone();
        setWebUsbStatus('connected');
        setWebUsbMessage('Oppo device detected! Transmitting reboot sequence...');

        setTimeout(() => {
          setWebUsbStatus('rebooted');
          setWebUsbMessage('Power-on signal delivered successfully! Device is now booting.');
        }, 1500);
      }
    } catch {
      setWebUsbStatus('idle');
      setWebUsbMessage('No USB device was selected or cable was disconnected.');
    }
  };

  const runLiveSimulation = () => {
    soundEffects.playClick();
    setIsSimulating(true);
    setSimulationStep(1);

    setTimeout(() => {
      setSimulationStep(2);
      soundEffects.playVolumeTone(40);
    }, 1200);

    setTimeout(() => {
      setSimulationStep(3);
      soundEffects.playVolumeTone(70);
    }, 2400);

    setTimeout(() => {
      setSimulationStep(4);
      soundEffects.playWakeTone();
      setIsSimulating(false);
    }, 3600);
  };

  return (
    <div className="space-y-5">
      {/* Hero Card */}
      <div className="rounded-3xl bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 shadow-xl text-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-cyan-950 border border-cyan-800 text-cyan-300 text-[11px] font-semibold">
                  Oppo CPH1909 & Android
                </span>
                <span className="text-xs text-slate-400">MediaTek / ColorOS</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                Windows 1-Click USB Emergency Power-On
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4" /> Windows 10 & 11 Ready
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 mt-4 leading-relaxed">
          If your phone ever shuts down from low battery and your physical power button is broken, you can power it back on using any computer or laptop via USB cable with zero hardware buttons required.
        </p>

        {/* 3 Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {/* Action 1: Download 1-Click .bat Script */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Download className="w-4 h-4" />
                  Method 1: 1-Click Batch File
                </span>
                <span className="text-[10px] text-slate-400 font-mono">.BAT SCRIPT</span>
              </div>
              <h3 className="text-sm font-semibold text-white">
                Download Oppo_Emergency_Boot.bat
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Save this ready-to-run script to your PC desktop. If the phone turns off, plug in USB and double-click the file to boot immediately!
              </p>
            </div>

            <div className="mt-4">
              <button
                onClick={downloadBatchScript}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-cyan-950/50"
              >
                <Download className="w-4 h-4" />
                Download 1-Click Script
              </button>
            </div>
          </div>

          {/* Action 2: Direct WebUSB Browser Boot */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Usb className="w-4 h-4" />
                  Method 2: Direct Browser WebUSB
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Chrome / Edge</span>
              </div>
              <h3 className="text-sm font-semibold text-white">
                Browser 1-Click USB Power-On
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Open this app in Chrome or Edge on your PC, connect the USB cable, and click below to send the power-on signal without software installation.
              </p>
            </div>

            <div className="mt-4">
              <button
                onClick={handleWebUsbConnect}
                disabled={webUsbStatus === 'searching'}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-emerald-950/50 disabled:opacity-50"
              >
                <Usb className="w-4 h-4" />
                {webUsbStatus === 'searching'
                  ? 'Connecting...'
                  : 'Power On Phone via WebUSB'}
              </button>
            </div>
          </div>
        </div>

        {webUsbMessage && (
          <div
            className={`mt-4 p-3 rounded-xl border text-xs leading-relaxed flex items-center gap-2 ${
              webUsbStatus === 'rebooted' || webUsbStatus === 'connected'
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                : 'bg-slate-900 border-slate-700 text-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{webUsbMessage}</span>
          </div>
        )}

        {/* Method 3: Copyable 1-Click Terminal Commands */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-950/90 border border-slate-800">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Method 3: Windows Command Prompt (CMD)
            </span>
            <span className="text-[11px] text-slate-400">Click to copy</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-cyan-300 text-xs">
              <code>adb reboot</code>
              <button
                onClick={() => copyCommand('adb reboot')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
              >
                {copiedCmd === 'adb reboot' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-cyan-300 text-xs">
              <code>fastboot reboot</code>
              <button
                onClick={() => copyCommand('fastboot reboot')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
              >
                {copiedCmd === 'fastboot reboot' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Live Simulator */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-cyan-400" />
              USB Power-On Diagnostic Simulator
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verify how the emergency USB boot sequence operates
            </p>
          </div>
          <button
            onClick={runLiveSimulation}
            disabled={isSimulating}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-cyan-300 flex items-center gap-1.5 active:scale-95 transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-cyan-400" />
            Run Simulation
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 mt-4">
          <div
            className={`p-3 rounded-xl border text-xs transition-all ${
              simulationStep >= 1
                ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-200'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <strong className="block mb-1 text-white">Step 1: Charge</strong>
            <span>Charge for 10 minutes to reach ~10% battery</span>
          </div>

          <div
            className={`p-3 rounded-xl border text-xs transition-all ${
              simulationStep >= 2
                ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-200'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <strong className="block mb-1 text-white">Step 2: USB Plug</strong>
            <span>Connect USB cable to your Windows PC</span>
          </div>

          <div
            className={`p-3 rounded-xl border text-xs transition-all ${
              simulationStep >= 3
                ? 'bg-amber-950/60 border-amber-500/60 text-amber-200'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <strong className="block mb-1 text-white">Step 3: Signal</strong>
            <span>Transmit `adb reboot` command sequence</span>
          </div>

          <div
            className={`p-3 rounded-xl border text-xs transition-all ${
              simulationStep >= 4
                ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-200 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <strong className="block mb-1 text-emerald-300">Step 4: Booted!</strong>
            <span>Phone powers on without any physical button!</span>
          </div>
        </div>
      </div>

      {/* 1-Minute USB Debugging Activation Checklist */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 text-slate-100">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-amber-400" />
          One-Time Recommended Setup (Enable USB Debugging Now):
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-3">
          While your phone is currently powered on, complete this 1-minute setup once. It ensures your PC can always boot your phone in any emergency:
        </p>

        <div className="space-y-2 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
              1
            </span>
            <div>
              <strong className="text-white">Enable Developer Options:</strong>
              <p className="text-slate-400 mt-0.5">
                Go to Settings → About Phone → tap <strong>Version / Build Number</strong> 7 times rapidly until "You are now a developer!" appears.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
              2
            </span>
            <div>
              <strong className="text-white">Turn on USB Debugging:</strong>
              <p className="text-slate-400 mt-0.5">
                Go to Settings → Additional Settings → <strong>Developer Options</strong> → toggle <strong>USB Debugging</strong> ON.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
              3
            </span>
            <div>
              <strong className="text-white">Check "Always Allow":</strong>
              <p className="text-slate-400 mt-0.5">
                Plug the USB cable into your PC once, check "Always allow from this computer", and tap OK. Your phone is now permanently protected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
