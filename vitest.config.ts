import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    // Test file patterns
    include: ['src/**/*.{test,spec}.{js,ts}'],

    // Environment
    environment: 'node',

    // Globals (if you prefer not to import describe, it, expect in every file)
    globals: true,

    // Coverage configuration (optional)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'out/', 'dist/', '**/*.d.ts', '**/*.config.*', '**/mockData/**']
    },

    // Timeout for tests
    testTimeout: 10000,

    // TypeScript config
    alias: {
      '@renderer': path.resolve(__dirname, './src/renderer/src'),
      'better-sqlite3-multiple-ciphers': 'better-sqlite3'
    }
  }
})
