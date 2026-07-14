'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';

type PaginationProps = {
  totalPages: number;
};

export default function Pagination({ totalPages }: PaginationProps) {
  const t = useTranslations('Pagination');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawPage = Number(searchParams.get('page'));
  const currentPage = Number.isNaN(rawPage)
    ? 1
    : Math.min(Math.max(rawPage, 1), totalPages);

  const changePage = (page: number): void => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('page', String(Math.max(1, page)));

    router.replace(`/${locale}?${params.toString()}`);
  };

  return (
    <section aria-label="Pagination" className="flex gap-3 justify-center">
      <button
        type="button"
        aria-label="Go to previous page"
        className="
        cursor-pointer 
        px-4 py-2 
        rounded-lg 
        border border-gray-300 
        bg-white text-gray-700 
        text-sm font-medium 
        transition hover:bg-gray-100 
        disabled:opacity-40 
        disabled:cursor-not-allowed
        "
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
      >
        {t('prevButton')}
      </button>
      <span className="flex items-center text-sm font-medium text-gray-600">
        {t('page')} {currentPage}
      </span>
      <button
        type="button"
        aria-label="Go to next page"
        className="
        cursor-pointer 
        px-4 py-2 
        rounded-lg 
        border border-gray-300 
        bg-white text-gray-700 
        text-sm font-medium 
        transition hover:bg-gray-100
        "
        disabled={currentPage >= totalPages}
        onClick={() => changePage(Math.min(currentPage + 1, totalPages))}
      >
        {t('nextButton')}
      </button>
    </section>
  );
}
