import { useNavigate, useSearchParams } from 'react-router';

import Spinner from '../Spinner/Spinner';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleItem } from '../../features/selectedItem/selectedItemSlice';
import type { Pokemon } from '../../types/apiTypes';

type ResultsProps = {
  results: Pokemon[];
  loading: boolean;
  error: string | null;
};

export default function Results({ results, loading, error }: ResultsProps) {
  const selected = useAppSelector((state) => state.selectedItem.items);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get('page') ?? '1');
  if (loading) {
    return <Spinner />;
  }
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
  if (!results.length) {
    return <p>No results found.</p>;
  }

  const handleSelectPokemon = (name: string): void => {
    const params = new URLSearchParams(searchParams);

    params.set('page', String(page));

    void navigate(`/details/${name}${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="space-y-4 flex-1">
      {results.map((item) => (
        <div
          key={item.name}
          className="
            p-4 rounded-xl shadow-sm
            border border-gray-200 
            bg-white dark:bg-gray-800 
            border-gray-200 
            dark:border-gray-700 
            hover:shadow-md transition
          "
        >
          <input
            type="checkbox"
            checked={selected.some((selectedItem) => selectedItem.name === item.name)}
            onChange={() =>
              dispatch(
                toggleItem({
                  name: item.name,
                  description: item.description,
                }),
              )
            }
          />

          <strong className="mb-2 block text-lg font-semibold text-gray-800 dark:text-gray-100">
            {item.name}
          </strong>

          <p className="mb-2">{item.description}</p>

          <button
            type="button"
            onClick={() => handleSelectPokemon(item.name)}
            className="
              cursor-pointer
              inline-flex items-center
              px-3 py-1.5
              text-sm font-medium
              text-gray-700
              bg-gray-100
              rounded-lg
              hover:bg-gray-200
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
