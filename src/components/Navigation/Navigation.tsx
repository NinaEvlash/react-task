import { NavLink } from 'react-router-dom';

import { useTheme } from '../../hooks/useTheme';

export default function Navigation() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white shadow-sm flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900">
      <nav className="flex gap-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? 'text-blue-600 font-semibold cursor-default'
              : 'text-gray-700 hover:text-blue-600 transition'
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? 'text-blue-600 font-semibold cursor-default'
              : 'text-gray-700 hover:text-blue-600 transition'
          }
        >
          About
        </NavLink>
      </nav>
      <button type="button" onClick={toggleTheme} className="px-3 py-2 rounded-lg border">
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>
    </header>
  );
}
