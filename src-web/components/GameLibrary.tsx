import React, { useState } from 'react';
import {
  Play,
  Settings,
  Award,
  Search,
  Filter,
  Layers,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  FolderOpen,
} from 'lucide-react';
import { GameItem, GameStatus } from '../types';

interface GameLibraryProps {
  games: GameItem[];
  onLaunchGame: (game: GameItem) => void;
  onOpenConfig: (game: GameItem) => void;
  onOpenTrophies: (game: GameItem) => void;
  onAddGame: () => void;
}

export const GameLibrary: React.FC<GameLibraryProps> = ({
  games,
  onLaunchGame,
  onOpenConfig,
  onOpenTrophies,
  onAddGame,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredGames = games.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.titleId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || game.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: GameStatus) => {
    switch (status) {
      case 'Playable':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-3 h-3" />
            <span>Playable</span>
          </span>
        );
      case 'InGame':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <span>In Game</span>
          </span>
        );
      case 'MainMenu':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            <span>Main Menu</span>
          </span>
        );
      case 'Logo':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <span>Boots Logo</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/30">
            <HelpCircle className="w-3 h-3" />
            <span>Unknown</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search game or Title ID (e.g. PPSA03671)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['All', 'Playable', 'InGame', 'MainMenu', 'Logo'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedFilter === status
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Games */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="group relative flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-950/20 transition-all duration-300"
          >
            {/* Cover Image Container */}
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // Fallback if local screenshot missing
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

              {/* Status Badge overlay */}
              <div className="absolute top-3 left-3">{getStatusBadge(game.status)}</div>

              {/* Title ID Pill */}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[11px] font-mono font-bold text-slate-300 border border-slate-800">
                {game.titleId}
              </div>

              {/* Quick Play Floating Overlay Button */}
              <button
                onClick={() => onLaunchGame(game)}
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 shadow-xl shadow-blue-600/50"
                title={`Launch ${game.title}`}
              >
                <Play className="w-7 h-7 fill-current ml-1" />
              </button>
            </div>

            {/* Game Card Content */}
            <div className="flex-1 p-4 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-bold text-base text-white font-display line-clamp-1 group-hover:text-blue-400 transition-colors">
                  {game.title}
                </h3>
                <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1 font-mono">
                  <span>v{game.version}</span>
                  <span>•</span>
                  <span>{game.size}</span>
                  <span>•</span>
                  <span className="text-slate-300">{game.region}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {game.notes}
                </p>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => onLaunchGame(game)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Boot Game</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onOpenTrophies(game)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition"
                    title="Trophies"
                  >
                    <Award className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenConfig(game)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title="Edit Game Configuration"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-12 p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <FolderOpen className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No games found</h3>
          <p className="text-xs text-slate-400">Try adjusting your search terms or add a new PS5 title.</p>
          <button
            onClick={onAddGame}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition"
          >
            Add New Game
          </button>
        </div>
      )}
    </div>
  );
};
