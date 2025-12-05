# Building SweepCRM

This document describes how to build SweepCRM for different platforms.

## Prerequisites

- Node.js 18+ and npm
- For Windows builds: Visual Studio Build Tools or similar (for native modules)
- For macOS builds: Xcode Command Line Tools
- For Linux builds: GCC and other build tools

## Building for Development

```bash
npm run dev
```

Starts the app in development mode with hot reload.

## Building for Production

### macOS (.dmg and .zip)

```bash
npm run build:mac
```

Output files will be in `out/` directory:
- `SweepCRM-{version}.dmg` - Installer
- `SweepCRM-{version}-mac.zip` - Portable zip

### Windows (.exe and .exe portable)

```bash
npm run build:win
```

Output files will be in `out/`:
- `SweepCRM-{version}-installer.exe` - NSIS installer
- `SweepCRM-{version}.exe` - Portable executable

### Linux (.AppImage and .deb)

```bash
npm run build:linux
```

Output files will be in `out/`:
- `SweepCRM-{version}.AppImage` - Portable AppImage
- `SweepCRM-{version}.deb` - Debian package

## Cross-Compilation

### macOS to Windows

To build Windows .exe files from macOS:

```bash
npm run build:win
```

The Windows configuration in `electron-builder.yml` is set up for cross-compilation. The build will work on macOS and produce Windows-compatible binaries.

### Notes

- Code signing is not configured by default. See `electron-builder.yml` for certificate options.
- Portable builds don't require installation.
- NSIS installer builds require Visual Studio Build Tools when building on Windows.

## Configuration

Build configuration is in `electron-builder.yml`:

- **appId**: Unique application identifier
- **productName**: Display name for the application
- **targets**: Platform-specific build targets
- **files**: Files to include in the build

For more information, see [electron-builder documentation](https://www.electron.build/).

## Troubleshooting

### Build fails with "ENOENT"

Ensure all dependencies are installed:
```bash
npm install
```

### Windows build on macOS fails

Ensure you're using `npm run build:win` which handles cross-compilation automatically.

### Code signing errors on macOS

Code signing is disabled by default in `electron-builder.yml`. To enable it, add your certificate details.

## Publishing

To publish builds:

1. Update version in `package.json`
2. Build for all platforms
3. Upload artifacts to your distribution platform
4. Update release notes

For automated publishing, configure the `publish` section in `electron-builder.yml`.
