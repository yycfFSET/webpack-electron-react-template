import { FC } from 'react';
import { createRoot } from 'react-dom/client';
import React from 'react';
import './index.scss';
document.body.innerHTML = `<div id="root"></div>`;
const App: FC = () => {
  return <></>;
};
const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

export { App };
