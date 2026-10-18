import React, { useState } from 'react';
import { X, Plus, FolderPlus, Gamepad2 } from 'lucide-react';
import { GameCategory, GameItem, GameStatus, Region } from '../types';
import { DEFAULT_GAME_CONFIG } from '../data/languages';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newGame: GameItem) => void;
}

export const AddGameModal: React.FC<AddGameModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [titleId, setTitleId] = useState('PPSA0');
  const [version, setVersion] = useState('1.000.000');
  const [region, setRegion] = useState<Region>('USA');
  const [category, setCategory] = useState<GameCategory>('Game');
  const [status, setStatus] = useState<GameStatus>('InGame');
  const [ebootPath, setEbootPath] = useState('C:\\Games\\CustomGame\\eboot.bin');
  const [size, setSize] = useState('24.5 GB');
  const [notes, setNotes] = useState('Imported PS5 game package with standard Vulkan pipeline.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !titleId.trim()) return;

    const newGame: GameItem = {
      id: `game-${Date.now()}`,
      title: title.trim(),
      titleId: titleId.trim().toUpperCase(),
      version: version.trim(),
      region,
      category,
      status,
      ebootPath,
      gameDir: ebootPath.replace(/\\eboot\.bin$/i, ''),
      size,
      fpsTarget: 60,
      notes,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
      config: { ...DEFAULT_GAME_CONFIG },
      trophies: [
        {
          id: `t-${Date.now()}-1`,
          title: 'Welcome Adventurer',
          description: 'Launch the game for the first time.',
          type: 'Bronze',
          unlocked: true,
          unlockedAt: 'Just now',
          hidden: false,
        },
        {
          id: `t-${Date.now()}-2`,
          title: 'Master Champion',
          description: 'Complete all chapters in story mode.',
          type: 'Gold',
          unlocked: false,
          hidden: false,
        },
      ],
    };

    onAdd(newGame);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">Add PlayStation 5 Title</h2>
              <div className="text-xs text-slate-400 font-mono">Register new dump into KytyPS5 library</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Game Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Ghost of Tsushima: Director's Cut"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Title ID (e.g. PPSA01234)</label>
              <input
                type="text"
                required
                value={titleId}
                onChange={(e) => setTitleId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Version</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as Region)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="USA">USA (Americas)</option>
                <option value="EUR">EUR (Europe)</option>
                <option value="JPN">JPN (Japan)</option>
                <option value="GLOBAL">GLOBAL</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GameCategory)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="Game">PS5 Retail Game</option>
                <option value="Application">System Application</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Executable Path (eboot.bin)</label>
            <input
              type="text"
              value={ebootPath}
              onChange={(e) => setEbootPath(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Testing Notes &amp; CLI Flags</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white leading-relaxed"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition"
            >
              Add to Library
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
