import React from 'react';
import { Download, Share } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundEffects } from '../services/soundEffects';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    soundEffects.playClick();
    await install();
  };

  return (
    <div className="rounded-2xl bg-linear-to-r from-cyan-950/70 via-slate-900 to-blue-950/70 border border-cyan-800/50 p-4 shadow-lg flex items-center justify-between gap-3 text-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
          <Download className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">
            Install on Phone Home Screen
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Run fullscreen like a native app without browser URL bars
          </p>
        </div>
      </div>

      <div>
        {isInstallable ? (
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs active:scale-95 transition-all shadow-md whitespace-nowrap"
          >
            Install App
          </button>
        ) : isIOS ? (
          <span className="text-[11px] text-cyan-300 flex items-center gap-1">
            <Share className="w-3.5 h-3.5" /> Safari Share → Add to Home
          </span>
        ) : (
          <button
            onClick={handleInstallClick}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium text-xs border border-slate-700 whitespace-nowrap"
          >
            Add to Home
          </button>
        )}
      </div>
    </div>
  );
};
