import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearItems } from '../../features/selectedItem/selectedItemSlice';

export default function SelectedItemsPanel() {
  const dispatch = useAppDispatch();

  const selectedItems = useAppSelector((state) => state.selectedItem.items);

  if (selectedItems.length === 0) {
    return null;
  }

  const handleDownload = (): void => {
    const headers: string[] = ['Name', 'Description', 'Details URL'];

    const rows: string[][] = selectedItems.map((item) => [
      item.name,
      item.description,
      `/details/${item.name}`,
    ]);

    const csvContent: string = [headers.join(','), ...rows.map((row) => row.join(', '))].join('\n');

    const blob: Blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url: string = URL.createObjectURL(blob);

    const link: HTMLAnchorElement = document.createElement('a');

    link.href = url;

    link.download = `${String(selectedItems.length)}_items.csv`;

    document.body.append(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
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
      <p className="font-medium">Selected items: {selectedItems.length}</p>

      <div className="flex gap-3">
        <button
          onClick={() => dispatch(clearItems())}
          className="
            px-4 py-2 rounded-lg
            bg-gray-200 dark:bg-gray-700
          "
        >
          Clear all
        </button>

        <button
          onClick={handleDownload}
          className="
            px-4 py-2 rounded-lg
            bg-blue-500 text-white
          "
        >
          Download
        </button>
      </div>
    </div>
  );
}
