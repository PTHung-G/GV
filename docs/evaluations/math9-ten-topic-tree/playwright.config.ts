import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: '../../../scripts', testMatch: 'math9-ten-topic-evaluation.ts', workers: 1, timeout: 2700000, outputDir: './test-output', reporter: 'line' });
