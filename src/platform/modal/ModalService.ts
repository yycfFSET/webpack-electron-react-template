import { BrowserWindow, app } from 'electron';
import { injectable, useService } from 'src/base/common/injector';
import isDev from 'electron-is-dev';
import path from 'path';
import EnvironmentService from './environment/common/EnvironmentService';
const environmentService = useService(EnvironmentService);
const modalHTML = `file://${path.resolve(__dirname, 'modal.html')}`;

@injectable()
export default class ModalService {
  modalWindow: BrowserWindow | null = null;
  constructor() {
    // 初始化生成待命的窗口
    app.on('ready', () => this.generateModalWindow());
  }
  generateModalWindow() {
    this.modalWindow = new BrowserWindow({
      resizable: false,
      width: 600,
      height: 400,
      show: false,
      webPreferences: {
        webSecurity: false,
        devTools: true,
        nodeIntegration: true,
        contextIsolation: false
      },
      frame: false
    });
    environmentService.globalWindowIds.malWindowId = this.modalWindow.webContents.id;
    // 提前加载modalHtml等待渲染
    if (isDev) {
      this.modalWindow.loadURL('http://localhost:8080/modal.html');
    } else {
      this.modalWindow.loadURL(modalHTML);
    }
  }
}
