import React, { useState } from 'react';
import {
  X,
  Trash2,
  Sliders,
  Battery,
  Laptop,
  Moon,
  Check,
  Smartphone
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';
import { NavTabType } from './TopNavigationBar';

interface TaskCard {
  id: string;
  tabKey: NavTabType | 'oled_sleep';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  bgGradient: string;
}

interface RecentAppsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: NavTabType) => void;
  onTriggerOledSleep: () => void;
}

export const RecentAppsDrawer: React.FC<RecentAppsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onTriggerOledSleep
}) => {
  const [tasks, setTasks] = useState<TaskCard[]>([
    {
      id: 'task_ctrl',
      tabKey: 'controller',
      title: 'Control Center',
      subtitle: 'On-screen Home, Power & Volume Master',
      icon: <Sliders className="w-5 h-5 text-cyan-400" />,
      bgGradient: 'from-slate-900 to-cyan-950/40 border-cyan-800/40'
    },
    {
      id: 'task_battery',
      tabKey: 'battery',
      title: 'Battery Guardian',
      subtitle: '20% & 10% emergency siren alarms',
      icon: <Battery className="w-5 h-5 text-emerald-400" />,
      bgGradient: 'from-slate-900 to-emerald-950/40 border-emerald-800/40'
    },
    {
      id: 'task_usb',
      tabKey: 'usb_boot',
      title: 'PC USB 1-Click Boot',
      subtitle: 'Windows emergency phone revival tool',
      icon: <Laptop className="w-5 h-5 text-blue-400" />,
      bgGradient: 'from-slate-900 to-blue-950/40 border-blue-800/40'
    },
    {
      id: 'task_sleep',
      tabKey: 'oled_sleep',
      title: 'OLED Blackout Standby',
      subtitle: 'Double-tap wake screen saver',
      icon: <Moon className="w-5 h-5 text-purple-400" />,
      bgGradient: 'from-slate-900 to-purple-950/40 border-purple-800/40'
    }
  ]);

  if (!isOpen) return null;

  const handleCardClick = (tabKey: NavTabType | 'oled_sleep') => {
    soundEffects.playClick();
    onClose();
    if (tabKey === 'oled_sleep') {
      onTriggerOledSleep();
    } else {
      onSelectTab(tabKey);
    }
  };

  const handleDismissCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.playClick();
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearAll = () => {
    soundEffects.playSleepTone();
    setTasks([]);
    setTimeout(() => {
      onClose();
      onSelectTab('controller');
    }, 350);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-55 flex flex-col justify-end bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg mx-auto bg-slate-900/95 border-t border-slate-800 rounded-t-3xl p-5 shadow-2xl max-h-[85vh] flex flex-col"
      >
        <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-3" />

        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Recent Apps & Tasks
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              ({tasks.length} active)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {tasks.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-1 rounded-lg bg-red-950/50 hover:bg-red-900/50 border border-red-800/60 text-red-300 text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                Clear All
              </button>
            )}
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
        </div>

        <div className="mt-4 overflow-y-auto space-y-2.5 flex-1 pr-1 pb-2">
          {tasks.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <Check className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              All recent tasks cleared. Memory freed!
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleCardClick(task.tabKey)}
                className={`p-3.5 rounded-2xl border bg-linear-to-r ${task.bgGradient} flex items-center justify-between cursor-pointer hover:border-cyan-400/50 active:scale-98 transition-all group shadow-sm`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0">
                    {task.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {task.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-cyan-400 font-medium group-hover:underline">
                    Switch →
                  </span>
                  <button
                    onClick={(e) => handleDismissCard(task.id, e)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-800/80 hover:bg-red-950/60 text-slate-400 hover:text-red-300 transition-colors"
                    title="Dismiss Task"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
          <Smartphone className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-white">Tip:</strong> In your phone's Settings → Smart & Convenient → <em>Assistive Ball</em>, double-tapping the native bubble also triggers Android's OS-level task switcher.
          </span>
        </div>
      </div>
    </div>
  );
};
