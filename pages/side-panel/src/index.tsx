import { createRoot } from 'react-dom/client';
import '@src/index.css';
import { Routes, Route, HashRouter } from 'react-router';
import Home from '@src/Home';
import Settings from './Settings';
import Notification from './Notification';

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);
  root.render(
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </HashRouter>,
  );
}

init();
