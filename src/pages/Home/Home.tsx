import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useSearchParams, useParams } from 'react-router';

import SearchBar from '../../components/SearchBar/SearchBar';
import Results from '../../components/Results/Results';
import Pagination from '../../components/Pagination/Pagination';
import { getDataByName, getDataList } from '../../api/dataApi';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { validateQuery } from '../../utils/validateQuery';
import SelectedItemsPanel from '../../components/SelectedItemsPanel/SelectedItemsPanel';
import type {
  PokemonDetailsResponse,
  PokemonListResponse,
  PokemonType,
} from '../../types/apiTypes';

export type Pokemon = {
  name: string;
  description: string;
};

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParameter = Number(searchParams.get('page'));

  const page = Number.isInteger(pageParameter) && pageParameter > 0 ? pageParameter : 1;
  const params = useParams<{ name?: string }>();
  const selectedPokemon: string | null = params.name ?? null;
  const navigate = useNavigate();

  const [results, setResults] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fatalError, setFatalError] = useState<string | null>(null);

  const [totalPages, setTotalPages] = useState(1);

  const [query, setQuery] = useLocalStorage('pokemonSearchQuery');

  useEffect(() => {
    if (!searchParams.get('page')) {
      const params: URLSearchParams = new URLSearchParams(searchParams);
      params.set('page', '1');

      setSearchParams(params);
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const normalizedQuery = validateQuery(query);

      setLoading(true);
      setError(null);

      try {
        if (normalizedQuery) {
          const data: PokemonDetailsResponse = await getDataByName(normalizedQuery);

          setResults([
            {
              name: data.name,
              description: `Weight: ${String(data.weight)}, Height: ${String(data.height)}`,
            },
          ]);

          return;
        }

        const limit = 20;
        const offset: number = (page - 1) * limit;

        const data: PokemonListResponse = await getDataList(limit, offset);
        setTotalPages(Math.ceil(data.count / limit));

        const mapped: Pokemon[] = data.results.map((p: PokemonType) => ({
          name: p.name,
          description: `Pokemon named ${p.name}`,
        }));

        setResults(mapped);
      } catch (error_) {
        const errorMessage =
          error_ instanceof Error ? error_.message : 'Network error. Please check your connection.';
        setError(errorMessage);

        if (error_ instanceof Error && error_.message === 'Pokémon not found') {
          setQuery('');
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [query, page, setQuery, searchParams]);

  const handleSearch = (newQuery: string): void => {
    const trimmedQuery = newQuery.trim();
    setQuery(trimmedQuery);

    const params: URLSearchParams = new URLSearchParams();
    params.set('page', '1');

    setSearchParams(params);
    void navigate('/');
  };

  if (fatalError) {
    throw new Error(fatalError);
  }

  const handleSelectPokemon = (name: string): void => {
    const params: URLSearchParams = new URLSearchParams(searchParams);
    params.delete('details');
    params.set('page', String(page));

    void navigate(`/details/${name}${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 pb-24 flex flex-col items-center dark:bg-gray-950">
      <div className="w-full max-w-2xl space-y-6">
        <SearchBar query={query} onSearch={handleSearch} />

        <section className="flex items-start gap-6 mt-6">
          <div className="w-full">
            <Results
              results={results}
              loading={loading}
              error={error}
              onSelect={handleSelectPokemon}
            />
          </div>

          {selectedPokemon && (
            <aside className="w-1/2 sticky top-6 bg-white rounded-2xl shadow-md p-6 bg-white dark:bg-gray-800">
              <Outlet />
            </aside>
          )}
        </section>

        {!loading && !query && results.length > 0 && <Pagination totalPages={totalPages} />}

        <section className="flex justify-center">
          <button
            type="button"
            onClick={() => setFatalError('Manual test error')}
            className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
          >
            Trigger Error
          </button>
        </section>
        <SelectedItemsPanel />
      </div>
    </main>
  );
}
