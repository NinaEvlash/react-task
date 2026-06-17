"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../hooks/useTheme';

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white shadow-sm flex items-center justify-between px-6 py-4 dark:bg-gray-900">
      <nav className="flex gap-6">
        <Link
          href="/"
          className={
            pathname === '/'
              ? 'text-blue-600 dark:text-blue-400 font-semibold cursor-default'
              : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 transition'
          }
        >
          Home
        </Link>

        <Link
          href="/about"
          className={
            pathname === '/about'
              ? 'text-blue-600 dark:text-blue-400 font-semibold cursor-default'
              : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 transition'
          }
        >
          About
        </Link>
      </nav>

       <button
        type="button"
        onClick={toggleTheme}
        className="
    px-3 py-2
    rounded-lg
    border
    transition-colors
    cursor-pointer

    bg-white
    text-gray-800
    border-gray-300
    hover:bg-gray-100

    dark:bg-gray-800
    dark:text-gray-100
    dark:border-gray-600
    dark:hover:bg-gray-700
  "
      >
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>
    </header>
  );
}