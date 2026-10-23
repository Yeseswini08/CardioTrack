import React, { useState } from 'react';
import { FileText, Eye, AlertCircle, Layers, CheckCircle2, Table as TableIcon, ExternalLink } from 'lucide-react';
import { V1_RAW_DATA, V2_RAW_DATA } from '../utils/rawPdfData';

interface PdfViewerProps {
  selectedVersion: number;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ selectedVersion }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rawData = selectedVersion === 1 ? V1_RAW_DATA : V2_RAW_DATA;
  const maxPages = rawData.totalPages;

  // The actual PDF asset URLs served from public folder
  const pdfUrl =
    selectedVersion === 1
      ? '/assets/aistudio/ct200_manual_0504d713.pdf'
      : '/assets/aistudio/ct200_manual_v2_b0c7aa72.pdf';

  // Get spans on this page
  const pageSpans = rawData.spans.filter((s) => s.pageNumber === currentPage);
  const pageTables = rawData.tables.filter((t) => t.pageNumber === currentPage);

  // Irregularities on this page
  const pageAnomalies: string[] = [];
  if (currentPage === 1) {
    pageAnomalies.push('Multi-line Title on Page 1: Merged 3 spans in NimbusSans-Bold 22.0pt into root node (level=0).');
  }
  if (currentPage === 2) {
    pageAnomalies.push('Skipped Level on Page 2: Section 2.1.1.1 directly follows 2.1, skipping 2.1.1. Prefix climbing attached it to 2.1.');
    pageAnomalies.push('Table Extraction: General Specifications table bounded and extracted into markdown format.');
  }
  if (currentPage === 3) {
    pageAnomalies.push('Font Size Anomaly: Section 3.2 rendered in 11.0pt Bold instead of 12.9pt Bold. Heading detector identified it via regex + bold weight.');
    pageAnomalies.push('Out-of-Order Section Numbering: Section 3.4 appears physically before Section 3.3.');
    pageAnomalies.push('Numbered List False Positive Trap: Section 3.3 items 1..5 match regex ^\\d+\\.\\s+ but are 11.0pt Regular. Correctly parsed as list_items, NOT headings.');
  }
  if (currentPage === 4) {
    pageAnomalies.push('Duplicate Heading: Section 4.2 Error Codes disambiguated with logical ID "4.2::error-codes".');
    pageAnomalies.push('Table Extraction: Error Codes table (E1-E5 in v1, E1-E6 in v2) parsed into structured dataset.');
    if (selectedVersion === 2) {
      pageAnomalies.push('Regulatory Contradiction: Section 4.1 still specifies 2s deflation while 4.2 E3 table specifies 1.5s deflation!');
    }
  }
  if (currentPage === 5) {
    if (selectedVersion === 2) {
      pageAnomalies.push('Newly Added Section 5.3 Data Export: Firmware 1.4 CSV export specification added.');
    }
    pageAnomalies.push('Cross-Page Split: Section 6.1 paragraph splits across page 5 and 6; stitched seamlessly.');
  }
  if (currentPage === 6) {
    pageAnomalies.push('Duplicate Heading: Section 7.1 Error Codes disambiguated with logical ID "7.1::error-codes".');
    pageAnomalies.push('Transitive Staleness: Section 7.1 references Section 4.2 ("If a code from Section 4.2 appears...").');
  }

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              Ground-Truth PDF &amp; Layout Span Visualizer
            </h2>
            <p className="text-xs text-slate-400">
              Comparing raw source PDF rendering with extracted typography spans and bounding boxes
            </p>
          </div>
        </div>

        {/* Page Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Page:</span>
          <div className="flex items-center space-x-1">
            {Array.from({ length: maxPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                type="button"
                onClick={() => setCurrentPage(pg)}
                className={`w-7 h-7 rounded-md text-xs font-mono font-medium transition-colors ${
                  currentPage === pg
                    ? 'bg-cyan-500 text-white font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {pg}
              </button>
            ))}
          </div>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors border border-slate-700 flex items-center space-x-1"
          >
            <span>Open Raw PDF</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Grid: PDF Embed / Preview + Layout Span Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Embedded PDF Viewer */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-[740px]">
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono">
              Source PDF: {pdfUrl.split('/').pop()} (Page {currentPage} of {maxPages})
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[11px]">
              v{selectedVersion}.0 Native Embed
            </span>
          </div>

          <div className="flex-1 bg-slate-950 p-2 overflow-hidden relative">
            <iframe
              src={`${pdfUrl}#page=${currentPage}&toolbar=0&navpanes=0`}
              title={`CardioTrack CT-200 v${selectedVersion} Page ${currentPage}`}
              className="w-full h-full rounded border border-slate-800 bg-white"
            />
          </div>
        </div>

        {/* Right: Extracted OCR Spans & Bounding Boxes */}
        <div className="lg:col-span-6 space-y-4">
          {/* Anomalies On This Page Card */}
          {pageAnomalies.length > 0 && (
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center space-x-2 text-amber-300 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Page {currentPage} Layout &amp; Typographical Anomalies</span>
              </div>
              <ul className="space-y-1.5 pl-6 text-xs text-amber-200/90 font-sans">
                {pageAnomalies.map((anom, idx) => (
                  <li key={idx} className="list-disc">
                    {anom}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Extracted Typography Spans */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Page {currentPage} Typography Spans ({pageSpans.length} Text Blocks)</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">pdfplumber Span Stream</span>
            </div>

            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {pageSpans.map((span, sIdx) => {
                const isHeading = span.isBold && /^\d+/.test(span.text);

                return (
                  <div
                    key={sIdx}
                    className={`p-3 rounded-lg border text-xs transition-colors ${
                      isHeading
                        ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-100'
                        : span.fontSize === 22.0
                        ? 'bg-blue-950/40 border-blue-500/40 text-blue-100 font-bold'
                        : 'bg-slate-950 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-cyan-400">{span.fontName}</span>
                        <span>&bull;</span>
                        <span className="font-mono font-bold text-white">{span.fontSize}pt</span>
                        {span.isBold && (
                          <span className="px-1 rounded bg-slate-800 text-slate-300 font-semibold">
                            Bold
                          </span>
                        )}
                      </div>

                      {isHeading && (
                        <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[9px]">
                          HEADING
                        </span>
                      )}
                    </div>

                    <div className="text-slate-200 font-sans leading-relaxed">
                      {span.text}
                    </div>
                  </div>
                );
              })}

              {/* Table Data on Page */}
              {pageTables.map((tbl, tIdx) => (
                <div
                  key={tIdx}
                  className="bg-slate-950 border border-cyan-500/30 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center space-x-1.5 text-xs text-cyan-400 font-semibold">
                    <TableIcon className="w-3.5 h-3.5" />
                    <span>Table Bounding Box: {JSON.stringify(tbl.bbox)}</span>
                  </div>
                  <div className="overflow-x-auto text-[11px]">
                    <table className="min-w-full divide-y divide-slate-800">
                      <thead className="text-slate-400">
                        <tr>
                          {tbl.headers.map((h, i) => (
                            <th key={i} className="px-2 py-1 text-left font-bold text-cyan-300">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {tbl.rows.map((r, rI) => (
                          <tr key={rI}>
                            {r.map((c, cI) => (
                              <td key={cI} className="px-2 py-1 font-mono">
                                {c}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
