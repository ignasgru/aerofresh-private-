export type TailSummary = {
  tail: string;
  regStatus: string;
  airworthiness: string;
  adOpenCount: number;
  ntsbAccidents: number;
  owners: number;
  riskScore: number;
};

// Export all core modules
export * from './tracking';
export * from './notifications';
export * from './pdf-generator';
export * from './analytics';
export * from './rate-limiter';
export * from './i18n';
