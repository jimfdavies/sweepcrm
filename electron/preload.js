const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Add secure IPC methods here
  ping: () => ipcRenderer.invoke('ping'),
});
