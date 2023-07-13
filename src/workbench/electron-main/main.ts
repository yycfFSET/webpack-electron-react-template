import { app, BrowserWindow, App } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
let mainWindow: BrowserWindow | null = null;
const webFile = `file://${path.join(__dirname, 'index.html')}`;

/**
 * 程序单例运行
 */
const requestSingleInstance = (app: App) => {
  const getTheLock = app.requestSingleInstanceLock();
  if (!getTheLock) {
    app.quit();
  } else {
  }
};

requestSingleInstance(app);
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
// 禁用硬件加速 解决win7旗舰版电脑安装 RPA软件后，打开软件界面无法正常显示。
// see https://github.com/electron/electron/issues/28164
// https://github.com/electron/electron/issues/28164
// 如果还是出现白屏/黑屏情况，需要手动添加启动参数   --disable-software-rasterizer
// 以下设置在electron个别版本不生效
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-software-rasterizer');

app.on('ready', async () => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 600,
    height: 400,
    minWidth: 600,
    minHeight: 400,
    resizable: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true
    },
    frame: false
  });
  if (isDev) {
    mainWindow.loadURL('http://localhost:8080');
  } else {
    mainWindow.loadURL(webFile);
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show();
  });

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.on('close', () => {
    mainWindow = null;
  });

  /**
   * 单例模式，检测到第二个实例时
   */
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      if (!mainWindow.isVisible()) mainWindow.show();
      mainWindow.focus();
    }
  });
});

process.on('uncaughtException', (e) => {
  console.error('process on uncaughtException', e);
});
