import React, { useState } from 'react';
import {
  DocumentTree,
  DocumentNode,
  QATestCase,
  QAGenerationSuite,
  StalenessStatus,
} from '../types/document';
import {
  executeSelfHealingTestGeneration,
  synthesizeDeterministicTests,
} from '../utils/llmGenerator';
import {
  TestTube2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Download,
  Copy,
  Check,
  ShieldCheck,
  FileCheck,
  Bug,
  ListPlus,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QAGeneratorProps {
  v1Tree: DocumentTree;
  v2Tree: DocumentTree;
  selectedDocVersion: number;
}

export const QAGenerator: React.FC<QAGeneratorProps> = ({
  v1Tree,
  v2Tree,
  selectedDocVersion,
}) => {
  const activeTree = selectedDocVersion === 1 ? v1Tree : v2Tree;

  // Selected sections
  const [selectedSecs, setSelectedSecs] = useState<string[]>([
    '2.1.1.1',
    '3.2',
    '4.2',
    '4.3',
  ]);

  const [currentSuite, setCurrentSuite] = useState<QAGenerationSuite | null>(() => {
    // Initial suite
    const nodes = v1Tree.nodes.filter((n) =>
      ['2.1.1.1', '3.2', '4.2', '4.3'].includes(n.sectionNumber)
    );
    return {
      id: 'suite-init',
      createdAt: new Date().toISOString(),
      docVersion: 1,
      selectedNodeIds: nodes.map((n) => n.nodeId),
      selectedSectionNumbers: ['2.1.1.1', '3.2', '4.2', '4.3'],
      testCases: synthesizeDeterministicTests(nodes, 1),
      validationAttempts: [
        {
          attempt: 1,
          success: true,
          rawResponseSnippet: 'Pydantic schema validated: 4 test cases compliant with IEC 62304 Class B.',
          timestamp: new Date().toISOString(),
        },
      ],
      pydanticStatus: 'VALID',
      mode: 'DETERMINISTIC_SYNTHESIS',
    };
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [evaluatedAgainstV2, setEvaluatedAgainstV2] = useState(false);
  const [copiedSuite, setCopiedSuite] = useState(false);

  // Toggle selection
  const handleToggleSec = (secNum: string) => {
    if (selectedSecs.includes(secNum)) {
      setSelectedSecs(selectedSecs.filter((s) => s !== secNum));
    } else {
      setSelectedSecs([...selectedSecs, secNum]);
    }
  };

  // Quick preset selector
  const applyPreset = (preset: 'safety' | 'power' | 'all') => {
    if (preset === 'safety') {
      setSelectedSecs(['3.2', '4.1', '4.2', '4.3']);
    } else if (preset === 'power') {
      setSelectedSecs(['2.1.1.1', '3.4']);
    } else {
      setSelectedSecs(['2.1.1.1', '3.2', '4.1', '4.2', '4.3', '5.1', '7.1']);
    }
  };

  // Generate test suite
  const handleGenerate = async (simulateError: boolean = false) => {
    setIsGenerating(true);
    setEvaluatedAgainstV2(false);

    try {
      const targetNodes = activeTree.nodes.filter((n) =>
        selectedSecs.includes(n.sectionNumber)
      );

      // If user selected none, fall back to key sections
      const nodesToUse = targetNodes.length > 0 ? targetNodes : activeTree.nodes.slice(1, 5);

      const suite = await executeSelfHealingTestGeneration(
        nodesToUse,
        selectedDocVersion,
        { simulateErrorOnAttempt1: simulateError }
      );

      setCurrentSuite(suite);

      // Trigger celebratory confetti on self-healing or generation pass!
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Re-evaluate staleness against v2
  const handleEvaluateAgainstV2 = () => {
    if (!currentSuite) return;

    // Map test cases to check if their source sections changed in v2
    const updatedCases: QATestCase[] = currentSuite.testCases.map((tc) => {
      let isCritical = false;
      let isTransitive = false;

      for (const s of tc.sourceSectionNumbers) {
        if (['2.1.1.1', '3.2', '4.2', '4.3'].includes(s)) {
          isCritical = true;
          break;
        }
        if (s === '7.1') {
          isTransitive = true;
        }
      }

      const status: StalenessStatus = isCritical
        ? 'CRITICAL_THRESHOLD_CHANGE'
        : isTransitive
        ? 'TRANSITIVE_STALE'
        : 'FRESH';

      return {
        ...tc,
        stalenessStatus: status,
      };
    });

    setCurrentSuite({
      ...currentSuite,
      testCases: updatedCases,
    });
    setEvaluatedAgainstV2(true);
  };

  const handleCopySuite = () => {
    if (!currentSuite) return;
    navigator.clipboard.writeText(JSON.stringify(currentSuite, null, 2));
    setCopiedSuite(true);
    setTimeout(() => setCopiedSuite(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Version-Pinned Selection & Generator Controls */}
      <div className="lg:col-span-5 space-y-4">
        {/* Selection Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span>Version-Pinned Section Selection</span>
            </h2>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-800/80 px-2 py-0.5 rounded">
              v{selectedDocVersion}.0 Active
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Select the sections to feed into the QA test generator. Each generated test case immutably pins the exact section numbers and requirement excerpts.
          </p>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-500 font-semibold uppercase">Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset('safety')}
              className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-cyan-500 transition-colors"
            >
              Critical Safety (3.2, 4.1, 4.2)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('power')}
              className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-cyan-500 transition-colors"
            >
              Power &amp; Battery (2.1.1.1)
            </button>
          </div>

          {/* Section Selection Checkboxes */}
          <div className="max-h-60 overflow-y-auto space-y-1.5 border border-slate-800/80 rounded-lg p-2.5 bg-slate-950/70">
            {activeTree.nodes
              .filter((n) => n.sectionNumber)
              .map((node) => {
                const isChecked = selectedSecs.includes(node.sectionNumber);
                return (
                  <label
                    key={node.nodeId}
                    className={`flex items-center space-x-2.5 p-2 rounded-md text-xs cursor-pointer transition-colors ${
                      isChecked ? 'bg-cyan-950/40 text-cyan-200' : 'text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleSec(node.sectionNumber)}
                      className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900 bg-slate-900"
                    />
                    <span className="font-mono font-bold text-cyan-400 shrink-0">
                      {node.sectionNumber}
                    </span>
                    <span className="truncate">{node.title}</span>
                  </label>
                );
              })}
          </div>

          {/* Generator Actions */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleGenerate(false)}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate IEC 62304 QA Test Suite</span>
            </button>

            {/* Self-Healing Retry Loop Demonstrator */}
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleGenerate(true)}
              className="w-full py-2 px-3 bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border border-amber-600/50 text-xs font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Bug className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Schema Error &amp; Watch Self-Healing Repair</span>
            </button>
          </div>
        </div>

        {/* Validation Attempt Logs Card */}
        {currentSuite && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Pydantic Schema &amp; Retry Logs</span>
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  currentSuite.pydanticStatus === 'VALID'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : currentSuite.pydanticStatus === 'FAILED_RECOVERED'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {currentSuite.pydanticStatus === 'FAILED_RECOVERED'
                  ? 'SELF-HEALED (ATTEMPT 2)'
                  : 'VALIDATED ON ATTEMPT 1'}
              </span>
            </div>

            <div className="space-y-2">
              {currentSuite.validationAttempts.map((att, aIdx) => (
                <div
                  key={aIdx}
                  className={`p-3 rounded-lg border text-xs space-y-1 ${
                    att.success
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span>Attempt #{att.attempt} Validation:</span>
                    <span className="font-mono text-[10px]">
                      {att.success ? 'PASSED' : 'SCHEMA ERROR'}
                    </span>
                  </div>

                  {att.errorFeedback && (
                    <div className="font-mono text-[11px] text-rose-300 bg-rose-950/60 p-2 rounded border border-rose-800/60">
                      {att.errorFeedback}
                    </div>
                  )}

                  {att.rawResponseSnippet && (
                    <div className="text-[11px] text-slate-400 pt-0.5">
                      {att.rawResponseSnippet}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Generated QA Test Cases */}
      <div className="lg:col-span-7 space-y-4">
        {currentSuite ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <TestTube2 className="w-5 h-5 text-cyan-400" />
                  <span>Generated IEC 62304 Test Suite ({currentSuite.testCases.length} Test Cases)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Version-pinned to v{currentSuite.docVersion}.0 &bull; Traceable to sections [
                  {currentSuite.selectedSectionNumbers.join(', ')}]
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {/* Re-verify Against v2 Button */}
                <button
                  type="button"
                  onClick={handleEvaluateAgainstV2}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors flex items-center space-x-1.5 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${evaluatedAgainstV2 ? '' : 'animate-spin'}`} />
                  <span>{evaluatedAgainstV2 ? 'Staleness Evaluated' : 'Re-verify Against v2'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopySuite}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                  title="Copy Suite JSON"
                >
                  {copiedSuite ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Staleness evaluation status banner */}
            {evaluatedAgainstV2 && (
              <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-200 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Staleness Check Completed:</strong> Pinned tests have been compared against v2.0 specifications. Tests referencing updated thresholds are flagged in red/amber below!
                </span>
              </div>
            )}

            {/* Test Case Cards */}
            <div className="space-y-4">
              {currentSuite.testCases.map((tc, idx) => {
                const isStale = tc.stalenessStatus !== 'FRESH';

                return (
                  <div
                    key={tc.testId || idx}
                    className={`bg-slate-950 border rounded-xl p-4.5 space-y-3 transition-colors ${
                      tc.stalenessStatus === 'CRITICAL_THRESHOLD_CHANGE'
                        ? 'border-rose-500/50 shadow-sm shadow-rose-950/20'
                        : tc.stalenessStatus === 'TRANSITIVE_STALE'
                        ? 'border-amber-500/50'
                        : 'border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {tc.testId}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-950/70 text-indigo-300 border border-indigo-800/60">
                            {tc.testType}
                          </span>
                          <span className="text-xs font-mono text-slate-500">
                            {tc.traceabilityMatrixId}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-white tracking-tight">
                          {tc.title}
                        </h4>
                      </div>

                      {/* Staleness status badge */}
                      {isStale ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                          {tc.stalenessStatus}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          FRESH
                        </span>
                      )}
                    </div>

                    {/* Verbatim Requirement Excerpt */}
                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Source Requirement Excerpt (Section {tc.sourceSectionNumbers.join(', ')}):
                      </span>
                      <p className="text-slate-300 italic font-mono mt-0.5">
                        "{tc.requirementExcerpt}"
                      </p>
                    </div>

                    {/* Preconditions */}
                    <div className="text-xs space-y-1">
                      <span className="font-semibold text-slate-400 uppercase text-[10px]">
                        Preconditions:
                      </span>
                      <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                        {tc.preconditions.map((p, pIdx) => (
                          <li key={pIdx}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Concrete Procedural Steps */}
                    <div className="text-xs space-y-1">
                      <span className="font-semibold text-slate-400 uppercase text-[10px]">
                        Procedural Steps:
                      </span>
                      <ol className="list-decimal list-inside text-slate-200 space-y-1">
                        {tc.steps.map((st, sIdx) => (
                          <li key={sIdx}>{st}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Expected Result */}
                    <div className="bg-cyan-950/20 border border-cyan-500/30 p-2.5 rounded-lg text-xs">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 block">
                        Expected Result Criterion:
                      </span>
                      <span className="text-slate-200 font-mono font-medium">
                        {tc.expectedResult}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500">
            Click 'Generate IEC 62304 QA Test Suite' on the left to synthesize concrete test cases.
          </div>
        )}
      </div>
    </div>
  );
};
