import { ipcMain } from 'electron'
import { IPCResponse } from '../shared/ipc.types'

/**
 * Register an IPC handler for a specific channel
 */
export const registerIPCHandler = <T = unknown, R = unknown>(
  channel: string,
  handler: (payload: T) => Promise<R> | R
): void => {
  ipcMain.handle(channel, async (_event: Electron.IpcMainInvokeEvent, payload: T) => {
    try {
      const result = await Promise.resolve(handler(payload))
      return {
        success: true,
        payload: result
      } as IPCResponse<R>
    } catch (error) {
      console.error(`[IPC Error] Channel: ${channel}`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      } as IPCResponse
    }
  })
}

/**
 * Send an IPC message to the renderer without expecting a response
 */
export const sendToRenderer = (
  mainWindow: Electron.BrowserWindow,
  channel: string,
  payload: unknown
): void => {
  mainWindow.webContents.send(channel, payload)
}
