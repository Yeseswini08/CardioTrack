import test from 'node:test';
import assert from 'node:assert/strict';
import { V1_RAW_DATA, V2_RAW_DATA } from './rawPdfData';
import { parsePdfDocument } from './parserPipeline';
import { computeDocumentDiff } from './stalenessEngine';
import { validateTestSuite, synthesizeDeterministicTests } from './llmGenerator';
import { computeSha256, normalizeText } from './crypto';

test('1. Multi-line Document Title merges into single root node (level=0)', () => {
  const v1Tree = parsePdfDocument(V1_RAW_DATA);
  const root = v1Tree.nodes.find((n) => n.level === 0);
  assert.ok(root, 'Root node must exist');
  assert.equal(root.title, 'CardioTrack CT-200 Home Blood Pressure Monitor — Technical & User Manual');
  assert.equal(root.level, 0);
  assert.equal(root.sectionNumber, '');
  assert.ok(root.anomalies.some((a) => a.includes('MULTI_LINE_TITLE_MERGE')));
});

test('2. Skipped hierarchy level 2.1 -> 2.1.1.1 climbs prefix tree to attach to parent 2.1', () => {
  const v1Tree = parsePdfDocument(V1_RAW_DATA);
  const node2_1 = v1Tree.nodes.find((n) => n.sectionNumber === '2.1');
  const node2_1_1_1 = v1Tree.nodes.find((n) => n.sectionNumber === '2.1.1.1');

  assert.ok(node2_1, 'Section 2.1 must exist');
  assert.ok(node2_1_1_1, 'Section 2.1.1.1 must exist');
  assert.equal(node2_1_1_1.level, 4, 'Must retain dot-segment level 4');
  assert.equal(node2_1_1_1.parentId, node2_1.nodeId, 'Parent must be nearest existing ancestor 2.1');
  assert.ok(node2_1_1_1.anomalies.some((a) => a.includes('SKIPPED_LEVEL')));
});

test('3. Inconsistent heading font size in Section 3.2 is detected without breaking hierarchy', () => {
  const v1Tree = parsePdfDocument(V1_RAW_DATA);
  const sec3_2 = v1Tree.nodes.find((n) => n.sectionNumber === '3.2');

  assert.ok(sec3_2, 'Section 3.2 must be detected');
  assert.equal(sec3_2.fontInfo.fontSize, 11.0);
  assert.equal(sec3_2.fontInfo.isBold, true);
  assert.ok(sec3_2.anomalies.some((a) => a.includes('INCONSISTENT_HEADING_FONT_SIZE')));
});

test('4. Out-of-order section numbering preserves physical reading order (3.4 before 3.3)', () => {
  const v1Tree = parsePdfDocument(V1_RAW_DATA);
  const sec3_4 = v1Tree.nodes.find((n) => n.sectionNumber === '3.4');
  const sec3_3 = v1Tree.nodes.find((n) => n.sectionNumber === '3.3');

  assert.ok(sec3_4, 'Section 3.4 must exist');
  assert.ok(sec3_3, 'Section 3.3 must exist');
  assert.ok(sec3_4.readingOrder < sec3_3.readingOrder, '3.4 must precede 3.3 in physical reading order');
  assert.ok(sec3_4.anomalies.some((a) => a.includes('OUT_OF_ORDER_SECTION_NUMBERING')));
});

test('5. Numbered list false-positive trap in Section 3.3 stored in listItems, not top-level headings', () => {
  const v1Tree = parsePdfDocument(V1_RAW_DATA);
  const sec3_3 = v1Tree.nodes.find((n) => n.sectionNumber === '3.3');

  assert.ok(sec3_3, 'Section 3.3 must exist');
  assert.ok(sec3_3.listItems && sec3_3.listItems.length === 5, 'Must contain 5 blood pressure classification items');
  assert.ok(sec3_3.listItems[0].startsWith('1. Normal:'));
  assert.ok(sec3_3.listItems[4].startsWith('5. Hypertensive Crisis:'));

  // Ensure no rogue top-level heading "1" was created from "1. Normal"
  const rogue1 = v1Tree.nodes.filter((n) => n.sectionNumber === '1');
  assert.equal(rogue1.length, 1, 'Only one Section 1 (Device Overview) should exist');
  assert.equal(rogue1[0].title, 'Device Overview');
});

test('6. Duplicate section headings on 4.2 and 7.1 have distinct logical and physical node IDs', () => {
  const v1Tree = parsePdfDocument(V1_RAW_DATA);
  const sec4_2 = v1Tree.nodes.find((n) => n.sectionNumber === '4.2');
  const sec7_1 = v1Tree.nodes.find((n) => n.sectionNumber === '7.1');

  assert.ok(sec4_2 && sec7_1, 'Both Error Codes sections must exist');
  assert.equal(sec4_2.title, 'Error Codes');
  assert.equal(sec7_1.title, 'Error Codes');
  assert.notEqual(sec4_2.nodeId, sec7_1.nodeId);
  assert.equal(sec4_2.logicalNodeId, '4.2::error-codes');
  assert.equal(sec7_1.logicalNodeId, '7.1::error-codes');
});

