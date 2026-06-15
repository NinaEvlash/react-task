import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { getDataByName } from '../../api/dataApi';
import Spinner from '../Spinner/Spinner';
import type { PokemonDetailsResponse } from '../../types/apiTypes';

export default function Details() {
  const params = useParams<{ name?: string }>();
  const name = params.name ?? '';
  const [item, setItem] = useState<PokemonDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!name) {
      return;
    }
    async function fetchData(): Promise<void> {
      try {
        setLoading(true);
        setError(null);

        const data: PokemonDetailsResponse = await getDataByName(name);

        setItem(data);
      } catch {
        setError('Failed to load pokemon');
      } finally {
        setLoading(false);
      }
    }
    void fetchData();
  }, [name]);

  if (loading) {
    {
      return (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spinner />
        </div>
      );
    }
  }
  if (error) {
    return (
      <div className="text-center text-red-500 bg-red-50 border border-red-200 rounded-xl p-4">
        {error}
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
    text-gray-700
    bg-gray-100
    rounded-lg
    hover:bg-gray-200
    transition-colors mt-4"
        onClick={() => void navigate('/')}
      >
        Close
      </button>
    </div>
  );
}
