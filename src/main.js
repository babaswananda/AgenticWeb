const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const Store = require('electron-store');

// Initialize electron store for settings
const store = new Store();

class AgenticWebDesktop {
  constructor() {
    this.mainWindow = null;
    this.isDevMode = process.argv.includes('--dev');
    
    // Set up app event listeners
    this.setupAppEvents();
    this.setupIpcHandlers();
  }

  setupAppEvents() {
    app.whenReady().then(() => {
      this.createMainWindow();
      this.createMenu();
      
      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createMainWindow();
        }
      });
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }

  createMainWindow() {
    // Get stored window bounds or use defaults
    const windowBounds = store.get('windowBounds', {
      width: 1400,
      height: 900,
      x: undefined,
      y: undefined
    });

    this.mainWindow = new BrowserWindow({
      ...windowBounds,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, 'preload.js'),
        webSecurity: true,
      },
      titleBarStyle: 'hiddenInset',
      show: false,
      icon: path.join(__dirname, '../assets/icon.png'),
    });

    // Load the app
    if (this.isDevMode) {
      this.mainWindow.loadURL('http://localhost:3000');
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow.show();
      
      if (this.isDevMode) {
        this.mainWindow.webContents.openDevTools();
      }
    });

    // Save window bounds on close
    this.mainWindow.on('close', () => {
      store.set('windowBounds', this.mainWindow.getBounds());
    });

    // Handle external links
    this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: 'deny' };
    });
  }

  createMenu() {
    const template = [
      {
        label: 'Agentic Web',
        submenu: [
          {
            label: 'About Agentic Web',
            click: () => this.showAbout()
          },
          { type: 'separator' },
          {
            label: 'Preferences...',
            accelerator: 'CmdOrCtrl+,',
            click: () => this.showPreferences()
          },
          { type: 'separator' },
          {
            label: 'Quit',
            accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
            click: () => app.quit()
          }
        ]
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: () => this.mainWindow.reload()
          },
          {
            label: 'Force Reload',
            accelerator: 'CmdOrCtrl+Shift+R',
            click: () => this.mainWindow.webContents.reloadIgnoringCache()
          },
          {
            label: 'Toggle Developer Tools',
            accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
            click: () => this.mainWindow.webContents.toggleDevTools()
          },
          { type: 'separator' },
          {
            label: 'Actual Size',
            accelerator: 'CmdOrCtrl+0',
            click: () => this.mainWindow.webContents.setZoomLevel(0)
          },
          {
            label: 'Zoom In',
            accelerator: 'CmdOrCtrl+Plus',
            click: () => {
              const currentZoom = this.mainWindow.webContents.getZoomLevel();
              this.mainWindow.webContents.setZoomLevel(currentZoom + 1);
            }
          },
          {
            label: 'Zoom Out',
            accelerator: 'CmdOrCtrl+-',
            click: () => {
              const currentZoom = this.mainWindow.webContents.getZoomLevel();
              this.mainWindow.webContents.setZoomLevel(currentZoom - 1);
            }
          },
          { type: 'separator' },
          {
            label: 'Toggle Fullscreen',
            accelerator: process.platform === 'darwin' ? 'Ctrl+Cmd+F' : 'F11',
            click: () => {
              const isFullScreen = this.mainWindow.isFullScreen();
              this.mainWindow.setFullScreen(!isFullScreen);
            }
          }
        ]
      },
      {
        label: 'Protocol',
        submenu: [
          {
            label: 'Initialize Protocol',
            accelerator: 'CmdOrCtrl+I',
            click: () => this.initializeProtocol()
          },
          {
            label: 'Parse Website',
            accelerator: 'CmdOrCtrl+P',
            click: () => this.parseWebsite()
          },
          { type: 'separator' },
          {
            label: 'Offline Mode',
            type: 'checkbox',
            checked: store.get('offlineMode', false),
            click: (menuItem) => {
              store.set('offlineMode', menuItem.checked);
              this.mainWindow.webContents.send('offline-mode-changed', menuItem.checked);
            }
          }
        ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Documentation',
            click: () => shell.openExternal('https://docs.agenticweb.com')
          },
          {
            label: 'Protocol Whitepaper',
            click: () => shell.openExternal('https://agenticweb.com/whitepaper')
          },
          { type: 'separator' },
          {
            label: 'Report Issue',
            click: () => shell.openExternal('https://github.com/agentic-web/issues')
          }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  setupIpcHandlers() {
    // Handle settings
    ipcMain.handle('get-setting', (event, key, defaultValue) => {
      return store.get(key, defaultValue);
    });

    ipcMain.handle('set-setting', (event, key, value) => {
      store.set(key, value);
      return true;
    });

    // Handle file operations
    ipcMain.handle('show-save-dialog', async (event, options) => {
      const result = await dialog.showSaveDialog(this.mainWindow, options);
      return result;
    });

    ipcMain.handle('show-open-dialog', async (event, options) => {
      const result = await dialog.showOpenDialog(this.mainWindow, options);
      return result;
    });

    // Handle external links
    ipcMain.handle('open-external', (event, url) => {
      shell.openExternal(url);
    });
  }

  showAbout() {
    dialog.showMessageBox(this.mainWindow, {
      type: 'info',
      title: 'About Agentic Web',
      message: 'Agentic Web Desktop',
      detail: `Version: ${app.getVersion()}\n\nProtocol-native AI infrastructure for the new internet.\n\nBuilt with Electron and powered by the Chat Stream Engine.`,
      buttons: ['OK']
    });
  }

  showPreferences() {
    // Create preferences window
    const prefsWindow = new BrowserWindow({
      width: 600,
      height: 400,
      parent: this.mainWindow,
      modal: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      }
    });

    prefsWindow.loadFile(path.join(__dirname, '../renderer/preferences.html'));
  }

  initializeProtocol() {
    this.mainWindow.webContents.send('initialize-protocol');
  }

  async parseWebsite() {
    const result = await dialog.showMessageBox(this.mainWindow, {
      type: 'question',
      title: 'Parse Website',
      message: 'Enter website URL to parse:',
      detail: 'This will convert the website into a conversational scroll experience.',
      buttons: ['Cancel', 'Parse'],
      defaultId: 1
    });

    if (result.response === 1) {
      // In a real implementation, you would show an input dialog
      // For now, we'll send a message to the renderer
      this.mainWindow.webContents.send('parse-website-request');
    }
  }
}

// Initialize the app
new AgenticWebDesktop();
