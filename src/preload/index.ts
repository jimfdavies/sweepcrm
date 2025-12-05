import { contextBridge, ipcRenderer } from 'electron'

const api = {
  invoke: (channel: string, ...args: unknown[]) => {
    return ipcRenderer.invoke(channel, ...args)
  },
  send: (channel: string, ...args: unknown[]) => {
    ipcRenderer.send(channel, ...args)
  },
  on: (channel: string, listener: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, (_event: Electron.IpcRendererEvent, ...args: unknown[]) =>
      listener(...args)
    )
  },
  off: (channel: string, listener: (...args: unknown[]) => void) => {
    ipcRenderer.off(channel, listener)
  }
}

contextBridge.exposeInMainWorld('electron', api)

declare global {
  interface Window {
    electron: typeof api
  }

  namespace Electron {
    interface IpcRendererEvent {}
    interface IpcMainInvokeEvent {}
  }
}
