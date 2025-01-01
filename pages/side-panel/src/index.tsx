import { createRoot } from 'react-dom/client';
import '@src/index.css';
import '@radix-ui/themes/styles.css';
import { Routes, Route, HashRouter } from 'react-router';
import { Entry, Home, Calendar, Settings } from '@src/pages';
import BottomNavigation from './components/navigation';
import Layout from './components/layout';
import { Theme } from '@radix-ui/themes';

export type Route = {
  path: string;
  name: string;
  element: React.ReactNode;
  exclude?: boolean; // Exclude from the navigation
};

const routes: Route[] = [
  {
    path: '/',
    name: 'Entry',
    element: <Entry />,
    exclude: true,
  },
  {
    path: '/home',
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

const App: React.FC = () => {
  return (
    <Theme>
      <Layout>
        <HashRouter>
          <Routes>
            {routes.map(route => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
          <BottomNavigation routes={routes} hideOnExclude={true} />
        </HashRouter>
      </Layout>
    </Theme>
  );
};

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }

  const root = createRoot(appContainer);
  root.render(<App />);
}

init();
