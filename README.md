# SweepCRM

An Electron application with React and TypeScript for SweepCRM.

## Prerequisites

- Node.js (>= 20) and npm
- `prebuild-install` (installed via npm)
- `electron-builder` (installed via npm)
- No separate SQLite installation required; the native module bundles SQLite.

## Project Setup

### Install

```bash
npm install
```

### Environment

Copy `.env.example` to `.env` if needed (contains DB password etc.).

## Development

```bash
npm run dev
```

Runs Electron with hot‑reloading.

## Build

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

The Windows build script downloads the pre‑built `better_sqlite3.node` binary for Windows, so you do **not** need to install SQLite separately.

## Running the Packaged App

After a build, run:

```bash
npm run start
```

This launches the app from the `out/` directory.

## Testing

```bash
npm run test          # unit tests
npm run test:e2e      # Playwright end‑to‑end tests
```

## SQLite / Native Module

The project uses `better-sqlite3-multiple-ciphers`, which includes the SQLite engine compiled for the target platform. The Windows build script (`scripts/build-win.js`) fetches the appropriate binary, so no external SQLite installation is required on any OS.
