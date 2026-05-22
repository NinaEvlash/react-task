import Spinner from '../Spinner/Spinner';
import { ResultsProps } from '../../types/results';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleItem } from '../../features/selectedItem/selectedItemSlice';

export default function Results({ results, loading, error, onSelect }: ResultsProps) {
  const selected = useAppSelector((state) => state.selectedItem.items);
  const dispatch = useAppDispatch();
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner />
      </div>
    );
  if (error) {
    return (
      <div
        className="
        text-center
        bg-red-50 dark:bg-red-950
        text-red-700 dark:text-red-200
        border border-red-
        200 dark:border-red-800
        rounded-xl
        p-4"
      >
        {error}
      </div>
    );
  }
  if (!results.length) return <p>No results found.</p>;

  return (
    <div className="space-y-4">
      {results.map((item) => (
        <div
          key={item.name}
          className="
          p-4 rounded-xl shadow-sm border border-gray-200 
          bg-white dark:bg-gray-800 
          border-gray-200 dark:border-gray-700 
          hover:shadow-md transition"
        >
          <input
            type="checkbox"
            checked={selected.includes(item.name)}
            onChange={() => dispatch(toggleItem(item.name))}
          />
          <strong className="block text-lg font-semibold text-gray-800 dark:text-gray-100">
            {item.name}
          </strong>

          <p className=" mb-4 border-gray-200 dark:border-gray-700">{item.description}</p>

          <button
            onClick={() => onSelect(item.name)}
            className="inline-flex items-center
    px-3 py-1.5
    text-sm font-medium
    text-gray-700 dark:text-gray-300
    bg-gray-100 dark:bg-gray-700
    rounded-lg
    hover:bg-gray-200 dark:hover:bg-gray-600
    transition-colors
    "
          >
            Details
          </button>
        </div>
      ))}
    </div>
  );
}
