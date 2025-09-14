// Minimal Electron main process to host the Next.js app as a desktop shell.
// Launches to /auth and provides quick navigation menu items.
const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

const DEFAULT_PORT = process.env.PORT || process.env.NEXT_PORT || 3000;
const WEB_URL = process.env.WEB_URL || `http://localhost:${DEFAULT_PORT}`;

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

  const startUrl = `${WEB_URL}/auth`;
  mainWindow.loadURL(startUrl);

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
        { label: 'Dashboard (Admin)', click: () => navigate('/dashboard?role=admin') },
        { label: 'Dashboard (Student)', click: () => navigate('/dashboard?role=student') },
        { label: 'Dashboard (Faculty)', click: () => navigate('/dashboard?role=faculty') },
        { type: 'separator' },
        { label: 'Workspace', click: () => navigate('/demo') },
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

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createMainWindow();
});
