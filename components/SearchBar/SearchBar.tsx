'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function SearchBar() {
  const t = useTranslations('Search');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get('search') ?? '';

  const [input, setInput] = useState(query);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    const trimmed = input.trim();

    if (trimmed) {
      params.set('search', trimmed);
    } else {
      params.delete('search');
    }

    params.delete('selected');
    params.set('page', '1');

    router.push(`${pathname}?${params.toString()}`);
  };
  return (
    <section className="flex items-center gap-3 mb-5">
      <label htmlFor="search" className="sr-only">
        {t('placeholder')}
      </label>

      <input
        id="search"
        type="text"
        placeholder={t('placeholder')}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
        className="px-4 py-2 w-64 rounded-xl border border-gray-300
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="button"
        onClick={handleSearch}
        className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
      >
        {t('button')}
      </button>
    </section>
  );
}
