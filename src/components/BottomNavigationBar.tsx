import React from 'react';
import {
  Layers,
  Home,
  ChevronLeft,
  Settings
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';
import { NavButtonOrder, NavIconStyle } from './PreferencesModal';

interface BottomNavigationBarProps {
  onPressRecent: () => void;
  onPressHome: () => void;
  onPressBack: () => void;
  onOpenSettings: () => void;
  buttonOrder: NavButtonOrder;
  iconStyle: NavIconStyle;
}

export const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  onPressRecent,
  onPressHome,
  onPressBack,
  onOpenSettings,
  buttonOrder,
  iconStyle
}) => {
  const renderRecentButton = () => (
    <button
      onClick={() => {
        soundEffects.playClick();
        onPressRecent();
      }}
      className="flex-1 h-full flex flex-col items-center justify-center text-slate-300 hover:text-cyan-400 active:scale-90 transition-all select-none group min-w-[54px] py-1"
      aria-label="Recent Tasks & Apps"
    >
      <div className="w-10 h-9 rounded-xl flex items-center justify-center group-hover:bg-slate-800/60 transition-colors">
        {iconStyle === 'geometric' ? (
          <div className="w-4 h-4 rounded-xs border-2 border-slate-300 group-hover:border-cyan-400 transition-colors shadow-xs" />
        ) : (
          <Layers className="w-5 h-5" />
        )}
      </div>
      <span className="text-[10px] font-medium text-slate-400 group-hover:text-cyan-300 mt-0.5 tracking-tight">
        Recent
      </span>
    </button>
  );

  const renderHomeButton = () => (
    <button
      onClick={() => {
        soundEffects.playClick();
        onPressHome();
      }}
      className="flex-1 h-full flex flex-col items-center justify-center text-slate-100 hover:text-cyan-300 active:scale-90 transition-all select-none group min-w-[54px] py-1"
      aria-label="Home"
    >
      <div className="w-12 h-9 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center group-hover:bg-cyan-500/30 group-hover:border-cyan-300 transition-all shadow-sm shadow-cyan-950/40">
        {iconStyle === 'geometric' ? (
          <div className="w-4 h-4 rounded-full border-2 border-cyan-400 bg-cyan-400/25 shadow-xs" />
        ) : (
          <Home className="w-5 h-5 text-cyan-400" />
        )}
      </div>
      <span className="text-[10px] font-semibold text-cyan-300 mt-0.5 tracking-tight">
        Home
      </span>
    </button>
  );

  const renderBackButton = () => (
    <button
      onClick={() => {
        soundEffects.playClick();
        onPressBack();
      }}
      className="flex-1 h-full flex flex-col items-center justify-center text-slate-300 hover:text-cyan-400 active:scale-90 transition-all select-none group min-w-[54px] py-1"
      aria-label="Back"
    >
      <div className="w-10 h-9 rounded-xl flex items-center justify-center group-hover:bg-slate-800/60 transition-colors">
        {iconStyle === 'geometric' ? (
          <div
            className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[11px] border-r-slate-300 group-hover:border-r-cyan-400 transition-colors shadow-xs"
            style={{ transform: 'translateX(-1px)' }}
          />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </div>
      <span className="text-[10px] font-medium text-slate-400 group-hover:text-cyan-300 mt-0.5 tracking-tight">
        Back
      </span>
    </button>
  );

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-45 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 shadow-2xl pb-[max(env(safe-area-inset-bottom),10px)] select-none">
      <div className="max-w-md mx-auto h-15 flex items-center justify-between px-3">
        {/* Navigation Buttons in chosen order */}
        <div className="flex-1 h-full flex items-center justify-around">
          {buttonOrder === 'recent_home_back' ? (
            <>
              {renderRecentButton()}
              {renderHomeButton()}
              {renderBackButton()}
            </>
          ) : (
            <>
              {renderBackButton()}
              {renderHomeButton()}
              {renderRecentButton()}
            </>
          )}
        </div>

        {/* Quick Preferences Trigger */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onOpenSettings();
          }}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:bg-slate-900 transition-colors shrink-0 ml-1"
          title="Navigation Preferences"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
