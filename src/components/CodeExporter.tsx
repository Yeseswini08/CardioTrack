import React, { useState } from 'react';
import { REPO_FILES, RepoFile } from '../utils/pythonRepoSource';
import {
  FileCode,
  Copy,
  Check,
  Download,
  FolderGit2,
  Terminal,
  ExternalLink,
  Mail,
  Calendar,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export const CodeExporter: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<RepoFile>(REPO_FILES[0]);
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FolderGit2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              Python Repository &amp; Assignment Submission Hub
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete, tested backend implementation ready to push to your public GitHub repository
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCopyCode}
            className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-all flex items-center space-x-1.5"
          >
            {copiedFile ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedFile ? 'Copied to Clipboard' : `Copy ${selectedFile.filename}`}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadFile}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors border border-slate-700 flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Code Viewer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* File Navigator Sidebar */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Repository Structure ({REPO_FILES.length} Files)
          </div>

          <div className="space-y-1">
            {REPO_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;

              return (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-center space-x-2.5 ${
                    isSelected
                      ? 'bg-cyan-950/50 border border-cyan-500/40 text-cyan-200 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white border border-transparent'
                  }`}
                >
                  <FileCode className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <div className="min-w-0 flex-1">
                    <span className="font-mono font-medium block truncate">{file.path}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{file.description}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Setup Commands Helper */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-semibold">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Local Run Commands:</span>
            </div>
            <pre className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-cyan-300 leading-relaxed overflow-x-auto">
              pip install -r requirements.txt{'\n'}
              python3 tests/test_suite.py{'\n'}
              python3 demo_e2e.py
            </pre>
          </div>
        </div>

        {/* Code Content Display */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-cyan-300">{selectedFile.path}</span>
            <span className="text-[11px] font-mono uppercase bg-slate-800 px-2 py-0.5 rounded">
              {selectedFile.language}
            </span>
          </div>

          <div className="p-4 bg-slate-950 overflow-x-auto max-h-[640px] flex-1">
            <pre className="text-xs font-mono text-slate-200 leading-relaxed font-normal">
              {selectedFile.content}
            </pre>
          </div>
        </div>
      </div>

      {/* Submission Instructions & Ready-to-Send Email Template */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">
            Submission Checklist &amp; Interview Booking Guide
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-bold text-white flex items-center space-x-1.5">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px]">
                1
              </span>
              <span>Push to Public GitHub</span>
            </span>
            <p className="text-slate-400 leading-relaxed">
              Push your code with incremental git commits to a repo named{' '}
              <code className="text-cyan-300">ct200-traceability-engine</code>.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-bold text-white flex items-center space-x-1.5">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px]">
                2
              </span>
              <span>Submit Google Form FIRST</span>
            </span>
            <p className="text-slate-400 leading-relaxed">
              Submit the form before booking a slot to avoid disqualification by the automated screener.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-bold text-white flex items-center space-x-1.5">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px]">
                3
              </span>
              <span>Book Interview Slot</span>
            </span>
            <p className="text-slate-400 leading-relaxed">
              Book a slot between 23 Oct and 26 Oct (8:00 AM – 9:00 PM IST) and send the submission email.
            </p>
          </div>
        </div>

        {/* Email Template Preview */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span>Ready-to-Send Submission Email (thomas@tri9t.in, dhayananthan.c@tri9t.in)</span>
            <button
              type="button"
              onClick={() => {
                const emailText = `To: thomas@tri9t.in, dhayananthan.c@tri9t.in\nSubject: Technical Assignment Submission — AI Engineer Intern — [Your Full Name]\n\nDear Thomas and Dhayanthan,\n\nI have completed and submitted the technical assignment for the AI Engineer Intern position at AffineSurge Pvt. Ltd. (Tri9T AI) via the Google Application Form and booked my interview slot.\n\nHere are the direct links to my deliverables:\n- GitHub Repository: https://github.com/[your-username]/ct200-traceability-engine\n- Approach Document & Decision Log: https://github.com/[your-username]/ct200-traceability-engine/blob/main/APPROACH.md\n- End-to-End Verification Demo: https://github.com/[your-username]/ct200-traceability-engine/blob/main/demo_e2e.py\n\nKey highlights:\n1. Layout- and typography-aware PDF parser (app/parser.py) resolving all 8 structural anomalies.\n2. Non-destructive v1->v2 versioning and automated contradiction detector (Section 4.1 2s vs Section 4.2 E3 1.5s).\n3. IEC 62304 QA test generator with Pydantic validation and 3-attempt self-healing retry loop.\n4. Three-tier staleness engine (FRESH, COSMETIC, CRITICAL_THRESHOLD_CHANGE, and TRANSITIVE_STALE for 7.1 -> 4.2).\n\nBest regards,\n[Your Name]`;
                navigator.clipboard.writeText(emailText);
                setCopiedTemplate(true);
                setTimeout(() => setCopiedTemplate(false), 2000);
              }}
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1"
            >
              {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTemplate ? 'Copied' : 'Copy Email Text'}</span>
            </button>
          </div>
          <div className="text-slate-300 font-mono text-[11px] whitespace-pre-line bg-slate-900 p-3 rounded-lg border border-slate-800">
            <strong>Subject:</strong> Technical Assignment Submission — AI Engineer Intern — [Your Full Name]{'\n\n'}
            Dear Thomas and Dhayanthan,{'\n\n'}
            I have completed and submitted the technical assignment for the AI Engineer Intern position at AffineSurge Pvt. Ltd. (Tri9T AI) via the Google Application Form and booked my interview slot.{'\n\n'}
            Direct Links:{'\n'}
            &bull; GitHub: https://github.com/[your-username]/ct200-traceability-engine{'\n'}
            &bull; Approach Document &amp; Decision Log: APPROACH.md{'\n'}
            &bull; End-to-End Verification Script: demo_e2e.py
          </div>
        </div>
      </div>
    </div>
  );
};
