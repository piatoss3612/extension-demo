import React from 'react';
import { NavLink } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBell, faCog } from '@fortawesome/free-solid-svg-icons';

const BottomNav = () => {
  const routes = [
    {
      path: '/',
      name: 'Home',
      icon: faHome,
    },
    {
      path: '/notification',
      name: 'Notification',
      icon: faBell,
    },
    {
      path: '/settings',
      name: 'Settings',
      icon: faCog,
    },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-gray-900 text-white shadow-lg">
      <ul className="flex justify-around">
        {routes.map(route => (
          <li key={route.path} className="flex-1 text-center">
            <NavLink
              to={route.path}
              className="flex flex-col items-center py-3 transition-colors duration-300 hover:bg-gray-700">
              <FontAwesomeIcon icon={route.icon} className="mb-1 text-xl" />
              <span className="text-sm">{route.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNav;
