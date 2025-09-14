// Minimal Electron main process to host the Next.js app as a desktop shell.
// Launches to /auth and provides quick navigation menu items.
const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('path');

const DEFAULT_PORT = process.env.PORT || process.env.NEXT_PORT || 3002;
const WEB_URL = process.env.WEB_URL || `http://localhost:${DEFAULT_PORT}`;
const isDev = !app.isPackaged;

/** @type {BrowserWindow | null} */
let mainWindow = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
    title: 'PSU Rizal — Desktop',
  });

  // Start with loading page
  const startUrl = isDev ? `${WEB_URL}/loading` : `file://${path.join(__dirname, '../webapp/loading.html')}`;
  mainWindow.loadURL(startUrl);
  mainWindow.webContents.openDevTools();

  // Listen for the 'ready-to-navigate' event from the renderer process
  ipcMain.on('ready-to-navigate', (event, pathname) => {
    if (mainWindow) {
      const url = isDev ? `${WEB_URL}${pathname}` : `file://${path.join(__dirname, `../webapp${pathname}.html`)}`;
      mainWindow.loadURL(url);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'Login', click: () => navigate('/auth') },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Navigate',
      submenu: [
        { label: 'Loading Page', click: () => navigate('/loading') },
        { label: 'Workspace', click: () => navigate('/workspace') },
        { type: 'separator' },
        { label: 'Dashboard (Admin)', click: () => navigate('/dashboard?role=admin') },
        { label: 'Dashboard (Student)', click: () => navigate('/dashboard?role=student') },
        { label: 'Dashboard (Faculty)', click: () => navigate('/dashboard?role=faculty') },
        { type: 'separator' },
        { label: 'Demo', click: () => navigate('/demo') },
        { label: 'Meetings', click: () => navigate('/meeting') },
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Open in Browser',
          click: async () => {
            await shell.openExternal(WEB_URL);
          },
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'toggleDevTools' },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function navigate(pathname) {
  if (!mainWindow) return;
  mainWindow.loadURL(`${WEB_URL}${pathname}`);
}

// IPC handlers for file system operations
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths[0];
});

ipcMain.handle('select-file', async (event, filters) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: filters || []
  });
  return result.filePaths[0];
});

ipcMain.handle('save-file', async (event, content, defaultPath, filters) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultPath || '',
    filters: filters || []
  });

  if (!result.canceled) {
    const fs = require('fs').promises;
    await fs.writeFile(result.filePath, content, 'utf8');
    return result.filePath;
  }
  return null;
});

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createMainWindow();
});
