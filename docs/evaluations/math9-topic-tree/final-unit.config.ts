import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: '../../../e2e/unit', testMatch: ['question-bank.spec.ts', 'question-bank-extraction.spec.ts'], workers: 1, reporter: 'line', outputDir: './final-unit-output' });
