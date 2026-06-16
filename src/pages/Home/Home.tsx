import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useSearchParams, useParams } from 'react-router';

import { useGetPokemonListQuery, useGetPokemonByNameQuery } from '../../store/api';
import SearchBar from '../../components/SearchBar/SearchBar';
import Results from '../../components/Results/Results';
import Pagination from '../../components/Pagination/Pagination';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { validateQuery } from '../../utils/validateQuery';
import SelectedItemsPanel from '../../components/SelectedItemsPanel/SelectedItemsPanel';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { useDispatch } from 'react-redux';
import { pokemonApi } from '../../store/api';

export type Pokemon = {
  name: string;
  description: string;
};

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams<{ name?: string }>();
  const selectedPokemon: string | null = params.name ?? null;
  const navigate = useNavigate();
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [query, setQuery] = useLocalStorage('pokemonSearchQuery');
  const dispatch = useDispatch();

  const page = Number(searchParams.get('page') ?? 1);
  const limit = 20;
  const offset = (page - 1) * limit;

  const {
    data: listData,
    isLoading: listLoading,
    error: listError,
  } = useGetPokemonListQuery({ limit, offset });

  const totalPages = Math.ceil((listData?.count ?? 0) / limit);

  const normalizedQuery = validateQuery(query) ? query.trim().toLowerCase() : '';

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useGetPokemonByNameQuery(normalizedQuery, {
    skip: !normalizedQuery,
  });

  const results: Pokemon[] = normalizedQuery
    ? searchData
      ? [
          {
            name: searchData.name,
            description: `Weight: ${String(searchData.weight)}, Height: ${String(searchData.height)}`,
          },
        ]
      : []
    : (listData?.results.map((p) => ({
        name: p.name,
        description: `Pokemon named ${p.name}`,
      })) ?? []);

  const loading = normalizedQuery ? searchLoading : listLoading;

  const activeError = normalizedQuery ? searchError : listError;

  const errorMessage = getErrorMessage(activeError);

  useEffect(() => {
    if (!searchParams.get('page')) {
      const params: URLSearchParams = new URLSearchParams(searchParams);
      params.set('page', '1');

      setSearchParams(params);
    }
  }, [searchParams, setSearchParams]);

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

  const handleRefresh = (): void => {
    const tags: ('PokemonList' | { type: 'Pokemon'; id: string })[] = ['PokemonList'];

    if (selectedPokemon) {
      tags.push({
        type: 'Pokemon',
        id: selectedPokemon,
      });
    }

    dispatch(pokemonApi.util.invalidateTags(tags));
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
              error={errorMessage}
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

        <section className="flex justify-between items-center">
          <button
            type="button"
            onClick={handleRefresh}
            className="
      px-4 py-2
      rounded-xl
      bg-blue-500
      text-white
      hover:bg-blue-600
      dark:bg-blue-600
      dark:hover:bg-blue-700
      transition-colors
    "
          >
            Refresh
          </button>

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
