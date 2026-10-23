import React, { useState } from 'react';
import { NodeDiff, RegulatoryContradiction, StalenessStatus } from '../types/document';
import {
  GitCompare,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  ShieldAlert,
  Zap,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';

interface DiffMatrixProps {
  diffs: NodeDiff[];
  contradictions: RegulatoryContradiction[];
  onSelectSection: (secNum: string) => void;
}

export const DiffMatrix: React.FC<DiffMatrixProps> = ({
  diffs,
  contradictions,
  onSelectSection,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [expandedRow, setExpandedRow] = useState<string | null>('2.1.1.1');

  // Counts
  const counts = {
    total: diffs.length,
    fresh: diffs.filter((d) => d.status === 'FRESH').length,
    critical: diffs.filter((d) => d.status === 'CRITICAL_THRESHOLD_CHANGE').length,
    cosmetic: diffs.filter((d) => d.status === 'COSMETIC_WORDING_CHANGE').length,
    transitive: diffs.filter((d) => d.status === 'TRANSITIVE_STALE').length,
    added: diffs.filter((d) => d.status === 'ADDED').length,
    contradiction: contradictions.length,
  };

  const filteredDiffs = diffs.filter((d) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'CHANGED') return d.status !== 'FRESH';
    return d.status === filterStatus;
  });

  const getStatusBadge = (status: StalenessStatus) => {
    switch (status) {
      case 'CRITICAL_THRESHOLD_CHANGE':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center space-x-1 shrink-0">
            <AlertOctagon className="w-3 h-3 text-rose-400" />
            <span>CRITICAL THRESHOLD</span>
          </span>
        );
      case 'TRANSITIVE_STALE':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-1 shrink-0">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>TRANSITIVE STALE</span>
          </span>
        );
      case 'ADDED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1 shrink-0">
            <PlusCircle className="w-3 h-3 text-emerald-400" />
            <span>ADDED IN V2</span>
          </span>
        );
      case 'COSMETIC_WORDING_CHANGE':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center space-x-1 shrink-0">
            <span>COSMETIC WORDING</span>
          </span>
        );
      case 'FRESH':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 flex items-center space-x-1 shrink-0">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>FRESH (IDENTICAL)</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm">
          <span className="text-slate-500 text-[11px] uppercase font-semibold block">Total Nodes</span>
          <span className="text-xl font-bold text-white mt-1 block">{counts.total}</span>
          <span className="text-[10px] text-slate-400">Merged &amp; Normalized</span>
        </div>

        <div className="bg-slate-900 border border-rose-500/30 rounded-xl p-3.5 shadow-sm">
          <span className="text-rose-400 text-[11px] uppercase font-semibold block">Critical Changes</span>
          <span className="text-xl font-bold text-rose-300 mt-1 block">{counts.critical}</span>
          <span className="text-[10px] text-rose-400/80">Thresholds &amp; Timers</span>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-3.5 shadow-sm">
          <span className="text-amber-400 text-[11px] uppercase font-semibold block">Transitive Stale</span>
          <span className="text-xl font-bold text-amber-300 mt-1 block">{counts.transitive}</span>
          <span className="text-[10px] text-amber-400/80">Cross-Ref Dependencies</span>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-3.5 shadow-sm">
          <span className="text-emerald-400 text-[11px] uppercase font-semibold block">New in v2</span>
          <span className="text-xl font-bold text-emerald-300 mt-1 block">{counts.added}</span>
          <span className="text-[10px] text-emerald-400/80">Sec 5.3 Data Export</span>
        </div>

        <div className="bg-slate-900 border border-rose-600/40 rounded-xl p-3.5 shadow-sm bg-gradient-to-br from-rose-950/20 to-slate-900">
          <span className="text-rose-400 text-[11px] uppercase font-semibold block">Contradictions</span>
          <span className="text-xl font-bold text-rose-300 mt-1 block">{counts.contradiction}</span>
          <span className="text-[10px] text-rose-400/80">Sec 4.1 vs 4.2 E3</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm">
          <span className="text-slate-500 text-[11px] uppercase font-semibold block">Unchanged</span>
          <span className="text-xl font-bold text-slate-300 mt-1 block">{counts.fresh}</span>
          <span className="text-[10px] text-slate-400">Exact SHA-256 Match</span>
        </div>
      </div>

      {/* Prominent Automated Regulatory Contradiction Alert Card */}
      {contradictions.length > 0 && (
        <div className="bg-gradient-to-r from-rose-950/50 via-slate-900 to-rose-950/30 border-2 border-rose-500/60 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-400 shrink-0">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white uppercase tracking-wider">
                  Automated Regulatory Contradiction Detected
                </span>
                <span className="text-xs font-mono text-rose-300">
                  IEC 62304 / ISO 13485 Audit Violation
                </span>
              </div>

              <h2 className="text-lg font-bold text-white tracking-tight">
                Section 4.1 (Prose) vs. Section 4.2 E3 (Table) Emergency Deflation Timing Contradiction in v2
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                In <code className="text-rose-300 font-mono">ct200_manual_v2.pdf</code>, the author updated the emergency deflation time in the{' '}
                <strong className="text-white">Section 4.2 Error Codes</strong> table for code <code className="text-cyan-300 font-mono">E3</code> from{' '}
                <span className="line-through text-slate-400">2 seconds</span> to{' '}
                <strong className="text-emerald-400">1.5 seconds</strong>, but <strong className="text-rose-300">failed to update Section 4.1 Overpressure Protection</strong>, which still states{' '}
                <strong className="text-rose-400">"venting the cuff within 2 seconds"</strong>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-rose-500/30 space-y-1">
                  <div className="text-[11px] font-semibold text-rose-400 uppercase">
                    Section 4.1 Specification (Unchanged Prose)
                  </div>
                  <div className="text-xs font-mono text-slate-200">
                    "...trigger emergency deflation valve, halting inflation and{' '}
                    <span className="bg-rose-500/20 text-rose-300 px-1 py-0.5 rounded font-bold underline">
                      venting the cuff within 2 seconds
                    </span>
                    ..."
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-emerald-500/30 space-y-1">
                  <div className="text-[11px] font-semibold text-emerald-400 uppercase">
                    Section 4.2 E3 Table Specification (Updated in v2)
                  </div>
                  <div className="text-xs font-mono text-slate-200">
                    "E3 Overpressure condition:{' '}
                    <span className="bg-emerald-500/20 text-emerald-300 px-1 py-0.5 rounded font-bold underline">
                      Auto-deflates within 1.5 seconds
                    </span>
                    , displays E3"
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-rose-500/20 text-xs">
                <span className="text-rose-200/90 italic">
                  <strong>Regulatory Action Required:</strong> Issue an Engineering Change Order (ECO) to align Section 4.1 with Section 4.2 (1.5 seconds) prior to regulatory submission.
                </span>
                <button
                  type="button"
                  onClick={() => onSelectSection('4.1')}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium transition-colors flex items-center space-x-1"
                >
                  <span>Inspect Section 4.1 in Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transitive Dependency Graph Visualizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Tier 3 Transitive Staleness Resolution Graph
            </h3>
          </div>
          <span className="text-xs text-amber-300 bg-amber-950/50 border border-amber-800/60 px-2.5 py-0.5 rounded-full font-mono">
            Dependency Invalidation Engine
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Standard hash comparison only detects direct byte differences. Our Tier 3 Graph checks cross-reference pointers to ensure downstream sections citing modified requirements are flagged for test re-verification:
        </p>

        {/* Visual Graph Nodes */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Target Modified Node */}
          <div className="bg-slate-900 border border-rose-500/40 rounded-xl p-4 w-full md:w-5/12 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400">Section 4.2</span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                Direct Change
              </span>
            </div>
            <div className="text-sm font-bold text-white">4.2 Error Codes (Table)</div>
            <div className="text-xs text-slate-400 space-y-1">
              <div>&bull; E3 deflation tightened from 2.0s &rarr; 1.5s</div>
              <div>&bull; New diagnostic code E6 (Bluetooth) added</div>
            </div>
          </div>

          {/* Directed Arrow */}
          <div className="flex flex-col items-center space-y-1 text-amber-400 shrink-0">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
              Referenced by
            </span>
            <div className="flex items-center space-x-1">
              <div className="w-8 h-0.5 bg-amber-500/60 hidden md:block"></div>
              <ArrowRight className="w-5 h-5 animate-pulse" />
              <div className="w-8 h-0.5 bg-amber-500/60 hidden md:block"></div>
            </div>
            <span className="text-[10px] font-mono text-amber-300">
              "If a code from Section 4.2 appears..."
            </span>
          </div>

          {/* Transitive Stale Node */}
          <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-4 w-full md:w-5/12 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400">Section 7.1</span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Transitive Stale
              </span>
            </div>
            <div className="text-sm font-bold text-white">7.1 Error Codes (Troubleshooting)</div>
            <div className="text-xs text-slate-400 space-y-1">
              <div>&bull; Section text itself has identical SHA-256 hash!</div>
              <div>&bull; Stale because referenced target (4.2) introduced code E6!</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Detailed Diff Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm space-y-4 p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <GitCompare className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              v1 &rarr; v2 Hierarchical Diff Matrix ({filteredDiffs.length} Entries)
            </h3>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'ALL', label: 'All Nodes' },
              { id: 'CHANGED', label: 'All Changes' },
              { id: 'CRITICAL_THRESHOLD_CHANGE', label: 'Critical Only' },
              { id: 'TRANSITIVE_STALE', label: 'Transitive Only' },
              { id: 'ADDED', label: 'Added (v2)' },
              { id: 'FRESH', label: 'Unchanged' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterStatus(tab.id)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filterStatus === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Diff Entries List */}
        <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-xl overflow-hidden">
          {filteredDiffs.map((diff) => {
            const isExpanded = expandedRow === diff.sectionNumber;

            return (
              <div key={diff.logicalNodeId} className="bg-slate-950/60 hover:bg-slate-800/30 transition-colors">
                <div
                  className="p-4 flex items-center justify-between cursor-pointer flex-wrap gap-3"
                  onClick={() => setExpandedRow(isExpanded ? null : diff.sectionNumber)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-800 px-2 py-0.5 rounded">
                      {diff.sectionNumber || 'Root'}
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-white">{diff.title}</span>
                      <span className="text-xs text-slate-400 block font-mono">
                        {diff.logicalNodeId}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {getStatusBadge(diff.status)}
                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-white"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Pane */}
                {isExpanded && (
                  <div className="p-4 bg-slate-900 border-t border-slate-800/80 space-y-3 text-xs">
                    <div className="text-slate-300">
                      <strong>Audit Explanation:</strong> {diff.reason}
                    </div>

                    {diff.specChanges.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-slate-400 font-semibold uppercase text-[10px]">
                          Specification Parameter Shifts:
                        </div>
                        {diff.specChanges.map((sc, sIdx) => (
                          <div
                            key={sIdx}
                            className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between flex-wrap gap-2"
                          >
                            <span className="font-medium text-slate-300">{sc.parameter}</span>
                            <div className="flex items-center space-x-2 font-mono">
                              <span className="text-rose-400 line-through bg-rose-950/40 px-1.5 py-0.5 rounded">
                                {sc.v1Value}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                              <span className="text-emerald-400 font-bold bg-emerald-950/40 px-1.5 py-0.5 rounded">
                                {sc.v2Value}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {diff.v1Node && diff.v2Node && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                            v1.0 Text (Page {diff.v1Node.pageNumber})
                          </span>
                          <p className="text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                            {diff.v1Node.bodyText}
                          </p>
                        </div>

                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                          <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">
                            v2.0 Text (Page {diff.v2Node.pageNumber})
                          </span>
                          <p className="text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                            {diff.v2Node.bodyText}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
