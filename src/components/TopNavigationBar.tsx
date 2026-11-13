import React from 'react';
import { Moon, Settings } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

export type NavTabType = 'controller' | 'battery' | 'usb_boot' | 'guide';

interface TopNavigationBarProps {
  activeTab: NavTabType;
  onSelectTab: (tab: NavTabType) => void;
  onEnterSleep: () => void;
  onOpenPreferences: () => void;
  showUsbBootTab?: boolean;
}

export const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  activeTab,
  onSelectTab,
  onEnterSleep,
  onOpenPreferences,
  showUsbBootTab = true
}) => {
  return (
    <header className="flex items-center justify-between gap-4 sm:gap-6 px-4 sm:px-6 py-3 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onSelectTab('controller');
        }}
        className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
        TouchAssist Pro
      </a>

      {/* Zone 2: Clean single-line navigation links */}
      <nav className="flex items-center gap-3 sm:gap-5 text-xs font-medium text-slate-300 overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            soundEffects.playClick();
            onSelectTab('controller');
          }}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'controller'
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Control Hub
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            onSelectTab('battery');
          }}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'battery'
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Battery Guard
        </button>

        {showUsbBootTab && (
          <button
            onClick={() => {
              soundEffects.playClick();
              onSelectTab('usb_boot');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'usb_boot'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            PC USB Boot
          </button>
        )}

        <button
          onClick={() => {
            soundEffects.playClick();
            onSelectTab('guide');
          }}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'guide'
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Emergency Guide
        </button>
      </nav>

      {/* Zone 3: 1 primary action & Settings icon */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => {
            soundEffects.playClick();
            onOpenPreferences();
          }}
          className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          title="Customize Features & Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            soundEffects.playSleepTone();
            onEnterSleep();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-cyan-950/40 active:scale-95"
        >
          <Moon className="w-3.5 h-3.5" />
          Screen Sleep
        </button>
      </div>
    </header>
  );
};
