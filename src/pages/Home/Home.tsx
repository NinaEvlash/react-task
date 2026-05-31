import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useSearchParams, useParams } from 'react-router-dom';

import { useGetPokemonListQuery, useGetPokemonByNameQuery } from '../../store/api';
import SearchBar from '../../components/SearchBar/SearchBar';
import Results from '../../components/Results/Results';
import Pagination from '../../components/Pagination/Pagination';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { validateQuery } from '../../utils/validateQuery';
import SelectedItemsPanel from '../../components/SelectedItemsPanel/SelectedItemsPanel';
import { getErrorMessage } from '../../utils/getErrorMessage';

export interface Pokemon {
  name: string;
  description: string;
}

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams<{ name?: string }>();
  const selectedPokemon: string | null = params.name || null;
  const navigate = useNavigate();
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [query, setQuery] = useLocalStorage('pokemonSearchQuery');

  const page: number = Number(searchParams.get('page') || 1);
  const limit = 20;
  const offset = (page - 1) * limit;

  const {
    data: listData,
    isLoading: listLoading,
    error: listError,
  } = useGetPokemonListQuery({ limit, offset });

  const normalizedQuery = validateQuery(query) ? query.trim().toLowerCase() : '';

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useGetPokemonByNameQuery(normalizedQuery, {
    skip: !normalizedQuery,
  });

  const results = normalizedQuery
    ? searchData
      ? [
          {
            name: searchData.name,
            description: `Weight: ${searchData.weight}, Height: ${searchData.height}`,
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

  const hasNextPage = (listData?.count ?? 0) > offset + limit;

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
    navigate('/');
  };

  const setPage = (newPage: number): void => {
    const params: URLSearchParams = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
  };

  if (fatalError) {
    throw new Error(fatalError);
  }

  const handleSelectPokemon = (name: string): void => {
    const params: URLSearchParams = new URLSearchParams(searchParams);
    params.delete('details');
    params.set('page', String(page));

    navigate(`/details/${name}${params.toString() ? `?${params.toString()}` : ''}`);
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

        {!loading && !query && results.length > 0 && (
          <Pagination page={page} hasNextPage={hasNextPage} onPageChange={setPage} />
        )}

        <section className="flex justify-center">
          <button
            type="button"
            onClick={() => setFatalError('Manual test error')}
            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
          >
            Trigger Error
          </button>
        </section>
        <SelectedItemsPanel />
      </div>
    </main>
  );
}
