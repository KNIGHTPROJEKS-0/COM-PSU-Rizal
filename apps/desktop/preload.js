const { contextBridge, ipcRenderer } = require('electron');
const { ElectronFileSystem } = require('./integrations/fileSystem');
const { SystemInfo } = require('./integrations/systemInfo');
const { ElectronNotifications } = require('./integrations/notifications');

const fileSystem = new ElectronFileSystem();
const systemInfo = new SystemInfo();
const notifications = new ElectronNotifications();

contextBridge.exposeInMainWorld('desktop', {
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },

  // File system operations
  fileSystem: {
    selectDirectory: () => ipcRenderer.invoke('select-directory'),
    selectFile: (filters) => ipcRenderer.invoke('select-file', filters),
    saveFile: (content, defaultPath, filters) => ipcRenderer.invoke('save-file', content, defaultPath, filters),
  },

  // System information
  system: {
    getInfo: () => systemInfo.getSystemInfo(),
    getPlatform: () => systemInfo.getPlatform(),
    getVersion: () => systemInfo.getVersion(),
    isDevelopment: () => systemInfo.isDevelopment(),
    getAppDataPath: () => systemInfo.getAppDataPath(),
    getUserDataPath: () => systemInfo.getUserDataPath(),
  },

  // Notifications
  notifications: {
    show: (title, body, options) => notifications.show(title, body, options),
    showSuccess: (title, body) => notifications.showSuccess(title, body),
    showError: (title, body) => notifications.showError(title, body),
    showInfo: (title, body) => notifications.showInfo(title, body),
    showWarning: (title, body) => notifications.showWarning(title, body),
  },

  // IPC communication
  ipc: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, callback) => ipcRenderer.on(channel, callback),
    once: (channel, callback) => ipcRenderer.once(channel, callback),
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  },
});
