## Issue Tracking with bd (beads)

**IMPORTANT**: This project uses **bd (beads)** for ALL issue tracking. Do NOT use markdown TODOs, task lists, or other tracking methods.

### Why bd?

- Dependency-aware: Track blockers and relationships between issues
- Git-friendly: Auto-syncs to JSONL for version control
- Agent-optimized: JSON output, ready work detection, discovered-from links
- Prevents duplicate tracking systems and confusion

### Quick Start

**Check for ready work:**

```bash
bd ready --json
```

**Create new issues:**

```bash
bd create "Issue title" -t bug|feature|task -p 0-4 --json
bd create "Issue title" -p 1 --deps discovered-from:bd-123 --json
```

**Claim and update:**

```bash
bd update bd-42 --status in_progress --json
bd update bd-42 --priority 1 --json
```

**Complete work:**

```bash
bd close bd-42 --reason "Completed" --json
```

### Issue Types

- `bug` - Something broken
- `feature` - New functionality
- `task` - Work item (tests, docs, refactoring)
- `epic` - Large feature with subtasks
- `chore` - Maintenance (dependencies, tooling)

### Priorities

- `0` - Critical (security, data loss, broken builds)
- `1` - High (major features, important bugs)
- `2` - Medium (default, nice-to-have)
- `3` - Low (polish, optimization)
- `4` - Backlog (future ideas)

### Workflow for AI Agents

1. **Check ready work**: `bd ready` shows unblocked issues
2. **Claim your task**: `bd update <id> --status in_progress`
3. **Work on it**: Implement, test, document
4. **Discover new work?** Create linked issue:
   - `bd create "Found bug" -p 1 --deps discovered-from:<parent-id>`
5. **Complete**: `bd close <id> --reason "Done"`
6. **Commit together**: Always commit the `.beads/issues.jsonl` file together with the code changes so issue state stays in sync with code state

### Auto-Sync

bd automatically syncs with git:

- Exports to `.beads/issues.jsonl` after changes (5s debounce)
- Imports from JSONL when newer (e.g., after `git pull`)
- No manual export/import needed!

### GitHub Copilot Integration

If using GitHub Copilot, also create `.github/copilot-instructions.md` for automatic instruction loading.
Run `bd onboard` to get the content, or see step 2 of the onboard instructions.

### MCP Server (Recommended)

If using Claude or MCP-compatible clients, install the beads MCP server:

```bash
pip install beads-mcp
```

Add to MCP config (e.g., `~/.config/claude/config.json`):

```json
{
  "beads": {
    "command": "beads-mcp",
    "args": []
  }
}
```

Then use `mcp__beads__*` functions instead of CLI commands.

### Managing AI-Generated Planning Documents

AI assistants often create planning and design documents during development:

- PLAN.md, IMPLEMENTATION.md, ARCHITECTURE.md
- DESIGN.md, CODEBASE_SUMMARY.md, INTEGRATION_PLAN.md
- TESTING_GUIDE.md, TECHNICAL_DESIGN.md, and similar files

**Best Practice: Use a dedicated directory for these ephemeral files**

**Recommended approach:**

- Create a `history/` directory in the project root
- Store ALL AI-generated planning/design docs in `history/`
- Keep the repository root clean and focused on permanent project files
- Only access `history/` when explicitly asked to review past planning

**Example .gitignore entry (optional):**

```
# AI planning documents (ephemeral)
history/
```

**Benefits:**

- ✅ Clean repository root
- ✅ Clear separation between ephemeral and permanent documentation
- ✅ Easy to exclude from version control if desired
- ✅ Preserves planning history for archeological research
- ✅ Reduces noise when browsing the project

### Important Rules

- ✅ Use bd for ALL task tracking
- ✅ Always use `--json` flag for programmatic use
- ✅ Link discovered work with `discovered-from` dependencies
- ✅ Check `bd ready` before asking "what should I work on?"
- ✅ Store AI planning docs in `history/` directory
- ❌ Do NOT create markdown TODO lists
- ❌ Do NOT use external issue trackers
- ❌ Do NOT duplicate tracking systems
- ❌ Do NOT clutter repo root with planning documents

For more details, see README.md and QUICKSTART.md.

---

## Testing with Playwright + Electron

**CRITICAL**: Tests are your visual verification tool. Always run tests after implementing features to verify UI works correctly.

### Quick Start

