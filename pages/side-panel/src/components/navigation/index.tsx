import { NavLink, useLocation } from 'react-router';

type BottomNavigationProps = {
  routes: {
    path: string;
    name: string;
    exclude?: boolean;
  }[];
  hideOnExclude?: boolean;
};

const BottomNavigation = ({ routes, hideOnExclude }: BottomNavigationProps) => {
  const location = useLocation();
  const currentRoute = routes.find(route => location.pathname === route.path);
  const hidden = hideOnExclude && currentRoute?.exclude;

  if (hidden) {
    return null;
  }

  return (
    <nav className="bottom-0 w-full bg-transparent text-black">
      <ul className="flex justify-around rounded-full border bg-white shadow-lg">
        {routes.map((route, i) => {
          if (route.exclude) {
            return null;
          }

          const isActive = location.pathname === route.path;

          return (
            <li key={`{route.path}-${i}`} className="flex-1 text-center">
              <NavLink
                to={route.path}
                className={`flex flex-col items-center rounded-full py-3 transition-colors duration-300 hover:bg-gray-200
                ${isActive ? 'bg-gray-200' : ''}`}>
                <span className="text-sm">{route.name}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNavigation;
