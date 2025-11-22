# Testing Guide

## Overview

This project uses a comprehensive testing setup with:

- **Vitest** for fast unit tests
- **Playwright** for end-to-end GUI tests

## Running Tests

### Unit Tests

```bash
# Run all unit tests (watch mode)
npm test

# Run unit tests once
npm run test:unit

# Run with visual UI
npm run test:ui

# Run with coverage report
npm run test:coverage
```

### E2E Tests

> **Important**: E2E tests use your **real database**. You must provide your database password.

You can provide the password in two ways:

1. **Using a `.env` file** (Recommended for local dev):
   Create a `.env` file in the root directory:

   ```
   SWEEPCRM_TEST_PASSWORD=your-password
   ```

   Then run:

   ```bash
   npm run test:e2e
   ```

2. **Using environment variables** (CI/CD):
   ```bash
   SWEEPCRM_TEST_PASSWORD=your-password npm run test:e2e
   ```

```bash
# Build the application (Required before testing)
npm run build

# Run E2E tests
npm run test:e2e

# Run with Playwright UI
npm run test:e2e:ui

# Debug E2E tests
npm run test:e2e:debug
```

## Writing Tests

### Unit Tests

Unit tests are co-located with source files using the `.test.ts` extension.

**Example**: `src/db/db.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { createTestDB } from '../utils/test-helpers'

describe('My Feature', () => {
  let db

  beforeEach(() => {
    db = createTestDB()
  })

  it('should do something', () => {
    // Your test code
    expect(result).toBe(expected)
  })
})
```

#### Test Utilities

Use the helpers in `src/utils/test-helpers.ts`:

- `createTestDB()` - Create an in-memory test database
- `insertTestCustomer(db, data?)` - Insert a test customer
- `insertTestProperty(db, data?)` - Insert a test property
- `insertTestJob(db, data?)` - Insert a test job

### E2E Tests

E2E tests are in `tests/e2e/` and end with `.spec.ts`.

**Example**: `tests/e2e/login.spec.ts`

```typescript
import { test, expect } from '@playwright/test'
import { launchElectronApp, login, closeApp } from '../fixtures/electron-app'
import { TEST_PASSWORD } from '../fixtures/test-data'

test('should login successfully', async () => {
  const { app, page } = await launchElectronApp()
  await login(page, TEST_PASSWORD)

  await expect(page).toHaveURL(/dashboard/)

  await closeApp(app)
})
```

#### E2E Test Helpers

Use the fixtures in `tests/fixtures/`:

- `launchElectronApp()` - Launch the Electron app
- `login(page, password?)` - Login to the app
- `navigateTo(page, route)` - Navigate to a page
- `closeApp(app)` - Close the app
- `getUniqueCustomer()` - Generate unique test customer data (from `test-data.ts`)

## Test Structure

```
src/
├── db/
│   ├── db.ts
│   └── db.test.ts          # Database unit tests
├── main/
│   ├── ipc.ts
│   └── ipc.test.ts         # IPC handler unit tests
└── utils/
    └── test-helpers.ts     # Shared test utilities

tests/
├── e2e/
│   ├── login.spec.ts       # Login flow E2E tests
│   └── customers.spec.ts   # Customer management E2E tests
└── fixtures/
    ├── electron-app.ts     # Electron app helpers
    └── test-data.ts        # Test data fixtures
```

## Best Practices

### Unit Tests

- Keep tests focused and isolated
- Use descriptive test names: `should create customer with valid data`
- Test one thing at a time
- Use beforeEach to set up fresh state
- Clean up resources in afterEach if needed

### E2E Tests

- Always close the app in tests
- Use stable selectors (prefer data-testid over CSS classes)
- Test user workflows, not implementation details
- Keep tests independent - don't rely on state from other tests
- Use `getUniqueCustomer()` to avoid data conflicts

## Continuous Integration

Tests can be run in CI with:

```yaml
# .github/workflows/test.yml
- run: npm run test:unit
- run: npm run build
- run: npm run test:e2e
```

## Troubleshooting

### Native Module Errors

### Native Module Errors

We use a dual-strategy for `better-sqlite3`:

- **App**: Uses `better-sqlite3-multiple-ciphers` (compiled for Electron)
- **Unit Tests**: Uses `better-sqlite3` (compiled for Node) via Vitest alias

If you see errors about `NODE_MODULE_VERSION` mismatch:

1. For App errors: `npm run postinstall` (rebuilds for Electron)
2. For Test errors: `npm install` (ensures better-sqlite3 is installed)

### E2E Tests Failing

1. **Login failing**: Make sure you have a `.env` file with `SWEEPCRM_TEST_PASSWORD` or set the environment variable.
2. Make sure the app is built: `npm run build`
3. Check that you're running the correct Node version
4. Use `npm run test:e2e:debug` to see what's happening

### TypeScript Errors in Tests

Make sure `src/utils/**/*.ts` is included in `tsconfig.node.json`.

## Coverage

View test coverage with:

```bash
npm run test:coverage
```

This generates an HTML report in `coverage/index.html`.
