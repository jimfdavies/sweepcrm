const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const modulePath = path.join(__dirname, '../node_modules/better-sqlite3-multiple-ciphers')
const releasePath = path.join(modulePath, 'build/Release')
const binaryPath = path.join(releasePath, 'better_sqlite3.node')
const backupPath = path.join(releasePath, 'better_sqlite3.node.mac')

function run(command) {
  console.log(`Running: ${command}`)
  execSync(command, { stdio: 'inherit' })
}

async function buildWindows() {
  try {
    console.log('Starting Windows build process...')

    // 1. Backup macOS binary
    if (fs.existsSync(binaryPath)) {
      console.log('Backing up macOS binary...')
      fs.copyFileSync(binaryPath, backupPath)
    } else {
      console.warn('Warning: No existing binary found to backup.')
    }

    // 2. Download Windows binary
    console.log('Fetching Windows prebuild...')
    // We use the prebuild-install from the module's dependencies or project dependencies
    const prebuildInstall = path.join(modulePath, 'node_modules/.bin/prebuild-install')

    // If not found there, try project level
    const prebuildCmd = fs.existsSync(prebuildInstall) ? prebuildInstall : 'npx prebuild-install'

    // Force install for win32 x64 electron 38.7.1
    // Note: --path argument tells prebuild-install where the package.json is
    // We execute inside the module path so it reads the correct package.json
    execSync(
      `${prebuildCmd} --runtime=electron --target=38.7.1 --platform=win32 --arch=x64 --force`,
      {
        cwd: modulePath,
        stdio: 'inherit'
      }
    )

    // 3. Build the app
    console.log('Building app...')
    run('npm run build')

    // 4. Packaging for Windows
    console.log('Packaging for Windows...')
    // We skip the npm rebuild step in electron-builder because we just manually handled it
    // We need to make sure electron-builder doesn't try to rebuild it again and overwrite our work
    // In electron-builder.yml we removed npmRebuild: false, so it defaults to true.
    // We should pass -c.npmRebuild=false to electron-builder to prevent it from messing with our binary
    run('npx electron-builder --win --config.npmRebuild=false')

    console.log('Windows build completed successfully!')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  } finally {
    // 5. Restore macOS binary
    if (fs.existsSync(backupPath)) {
      console.log('Restoring macOS binary...')
      // Remove the windows binary we downloaded
      if (fs.existsSync(binaryPath)) {
        fs.unlinkSync(binaryPath)
      }
      fs.renameSync(backupPath, binaryPath)
      console.log('Restored macOS binary.')
    }
  }
}

buildWindows()
