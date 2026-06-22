import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearItems } from '../../features/selectedItem/selectedItemSlice';
import { useTranslations } from 'next-intl';

export default function SelectedItemsPanel() {
  const t = useTranslations('SelectedItems');
  const dispatch = useAppDispatch();

  const selectedItems = useAppSelector((state) => state.selectedItem.items);

  if (selectedItems.length === 0) {
    return null;
  }

  const handleDownload = async () => {
  const res = await fetch('/api/export-csv', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items: selectedItems }),
  });

  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `${selectedItems.length}_items.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};

  return (
    <div
      className="
        fixed bottom-0 left-0 w-full
        bg-white dark:bg-gray-900
        border-t border-gray-200 dark:border-gray-700
        shadow-lg
        px-6 py-4
        flex items-center justify-between
        z-50
      "
    >
      <p className="font-medium">{t('items')}: {selectedItems.length}</p>

      <div className="flex gap-3">
        <button
          onClick={() => dispatch(clearItems())}
          className="
            px-4 py-2 rounded-lg
            bg-gray-200 dark:bg-gray-700
          "
        >
          {t('clearButton')}
        </button>

        <button
          onClick={handleDownload}
          className="
            px-4 py-2 rounded-lg
            bg-blue-500 text-white
          "
        >
          {t('downloadButton')}
        </button>
      </div>
    </div>
  );
}
