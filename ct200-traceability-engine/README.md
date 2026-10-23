# CardioTrack CT-200 Regulatory Document Traceability & Staleness Engine

**Company:** AffineSurge Pvt. Ltd. (Tri9T AI)  
**Role:** AI Engineer Intern Technical Assignment  
**Standards:** IEC 62304 / ISO 13485 / ISO 14971  

## Quick Start
\`\`\`bash
# 1. Create virtualenv and install dependencies
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\\Scripts\\activate
pip install -r requirements.txt

# 2. Run automated test suite (all 8 anomalies + staleness tests)
python3 tests/test_suite.py

# 3. Run End-to-End Demo (v1 -> v2 re-ingestion & staleness flow)
python3 demo_e2e.py
\`\`\`

## Key Architectural Highlights
1. **Layout- & Typography-Aware PDF Parser (`app/parser.py`)**:
   - Resolves multi-line title merge on Page 1 (NimbusSans-Bold 22.0pt) into root node.
   - Handles skipped hierarchy level (2.1 -> 2.1.1.1) via prefix-tree climbing.
   - Resolves inconsistent heading font size (Section 3.2 11pt Bold).
   - Preserves physical reading order when section numbers appear out-of-order (3.4 before 3.3).
   - Disambiguates numbered lists from headings in Section 3.3 (font weight check).
   - Separates duplicate headings (4.2 and 7.1 'Error Codes') with unique logical IDs.
   - Extracts bounding-box multi-line tables and normalizes Unicode non-breaking hyphens.

2. **Three-Tier Staleness Engine (`app/versioning.py`)**:
   - **Tier 1:** O(1) SHA-256 content hash check.
   - **Tier 2:** Clinical & numeric quantity extractor (`CRITICAL_THRESHOLD_CHANGE` vs `COSMETIC_WORDING_CHANGE`).
   - **Tier 3:** Transitive cross-reference staleness (e.g. Section 7.1 flagged as `TRANSITIVE_STALE` because it references Section 4.2).

3. **Automated Regulatory Contradiction Detector**:
   - Detects the cross-section contradiction in v2: Section 4.1 prose specifies 2.0s deflation while Section 4.2 E3 table specifies 1.5s deflation!

4. **Structured Output LLM QA Generator (`app/llm_service.py`)**:
   - Strict Pydantic schema validation for IEC 62304 test cases.
   - 3-attempt self-healing retry loop injecting validation errors back to LLM.
