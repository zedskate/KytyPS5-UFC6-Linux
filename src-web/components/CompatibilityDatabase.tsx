import React, { useState } from 'react';
import { Database, Search, Filter, Download, ExternalLink, Cpu, CheckCircle } from 'lucide-react';
import { COMPATIBILITY_DATABASE } from '../data/compatibilityData';
import { CompatibilityEntry, GameStatus } from '../types';

export const CompatibilityDatabase: React.FC = () => {
  const [entries, setEntries] = useState<CompatibilityEntry[]>(COMPATIBILITY_DATABASE);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.titleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.hardware.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || entry.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const exportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'compatibility_db.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getStatusBadge = (status: GameStatus) => {
    switch (status) {
      case 'Playable':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Playable</span>;
      case 'InGame':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30">In Game</span>;
      case 'MainMenu':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">Main Menu</span>;
      case 'Logo':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">Boots Logo</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400">Unknown</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white font-display">
              KytyPS5 Compatibility Database
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Community and maintainer compatibility test reports for PlayStation 5 titles running on Linux &amp; Windows.
            Synchronized with <code className="text-blue-300">https://kytyps5.github.io/</code>.
          </p>
        </div>

        <button
          onClick={exportJson}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <Download className="w-4 h-4" />
          <span>Export compatibility_db.json</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search game, title ID, or hardware..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['All', 'Playable', 'InGame', 'MainMenu', 'Logo'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                statusFilter === st
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Entries Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Title &amp; ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Tested Build</th>
                <th className="py-3 px-4">Hardware Testbench</th>
                <th className="py-3 px-4">Recommended CLI Flags</th>
                <th className="py-3 px-4">Test Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredEntries.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-bold text-white text-sm">{item.title}</div>
                    <div className="font-mono text-[11px] text-blue-400 font-semibold">{item.titleId}</div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                  <td className="py-4 px-4 font-mono text-slate-300">
                    <div>{item.testedVersion}</div>
                    <div className="text-[10px] text-slate-500">{item.testedDate} by {item.tester}</div>
                  </td>
                  <td className="py-4 px-4 text-slate-300 font-mono text-[11px] max-w-[200px]">
                    {item.hardware}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[240px]">
                      {item.recommendedFlags.length > 0 ? (
                        item.recommendedFlags.map((flag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 font-mono text-[10px]"
                          >
                            {flag}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 font-mono">None</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-300 leading-relaxed max-w-xs">
                    {item.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
