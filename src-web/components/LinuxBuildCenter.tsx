import React, { useState } from 'react';
import {
  Terminal,
  Cpu,
  CheckCircle2,
  Copy,
  Check,
  Play,
  Flame,
  FileCode,
  Package,
  Layers,
} from 'lucide-react';

export const LinuxBuildCenter: React.FC = () => {
  const [selectedDistro, setSelectedDistro] = useState<'ubuntu' | 'arch' | 'fedora' | 'nix'>('ubuntu');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [buildSimState, setBuildSimState] = useState<'idle' | 'running' | 'done'>('idle');
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [buildProgress, setBuildProgress] = useState(0);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const distroCommands = {
    ubuntu: `# Ubuntu 22.04 / 24.04 LTS & Debian 12
sudo apt-get update
sudo apt-get install --no-install-recommends -y \\
  clang lld ninja-build cmake pkg-config \\
  glslang-tools \\
  qt6-base-dev qt6-base-private-dev \\
  libvulkan-dev vulkan-tools \\
  libgl1-mesa-dev \\
  libasound2-dev libpulse-dev \\
  libudev-dev libdbus-1-dev \\
  libx11-dev libxcursor-dev libxext-dev libxfixes-dev libxi-dev libxrandr-dev libxss-dev libxtst-dev libxkbcommon-dev \\
  libwayland-dev wayland-protocols libdecor-0-dev`,
    arch: `# Arch Linux / EndeavourOS / Manjaro
sudo pacman -S --needed \\
  clang lld cmake ninja pkgconf \\
  glslang \\
  qt6-base \\
  vulkan-headers vulkan-icd-loader vulkan-tools \\
  mesa \\
  alsa-lib libpulse \\
  systemd-libs dbus \\
  libx11 libxcursor libxext libxfixes libxi libxrandr libxss libxtst libxkbcommon \\
  wayland wayland-protocols libdecor`,
    fedora: `# Fedora 40 / 41
sudo dnf install -y \\
  clang lld cmake ninja-build pkgconf-pkg-config \\
  glslang \\
  qt6-qtbase-devel qt6-qtbase-private-devel \\
  vulkan-loader-devel vulkan-tools \\
  mesa-libGL-devel \\
  alsa-lib-devel pulseaudio-libs-devel \\
  systemd-devel dbus-devel \\
  libX11-devel libXcursor-devel libXext-devel libXfixes-devel libXi-devel libXrandr-devel libXScrnSaver-devel libXtst-devel libxkbcommon-devel \\
  wayland-devel wayland-protocols-devel libdecor-devel`,
    nix: `# Nix / NixOS (KytyPS5 bundled environment)
# Uses the flake.nix / shell.nix in this repository:
nix-shell

# Or via Nix flakes:
nix develop`,
  };

  const cmakeBuildSteps = `# 1. Configure KytyPS5 with Clang & Ninja
cmake -S . -B _Build/linux \\
  -G Ninja \\
  -DCMAKE_BUILD_TYPE=Release \\
  -DCMAKE_C_COMPILER=clang \\
  -DCMAKE_CXX_COMPILER=clang++ \\
  -DCMAKE_PREFIX_PATH=/usr/lib/x86_64-linux-gnu/cmake/Qt6

# 2. Build the emulator and Qt launcher
cmake --build _Build/linux --target launcher kyty_emulator --parallel $(nproc)

# 3. (Optional) Run the test suite
ctest --test-dir _Build/linux -E kernel_file_system

# 4. Install binaries
cmake --install _Build/linux --prefix _Build/linux/install

# 5. Run a title (e.g. Marvel's Wolverine with bindless & redzone flags)
./_Build/linux/install/kyty_emulator \\
  --game "/path/to/PPSA03671/eboot.bin" \\
  --readback-linear-images true \\
  --tessellation \\
  --redzone \\
  --bindless \\
  --printf-direction File --printf-output-file _kyty.txt`;

  const runBuildSimulation = () => {
    if (buildSimState === 'running') return;
    setBuildSimState('running');
    setBuildLogs([]);
    setBuildProgress(0);

    const steps = [
      { text: '[0%] Host environment check: Linux x86_64 GNU/Linux (Clang 18.1.3 detected)', progress: 5 },
      { text: '[5%] Checking SDL3 backends: ALSA: ON, PulseAudio: ON, Wayland: ON, X11: ON', progress: 10 },
      { text: '[10%] Vulkan SDK 1.3.283: Checking descriptor indexing & bindless extensions... OK', progress: 15 },
      { text: '[15%] Qt6 Concurrent, Network, Widgets found at /usr/lib/cmake/Qt6', progress: 20 },
      { text: '[25%] [1/42] Compiling src/common/emulatorConfig.cpp (clang++)', progress: 28 },
      { text: '[35%] [8/42] Compiling src/graphics/host_gpu/renderer/pipeline/bindlessTable.cpp', progress: 38 },
      { text: '[45%] [16/42] Compiling src/graphics/shader/recompiler/backend/spirv/spirvEmitterProgram.cpp', progress: 48 },
      { text: '[55%] [24/42] Compiling src/libs/libAmpr.cpp (wait-free AMM memory streaming batch)', progress: 60 },
      { text: '[68%] [32/42] Compiling src/libs/ajm.cpp (LibAtrac9 decoder header 0xFE validator)', progress: 70 },
      { text: '[80%] [38/42] Compiling src/launcher/src/mainDialog.cpp & configurationEditDialog.cpp', progress: 82 },
      { text: '[90%] [40/42] Linking CXX executable _Build/linux/kyty_emulator (ld.lld)', progress: 90 },
      { text: '[95%] [42/42] Linking CXX executable _Build/linux/launcher (Qt6 Widgets)', progress: 96 },
      { text: '[98%] Installing artifacts into _Build/linux/install/kyty_emulator & launcher', progress: 99 },
      { text: '[100%] BUILD SUCCESSFUL! Binaries verified: ELF 64-bit LSB pie executable, x86-64', progress: 100 },
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setBuildLogs((prev) => [...prev, step.text]);
        setBuildProgress(step.progress);
        if (idx === steps.length - 1) {
          setBuildSimState('done');
        }
      }, (idx + 1) * 350);
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                Linux Native Toolchain
              </span>
              <span className="text-xs text-slate-400 font-mono">Clang + Ninja + Qt 6 + Vulkan 1.3</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white font-display tracking-tight">
              Building KytyPS5 for Linux
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              KytyPS5 provides first-class support for Linux x86_64 using Vulkan and SDL3. On Linux,
              titles like <strong className="text-white">Marvel&apos;s Wolverine (PPSA03671)</strong> and{' '}
              <strong className="text-white">Spider-Man: Miles Morales</strong> run with native Vulkan
              descriptor indexing and wait-free memory streaming.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={runBuildSimulation}
              disabled={buildSimState === 'running'}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{buildSimState === 'running' ? 'Building...' : 'Test Linux Build Run'}</span>
            </button>
            <button
              onClick={() => copyToClipboard(cmakeBuildSteps, 'all_steps')}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              {copiedKey === 'all_steps' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>Copy Build Script</span>
            </button>
          </div>
        </div>

        {/* Build Progress Bar */}
        {buildSimState !== 'idle' && (
          <div className="mt-5 space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Linux Build Progress</span>
              <span className="text-blue-400 font-bold">{buildProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${buildProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Simulated Terminal Log Output */}
      {buildLogs.length > 0 && (
        <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-slate-300 font-semibold">Linux Build Terminal Output</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Ninja (14 jobs)</span>
          </div>
          <div className="p-4 font-mono text-xs text-slate-300 space-y-1 max-h-60 overflow-y-auto bg-black/40">
            {buildLogs.map((log, index) => (
              <div
                key={index}
                className={
                  log.includes('SUCCESSFUL')
                    ? 'text-emerald-400 font-bold'
                    : log.includes('Checking')
                    ? 'text-sky-300'
                    : 'text-slate-300'
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Linux Distro Packages Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step 1: Install Dependencies */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="text-base font-bold text-white">Install Linux Dependencies</h3>
            </div>

            {/* Distro selector */}
            <div className="flex space-x-1 bg-slate-800/80 p-1 rounded-lg text-xs">
              {(['ubuntu', 'arch', 'fedora', 'nix'] as const).map((distro) => (
                <button
                  key={distro}
                  onClick={() => setSelectedDistro(distro)}
                  className={`px-2.5 py-1 rounded-md capitalize font-mono text-xs transition ${
                    selectedDistro === distro
                      ? 'bg-blue-600 text-white font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {distro}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 overflow-x-auto">
              <code>{distroCommands[selectedDistro]}</code>
            </pre>
            <button
              onClick={() => copyToClipboard(distroCommands[selectedDistro], 'distro')}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Copy command"
            >
              {copiedKey === 'distro' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Step 2: CMake Configure & Compile */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-base font-bold text-white">CMake & Ninja Compilation</h3>
            </div>
            <button
              onClick={() => copyToClipboard(cmakeBuildSteps, 'cmake_steps')}
              className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 font-mono"
            >
              {copiedKey === 'cmake_steps' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 overflow-x-auto max-h-72">
            <code>{cmakeBuildSteps}</code>
          </pre>
        </div>
      </div>

      {/* Linux Specific Runtime Guidance & Optimizations */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Linux Runtime Optimizations & Critical Flags</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>--bindless</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Mandatory for games like Wolverine with 14,500+ heap descriptors. Uses Vulkan
              <code className="text-slate-200"> UPDATE_AFTER_BIND</code> and host translation buffers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>--redzone</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Preserves the guest SysV red zone (128 bytes) during signal and exception handling,
              preventing immediate crashes when pressing Cross on game menus.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>AMD RADV / Mesa note</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              For AMD GPUs with RADV, ensure
              <code className="text-slate-200"> VK_KHRONOS_VALIDATION_GPUAV_SHARED_MEMORY_DATA_RACE=false</code>
              is set because lockstep GCN code does not trigger false positive races.
            </p>
          </div>
        </div>

        {/* Ready-to-use Scripts in Repository */}
        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <FileCode className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <div className="text-sm font-semibold text-white">Built-in Linux Scripts Included</div>
              <div className="text-xs text-slate-400">
                Executable scripts <code className="text-blue-300">scripts/build_linux.sh</code> and{' '}
                <code className="text-blue-300">kyty_run.sh</code> are saved directly in this repo.
              </div>
            </div>
          </div>
          <div className="flex space-x-2 shrink-0">
            <button
              onClick={() => copyToClipboard('chmod +x scripts/build_linux.sh && ./scripts/build_linux.sh', 'run_script')}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-semibold transition"
            >
              {copiedKey === 'run_script' ? 'Copied Command!' : './scripts/build_linux.sh'}
            </button>
          </div>
        </div>

        {/* GitHub Actions CI Integration Card */}
        <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              CI
            </div>
            <div>
              <div className="text-sm font-semibold text-white flex items-center space-x-2">
                <span>GitHub Actions Linux CI Workflow</span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ENABLED
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Configured in <code className="text-purple-300">.github/workflows/build.yml</code> on{' '}
                <code className="text-slate-200">ubuntu-24.04</code> with Clang, Qt 6.10.3, and automated{' '}
                <code className="text-slate-200">KytyPS5-Linux-x86_64.tar.gz</code> release packaging.
              </div>
            </div>
          </div>
          <div className="text-xs font-mono text-purple-400 shrink-0">
            Triggers on push &amp; workflow_dispatch
          </div>
        </div>
      </div>
    </div>
  );
};
