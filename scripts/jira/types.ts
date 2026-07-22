export type QaStatus = 'PASSED' | 'FAILED' | 'FLAKY' | 'INFRASTRUCTURE' | 'NEEDS HUMAN REVIEW';
export type FailureClassification = 'Defecto reproducible' | 'Flaky test' | 'Infraestructura' | 'Dependencia externa' | 'Seguridad' | 'Accesibilidad' | 'Diferencia visual' | 'Revisión humana';

export interface QaEvidence {
  status: QaStatus;
  classification: FailureClassification;
  summary: string;
  commit: string;
  branch: string;
  seed: string;
  artifacts: Array<{ label: string; url: string }>;
  timestamp: string;
}
