import React from 'react';
import { audioManager } from '../utils/audio';

interface DualSenseControllerProps {
  lightbarColor: string;
  activeButtons: Set<string>;
  onButtonDown: (buttonName: string) => void;
  onButtonUp: (buttonName: string) => void;
}

export const DualSenseController: React.FC<DualSenseControllerProps> = ({
  lightbarColor,
  activeButtons,
  onButtonDown,
  onButtonUp,
}) => {
  const isPressed = (btn: string) => activeButtons.has(btn);

  const handlePointerDown = (btn: string) => {
    audioManager.playButtonClick();
    onButtonDown(btn);
  };

  const handlePointerUp = (btn: string) => {
    onButtonUp(btn);
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Controller Top Triggers bar */}
      <div className="w-full max-w-md flex justify-between px-8 mb-2">
        <div className="flex space-x-2">
          <button
            onPointerDown={() => handlePointerDown('L2')}
            onPointerUp={() => handlePointerUp('L2')}
            onPointerLeave={() => handlePointerUp('L2')}
            className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
              isPressed('L2')
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50 scale-95'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            L2 [Z]
          </button>
          <button
            onPointerDown={() => handlePointerDown('L1')}
            onPointerUp={() => handlePointerUp('L1')}
            onPointerLeave={() => handlePointerUp('L1')}
            className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
              isPressed('L1')
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50 scale-95'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            L1 [Q]
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            onPointerDown={() => handlePointerDown('R1')}
            onPointerUp={() => handlePointerUp('R1')}
            onPointerLeave={() => handlePointerUp('R1')}
            className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
              isPressed('R1')
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50 scale-95'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            R1 [E]
          </button>
          <button
            onPointerDown={() => handlePointerDown('R2')}
            onPointerUp={() => handlePointerUp('R2')}
            onPointerLeave={() => handlePointerUp('R2')}
            className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
              isPressed('R2')
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50 scale-95'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            R2 [C]
          </button>
        </div>
      </div>

      {/* Main DualSense Body */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden">
        {/* Glow ambient background based on lightbar */}
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 blur-2xl opacity-40 rounded-full pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: lightbarColor }}
        />

        {/* Center Touchpad & Lightbar */}
        <div className="flex flex-col items-center mb-4">
          <div
            className="w-40 h-2 rounded-full mb-2 transition-all duration-300 shadow-md"
            style={{
              backgroundColor: lightbarColor,
              boxShadow: `0 0 16px ${lightbarColor}, 0 0 4px ${lightbarColor}`,
            }}
          />
          <button
            onPointerDown={() => handlePointerDown('Touchpad')}
            onPointerUp={() => handlePointerUp('Touchpad')}
            onPointerLeave={() => handlePointerUp('Touchpad')}
            className={`w-36 h-14 rounded-xl border border-slate-600/60 flex items-center justify-center text-[11px] font-mono transition-all ${
              isPressed('Touchpad')
                ? 'bg-slate-700 text-white scale-98'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800'
            }`}
          >
            Touchpad [~]
          </button>
        </div>

        {/* Action Controls Area */}
        <div className="grid grid-cols-3 gap-2 items-center">
          {/* Left D-PAD */}
          <div className="flex flex-col items-center">
            <button
              onPointerDown={() => handlePointerDown('DpadUp')}
              onPointerUp={() => handlePointerUp('DpadUp')}
              onPointerLeave={() => handlePointerUp('DpadUp')}
              className={`w-9 h-9 rounded-t-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-xs font-bold transition-all ${
                isPressed('DpadUp') ? 'bg-blue-600 text-white scale-95 shadow-md shadow-blue-500/50' : 'text-slate-300'
              }`}
            >
              ▲
            </button>
            <div className="flex">
              <button
                onPointerDown={() => handlePointerDown('DpadLeft')}
                onPointerUp={() => handlePointerUp('DpadLeft')}
                onPointerLeave={() => handlePointerUp('DpadLeft')}
                className={`w-9 h-9 rounded-l-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-xs font-bold transition-all ${
                  isPressed('DpadLeft') ? 'bg-blue-600 text-white scale-95 shadow-md shadow-blue-500/50' : 'text-slate-300'
                }`}
              >
                ◀
              </button>
              <div className="w-9 h-9 bg-slate-900 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-slate-700"></span>
              </div>
              <button
                onPointerDown={() => handlePointerDown('DpadRight')}
                onPointerUp={() => handlePointerUp('DpadRight')}
                onPointerLeave={() => handlePointerUp('DpadRight')}
                className={`w-9 h-9 rounded-r-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-xs font-bold transition-all ${
                  isPressed('DpadRight') ? 'bg-blue-600 text-white scale-95 shadow-md shadow-blue-500/50' : 'text-slate-300'
                }`}
              >
                ▶
              </button>
            </div>
            <button
              onPointerDown={() => handlePointerDown('DpadDown')}
              onPointerUp={() => handlePointerUp('DpadDown')}
              onPointerLeave={() => handlePointerUp('DpadDown')}
              className={`w-9 h-9 rounded-b-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-xs font-bold transition-all ${
                isPressed('DpadDown') ? 'bg-blue-600 text-white scale-95 shadow-md shadow-blue-500/50' : 'text-slate-300'
              }`}
            >
              ▼
            </button>
            <span className="text-[10px] text-slate-500 mt-1 font-mono">Arrow Keys</span>
          </div>

          {/* Center PS Button & Options */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="flex items-center space-x-6">
              <button
                onPointerDown={() => handlePointerDown('Share')}
                onPointerUp={() => handlePointerUp('Share')}
                onPointerLeave={() => handlePointerUp('Share')}
                className="w-4 h-6 rounded-full bg-slate-800 text-[9px] text-slate-400 hover:bg-slate-700"
                title="Create"
              >
                |
              </button>
              <button
                onPointerDown={() => handlePointerDown('Options')}
                onPointerUp={() => handlePointerUp('Options')}
                onPointerLeave={() => handlePointerUp('Options')}
                className={`px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono transition-all ${
                  isPressed('Options') ? 'bg-blue-600 text-white scale-95' : 'text-slate-300'
                }`}
                title="Options [Enter]"
              >
                OPT
              </button>
            </div>

            {/* PlayStation Symbol Button */}
            <button
              onPointerDown={() => handlePointerDown('PS')}
              onPointerUp={() => handlePointerUp('PS')}
              onPointerLeave={() => handlePointerUp('PS')}
              className={`w-8 h-8 rounded-full border border-slate-600/70 flex items-center justify-center font-bold text-xs shadow-md transition-all ${
                isPressed('PS')
                  ? 'bg-blue-600 text-white scale-90 shadow-blue-500/50'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              ☖
            </button>
            <span className="text-[10px] text-slate-500 font-mono">Enter=Options</span>
          </div>

          {/* Right Action Face Buttons (Cross, Circle, Triangle, Square) */}
          <div className="flex flex-col items-center">
            {/* Triangle [I] */}
            <button
              onPointerDown={() => handlePointerDown('Triangle')}
              onPointerUp={() => handlePointerUp('Triangle')}
              onPointerLeave={() => handlePointerUp('Triangle')}
              className={`w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-emerald-400 font-bold transition-all ${
                isPressed('Triangle') ? 'bg-emerald-600 text-white scale-95 shadow-md shadow-emerald-500/50' : ''
              }`}
              title="Triangle [I]"
            >
              ▲
            </button>

            <div className="flex space-x-3 my-1">
              {/* Square [K] */}
              <button
                onPointerDown={() => handlePointerDown('Square')}
                onPointerUp={() => handlePointerUp('Square')}
                onPointerLeave={() => handlePointerUp('Square')}
                className={`w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-pink-400 font-bold transition-all ${
                  isPressed('Square') ? 'bg-pink-600 text-white scale-95 shadow-md shadow-pink-500/50' : ''
                }`}
                title="Square [K]"
              >
                ■
              </button>
              {/* Circle [L] */}
              <button
                onPointerDown={() => handlePointerDown('Circle')}
                onPointerUp={() => handlePointerUp('Circle')}
                onPointerLeave={() => handlePointerUp('Circle')}
                className={`w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-red-400 font-bold transition-all ${
                  isPressed('Circle') ? 'bg-red-600 text-white scale-95 shadow-md shadow-red-500/50' : ''
                }`}
                title="Circle [L]"
              >
                ●
              </button>
            </div>

            {/* Cross [J] */}
            <button
              onPointerDown={() => handlePointerDown('Cross')}
              onPointerUp={() => handlePointerUp('Cross')}
              onPointerLeave={() => handlePointerUp('Cross')}
              className={`w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-blue-400 font-bold transition-all ${
                isPressed('Cross') ? 'bg-blue-600 text-white scale-95 shadow-md shadow-blue-500/50' : ''
              }`}
              title="Cross [J]"
            >
              ✕
            </button>
            <span className="text-[10px] text-slate-500 mt-1 font-mono">J=✕ L=● I=▲ K=■</span>
          </div>
        </div>

        {/* Analog Thumbsticks */}
        <div className="flex justify-around mt-5 pt-3 border-t border-slate-800/80">
          {/* Left Stick (WASD) */}
          <div className="flex flex-col items-center">
            <button
              onPointerDown={() => handlePointerDown('L3')}
              onPointerUp={() => handlePointerUp('L3')}
              onPointerLeave={() => handlePointerUp('L3')}
              className={`w-14 h-14 rounded-full bg-gradient-to-tr from-slate-900 to-slate-800 border-2 border-slate-700 flex flex-col items-center justify-center shadow-lg transition-transform ${
                isPressed('LeftStickUp') || isPressed('LeftStickDown') || isPressed('LeftStickLeft') || isPressed('LeftStickRight') || isPressed('L3')
                  ? 'ring-2 ring-blue-500 scale-95'
                  : 'hover:border-slate-500'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                L3
              </div>
            </button>
            <span className="text-[10px] text-slate-400 font-mono mt-1">Left Stick (WASD)</span>
          </div>

          {/* Right Stick (TFGH) */}
          <div className="flex flex-col items-center">
            <button
              onPointerDown={() => handlePointerDown('R3')}
              onPointerUp={() => handlePointerUp('R3')}
              onPointerLeave={() => handlePointerUp('R3')}
              className={`w-14 h-14 rounded-full bg-gradient-to-tr from-slate-900 to-slate-800 border-2 border-slate-700 flex flex-col items-center justify-center shadow-lg transition-transform ${
                isPressed('RightStickUp') || isPressed('RightStickDown') || isPressed('RightStickLeft') || isPressed('RightStickRight') || isPressed('R3')
                  ? 'ring-2 ring-blue-500 scale-95'
                  : 'hover:border-slate-500'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                R3
              </div>
            </button>
            <span className="text-[10px] text-slate-400 font-mono mt-1">Right Stick (TFGH)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
