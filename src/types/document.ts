export type StalenessStatus =
  | 'FRESH'
  | 'COSMETIC_WORDING_CHANGE'
  | 'CRITICAL_THRESHOLD_CHANGE'
  | 'TRANSITIVE_STALE'
  | 'ADDED'
  | 'DELETED';

export interface FontInfo {
  fontName: string;
  fontSize: number;
  isBold: boolean;
}

export interface ClinicalSpec {
  parameter: string;
  value: string;
  unit: string;
  raw: string;
  criticality: 'CRITICAL' | 'STANDARD';
}

export interface DocumentNode {
  nodeId: string;
  logicalNodeId: string;
  docSlug: string;
  versionNumber: number;
  sectionNumber: string;
  title: string;
  level: number;
  parentId: string | null;
  bodyText: string;
  markdownTable?: string;
  tableData?: { headers: string[]; rows: string[][] };
  listItems?: string[];
  pageNumber: number;
  fontInfo: FontInfo;
  contentHash: string;
  clinicalSpecs: ClinicalSpec[];
  referencedSections: string[];
  anomalies: string[];
  readingOrder: number;
}

export interface DocumentTree {
  docSlug: string;
  versionNumber: number;
  rootId: string;
  nodes: DocumentNode[];
  totalPages: number;
  nodeCount: number;
}

export interface SpecChange {
  parameter: string;
  v1Value: string;
  v2Value: string;
  severity: 'CRITICAL' | 'COSMETIC';
  rationale: string;
}

export interface NodeDiff {
  logicalNodeId: string;
  sectionNumber: string;
  title: string;
  status: StalenessStatus;
  v1Node?: DocumentNode;
  v2Node?: DocumentNode;
  hashChanged: boolean;
  specChanges: SpecChange[];
  reason: string;
  transitiveSource?: string;
}

export interface RegulatoryContradiction {
  id: string;
  type: 'SPEC_THRESHOLD_MISMATCH';
  severity: 'HIGH_REGULATORY_DEFECT';
  sectionA: string;
  titleA: string;
  statementA: string;
  sectionB: string;
  titleB: string;
  statementB: string;
  description: string;
  standardReference: string;
  recommendation: string;
}

export interface QATestCase {
  testId: string;
  title: string;
  sourceSectionNumbers: string[];
  requirementExcerpt: string;
  testType: 'BOUNDARY_VALUE' | 'NOMINAL' | 'FAULT_INJECTION' | 'REGULATORY_SAFETY';
  preconditions: string[];
  steps: string[];
  expectedResult: string;
  stalenessStatus: StalenessStatus;
  traceabilityMatrixId: string;
  notes?: string;
}

export interface ValidationAttempt {
  attempt: number;
  success: boolean;
  errorFeedback?: string;
  rawResponseSnippet?: string;
  timestamp: string;
}

export interface QAGenerationSuite {
  id: string;
  createdAt: string;
  docVersion: number;
  selectedNodeIds: string[];
  selectedSectionNumbers: string[];
  testCases: QATestCase[];
  validationAttempts: ValidationAttempt[];
  pydanticStatus: 'VALID' | 'FAILED_RECOVERED' | 'INVALID';
  mode: 'GEMINI_LIVE' | 'DETERMINISTIC_SYNTHESIS';
}
