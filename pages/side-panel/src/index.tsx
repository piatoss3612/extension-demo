import { createRoot } from 'react-dom/client';
import '@src/index.css';
import { Routes, Route, HashRouter } from 'react-router';
import { Home, Calendar, Settings } from '@src/pages';
import BottomNavigation from './components/navigation';
import Layout from './components/layout';

const routes = [
  {
    path: '/',
    name: 'Home',
    element: <Home />,
  },
  {
    path: '/calendar',
    name: 'Calender',
    element: <Calendar />,
  },
  {
    path: '/settings',
    name: 'Settings',
    element: <Settings />,
  },
];

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);
  root.render(
    <Layout>
      <HashRouter>
        <Routes>
          {routes.map(route => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
        <BottomNavigation routes={routes} />
      </HashRouter>
    </Layout>,
  );
}

init();
