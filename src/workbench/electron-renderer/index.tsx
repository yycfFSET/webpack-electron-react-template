import { FC } from 'react';
import { createRoot } from 'react-dom/client';
import React from 'react';
import './index.scss';
import { CloseOutlined, MinusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ipcRenderer } from 'electron';
import { useService } from 'src/base/common/injector';
import EnvironmentService from 'src/platform/modal/environment/common/EnvironmentService';
document.body.innerHTML = `<div id="root"></div>`;

const environmentService = useService(EnvironmentService);
const rendererChannel = new BroadcastChannel('renderer-channel');
const pMsg = (msg: string = 'hello modal window') => {
  rendererChannel.postMessage(msg);
};
rendererChannel.onmessage = (e) => {
  alert(e.data);
};

const App: FC = () => {
  const onMini = () => {
    ipcRenderer.send('miniWin', 'a', 'b');
  };
  const onClose = async () => {
    let res = await ipcRenderer.invoke('closeWin', 'c', 'd');
    console.log(res);
  };
  return (
    <div className="d-flex container">
      <div className="windowActionWrap">
        <div className="window-left"></div>
        <div className="window-right">
          <Button type="text" icon={<MinusOutlined />} onClick={onMini}></Button>
          <Button type="text" icon={<CloseOutlined />} onClick={onClose}></Button>
        </div>
      </div>
      <div className="d-flex container-home">
        <Button type="primary" onClick={() => pMsg()}>
          BroadcastChannel
        </Button>
      </div>
    </div>
  );
};
const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

export { App };
