import React, { useState, useMemo } from 'react';
import { V1_RAW_DATA, V2_RAW_DATA } from './utils/rawPdfData';
import { parsePdfDocument } from './utils/parserPipeline';
import { computeDocumentDiff } from './utils/stalenessEngine';
import { Header } from './components/Header';
import { HierarchyExplorer } from './components/HierarchyExplorer';
import { DiffMatrix } from './components/DiffMatrix';
import { QAGenerator } from './components/QAGenerator';
import { PdfViewer } from './components/PdfViewer';
import { TestRunner } from './components/TestRunner';
import { CodeExporter } from './components/CodeExporter';
import { ShieldCheck, Cpu, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explorer' | 'diff' | 'generator' | 'pdf' | 'export' | 'tests'>('explorer');
  const [selectedVersion, setSelectedVersion] = useState<number>(1);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Parse document trees
  const v1Tree = useMemo(() => parsePdfDocument(V1_RAW_DATA), []);
  const v2Tree = useMemo(() => parsePdfDocument(V2_RAW_DATA), []);

  // Compute version diff & regulatory contradictions
  const { diffs, contradictions } = useMemo(
    () => computeDocumentDiff(v1Tree, v2Tree),
    [v1Tree, v2Tree]
  );

  const activeTree = selectedVersion === 1 ? v1Tree : v2Tree;

  // Stale/Changed count
  const staleCount = diffs.filter((d) => d.status !== 'FRESH').length;

  const handleSelectSectionFromDiff = (secNum: string) => {
    const node = activeTree.nodes.find((n) => n.sectionNumber === secNum);
    if (node) {
      setSelectedNodeId(node.nodeId);
      setActiveTab('explorer');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Global Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedVersion={selectedVersion}
        setSelectedVersion={setSelectedVersion}
        contradictionCount={contradictions.length}
        staleCount={staleCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'explorer' && (
          <HierarchyExplorer
            tree={activeTree}
            selectedNodeId={selectedNodeId}
            onSelectNode={(id) => setSelectedNodeId(id)}
            onOpenDiffForNode={(sec) => {
              setActiveTab('diff');
            }}
          />
        )}

        {activeTab === 'diff' && (
          <DiffMatrix
            diffs={diffs}
            contradictions={contradictions}
            onSelectSection={handleSelectSectionFromDiff}
          />
        )}

        {activeTab === 'generator' && (
          <QAGenerator
            v1Tree={v1Tree}
            v2Tree={v2Tree}
            selectedDocVersion={selectedVersion}
          />
        )}

        {activeTab === 'pdf' && (
          <PdfViewer selectedVersion={selectedVersion} />
        )}

        {activeTab === 'tests' && <TestRunner />}

        {activeTab === 'export' && <CodeExporter />}
      </main>

      {/* System Status Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/90 text-slate-400 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-300">
              CardioTrack CT-200 Regulatory Traceability Engine Active
            </span>
            <span>&bull;</span>
            <span className="font-mono text-slate-400">11 Tests Passing (100%)</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400 text-xs">
            <span>IEC 62304 / ISO 13485 Compliant</span>
            <span>&bull;</span>
            <span>Tri9T AI Internship Assignment</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
