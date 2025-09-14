const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow = null;

function createWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'electron-fiddle-preload.js')
        },
        title: 'PSU Rizal Desktop - Electron Fiddle',
        icon: null // Add icon path if available
    });

    // Load the HTML file
    mainWindow.loadFile('electron-fiddle-index.html');

    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Create application menu
    createMenu();
}

function createMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open DevTools',
                    accelerator: 'CmdOrCtrl+I',
                    click: () => {
                        if (mainWindow) mainWindow.webContents.openDevTools();
                    }
                },
                { type: 'separator' },
                { role: 'reload' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        },
        {
            label: 'Navigate',
            submenu: [
                {
                    label: 'Loading Page',
                    click: () => navigateTo('/loading')
                },
                {
                    label: 'Workspace',
                    click: () => navigateTo('/workspace')
                },
                {
                    label: 'Dashboard',
                    click: () => navigateTo('/dashboard')
                }
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'About',
                    click: () => {
                        require('electron').dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'About PSU Rizal Desktop',
                            message: 'PSU Rizal Desktop Application',
                            detail: 'Built with Electron and Next.js\nRunning in Electron Fiddle'
                        });
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

function navigateTo(pathname) {
    if (mainWindow) {
        // Send navigation command to renderer
        mainWindow.webContents.send('navigate-to', pathname);
    }
}

// App event handlers
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// Security: Prevent navigation to external websites
app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);

        if (parsedUrl.origin !== 'http://localhost:3002') {
            event.preventDefault();
            require('electron').shell.openExternal(navigationUrl);
        }
    });
});