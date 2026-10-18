import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Download, Search, Play, Pause, Trash2 } from 'lucide-react';
import { LogLine } from '../types';

export const LogViewer: React.FC = () => {
  const [filterTag, setFilterTag] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const logContainerRef = useRef<HTMLDivElement | null>(null);

  const initialLogs: LogLine[] = [
    { id: '1', timestamp: '16:45:01.012', level: 'INFO', tag: 'BOOT', message: 'KytyPS5 Emulator starting (Linux x86_64, host: Linux 6.8.0, build: db7745ef)' },
    { id: '2', timestamp: '16:45:01.034', level: 'VULKAN', tag: 'VULKAN', message: 'Vulkan instance initialized with validation layers disabled. Device: NVIDIA GeForce RTX 3060 Laptop (Vulkan 1.3.280)' },
    { id: '3', timestamp: '16:45:01.048', level: 'VULKAN', tag: 'VULKAN', message: 'Vulkan bindless images: enabled (descriptorBindingPartiallyBound=1, runtimeDescriptorArray=1)' },
    { id: '4', timestamp: '16:45:01.082', level: 'INFO', tag: 'LOADER', message: 'Loading ELF eboot.bin for PPSA03671 (Marvel\'s Wolverine)...' },
    { id: '5', timestamp: '16:45:01.120', level: 'INFO', tag: 'REDZONE', message: 'Windows/Linux SysV red zone protection activated (128 bytes guard).' },
    { id: '6', timestamp: '16:45:01.240', level: 'BINDLESS', tag: 'BINDLESS', message: 'BindlessTable: allocated translation buffer 1048576 entries, feedback buffer in host-visible device memory.' },
    { id: '7', timestamp: '16:45:01.350', level: 'AMPR', tag: 'AMPRTRACE', message: 'AMM unit initialized: wait-free batch execution on idle ring active.' },
    { id: '8', timestamp: '16:45:01.420', level: 'AMPR', tag: 'AMPRTRACE', message: 'APR file read submitted: streaming/textures/desert_canyon_01.dat (42.8 MB)' },
    { id: '9', timestamp: '16:45:02.100', level: 'SHADER', tag: 'RECOMPILER', message: 'Shader 0x01ba288cccc11730: detected indirect image V# heap (14,528 entries). Materializing as bindless image.' },
    { id: '10', timestamp: '16:45:02.180', level: 'BINDLESS', tag: 'BINDLESS', message: 'ResolveBindlessRequests: resolved 128 keys in presented frame 1. Allocated slots in descriptor set 1, binding 0.' },
    { id: '11', timestamp: '16:45:02.320', level: 'SHADER', tag: 'RECOMPILER', message: 'Shader 0x09161b28ae4039bb (blur pixel shader): applied CFG dispatcher safety cap (4096 transitions).' },
    { id: '12', timestamp: '16:45:02.410', level: 'INFO', tag: 'AJM/ATRAC9', message: 'ATRAC9 config validated: header 0xFE verified, channel config 2 (< 6). Audio stream active.' },
    { id: '13', timestamp: '16:45:02.500', level: 'INFO', tag: 'SAVEDATA', message: 'SaveDataGetEventResult: polled empty results (logging throttled to prevent file flood).' },
    { id: '14', timestamp: '16:45:03.010', level: 'INFO', tag: 'PRESENT', message: 'Screen-reader prompt frame presented at 50 FPS. EndOfPipe count: 240.' },
  ];

  const [logs, setLogs] = useState<LogLine[]>(initialLogs);

  // Periodic simulated live log streaming
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(Math.random() * 900) + 100)}`;

      const liveMessages: Array<{ level: LogLine['level']; tag: string; message: string }> = [
        { level: 'BINDLESS', tag: 'BINDLESS', message: `Bindless patch: frame drawn with ${14500 + Math.floor(Math.random() * 30)} textures mapped.` },
        { level: 'AMPR', tag: 'AMPRTRACE', message: `APR streaming chunk read: ${+(Math.random() * 8 + 2).toFixed(1)} MB completed in 3.4ms.` },
        { level: 'INFO', tag: 'PRESENT', message: `EndOfPipe count: ${4800 + Math.floor(Math.random() * 200)} • Vulkan swapchain present OK (16.6ms)` },
      ];

      const chosen = liveMessages[Math.floor(Math.random() * liveMessages.length)];
      setLogs((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          timestamp: timeStr,
          level: chosen.level,
          tag: chosen.tag,
          message: chosen.message,
        },
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAutoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, isAutoScroll]);

  const filteredLogs = logs.filter((log) => {
    const matchesTag = filterTag === 'ALL' || log.level === filterTag || log.tag === filterTag;
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const exportLogFile = () => {
    const content = logs.map((l) => `[${l.timestamp}] [${l.level}] [${l.tag}] ${l.message}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '_kyty.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white font-display">
            KytyPS5 Emulator Console Log Output (_kyty.txt)
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          {/* Tag Filter */}
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono"
          >
            <option value="ALL">All Categories</option>
            <option value="BINDLESS">BINDLESS</option>
            <option value="AMPR">AMPR / Streaming</option>
            <option value="SHADER">SHADER / Recompiler</option>
            <option value="VULKAN">VULKAN</option>
            <option value="INFO">INFO / System</option>
          </select>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 w-36 sm:w-48"
            />
          </div>

          <button
            onClick={() => setIsAutoScroll(!isAutoScroll)}
            className={`p-2 rounded-lg border text-xs font-mono transition ${
              isAutoScroll
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle Auto-Scroll"
          >
            {isAutoScroll ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={exportLogFile}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export _kyty.txt</span>
          </button>
        </div>
      </div>

      {/* Log Terminal Window */}
      <div
        ref={logContainerRef}
        className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs overflow-y-auto max-h-[560px] space-y-1 shadow-2xl"
      >
        {filteredLogs.map((log) => {
          let levelColor = 'text-slate-400';
          if (log.level === 'BINDLESS') levelColor = 'text-emerald-400 font-semibold';
          if (log.level === 'AMPR') levelColor = 'text-sky-400';
          if (log.level === 'VULKAN') levelColor = 'text-purple-400';
          if (log.level === 'SHADER') levelColor = 'text-amber-400';
          if (log.level === 'ERROR') levelColor = 'text-red-400 font-bold';

          return (
            <div key={log.id} className="flex items-start space-x-2 hover:bg-slate-900/60 px-1 py-0.5 rounded leading-relaxed">
              <span className="text-slate-600 select-none text-[11px]">{log.timestamp}</span>
              <span className={`text-[11px] px-1.5 rounded bg-slate-900 border border-slate-800/80 font-bold ${levelColor}`}>
                {log.tag}
              </span>
              <span className="text-slate-200 flex-1 break-all">{log.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
