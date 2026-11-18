import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: './unit', testMatch: 'ai-memory-storage.spec.ts', workers: 1, timeout: 30000 });
