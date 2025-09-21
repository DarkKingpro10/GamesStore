const { contextBridge, ipcRenderer } = require('electron');

// Exponer una API mínima y segura al renderer
contextBridge.exposeInMainWorld('app', {
  env: {
    isElectron: true,
  },
  window: {
    minimize: () => ipcRenderer.invoke('window:action', 'minimize'),
    maximizeRestore: () => ipcRenderer.invoke('window:action', 'maximize-restore'),
    close: () => ipcRenderer.invoke('window:action', 'close'),
  },
});
