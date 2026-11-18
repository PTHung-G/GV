import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: '../../../scripts', testMatch: 'math9-topic-evaluation.ts', workers: 1, timeout: 720000, outputDir: './test-output', reporter: 'line' });