test('7. Interleaved multi-line table extraction formats markdown table correctly', () => {
  const v1Tree = parsePdfDocument(V1_RAW_DATA);
  const sec2_1 = v1Tree.nodes.find((n) => n.sectionNumber === '2.1');
  const sec4_2 = v1Tree.nodes.find((n) => n.sectionNumber === '4.2');

  assert.ok(sec2_1 && sec2_1.markdownTable, 'Section 2.1 must contain markdown table');
  assert.ok(sec2_1.markdownTable.includes('| Parameter | Value |'));
  assert.ok(sec2_1.markdownTable.includes('0–299 mmHg'));

  assert.ok(sec4_2 && sec4_2.markdownTable, 'Section 4.2 must contain markdown table');
  assert.ok(sec4_2.markdownTable.includes('| Code | Meaning | Device Behavior |'));
  assert.ok(sec4_2.markdownTable.includes('E1'));
  assert.ok(sec4_2.markdownTable.includes('E5'));
});

test('8. Unicode non-breaking hyphens normalized and cross-page paragraphs stitched', () => {
  const textWithNbHyphen = 'CardioTrack CT\u2011200';
  const normalized = normalizeText(textWithNbHyphen);
  assert.equal(normalized, 'CardioTrack CT-200');

  const v1Tree = parsePdfDocument(V1_RAW_DATA);
  const sec6_1 = v1Tree.nodes.find((n) => n.sectionNumber === '6.1');
  assert.ok(sec6_1, 'Section 6.1 must exist');
  assert.ok(
    sec6_1.bodyText.includes('Do not submerge the device or cuff, and do not use alcohol'),
    'Paragraph split across page 5 and 6 must be stitched seamlessly'
  );
});

test('9. Three-Tier Staleness detects CRITICAL_THRESHOLD_CHANGE, ADDED, and TRANSITIVE_STALE', () => {
  const v1Tree = parsePdfDocument(V1_RAW_DATA);
  const v2Tree = parsePdfDocument(V2_RAW_DATA);

  const { diffs, contradictions } = computeDocumentDiff(v1Tree, v2Tree);

  // Check Section 2.1.1.1 (300 -> 250 cycles, 15% -> 10%)
  const diff2_1_1_1 = diffs.find((d) => d.sectionNumber === '2.1.1.1');
  assert.ok(diff2_1_1_1);
  assert.equal(diff2_1_1_1.status, 'CRITICAL_THRESHOLD_CHANGE');

  // Check Section 3.2 (40 -> 30 mmHg step)
  const diff3_2 = diffs.find((d) => d.sectionNumber === '3.2');
  assert.ok(diff3_2);
  assert.equal(diff3_2.status, 'CRITICAL_THRESHOLD_CHANGE');

  // Check Section 4.2 (E3 2s -> 1.5s, E6 added)
  const diff4_2 = diffs.find((d) => d.sectionNumber === '4.2');
  assert.ok(diff4_2);
  assert.equal(diff4_2.status, 'CRITICAL_THRESHOLD_CHANGE');

  // Check Section 5.3 (New section added in v2)
  const diff5_3 = diffs.find((d) => d.sectionNumber === '5.3');
  assert.ok(diff5_3);
  assert.equal(diff5_3.status, 'ADDED');

  // Check Section 7.1 (Transitive staleness: references Section 4.2 which changed!)
  const diff7_1 = diffs.find((d) => d.sectionNumber === '7.1');
  assert.ok(diff7_1);
  assert.equal(diff7_1.status, 'TRANSITIVE_STALE', 'Section 7.1 must be flagged as TRANSITIVE_STALE due to 4.2 dependency');
});

test('10. Automated Regulatory Contradiction detector catches Section 4.1 vs 4.2 E3 timing mismatch in v2', () => {
  const v1Tree = parsePdfDocument(V1_RAW_DATA);
  const v2Tree = parsePdfDocument(V2_RAW_DATA);

  const { contradictions } = computeDocumentDiff(v1Tree, v2Tree);

  assert.equal(contradictions.length, 1, 'Must detect exactly 1 regulatory contradiction in v2');
  const contra = contradictions[0];
  assert.equal(contra.type, 'SPEC_THRESHOLD_MISMATCH');
  assert.equal(contra.sectionA, '4.1');
  assert.equal(contra.sectionB, '4.2');
  assert.ok(contra.statementA.includes('2 seconds'));
  assert.ok(contra.statementB.includes('1.5 seconds'));
});

test('11. Pydantic-style test case validator enforces 3-5 cases and selection bounds', () => {
  const allowed = ['2.1.1.1', '3.2', '4.2'];

  // Test failure on out-of-bounds section reference
  const badData = {
    test_cases: [
      {
        title: 'Valid test 1',
        source_section_numbers: ['9.9'], // Invalid!
        requirement_excerpt: 'Excerpt 1 exceeding ten characters minimum',
        steps: ['Step 1', 'Step 2'],
        expected_result: 'Valid expected 1',
      },
    ],
  };

  const validation = validateTestSuite(badData, allowed);
  assert.equal(validation.valid, false);
  assert.ok(validation.errors.some((e) => e.includes('references "9.9" which is not in the pinned selection')));
  assert.ok(validation.errors.some((e) => e.includes('must contain between 3 and 5 items')));
});
