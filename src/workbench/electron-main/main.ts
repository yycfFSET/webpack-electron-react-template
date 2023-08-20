import { app, BrowserWindow, App, ipcMain, Notification } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import logger from 'electron-log';
import ModalService from 'src/platform/modal/ModalService';
import { useService } from 'src/base/common/injector';
import EnvironmentService from 'src/platform/modal/environment/common/EnvironmentService';

logger.transports.file.level = 'debug';
logger.transports.console.level = 'debug';
logger.transports.file.maxSize = 1048576 * 20; // 20M,超过20M自动备份成1个.old.log文件
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
    const environmentService = useService(EnvironmentService);
    const modalService = useService(ModalService);
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
      environmentService.globalWindowIds.mainWindowId = mainWindow.webContents.id;
      mainWindow.on('ready-to-show', () => {
        mainWindow!.show();
      });

      if (isDev) {
        // mainWindow.webContents.openDevTools({ mode: 'detach' });
      }

      mainWindow.on('close', () => {
        mainWindow = null;
      });
    });
    ipcMain.on('miniWin', (event, ...args: any[]) => {
      console.log(args);
      if (mainWindow) {
        mainWindow.minimize();
      }
    });
    ipcMain.handle('closeWin', async (event, ...args: any[]) => {
      console.warn('args', args);
      console.log('notification is Supported', Notification.isSupported());
      let res = await new Promise((res, rej) => {
        let notification = new Notification({
          title: '关闭提示',
          body: '确定要关闭嘛？',
          actions: [
            { text: '继续工作', type: 'button' },
            { text: '享受生活', type: 'button' }
          ]
        });
        notification.show();
        notification.on('action', (event, index) => {
          console.log(index, 'action');
          if (index === 0) {
            res('继续工作');
          }
          if (index === 1) {
            res('享受生活');
            mainWindow = null;
            app.quit();
          }
        });
        notification.on('close', (event) => {
          console.log('关闭le');
          res(true);
        });
      });
      return res;
    });
    ipcMain.on('miniModalWin', (event, ...args: any[]) => {
      console.log(args);
      if (modalService.modalWindow) {
        modalService.modalWindow.minimize();
      }
    });

    ipcMain.handle('closeModalWin', async (event, ...args: any[]) => {
      if (modalService.modalWindow) {
        modalService.modalWindow.hide();
      }
    });
    app.on('activate', () => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        if (!mainWindow.isVisible()) mainWindow.show();
        mainWindow.focus();
      }
    });
    ipcMain.handle('windowId', async (event, key) => {
      return environmentService.globalWindowIds[key];
    });
  }
};
requestSingleInstance(app);
logger.info('webpack-electron-temp');
process.on('uncaughtException', (e) => {
  logger.error('process on uncaughtException', e);
});
