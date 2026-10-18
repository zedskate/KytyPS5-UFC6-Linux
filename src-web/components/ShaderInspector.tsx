import React, { useState } from 'react';
import { Layers, Cpu, CheckCircle2, AlertOctagon, HelpCircle, Code2, Hash } from 'lucide-react';
import { SAMPLE_SHADERS } from '../data/shaderData';
import { ShaderEntry } from '../types';

export const ShaderInspector: React.FC = () => {
  const [selectedShader, setSelectedShader] = useState<ShaderEntry>(SAMPLE_SHADERS[0]);
  const [searchHash, setSearchHash] = useState('');

  const filteredShaders = SAMPLE_SHADERS.filter((s) =>
    s.hash.toLowerCase().includes(searchHash.toLowerCase()) ||
    s.stage.toLowerCase().includes(searchHash.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white font-display">
            SPIR-V & Bindless Texture Recompiler Inspector
          </h2>
        </div>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          Inspects guest GCN/RDNA2 shader bytecode translation to host Vulkan SPIR-V. Shows
          the <strong>Descriptor Set 1</strong> runtime arrays used by KytyPS5 for bindless texture heap
          streaming (14,500+ candidates in titles like Marvel&apos;s Wolverine).
        </p>
      </div>

      {/* Bindless Descriptor Set 1 Architecture Diagram */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white font-display flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Descriptor Set 1 Layout (UPDATE_AFTER_BIND | PARTIALLY_BOUND)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { binding: 'Binding 0', name: '2D Sampled Images', type: 'runtime array', color: 'emerald' },
            { binding: 'Binding 1', name: '2D-Array Images', type: 'runtime array', color: 'emerald' },
            { binding: 'Binding 2', name: 'Cube Sampled Images', type: 'runtime array', color: 'emerald' },
            { binding: 'Binding 3', name: '3D Sampled Images', type: 'runtime array', color: 'emerald' },
            { binding: 'Binding 4', name: 'Translation Buffer', type: '1M entries (SSBO)', color: 'blue' },
            { binding: 'Binding 5', name: 'Feedback Buffer', type: 'Host-visible (SSBO)', color: 'purple' },
          ].map((item) => (
            <div
              key={item.binding}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1"
            >
              <div className="text-[11px] font-mono font-bold text-blue-400">{item.binding}</div>
              <div className="text-xs font-semibold text-slate-200">{item.name}</div>
              <div className="text-[10px] text-slate-500 font-mono">{item.type}</div>
            </div>
          ))}
        </div>

        {/* Slot Color Legend */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400 font-mono">Slot Resolution States:</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
            <span className="text-slate-300">Slot 0: Grey (Dropped/Unregistered)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="text-slate-300">Slot 1: Red (Out-of-range key)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="text-slate-300">Slot 2: Blue (Requested/Pending)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300">Slot 3+: Green (Resolved Texture)</span>
          </div>
        </div>
      </div>

      {/* Main Shader Browser & Disassembly View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shader List Selection */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search shader hash..."
              value={searchHash}
              onChange={(e) => setSearchHash(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            {filteredShaders.map((shader) => {
              const active = selectedShader.hash === shader.hash;
              return (
                <button
                  key={shader.hash}
                  onClick={() => setSelectedShader(shader)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    active
                      ? 'bg-blue-600/10 border-blue-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-400">{shader.hash}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                        shader.status === 'BindlessResolved'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : shader.status === 'Dispatched'
                          ? 'bg-sky-500/20 text-sky-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {shader.status}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-200 mt-1">{shader.stage}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {shader.type} Stage • {shader.descriptorsUsed} descriptors
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Shader Inspection Panels */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header Info */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-white font-mono">{selectedShader.hash}</span>
                <span className="text-xs text-slate-400">({selectedShader.stage})</span>
              </div>
              {selectedShader.reason && (
                <div className="text-xs text-amber-400 mt-1 font-mono">
                  Note: {selectedShader.reason}
                </div>
              )}
            </div>

            <div className="text-xs font-mono text-slate-400">
              Heap Base: <span className="text-slate-200">{selectedShader.heapBase || 'Inline SRT'}</span>
            </div>
          </div>

          {/* GCN vs SPIR-V side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* GCN / RDNA2 Guest Assembly */}
            <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300">Guest GCN Assembly</span>
                <span className="text-[10px] font-mono text-slate-500">AMD RDNA 2</span>
              </div>
              <pre className="p-4 font-mono text-xs text-slate-300 overflow-x-auto space-y-1 max-h-96">
                <code>
                  {selectedShader.gcnAsm.map((line, idx) => (
                    <div key={idx} className="hover:bg-slate-900/50 px-1 rounded">
                      <span className="text-slate-600 select-none mr-3">{idx + 1}</span>
                      <span className={line.includes('bindless') ? 'text-emerald-400 font-bold' : ''}>
                        {line}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>

            {/* Host SPIR-V Output */}
            <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300">Host SPIR-V 1.6</span>
                <span className="text-[10px] font-mono text-blue-400">Vulkan Pipeline</span>
              </div>
              <pre className="p-4 font-mono text-xs text-slate-300 overflow-x-auto space-y-1 max-h-96">
                <code>
                  {selectedShader.spirvCode.map((line, idx) => (
                    <div key={idx} className="hover:bg-slate-900/50 px-1 rounded">
                      <span className="text-slate-600 select-none mr-3">{idx + 1}</span>
                      <span
                        className={
                          line.includes('OpDecorate')
                            ? 'text-sky-400'
                            : line.includes('NonUniform')
                            ? 'text-emerald-400'
                            : line.includes('gives up')
                            ? 'text-amber-400'
                            : ''
                        }
                      >
                        {line}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
