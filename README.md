# SweepCRM

An Electron application with React and TypeScript for SweepCRM.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Development

To run the application in development mode (with hot-reload):

```bash
npm start
```

This will launch:

1. The Vite development server (http://localhost:5173)
2. The Electron application window

### Build

To build the application for production (macOS/Windows):

```bash
npm run build
```

The output will be in the `release/` directory.

### Database

The application uses a local SQLite database.

- **Development**: `sweepcrm.db` in the project root.
- **Production**: `sweepcrm.db` in the user's application data directory.
