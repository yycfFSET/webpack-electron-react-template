import { ipcRenderer } from 'electron';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Modal from 'src/workbench/electron-renderer/components/modal';
// 渲染进程监听渲染事件
document.body.innerHTML = `<div id="root"></div>`;
const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

const modalWindows = {
  ModalEditor: Modal
};
root.render(React.createElement(modalWindows['ModalEditor'], {}));
