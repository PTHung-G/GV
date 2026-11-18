import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: '../../../e2e/unit', testIgnore: ['**/document-sync.spec.ts', '**/wizard-contract.spec.ts'], workers: 1, timeout: 30000, reporter: 'line', outputDir: './unit-test-output' });
