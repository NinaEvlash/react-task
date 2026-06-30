'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import { usePathname, useRouter } from '@/i18n/navigation';

import type { Pokemon } from '@/types/apiTypes';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleItem } from '@/features/selectedItem/selectedItemSlice';

type Props = {
  item: Pokemon;
};

export default function ResultsItem({ item }: Props) {
  const t = useTranslations('Details');

  const dispatch = useAppDispatch();

  const selectedItems = useAppSelector(
    (state) => state.selectedItem.items,
  );

  const isSelected = selectedItems.some(
    (selectedItem) => selectedItem.name === item.name,
  );

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleDetailsClick = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('selected', item.name);

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div
      className="
        p-4 rounded-xl shadow-sm border
        bg-white dark:bg-gray-800
        border-gray-200 dark:border-gray-700
        hover:shadow-md transition
      "
    >
      <div className="flex items-center gap-3 mb-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() =>
            dispatch(
              toggleItem({
                name: item.name,
                description: item.description,
              }),
            )
          }
        />

        <strong className="text-lg font-semibold">
          {item.name}
        </strong>
      </div>

      <p className="mb-4">{item.description}</p>

      <button
        type="button"
        onClick={handleDetailsClick}
        className="
          cursor-pointer
          inline-flex items-center
          px-3 py-1.5
          text-sm font-medium
          bg-gray-100
          rounded-lg
          hover:bg-gray-200
        "
      >
        {t('detailsButton')}
      </button>
    </div>
  );
}