import { useNavigate, useParams, useLocation } from 'react-router';

import { useGetPokemonByNameQuery } from '../../store/api';
import Spinner from '../Spinner/Spinner';
import type { PokemonDetailsResponse } from '../../types/apiTypes';
import { getErrorMessage } from '../../utils/getErrorMessage';

export default function Details() {
  const params = useParams<{ name: string }>();
  const name: string = params.name ?? '';
  const location = useLocation();
  const navigate = useNavigate();

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useGetPokemonByNameQuery(name, {
    skip: !name,
  });

  const item: PokemonDetailsResponse | undefined = searchData;
  const loading = searchLoading;
  const errorMessage: string = getErrorMessage(searchError);

  if (loading) {
    {
      return (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spinner />
        </div>
      );
    }
  }
  if (errorMessage) {
    return (
      <div className="text-center text-red-500 bg-red-50 border border-red-200 rounded-xl p-4">
        {errorMessage}
      </div>
    );
  }
  if (!item) {
    return null;
  }

  return (
    <div className="flex flex-col items-center">
      <img
        src={item.sprites.front_default ?? '/placeholder.png'}
        alt={`Sprite of ${item.name}`}
        className="w-40 h-40"
      />

      <h2 className="text-2xl font-bold capitalize mb-4">{item.name}</h2>

      <p>Height: {item.height}</p>
      <p>Weight: {item.weight}</p>
      <p>Types: {item.types.map((t) => t.type.name).join(', ')}</p>
      <button
        type="button"
        className="cursor-pointer inline-flex items-center
    px-3 py-1.5
    text-sm font-medium
    text-gray-700 dark:text-gray-300
    bg-gray-100 dark:bg-gray-700
    rounded-lg
    hover:bg-gray-200 dark:hover:bg-gray-600
    transition-colors mt-4"
        onClick={() => void navigate(`/${location.search}`)}
      >
        Close
      </button>
    </div>
  );
}
