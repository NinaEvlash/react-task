import { NavLink } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm px-6 py-4">
      <div className="flex gap-6">
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
      </div>
    </nav>
  );
}
