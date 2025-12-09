# SweepCRM

A desktop customer management system for chimney sweep businesses, built with Electron and React.

## Features

- **Customers**: Manage customer contacts and information
- **Properties**: Track customer properties and locations
- **Jobs**: Log and track sweep jobs with reminders
- **Reminders**: View upcoming job reminders and follow-ups
- **CSV Export**: Export customer and job data for mail-merge
- **Database Backup**: Built-in backup functionality

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run uat

# Build for production
npm run build

# Run tests
npm run test:e2e
```

## Tech Stack

- **Electron**: Desktop app framework
- **React + TypeScript**: UI
- **Tailwind CSS**: Styling
- **Better SQLite3**: Local database
- **Playwright**: E2E testing

## Architecture

```
src/
├── main/       # Electron main process
├── preload/    # IPC bridge
├── renderer/   # React UI
└── shared/     # Shared types
```

## License

MIT
