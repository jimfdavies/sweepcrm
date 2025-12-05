import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { is, platform } from '@electron-toolkit/utils'
import { registerIPCHandler } from './ipc'
import { initializeDatabase, handleDatabaseRequest } from './db'
import { DatabaseRequest } from '../shared/ipc.types'

let mainWindow: BrowserWindow | null = null

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  registerIPCHandler<DatabaseRequest>('db:request', handleDatabaseRequest)
  initializeDatabase().catch(error => {
    console.error('[DB Init] Failed:', error)
  })
  createWindow()
})

app.on('window-all-closed', () => {
  if (!platform.isMacOS) {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
