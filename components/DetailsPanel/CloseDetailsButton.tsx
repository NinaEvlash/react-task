'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';

export default function CloseDetailsButton() {
  const t = useTranslations('Details');
  const locale = useLocale();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete('selected');

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : `/${locale}`;

    router.push(url);
  };

  return (
    <button
      type="button"
      onClick={handleClose}
      className="
        cursor-pointer inline-flex items-center
        px-3 py-1.5
        text-sm font-medium
        text-gray-700 dark:text-gray-300
        bg-gray-100 dark:bg-gray-700
        rounded-lg
        hover:bg-gray-200 dark:hover:bg-gray-600
        transition-colors mt-4
      "
    >
      {t('closeButton')}
    </button>
  );
}
