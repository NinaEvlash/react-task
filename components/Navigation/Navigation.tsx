"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useTheme } from '../../hooks/useTheme';
import type {Locale} from '@/i18n/routing';

export default function Navigation() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const t = useTranslations('Navigation');

  const switchLanguage = () => {
    const newLocale: Locale = locale === 'en' ? 'pl' : 'en';

    const cleanPath = pathname.replace(/^\/(en|pl)/, '');

    router.replace(`/${newLocale}${cleanPath}`);

   console.log({
  locale,
  pathname
});
};

  return (
    <header className="bg-white shadow-sm flex items-center justify-between px-6 py-4 dark:bg-gray-900">
      <nav className="flex gap-6">
        <Link
          href={`/${locale}`}
          className={
            pathname === `/${locale}`
              ? 'text-blue-600 dark:text-blue-400 font-semibold cursor-default'
              : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 transition'
          }
        >
          {t('home')}
        </Link>

        <Link
          href={`/${locale}/about`}
          className={
            pathname === `/${locale}/about`
              ? 'text-blue-600 dark:text-blue-400 font-semibold cursor-default'
              : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 transition'
          }
        >
          {t('about')}
        </Link>
      </nav>
      <div>
        <button
  type="button"
  onClick={switchLanguage}
  className="
  px-3 py-2
  mr-5
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
  {locale === 'en' ? 'pl' : 'en'}
</button>

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
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      </div>

      
    </header>
  );
}