import React, { FC } from 'react';
import { Button } from 'antd';
import { CloseOutlined, MinusOutlined } from '@ant-design/icons';
import '../index.scss';
import { ipcRenderer } from 'electron';

const Modal: FC = () => {
  const onMini = () => {
    ipcRenderer.send('miniModalWin', 'a', 'b');
  };
  const onClose = async () => {
    let res = await ipcRenderer.invoke('closeModalWin');
    console.log(res);
  };
  return (
    <>
      <div className="d-flex container">
        <div className="windowActionWrap">
          <div className="window-left"></div>
          <div className="window-right">
            <Button type="text" icon={<MinusOutlined />} onClick={onMini}></Button>
            <Button type="text" icon={<CloseOutlined />} onClick={onClose}></Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Modal;
