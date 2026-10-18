import React from 'react';
import { X, Award, CheckCircle, Lock, Sparkles } from 'lucide-react';
import { GameItem, TrophyItem } from '../types';
import { audioManager } from '../utils/audio';
import confetti from 'canvas-confetti';

interface TrophyModalProps {
  game?: GameItem;
  isOpen: boolean;
  onClose: () => void;
  onToggleUnlock: (trophyId: string) => void;
}

export const TrophyModal: React.FC<TrophyModalProps> = ({
  game,
  isOpen,
  onClose,
  onToggleUnlock,
}) => {
  if (!isOpen || !game) return null;

  const unlockedCount = game.trophies.filter((t) => t.unlocked).length;
  const totalCount = game.trophies.length;
  const progressPercent = Math.round((unlockedCount / (totalCount || 1)) * 100);

  const handleUnlock = (trophy: TrophyItem) => {
    onToggleUnlock(trophy.id);
    if (!trophy.unlocked) {
      audioManager.playTrophyUnlock();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.3 },
      });
    }
  };

  const getRarityBadge = (type: TrophyItem['type']) => {
    switch (type) {
      case 'Platinum':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">PLATINUM</span>;
      case 'Gold':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">GOLD</span>;
      case 'Silver':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-300/20 text-slate-200 border border-slate-300/40">SILVER</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-700/20 text-amber-500 border border-amber-700/40">BRONZE</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">Trophies — {game.title}</h2>
              <div className="text-xs text-slate-400 font-mono">
                {unlockedCount} of {totalCount} Unlocked ({progressPercent}%)
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/80">
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Trophies List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {game.trophies.map((trophy) => (
            <div
              key={trophy.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                trophy.unlocked
                  ? 'bg-slate-950/70 border-amber-500/30'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-75'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                    trophy.unlocked
                      ? 'bg-gradient-to-tr from-amber-600/20 to-yellow-500/10 border-amber-500/40 text-amber-400 shadow-md shadow-amber-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}
                >
                  <Award className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-white text-sm">{trophy.title}</h4>
                    {getRarityBadge(trophy.type)}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {trophy.hidden && !trophy.unlocked ? (
                      <span className="italic text-slate-500 flex items-center space-x-1">
                        <Lock className="w-3 h-3 inline mr-1" /> Hidden Trophy
                      </span>
                    ) : (
                      trophy.description
                    )}
                  </p>
                  {trophy.unlocked && trophy.unlockedAt && (
                    <div className="text-[10px] text-emerald-400 font-mono">
                      Unlocked on {trophy.unlockedAt}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleUnlock(trophy)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
                  trophy.unlocked
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/30'
                }`}
              >
                {trophy.unlocked ? 'Revoke' : 'Simulate Unlock'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
