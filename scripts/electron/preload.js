const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // Navigation
    navigateTo: (pathname) => ipcRenderer.send('navigate-to', pathname),

    // System info
    platform: process.platform,
    versions: process.versions,

    // Simple notifications (no external dependencies)
    showNotification: (title, body) => {
        // Use native Notification API if available
        if (typeof Notification !== 'undefined') {
            new Notification(title, { body });
        }
    }
});

// Handle navigation from main process
ipcRenderer.on('navigate-to', (event, pathname) => {
    // This will be handled by the renderer process
    window.postMessage({
        type: 'navigate-to',
        pathname: pathname
    }, '*');
});

// Handle any IPC messages from main process
ipcRenderer.on('main-process-message', (event, message) => {
    console.log('Message from main process:', message);
});