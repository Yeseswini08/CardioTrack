import React from 'react';
import {
  FileText,
  GitBranch,
  ShieldAlert,
  TestTube2,
  Code2,
  Play,
  CheckCircle2,
  AlertTriangle,
  FileCode,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'explorer' | 'diff' | 'generator' | 'pdf' | 'export' | 'tests';
  setActiveTab: (tab: 'explorer' | 'diff' | 'generator' | 'pdf' | 'export' | 'tests') => void;
  selectedVersion: number;
  setSelectedVersion: (v: number) => void;
  contradictionCount: number;
  staleCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedVersion,
  setSelectedVersion,
  contradictionCount,
  staleCount,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Brand */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20 shrink-0">
              <FileText className="w-4 h-4 sm:w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent truncate">
                  CardioTrack CT-200
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/80">
                  IEC 62304 / ISO 13485
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate hidden xs:block">
                Regulatory Traceability &amp; Staleness Engine &bull; Tri9T AI
              </p>
            </div>
          </div>

          {/* Version Switcher */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="flex items-center bg-slate-800/90 p-1 rounded-lg border border-slate-700/80 text-xs">
              <button
                type="button"
                onClick={() => setSelectedVersion(1)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                  selectedVersion === 1
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                v1.0 (28)
              </button>
              <button
                type="button"
                onClick={() => setSelectedVersion(2)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all flex items-center space-x-1 ${
                  selectedVersion === 2
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>v2.0 (29)</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>
            </div>

            {/* Quick Status Pill */}
            {contradictionCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('diff')}
                className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium hover:bg-rose-500/25 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>1 Contradiction</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 border-t border-slate-800/80 py-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium rounded-md transition-colors shrink-0 ${
              activeTab === 'explorer'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700/80 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Document Hierarchy Tree</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('diff')}
            className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium rounded-md transition-colors shrink-0 relative ${
              activeTab === 'diff'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700/80 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>v1 &rarr; v2 Staleness Matrix</span>
            {staleCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                {staleCount} changes
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('generator')}
            className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium rounded-md transition-colors shrink-0 ${
              activeTab === 'generator'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700/80 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <TestTube2 className="w-3.5 h-3.5" />
            <span>IEC 62304 QA Generator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pdf')}
            className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium rounded-md transition-colors shrink-0 ${
              activeTab === 'pdf'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700/80 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Live PDF &amp; Layout Inspection</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tests')}
            className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium rounded-md transition-colors shrink-0 ${
              activeTab === 'tests'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700/80 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Unit Test Runner (11 Passes)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium rounded-md transition-colors shrink-0 ${
              activeTab === 'export'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700/80 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Python Code &amp; Submission Hub</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
