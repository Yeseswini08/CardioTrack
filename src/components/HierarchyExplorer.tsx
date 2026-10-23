import React, { useState, useMemo } from 'react';
import {
  DocumentNode,
  DocumentTree,
} from '../types/document';
import {
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  Hash,
  Table as TableIcon,
  ListOrdered,
  AlertCircle,
  Copy,
  Check,
  FileText,
  SlidersHorizontal,
  Info,
  Code,
  Tag,
  ExternalLink,
} from 'lucide-react';

interface HierarchyExplorerProps {
  tree: DocumentTree;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onOpenDiffForNode?: (secNum: string) => void;
}

export const HierarchyExplorer: React.FC<HierarchyExplorerProps> = ({
  tree,
  selectedNodeId,
  onSelectNode,
  onOpenDiffForNode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [anomalyOnly, setAnomalyOnly] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [showJsonAst, setShowJsonAst] = useState(false);

  // Filter nodes based on search and filters
  const filteredNodes = useMemo(() => {
    return tree.nodes.filter((node) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = node.title.toLowerCase().includes(q);
        const matchesSec = node.sectionNumber.toLowerCase().includes(q);
        const matchesBody = node.bodyText.toLowerCase().includes(q);
        const matchesLogical = node.logicalNodeId.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSec && !matchesBody && !matchesLogical) {
          return false;
        }
      }

      if (levelFilter !== 'all') {
        const lvl = parseInt(levelFilter, 10);
        if (node.level !== lvl) return false;
      }

      if (anomalyOnly && node.anomalies.length === 0) {
        return false;
      }

      return true;
    });
  }, [tree.nodes, searchQuery, levelFilter, anomalyOnly]);

  const selectedNode = useMemo(() => {
    return tree.nodes.find((n) => n.nodeId === selectedNodeId) || tree.nodes[0];
  }, [tree.nodes, selectedNodeId]);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-140px)]">
      {/* Left Column: Filter & Hierarchical Document Tree */}
      <div className="lg:col-span-5 flex flex-col space-y-4">
        {/* Controls Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Document Nodes ({filteredNodes.length} of {tree.nodes.length})</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Version {tree.versionNumber}.0
            </span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search section number, title, or text..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="flex items-center space-x-1 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Level:</span>
            </div>
            {['all', '0', '1', '2', '3', '4'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevelFilter(lvl)}
                className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                  levelFilter === lvl
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
                }`}
              >
                {lvl === 'all' ? 'All' : lvl === '0' ? 'Root' : `L${lvl}`}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setAnomalyOnly(!anomalyOnly)}
              className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors ml-auto flex items-center space-x-1 ${
                anomalyOnly
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
              }`}
            >
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span>Anomalies Only</span>
            </button>
          </div>
        </div>

        {/* Tree List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex-1 max-h-[720px] overflow-y-auto divide-y divide-slate-800/50">
          {filteredNodes.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No matching nodes found for query "{searchQuery}".
            </div>
          ) : (
            filteredNodes.map((node) => {
              const isSelected = selectedNode?.nodeId === node.nodeId;
              const indentPadding = node.level * 16;

              return (
                <div
                  key={node.nodeId}
                  onClick={() => onSelectNode(node.nodeId)}
                  style={{ paddingLeft: `${Math.max(12, indentPadding)}px` }}
                  className={`pr-3 py-2.5 cursor-pointer text-left transition-all flex items-start space-x-2 border-l-2 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-inner'
                      : 'border-transparent text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="pt-0.5 shrink-0 text-slate-500">
                    {node.level === 0 ? (
                      <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold">
                        R
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1 py-0.5 rounded">
                        L{node.level}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                      {node.sectionNumber && (
                        <span className="font-mono text-xs font-semibold text-cyan-400 shrink-0">
                          {node.sectionNumber}
                        </span>
                      )}
                      <span className="text-xs font-medium truncate text-slate-200">
                        {node.title}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-1">
                      <span>p.{node.pageNumber}</span>
                      <span>&bull;</span>
                      <span className="font-mono">{node.fontInfo.fontSize}pt</span>
                      {node.fontInfo.isBold && <span className="font-semibold text-slate-300">Bold</span>}

                      {node.markdownTable && (
                        <span className="flex items-center text-cyan-400 space-x-0.5 bg-cyan-950/60 px-1 rounded">
                          <TableIcon className="w-2.5 h-2.5" />
                          <span>Table</span>
                        </span>
                      )}

                      {node.listItems && node.listItems.length > 0 && (
                        <span className="flex items-center text-indigo-400 space-x-0.5 bg-indigo-950/60 px-1 rounded">
                          <ListOrdered className="w-2.5 h-2.5" />
                          <span>{node.listItems.length} items</span>
                        </span>
                      )}

                      {node.anomalies.length > 0 && (
                        <span className="flex items-center text-amber-400 space-x-0.5 bg-amber-950/60 px-1 rounded font-medium">
                          <AlertCircle className="w-2.5 h-2.5" />
                          <span>{node.anomalies.length} Flag</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Node Inspector & AST Details */}
      <div className="lg:col-span-7 flex flex-col space-y-4">
        {selectedNode ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
            {/* Header / Identification */}
            <div className="border-b border-slate-800 pb-5">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  {selectedNode.sectionNumber ? (
                    <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-sm font-bold">
                      Section {selectedNode.sectionNumber}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                      Document Root
                    </span>
                  )}
                  <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
                    Level {selectedNode.level} &bull; Page {selectedNode.pageNumber}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowJsonAst(!showJsonAst)}
                    className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>{showJsonAst ? 'View Prose' : 'View AST JSON'}</span>
                  </button>
                </div>
              </div>

              <h1 className="text-xl font-bold text-slate-100 tracking-tight">
                {selectedNode.title}
              </h1>

              {/* Metadata Badges Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Logical Node ID (Disambiguated)
                  </span>
                  <span className="font-mono text-cyan-300 break-all select-all">
                    {selectedNode.logicalNodeId}
                  </span>
                </div>

                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[10px] uppercase font-semibold">
                      SHA-256 Content Hash
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyHash(selectedNode.contentHash)}
                      className="text-slate-400 hover:text-cyan-300 flex items-center space-x-1"
                    >
                      {copiedHash ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span className="text-[10px]">{copiedHash ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <span className="font-mono text-slate-300 text-[11px] truncate block select-all" title={selectedNode.contentHash}>
                    {selectedNode.contentHash}
                  </span>
                </div>
              </div>
            </div>

            {/* Handled Anomalies Callout (if any) */}
            {selectedNode.anomalies.length > 0 && (
              <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-amber-300 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Handled Structural Irregularities ({selectedNode.anomalies.length})</span>
                </div>
                <div className="space-y-1.5 pl-6">
                  {selectedNode.anomalies.map((anom, idx) => (
                    <div key={idx} className="text-xs text-amber-200/90 leading-relaxed font-sans">
                      &bull; {anom}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View AST JSON Mode */}
            {showJsonAst ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Structured AST Node Representation</span>
                  <span className="font-mono text-[11px]">JSON Format</span>
                </div>
                <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto max-h-[460px] leading-relaxed">
                  {JSON.stringify(selectedNode, null, 2)}
                </pre>
              </div>
            ) : (
              <>
                {/* Extracted Specifications Chips */}
                {selectedNode.clinicalSpecs.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <Tag className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Extracted Engineering &amp; Clinical Specifications</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedNode.clinicalSpecs.map((spec, sIdx) => (
                        <div
                          key={sIdx}
                          className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg text-xs flex items-center space-x-2"
                        >
                          <span className="text-slate-400">{spec.parameter}:</span>
                          <span className="font-mono font-bold text-cyan-300">
                            {spec.value} {spec.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cross-References */}
                {selectedNode.referencedSections.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Transitive Section Dependencies</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedNode.referencedSections.map((sec, rIdx) => (
                        <button
                          key={rIdx}
                          type="button"
                          onClick={() => {
                            const target = tree.nodes.find((n) => n.sectionNumber === sec);
                            if (target) onSelectNode(target.nodeId);
                          }}
                          className="text-xs px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 font-mono transition-colors flex items-center space-x-1"
                        >
                          <span>Section {sec}</span>
                          <ChevronRight className="w-3 h-3 text-indigo-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section Body Text */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Extracted Prose &amp; Content
                  </h3>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-line font-sans">
                    {selectedNode.bodyText || (
                      <span className="text-slate-500 italic">No prose body for this node (Header/Root container).</span>
                    )}
                  </div>
                </div>

                {/* Formatted Markdown Table (if present) */}
                {selectedNode.tableData && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <TableIcon className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Extracted Table Data
                      </h3>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                      <table className="min-w-full divide-y divide-slate-800 text-xs">
                        <thead className="bg-slate-900/90 text-slate-300">
                          <tr>
                            {selectedNode.tableData.headers.map((h, i) => (
                              <th
                                key={i}
                                className="px-4 py-2.5 text-left font-semibold tracking-wider text-cyan-300"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-200">
                          {selectedNode.tableData.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-800/40">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="px-4 py-2.5 font-mono">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* List Items (if present) */}
                {selectedNode.listItems && selectedNode.listItems.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <ListOrdered className="w-4 h-4 text-indigo-400" />
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Disambiguated Numbered List Items ({selectedNode.listItems.length})
                      </h3>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
                      {selectedNode.listItems.map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <span className="text-indigo-400 font-bold font-mono">#{idx + 1}</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500">
            Select a document node from the tree on the left to inspect its hierarchical attributes.
          </div>
        )}
      </div>
    </div>
  );
};
