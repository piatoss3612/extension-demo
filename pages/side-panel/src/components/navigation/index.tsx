import { NavLink, useLocation } from 'react-router';

type BottomNavigationProps = {
  routes: {
    path: string;
    name: string;
  }[];
};

const BottomNavigation = ({ routes }: BottomNavigationProps) => {
  const location = useLocation();

  return (
    <nav className="bottom-0 w-full bg-transparent text-black">
      <ul className="flex justify-around rounded-full border bg-white shadow-lg">
        {routes.map((route, i) => {
          // chrome extension에서는 location.pathname을 사용할 수 없습니다.
          // hash router를 사용하고 있기 때문에 window.location.hash를 사용해야 합니다.
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