```bash
# Build and run all tests (screenshots on failure)
npm run test:e2e

# Run with interactive UI (Playwright Inspector)
npm run test:e2e:ui

# Debug with DevTools
npm run test:e2e:debug
```

### When to Run Tests

1. **After implementing a new feature** - Verify it works and take screenshots
2. **Before closing a task** - Tests must pass before `bd close`
3. **After modifying UI** - Check that changes render correctly
4. **When debugging** - Use `npm run test:e2e:ui` to step through actions

### Writing Tests

All tests use the `electron-app.fixture`:

```typescript
import { test, expect } from './fixtures/electron-app.fixture'

test('customer form works', async ({ window }) => {
  // Click to open form
  await window.click('button:has-text("Add Customer")')

  // Fill inputs
  await window.fill('input[name="firstName"]', 'John')
  await window.fill('input[name="lastName"]', 'Smith')

  // Submit and verify
  await window.click('button:has-text("Save")')
  await expect(window.locator('.success-message')).toBeVisible()

  // Screenshot for visual verification
  await window.screenshot({ path: 'tests/screenshots/customer-added.png' })
})
```

**Key APIs:**

| Method | Purpose |
|--------|---------|
| `window.click(selector)` | Click an element |
| `window.fill(selector, text)` | Fill input/textarea |
| `window.locator(selector)` | Get element reference |
| `window.screenshot({ path })` | Capture visual state |
| `await expect(...)` | Assert conditions |
| `electronApp.evaluate(fn)` | Run code in main process |

### Test File Structure

```
tests/
├── app.spec.ts                    # Basic app launch tests
├── features/
│   ├── customers.spec.ts          # Customer management tests
│   ├── properties.spec.ts         # Property management tests
│   └── jobs.spec.ts               # Job logging tests
├── fixtures/
│   └── electron-app.fixture.ts    # Reusable Electron fixture
└── screenshots/                   # Auto-captured screenshots
    └── app-launch.png
```

### Debugging Tests

**View test results:**
```bash
npx playwright show-report
# Opens HTML report with videos, traces, screenshots
```

**Inspect console output:**
Tests automatically log:
- `[Electron Main]` - Main process console
- `[Renderer]` - Renderer console
- `[Renderer Error]` - JavaScript errors

**Find screenshots on failure:**
```bash
ls -la tests/screenshots/
# Auto-captured on test failure
```

**Step through test interactively:**
```bash
npm run test:e2e:ui
# Click "Step over" in Playwright Inspector
# See live DOM, console, values
```

### CI/CD Integration

Tests are configured to:
- ✅ Run with single worker in CI (no race conditions)
- ✅ Capture screenshots on failure
- ✅ Record videos on failure
- ✅ Save traces for debugging
- ✅ Auto-build before running (no manual npm run build needed)

### Important Rules

- ✅ Always run `npm run test:e2e` after feature implementation
- ✅ Keep tests focused and single-concern
- ✅ Use semantic selectors (`text=` helpers)
- ✅ Screenshot new features for visual verification
- ✅ Only close issue after tests pass
- ❌ Do NOT ignore failing tests
- ❌ Do NOT skip E2E tests for UI changes
- ❌ Do NOT use brittle CSS class selectors

### Fixture Pattern

All tests use this pattern:

```typescript
test('my test', async ({ electronApp, window }) => {
  // electronApp: ElectronApplication - full main process access
  // window: Page - first BrowserWindow as Playwright Page

  // Test setup
  const result = await electronApp.evaluate(async ({ app }) => {
    return app.isPackaged
  })

  // UI interaction
  await window.click('button')
  const text = await window.textContent('h1')

  // Assertion
  expect(text).toContain('SweepCRM')

  // Visual verification
  await window.screenshot({ path: 'tests/screenshots/feature.png' })
})
```

Fixture automatically:
- ✅ Launches app before test
- ✅ Waits for first window
- ✅ Logs console messages
- ✅ Cleans up after test
- ✅ Closes app gracefully

### Troubleshooting

| Problem | Solution |
|---------|----------|
| Tests hang | Check `npm run build` succeeded. Increase timeout in playwright.config.ts |
| App won't launch | Verify `./out/main/index.js` exists. Run `npm run build` first |
| Selector not found | Use `npm run test:e2e:ui` to inspect DOM. Check element exists |
| Screenshot is blank | Add `await window.waitForLoadState('networkidle')` before screenshot |
| IPC calls fail | Verify preload script loaded. Check main process handlers exist |

See `history/TESTING_GUIDE.md` for detailed testing documentation.
