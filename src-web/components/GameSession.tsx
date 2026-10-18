import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Camera,
  Maximize2,
  Volume2,
  VolumeX,
  Sliders,
  Award,
  ChevronDown,
  Terminal,
} from 'lucide-react';
import { GameItem } from '../types';
import { DualSenseController } from './DualSenseController';
import { audioManager } from '../utils/audio';
import confetti from 'canvas-confetti';

interface GameSessionProps {
  game: GameItem;
  onExit: () => void;
  onUnlockTrophy: (trophyId: string) => void;
}

export const GameSession: React.FC<GameSessionProps> = ({
  game,
  onExit,
  onUnlockTrophy,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showController, setShowController] = useState(true);
  const [showDebugHud, setShowDebugHud] = useState(true);
  const [activeButtons, setActiveButtons] = useState<Set<string>>(new Set());
  const [gameState, setGameState] = useState<'screenReader' | 'titleScreen' | 'inGame'>('screenReader');
  const [fps, setFps] = useState(58);
  const [frameTime, setFrameTime] = useState(16.7);
  const [endOfPipeCount, setEndOfPipeCount] = useState(4820);
  const [descriptorsCount] = useState(14528);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  // Player position in simulation
  const playerRef = useRef({ x: 200, y: 300, vx: 0, vy: 0, slashEffect: 0 });

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid shortcuts if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const code = e.code;
      if (code === 'Space') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
        return;
      }

      const buttonMap: Record<string, string> = {
        KeyJ: 'Cross',
        KeyL: 'Circle',
        KeyI: 'Triangle',
        KeyK: 'Square',
        ArrowUp: 'DpadUp',
        ArrowDown: 'DpadDown',
        ArrowLeft: 'DpadLeft',
        ArrowRight: 'DpadRight',
        KeyW: 'LeftStickUp',
        KeyS: 'LeftStickDown',
        KeyA: 'LeftStickLeft',
        KeyD: 'LeftStickRight',
        KeyT: 'RightStickUp',
        KeyG: 'RightStickDown',
        KeyF: 'RightStickLeft',
        KeyH: 'RightStickRight',
        KeyQ: 'L1',
        KeyE: 'R1',
        KeyZ: 'L2',
        KeyC: 'R2',
        Enter: 'Options',
      };

      const btn = buttonMap[code];
      if (btn) {
        e.preventDefault();
        triggerButtonPress(btn);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const buttonMap: Record<string, string> = {
        KeyJ: 'Cross',
        KeyL: 'Circle',
        KeyI: 'Triangle',
        KeyK: 'Square',
        ArrowUp: 'DpadUp',
        ArrowDown: 'DpadDown',
        ArrowLeft: 'DpadLeft',
        ArrowRight: 'DpadRight',
        KeyW: 'LeftStickUp',
        KeyS: 'LeftStickDown',
        KeyA: 'LeftStickLeft',
        KeyD: 'LeftStickRight',
        KeyT: 'RightStickUp',
        KeyG: 'RightStickDown',
        KeyF: 'RightStickLeft',
        KeyH: 'RightStickRight',
        KeyQ: 'L1',
        KeyE: 'R1',
        KeyZ: 'L2',
        KeyC: 'R2',
        Enter: 'Options',
      };

      const btn = buttonMap[e.code];
      if (btn) {
        releaseButton(btn);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  const triggerButtonPress = (btn: string) => {
    setActiveButtons((prev) => new Set(prev).add(btn));
    audioManager.playButtonClick();

    if (btn === 'Cross') {
      if (gameState === 'screenReader') {
        setGameState('titleScreen');
      } else if (gameState === 'titleScreen') {
        setGameState('inGame');
      }
    }

    if (btn === 'Triangle' || btn === 'Square') {
      playerRef.current.slashEffect = 20; // Trigger claw slash animation
    }
  };

  const releaseButton = (btn: string) => {
    setActiveButtons((prev) => {
      const next = new Set(prev);
      next.delete(btn);
      return next;
    });
  };

  // Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();
    let frameCounter = 0;
    let particleTime = 0;

    // Dust particles for desert canyon
    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.2) * 1.5,
      speedY: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const render = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      if (!isPaused) {
        frameCounter++;
        particleTime += 0.02;

        if (frameCounter % 15 === 0) {
          setFps(Math.round(57 + Math.random() * 5));
          setFrameTime(+(16.4 + Math.random() * 0.7).toFixed(1));
          setEndOfPipeCount((c) => c + 1);
        }

        // Left stick movement
        if (activeButtons.has('LeftStickLeft')) playerRef.current.x -= 3;
        if (activeButtons.has('LeftStickRight')) playerRef.current.x += 3;
        if (activeButtons.has('LeftStickUp')) playerRef.current.y -= 3;
        if (activeButtons.has('LeftStickDown')) playerRef.current.y += 3;

        // Clear canvas
        ctx.fillStyle = '#05070f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (game.id === 'wolverine') {
          // Render Wolverine Desert Scene
          // 1. Sky Gradient (Sunset Desert)
          const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
          skyGrad.addColorStop(0, '#1a0808');
          skyGrad.addColorStop(0.35, '#3b120c');
          skyGrad.addColorStop(0.65, '#853216');
          skyGrad.addColorStop(0.85, '#cc6c33');
          skyGrad.addColorStop(1, '#e39446');
          ctx.fillStyle = skyGrad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // 2. Distant Desert Mountains (Depth of Field blurred)
          ctx.fillStyle = 'rgba(70, 20, 15, 0.7)';
          ctx.beginPath();
          ctx.moveTo(0, canvas.height * 0.68);
          ctx.lineTo(150, canvas.height * 0.52);
          ctx.lineTo(340, canvas.height * 0.62);
          ctx.lineTo(520, canvas.height * 0.48);
          ctx.lineTo(720, canvas.height * 0.65);
          ctx.lineTo(canvas.width, canvas.height * 0.54);
          ctx.lineTo(canvas.width, canvas.height);
          ctx.lineTo(0, canvas.height);
          ctx.fill();

          // 3. Foreground Desert Plateau with rock geometry
          const groundGrad = ctx.createLinearGradient(0, canvas.height * 0.65, 0, canvas.height);
          groundGrad.addColorStop(0, '#2e1208');
          groundGrad.addColorStop(0.5, '#1e0c05');
          groundGrad.addColorStop(1, '#0c0502');
          ctx.fillStyle = groundGrad;
          ctx.beginPath();
          ctx.moveTo(0, canvas.height * 0.72);
          ctx.bezierCurveTo(240, canvas.height * 0.68, 500, canvas.height * 0.76, canvas.width, canvas.height * 0.7);
          ctx.lineTo(canvas.width, canvas.height);
          ctx.lineTo(0, canvas.height);
          ctx.fill();

          // 4. Floating dust particles (Vulkan compute particles simulation)
          particles.forEach((p) => {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x > canvas.width) p.x = 0;
            if (p.x < 0) p.x = canvas.width;
            if (p.y > canvas.height) p.y = 0;
            if (p.y < 0) p.y = canvas.height;

            ctx.fillStyle = `rgba(240, 190, 140, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          });

          // 5. Claw slash effect if active
          if (playerRef.current.slashEffect > 0) {
            playerRef.current.slashEffect--;
            ctx.save();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 4;
            ctx.shadowColor = '#e50914';
            ctx.shadowBlur = 20;

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const slashAlpha = playerRef.current.slashEffect / 20;
            ctx.globalAlpha = slashAlpha;

            for (let i = -1; i <= 1; i++) {
              ctx.beginPath();
              ctx.moveTo(cx - 120 + i * 25, cy - 80);
              ctx.lineTo(cx + 80 + i * 25, cy + 90);
              ctx.stroke();
            }
            ctx.restore();
          }

          // 6. Overlay UI depending on state
          if (gameState === 'screenReader') {
            // Authentic PS5 Screen Reader dialog box
            ctx.fillStyle = 'rgba(10, 15, 25, 0.88)';
            const boxW = 540;
            const boxH = 220;
            const bx = (canvas.width - boxW) / 2;
            const by = (canvas.height - boxH) / 2;
            ctx.roundRect(bx, by, boxW, boxH, 16);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.font = 'bold 20px Outfit, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText('Screen Reader Enabled', canvas.width / 2, by + 45);

            ctx.font = '14px Plus Jakarta Sans, sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('Would you like to keep Screen Reader turned on?', canvas.width / 2, by + 80);
            ctx.fillText('You can change this anytime in Accessibility Settings.', canvas.width / 2, by + 105);

            // Press ⊗ button glyph
            ctx.fillStyle = '#006FCD';
            ctx.beginPath();
            ctx.arc(canvas.width / 2 - 70, by + 160, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 15px monospace';
            ctx.fillText('✕', canvas.width / 2 - 70, by + 165);

            ctx.fillStyle = '#ffffff';
            ctx.font = '600 15px Plus Jakarta Sans, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Press J or Click Cross to Continue', canvas.width / 2 - 40, by + 166);
          } else if (gameState === 'titleScreen') {
            // Main 3D Title Screen
            ctx.font = '900 48px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 12;
            ctx.fillText("MARVEL'S WOLVERINE", canvas.width / 2, canvas.height * 0.38);

            ctx.font = '700 14px monospace';
            ctx.fillStyle = '#ef4444';
            ctx.fillText('PPSA03671 • BUILD v1.000.000 • BINDLESS HEAP ACTIVE', canvas.width / 2, canvas.height * 0.44);

            // Pulsing "PRESS ⊗ TO START"
            const pulse = 0.7 + 0.3 * Math.sin(time * 0.004);
            ctx.globalAlpha = pulse;
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 18px Plus Jakarta Sans, sans-serif';
            ctx.fillText('PRESS  [ ✕ ]  TO START', canvas.width / 2, canvas.height * 0.82);
            ctx.globalAlpha = 1.0;

            // Subtitle preview
            ctx.font = '13px Plus Jakarta Sans, sans-serif';
            ctx.fillStyle = '#fbbf24';
            ctx.fillText('Logan (VO): "Not everything buried out here stays dead..."', canvas.width / 2, canvas.height * 0.9);
          } else {
            // InGame Desert Exploration
            ctx.font = '700 24px Outfit, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText('CANADIAN HIGH PLAINS - ACT I', canvas.width / 2, 70);

            // Interactive Logan Avatar / Target
            ctx.fillStyle = '#e50914';
            ctx.beginPath();
            ctx.arc(playerRef.current.x, playerRef.current.y, 22, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.font = 'bold 11px monospace';
            ctx.fillStyle = '#ffffff';
            ctx.fillText('LOGAN', playerRef.current.x, playerRef.current.y - 30);

            ctx.font = '13px Plus Jakarta Sans, sans-serif';
            ctx.fillStyle = '#e2e8f0';
            ctx.fillText('Move with WASD / Left Stick • Slash with Triangle [I] or Square [K]', canvas.width / 2, canvas.height - 40);
          }
        } else {
          // Astro Bot or other game generic canvas
          ctx.fillStyle = '#1e1b4b';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.font = 'bold 36px Outfit, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText(game.title, canvas.width / 2, canvas.height * 0.4);

          ctx.font = '16px Plus Jakarta Sans, sans-serif';
          ctx.fillStyle = '#93c5fd';
          ctx.fillText(`Playing ${game.titleId} • 60 FPS • Vulkan Host Pipeline`, canvas.width / 2, canvas.height * 0.5);

          ctx.fillStyle = '#3b82f6';
          ctx.beginPath();
          ctx.arc(playerRef.current.x, playerRef.current.y, 24, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = '13px Plus Jakarta Sans, sans-serif';
          ctx.fillStyle = '#cbd5e1';
          ctx.fillText('Controls active: WASD to Move, J=Cross, L=Circle, I=Triangle, K=Square', canvas.width / 2, canvas.height * 0.75);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [game, isPaused, gameState, activeButtons]);

  const triggerTrophyDemo = () => {
    const lockedTrophy = game.trophies.find((t) => !t.unlocked) || game.trophies[0];
    if (lockedTrophy) {
      onUnlockTrophy(lockedTrophy.id);
      audioManager.playTrophyUnlock();
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.2 },
      });
      setRecentNotification(`Trophy Unlocked: ${lockedTrophy.title} (${lockedTrophy.type})`);
      setTimeout(() => setRecentNotification(null), 4000);
    }
  };

  const captureScreenshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `kyty_${game.titleId}_${Date.now()}.png`;
    a.click();
    setRecentNotification('Screenshot captured & saved!');
    setTimeout(() => setRecentNotification(null), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Session Header & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white font-display">{game.title}</h2>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                {game.titleId}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Linux x64 • Vulkan 1.3 • {game.config.bindlessTextures ? 'Bindless Descriptors ON' : 'Standard Textures'}
            </div>
          </div>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-2 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition ${
              isPaused
                ? 'bg-amber-600/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Pause / Resume (Space)"
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
            <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            onClick={captureScreenshot}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Take Screenshot"
          >
            <Camera className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Mute Audio"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={triggerTrophyDemo}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition"
            title="Simulate Trophy Unlock"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Test Trophy</span>
          </button>

          <button
            onClick={() => setShowDebugHud(!showDebugHud)}
            className={`p-2 rounded-lg border text-xs transition ${
              showDebugHud
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle Debug HUD"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600/20 text-red-300 border border-red-500/40 hover:bg-red-600 hover:text-white transition"
          >
            Stop Emulation
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="relative rounded-2xl bg-black border border-slate-800 overflow-hidden shadow-2xl aspect-video max-h-[640px] flex items-center justify-center">
        {/* Real-time Canvas */}
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="w-full h-full object-contain"
        />

        {/* PS5 Notification Toast */}
        {recentNotification && (
          <div className="absolute top-6 right-6 flex items-center space-x-3 px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-slate-700 text-white shadow-2xl animate-bounce">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              🏆
            </div>
            <div className="text-xs">
              <div className="font-bold">{recentNotification}</div>
              <div className="text-[10px] text-slate-400">PlayStation Network Emulation</div>
            </div>
          </div>
        )}

        {/* Debug HUD Overlay */}
        {showDebugHud && (
          <div className="absolute top-4 left-4 p-3 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 font-mono text-[11px] text-slate-300 space-y-1 shadow-lg pointer-events-none">
            <div className="flex items-center space-x-2">
              <span className="text-emerald-400 font-bold text-sm">{fps} FPS</span>
              <span className="text-slate-500">•</span>
              <span className="text-blue-400">{frameTime} ms</span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-400">EndOfPipe: {endOfPipeCount}</span>
            </div>
            <div className="text-slate-400">
              Vulkan: <span className="text-white">VK_QUEUE_GRAPHICS_BIT</span> (Device: NVIDIA/RADV)
            </div>
            <div className="text-slate-400">
              Bindless: <span className="text-emerald-300">{descriptorsCount} descriptors</span> • Set 1, Bind 0-5
            </div>
            <div className="text-slate-400">
              AMPR: <span className="text-sky-300">Wait-Free Ring (1.2 GB/s streamed)</span>
            </div>
          </div>
        )}

        {/* Controller quick toggle overlay button */}
        <button
          onClick={() => setShowController(!showController)}
          className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-slate-300 text-xs font-mono border border-slate-700 backdrop-blur-sm transition"
        >
          {showController ? 'Hide Controller' : 'Show Controller'}
        </button>
      </div>

      {/* Dockable Interactive DualSense Controller */}
      {showController && (
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="text-xs font-mono text-slate-400">
              Interactive Controller Input • Keyboard active (J=Cross, L=Circle, I=Triangle, K=Square, WASD=Stick)
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400 font-mono">Lightbar:</span>
              <div
                className="w-4 h-4 rounded-full border border-white/30"
                style={{ backgroundColor: game.config.lightbarColor }}
              />
            </div>
          </div>
          <DualSenseController
            lightbarColor={game.config.lightbarColor}
            activeButtons={activeButtons}
            onButtonDown={triggerButtonPress}
            onButtonUp={releaseButton}
          />
        </div>
      )}
    </div>
  );
};
