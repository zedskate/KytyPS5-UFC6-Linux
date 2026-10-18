import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { GameLibrary } from './components/GameLibrary';
import { GameSession } from './components/GameSession';
import { LinuxBuildCenter } from './components/LinuxBuildCenter';
import { ShaderInspector } from './components/ShaderInspector';
import { CompatibilityDatabase } from './components/CompatibilityDatabase';
import { LogViewer } from './components/LogViewer';
import { ConfigurationModal } from './components/ConfigurationModal';
import { TrophyModal } from './components/TrophyModal';
import { AddGameModal } from './components/AddGameModal';
import { INITIAL_GAMES } from './data/defaultGames';
import { GameConfig, GameItem } from './types';

export const App: React.FC = () => {
  const [games, setGames] = useState<GameItem[]>(() => {
    try {
      const saved = localStorage.getItem('kyty_ps5_games');
      if (saved) return JSON.parse(saved);
    } catch {
      // localStorage error fallback
    }
    return INITIAL_GAMES;
  });

  const [currentTab, setCurrentTab] = useState<string>('library');
  const [runningGame, setRunningGame] = useState<GameItem | null>(null);

  // Modals state
  const [configModalGame, setConfigModalGame] = useState<GameItem | null>(null);
  const [trophyModalGame, setTrophyModalGame] = useState<GameItem | null>(null);
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);

  // Persist games changes
  useEffect(() => {
    try {
      localStorage.setItem('kyty_ps5_games', JSON.stringify(games));
    } catch {
      // localStorage error fallback
    }
  }, [games]);

  const handleLaunchGame = (game: GameItem) => {
    setRunningGame(game);
    setCurrentTab('session');
  };

  const handleQuickLaunchWolverine = () => {
    const wolverine = games.find((g) => g.id === 'wolverine') || games[0];
    handleLaunchGame(wolverine);
  };

  const handleSaveConfig = (newConfig: GameConfig) => {
    if (!configModalGame) return;
    setGames((prev) =>
      prev.map((g) => (g.id === configModalGame.id ? { ...g, config: newConfig } : g))
    );
    if (runningGame && runningGame.id === configModalGame.id) {
      setRunningGame((prev) => (prev ? { ...prev, config: newConfig } : null));
    }
  };

  const handleToggleTrophy = (trophyId: string) => {
    if (!trophyModalGame) return;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const updatedTrophies = trophyModalGame.trophies.map((t) => {
      if (t.id === trophyId) {
        return {
          ...t,
          unlocked: !t.unlocked,
          unlockedAt: !t.unlocked ? nowStr : undefined,
        };
      }
      return t;
    });

    const updatedGame = { ...trophyModalGame, trophies: updatedTrophies };
    setTrophyModalGame(updatedGame);
    setGames((prev) => prev.map((g) => (g.id === updatedGame.id ? updatedGame : g)));
    if (runningGame && runningGame.id === updatedGame.id) {
      setRunningGame(updatedGame);
    }
  };

  const handleUnlockTrophyInSession = (trophyId: string) => {
    if (!runningGame) return;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const updatedTrophies = runningGame.trophies.map((t) => {
      if (t.id === trophyId) {
        return {
          ...t,
          unlocked: true,
          unlockedAt: nowStr,
        };
      }
      return t;
    });

    const updatedGame = { ...runningGame, trophies: updatedTrophies };
    setRunningGame(updatedGame);
    setGames((prev) => prev.map((g) => (g.id === updatedGame.id ? updatedGame : g)));
  };

  const handleAddGame = (newGame: GameItem) => {
    setGames((prev) => [newGame, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isRunning={runningGame !== null}
        runningTitle={runningGame?.title}
        onOpenSettings={() => setConfigModalGame(runningGame || games[0])}
        onOpenAddGame={() => setIsAddGameOpen(true)}
        onQuickLaunchWolverine={handleQuickLaunchWolverine}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'library' && (
          <GameLibrary
            games={games}
            onLaunchGame={handleLaunchGame}
            onOpenConfig={(game) => setConfigModalGame(game)}
            onOpenTrophies={(game) => setTrophyModalGame(game)}
            onAddGame={() => setIsAddGameOpen(true)}
          />
        )}

        {currentTab === 'session' && (
          runningGame ? (
            <GameSession
              game={runningGame}
              onExit={() => {
                setRunningGame(null);
                setCurrentTab('library');
              }}
              onUnlockTrophy={handleUnlockTrophyInSession}
            />
          ) : (
            <div className="text-center py-20 p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 max-w-xl mx-auto shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto text-2xl font-bold font-display">
                PS5
              </div>
              <h2 className="text-xl font-bold text-white font-display">No Game Session Active</h2>
              <p className="text-sm text-slate-400">
                Select a PlayStation 5 title from your library to start the interactive emulator session with
                Vulkan shader pipeline and DualSense input simulation.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleQuickLaunchWolverine}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-lg shadow-red-950/40 transition active:scale-95"
                >
                  Boot Marvel&apos;s Wolverine (PPSA03671)
                </button>
                <button
                  onClick={() => setCurrentTab('library')}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                >
                  Browse Library
                </button>
              </div>
            </div>
          )
        )}

        {currentTab === 'linux-build' && <LinuxBuildCenter />}

        {currentTab === 'shaders' && <ShaderInspector />}

        {currentTab === 'compatibility' && <CompatibilityDatabase />}

        {currentTab === 'logs' && <LogViewer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300 font-display">KytyPS5 Web Control Hub</span>
            <span>•</span>
            <span className="font-mono text-slate-400">commit db7745ef</span>
            <span>•</span>
            <span className="text-emerald-400 font-mono">Linux x86_64</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <span>PlayStation 5 Open-Source Research</span>
            <span>•</span>
            <span>GPL-2.0 License</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ConfigurationModal
        game={configModalGame || undefined}
        isOpen={configModalGame !== null}
        onClose={() => setConfigModalGame(null)}
        onSave={handleSaveConfig}
      />

      <TrophyModal
        game={trophyModalGame || undefined}
        isOpen={trophyModalGame !== null}
        onClose={() => setTrophyModalGame(null)}
        onToggleUnlock={handleToggleTrophy}
      />

      <AddGameModal
        isOpen={isAddGameOpen}
        onClose={() => setIsAddGameOpen(false)}
        onAdd={handleAddGame}
      />
    </div>
  );
};
