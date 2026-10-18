import React, { useState } from 'react';
import {
  X,
  Sliders,
  Cpu,
  Tv,
  Volume2,
  Gamepad,
  Globe,
  Check,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { GameConfig, GameItem } from '../types';
import { CONSOLE_LANGUAGES } from '../data/languages';

interface ConfigurationModalProps {
  game?: GameItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newConfig: GameConfig) => void;
}

export const ConfigurationModal: React.FC<ConfigurationModalProps> = ({
  game,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !game) return null;

  const [activeTab, setActiveTab] = useState<'graphics' | 'cpu' | 'audio' | 'controller' | 'system'>('graphics');
  const [config, setConfig] = useState<GameConfig>({ ...game.config });

  const presetColors = [
    { label: 'PlayStation Blue', hex: '#006FCD' },
    { label: 'Wolverine Crimson', hex: '#E50914' },
    { label: 'Venom Red', hex: '#FF2A2A' },
    { label: 'Astro Cyan', hex: '#00D2FF' },
    { label: 'Dreaming Violet', hex: '#A855F7' },
    { label: 'Gold Trophy', hex: '#EAB308' },
  ];

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Configuration — {game.title}
              </h2>
              <div className="text-xs text-slate-400 font-mono">
                Title ID: {game.titleId} • KytyPS5 Launcher Settings
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

        {/* Tab Switcher */}
        <div className="flex px-6 pt-2 border-b border-slate-800 bg-slate-950/40 space-x-2 overflow-x-auto">
          {[
            { id: 'graphics', label: 'Graphics & GPU', icon: Tv },
            { id: 'cpu', label: 'CPU & Kernel', icon: Cpu },
            { id: 'audio', label: 'Audio & Sound', icon: Volume2 },
            { id: 'controller', label: 'Controller & DualSense', icon: Gamepad },
            { id: 'system', label: 'System & Language', icon: Globe },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center space-x-2 py-3 px-3.5 border-b-2 text-xs font-semibold whitespace-nowrap transition ${
                  active
                    ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* GRAPHICS TAB */}
          {activeTab === 'graphics' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">Bindless Textures (--bindless)</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/40 font-bold">
                        CRITICAL FOR WOLVERINE
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                      Material system reads image descriptors from global texture heap (14,500+ candidates).
                      Uses Vulkan UPDATE_AFTER_BIND descriptor indexing, translation buffer and feedback buffer.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.bindlessTextures}
                    onChange={(e) => setConfig({ ...config, bindlessTextures: e.target.checked })}
                    className="w-5 h-5 rounded accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-bold text-white">Enable Readback Linear Images</span>
                    <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                      Permits CPU host reads of linear texture layouts (required for menu UI and screen-reader prompts).
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.readbackLinearImages}
                    onChange={(e) => setConfig({ ...config, readbackLinearImages: e.target.checked })}
                    className="w-5 h-5 rounded accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-bold text-white">Enable Tessellation Support</span>
                    <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                      Recompiles hull/domain stages to SPIR-V tessellation control and evaluation shaders.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.tessellation}
                    onChange={(e) => setConfig({ ...config, tessellation: e.target.checked })}
                    className="w-5 h-5 rounded accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">SysV Red Zone Protection (--redzone)</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                      Prevents host exception dispatch and POSIX signal handlers from overwriting the guest 128-byte SysV red zone.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.redzoneProtection}
                    onChange={(e) => setConfig({ ...config, redzoneProtection: e.target.checked })}
                    className="w-5 h-5 rounded accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-300">Resolution Scale</label>
                  <select
                    value={config.resolutionScale}
                    onChange={(e) => setConfig({ ...config, resolutionScale: e.target.value as any })}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  >
                    <option value="1080p">1080p (Standard Full HD)</option>
                    <option value="1440p">1440p (QHD 2K)</option>
                    <option value="4k">4K (Ultra HD 3840x2160)</option>
                    <option value="Native">Native Guest Viewport</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-300">Frame Rate Limiter</label>
                  <select
                    value={config.frameLimit}
                    onChange={(e) => setConfig({ ...config, frameLimit: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  >
                    <option value={30}>30 FPS (Cinematic Lock)</option>
                    <option value={60}>60 FPS (Default)</option>
                    <option value={120}>120 FPS (High Refresh Rate)</option>
                    <option value={0}>Unlimited</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* CPU & KERNEL TAB */}
          {activeTab === 'cpu' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">x86_64 JIT Recompiler</span>
                    <p className="text-xs text-slate-400">Dynamic binary translation for PS5 AMD Zen 2 CPU cores.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.jitEnabled}
                    onChange={(e) => setConfig({ ...config, jitEnabled: e.target.checked })}
                    className="w-5 h-5 rounded accent-blue-600"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">AMPR Wait-Free Ring Buffer</span>
                    <p className="text-xs text-slate-400">
                      Decouples APR file reads and AMM memory maps under separate locks to prevent streaming access violations.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.amprWaitFree}
                    onChange={(e) => setConfig({ ...config, amprWaitFree: e.target.checked })}
                    className="w-5 h-5 rounded accent-blue-600"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300">CFG Dispatcher Safety Cap (transitions)</label>
                <input
                  type="number"
                  value={config.cfgSafetyCap}
                  onChange={(e) => setConfig({ ...config, cfgSafetyCap: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                />
                <p className="text-[11px] text-slate-500">
                  Prevents infinite loop GPU hangs on non-structurised shaders (e.g. hash 0x09161b28ae4039bb). Default: 4096.
                </p>
              </div>
            </div>
          )}

          {/* AUDIO TAB */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300">Audio Decoder Backend</label>
                <select
                  value={config.audioDecoder}
                  onChange={(e) => setConfig({ ...config, audioDecoder: e.target.value as any })}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="LibAtrac9">LibAtrac9 (Validates Header 0xFE & Channels &lt; 6)</option>
                  <option value="Ngs2">NGS2 Synthesizer / Audio3D</option>
                  <option value="Aac">FFmpeg AAC Decoder</option>
                  <option value="Opus">Opus Audio Codec</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-white">Master Output Volume</span>
                  <span className="font-mono text-blue-400">{config.masterVolume}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={config.masterVolume}
                  onChange={(e) => setConfig({ ...config, masterVolume: Number(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">PlayStation 3D Tempest Audio</span>
                    <p className="text-xs text-slate-400">Headphone HRTF surround simulation for atmospheric depth.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.spatialAudio}
                    onChange={(e) => setConfig({ ...config, spatialAudio: e.target.checked })}
                    className="w-5 h-5 rounded accent-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CONTROLLER & LIGHTBAR TAB */}
          {activeTab === 'controller' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-300">DualSense Lightbar LED Color</label>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-xl border border-white/20 shadow-lg"
                    style={{ backgroundColor: config.lightbarColor }}
                  />
                  <input
                    type="text"
                    value={config.lightbarColor}
                    onChange={(e) => setConfig({ ...config, lightbarColor: e.target.value })}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white w-32"
                  />
                  <input
                    type="color"
                    value={config.lightbarColor}
                    onChange={(e) => setConfig({ ...config, lightbarColor: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {presetColors.map((preset) => (
                    <button
                      key={preset.hex}
                      onClick={() => setConfig({ ...config, lightbarColor: preset.hex })}
                      className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs"
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.hex }} />
                      <span className="text-slate-300">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">Haptic Feedback & Rumble</span>
                    <p className="text-xs text-slate-400">Simulate dual voice coil actuators on controller vibration.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.hapticFeedback}
                    onChange={(e) => setConfig({ ...config, hapticFeedback: e.target.checked })}
                    className="w-5 h-5 rounded accent-blue-600"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">Adaptive Triggers Emulation</span>
                    <p className="text-xs text-slate-400">Dynamic trigger tension for L2 and R2.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.adaptiveTriggers}
                    onChange={(e) => setConfig({ ...config, adaptiveTriggers: e.target.checked })}
                    className="w-5 h-5 rounded accent-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SYSTEM & LANGUAGE TAB */}
          {activeTab === 'system' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300">PS5 Console Language</label>
                <select
                  value={config.consoleLanguage}
                  onChange={(e) => setConfig({ ...config, consoleLanguage: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  {CONSOLE_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500">
                  Games query libSystemService / UserService to load local voice packs and localization strings.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300">Save Data Directory</label>
                <input
                  type="text"
                  readOnly
                  value="savedata/user_00000001/PPSA03671/"
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400"
                />
                <p className="text-[11px] text-slate-500">
                  SaveDataGetEventResult poll rate limiter applied (prevents 74 GB log flood).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex items-center justify-end space-x-3 bg-slate-900/80">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Apply Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
