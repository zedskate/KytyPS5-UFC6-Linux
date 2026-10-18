import React from 'react';
import {
  Gamepad2,
  Tv,
  Cpu,
  Layers,
  Database,
  Terminal,
  Settings,
  PlusCircle,
  PlayCircle,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isRunning: boolean;
  runningTitle?: string;
  onOpenSettings: () => void;
  onOpenAddGame: () => void;
  onQuickLaunchWolverine: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isRunning,
  runningTitle,
  onOpenSettings,
  onOpenAddGame,
  onQuickLaunchWolverine,
}) => {
  const tabs = [
    { id: 'library', label: 'Library', icon: Gamepad2 },
    { id: 'session', label: 'Live Session', icon: Tv, badge: isRunning ? 'Active' : undefined },
    { id: 'linux-build', label: 'Linux Build & Run', icon: Cpu, badge: 'Native' },
    { id: 'shaders', label: 'Shader Inspector', icon: Layers },
    { id: 'compatibility', label: 'Compatibility', icon: Database },
    { id: 'logs', label: 'Logs', icon: Terminal },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Info */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 shadow-lg shadow-blue-500/20 text-white font-bold tracking-wider font-display">
              PS5
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent font-display">
                  KytyPS5
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  v0.5.8-alpha
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                <span>Linux x64 (glibc / Musl)</span>
                <span>•</span>
                <span className="text-blue-400">Vulkan 1.3</span>
                <span>•</span>
                <span className="text-amber-400">commit db7745ef</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-inner shadow-blue-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                        tab.badge === 'Active'
                          ? 'bg-emerald-500/20 text-emerald-300 animate-pulse border border-emerald-500/40'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            {!isRunning ? (
              <button
                onClick={onQuickLaunchWolverine}
                className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-md shadow-red-950/40 border border-red-400/30 transition-transform active:scale-95"
                title="Launch Marvel's Wolverine with --bindless --redzone"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Quick Boot: Wolverine</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentTab('session')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 border border-emerald-400/30 transition-transform active:scale-95 animate-pulse"
              >
                <span className="w-2 h-2 rounded-full bg-white"></span>
                <span>Playing: {runningTitle || 'Game'}</span>
              </button>
            )}

            <button
              onClick={onOpenAddGame}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Add PS5 Game (eboot.bin)"
            >
              <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Add Game</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800 transition"
              title="Global Emulator Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Submenu */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 border-t border-slate-800/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs whitespace-nowrap ${
                  active ? 'bg-blue-600 text-white' : 'text-slate-400 bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
