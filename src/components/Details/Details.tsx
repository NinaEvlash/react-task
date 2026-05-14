import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getDataDetails } from '../../api/dataApi';
import Spinner from '../Spinner/Spinner';
import { PokemonDetails } from '../../types/pokemon';

export default function Details() {
  const [item, setItem] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { name } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        if (!name) return;

        const data: PokemonDetails = await getDataDetails(name);

        setItem(data);
      } catch {
        setError('Failed to load pokemon');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [name]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner />
      </div>
    );
  if (error) {
    return (
      <div className="text-center text-red-500 bg-red-50 border border-red-200 rounded-xl p-4">
        {error}
      </div>
    );
  }
  if (!item) return null;

  return (
    <div className="flex flex-col items-center">
      <img src={item.sprites.front_default} alt={item.name} className="w-40 h-40" />

      <h2 className="text-2xl font-bold capitalize mb-4">{item.name}</h2>

      <p>Height: {item.height}</p>
      <p>Weight: {item.weight}</p>
      <p>Types: {item.types.map((t) => t.type.name).join(', ')}</p>
      <button
        className="inline-flex items-center
    px-3 py-1.5
    text-sm font-medium
    text-gray-700
    bg-gray-100
    rounded-lg
    hover:bg-gray-200
    transition-colors mt-4"
        onClick={() => navigate('/')}
      >
        Close
      </button>
    </div>
  );
}
