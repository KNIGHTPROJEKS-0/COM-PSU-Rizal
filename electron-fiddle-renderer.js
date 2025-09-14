// Renderer process for Electron Fiddle - Simplified standalone version
const { ipcRenderer } = require('electron');

let loadingContainer = null;
let workspaceContainer = null;
let errorContainer = null;
let isWebappConnected = false;

function init() {
    loadingContainer = document.getElementById('loading-container');
    workspaceContainer = document.getElementById('workspace-container');
    errorContainer = document.getElementById('error-container');

    console.log('PSU Rizal Desktop - Electron Fiddle Renderer initialized');

    // Start the loading sequence
    startLoadingSequence();
}

function startLoadingSequence() {
    console.log('Starting loading sequence...');

    // Show loading for 8 seconds (same as the original component)
    setTimeout(() => {
        // Check if webapp is available
        checkWebappConnection().then(() => {
            if (isWebappConnected) {
                // If webapp is connected, we could load it in a webview
                // For now, show the built-in workspace
                showWorkspace();
            } else {
                // Show built-in workspace as fallback
                showWorkspace();
            }
        }).catch(() => {
            // Show built-in workspace as fallback
            showWorkspace();
        });
    }, 8000);
}

function checkWebappConnection() {
    return fetch('http://localhost:3002/loading', {
        method: 'HEAD',
        mode: 'no-cors'
    })
    .then(() => {
        isWebappConnected = true;
        console.log('Webapp connection successful');
        return true;
    })
    .catch(() => {
        isWebappConnected = false;
        console.log('Webapp connection failed - using built-in workspace');
        return false;
    });
}

function showWorkspace() {
    console.log('Showing workspace...');

    if (loadingContainer && workspaceContainer) {
        loadingContainer.style.display = 'none';
        workspaceContainer.style.display = 'block';
        errorContainer.style.display = 'none';
    }
}

function showError() {
    console.log('Showing error...');

    if (loadingContainer && errorContainer) {
        loadingContainer.style.display = 'none';
        workspaceContainer.style.display = 'none';
        errorContainer.style.display = 'flex';
    }
}

// Global function for retry button
function retryConnection() {
    console.log('Retrying connection...');

    if (errorContainer) {
        errorContainer.style.display = 'none';
    }

    if (loadingContainer) {
        loadingContainer.style.display = 'flex';
    }

    // Restart the loading sequence
    startLoadingSequence();
}

// Desktop API (simplified for Electron Fiddle)
window.desktop = {
    versions: {
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron,
    },

    system: {
        getPlatform: () => process.platform,
        isDevelopment: () => true, // Always true in Electron Fiddle
    },

    notifications: {
        show: (title, body) => {
            console.log('Notification:', title, body);
            // In Electron Fiddle, just log to console
            if (window.electronAPI && window.electronAPI.showNotification) {
                window.electronAPI.showNotification(title, body);
            }
        },
        showSuccess: (title, body) => console.log('✅', title, body),
        showError: (title, body) => console.error('❌', title, body),
        showInfo: (title, body) => console.log('ℹ️', title, body),
        showWarning: (title, body) => console.warn('⚠️', title, body),
    }
};

// Handle messages from main process
if (window.electronAPI) {
    // Listen for navigation commands from main process
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'navigate-to') {
            console.log('Navigation request:', event.data.pathname);
            // Handle navigation within the built-in workspace
            handleNavigation(event.data.pathname);
        }
    });
}

function handleNavigation(pathname) {
    console.log('Handling navigation to:', pathname);

    // For the built-in workspace, we can update content based on the path
    const workspaceTitle = document.querySelector('.workspace-title');
    const workspaceSubtitle = document.querySelector('.workspace-subtitle');

    if (workspaceTitle && workspaceSubtitle) {
        switch(pathname) {
            case '/loading':
                showLoading();
                break;
            case '/workspace':
                workspaceTitle.textContent = 'PSU Rizal Eisenhower Matrix';
                workspaceSubtitle.textContent = 'Productivity Workspace - Organize your tasks by urgency and importance';
                break;
            case '/dashboard':
                workspaceTitle.textContent = 'PSU Rizal Dashboard';
                workspaceSubtitle.textContent = 'Administrative Dashboard - Monitor and manage system activities';
                break;
            default:
                workspaceTitle.textContent = 'PSU Rizal Desktop';
                workspaceSubtitle.textContent = 'Welcome to the PSU Rizal Desktop Application';
        }
    }
}

function showLoading() {
    if (workspaceContainer && loadingContainer) {
        workspaceContainer.style.display = 'none';
        errorContainer.style.display = 'none';
        loadingContainer.style.display = 'flex';

        // Restart loading sequence
        setTimeout(() => {
            showWorkspace();
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Handle any uncaught errors
window.addEventListener('error', (event) => {
    console.error('Renderer error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});