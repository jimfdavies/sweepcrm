import { IPCResponse } from '../../../shared/ipc.types'

/**
 * Invoke an IPC handler and wait for response
 */
export const ipcInvoke = async <T = unknown>(channel: string, payload?: unknown): Promise<T> => {
  if (!window.electron) {
    throw new Error('IPC not available')
  }

  const response = (await window.electron.invoke(channel, payload)) as IPCResponse<T>

  if (!response.success) {
    throw new Error(response.error || 'IPC request failed')
  }

  return response.payload as T
}

/**
 * Send an IPC message without expecting a response
 */
export const ipcSend = (channel: string, payload?: unknown): void => {
  if (!window.electron) {
    throw new Error('IPC not available')
  }

  window.electron.send(channel, payload)
}

/**
 * Listen for IPC messages from main process
 */
export const ipcOn = (channel: string, handler: (...args: unknown[]) => void): (() => void) => {
  if (!window.electron) {
    throw new Error('IPC not available')
  }

  window.electron.on(channel, handler)

  // Return cleanup function
  return (): void => {
    window.electron.off(channel, handler)
  }
}
