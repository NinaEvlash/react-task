'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetPokemonListQuery, useGetPokemonByNameQuery } from '../../store/api';
import SearchBar from '../../components/SearchBar/SearchBar';
import Results from '../../components/Results/Results';
import Pagination from '../../components/Pagination/Pagination';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { validateQuery } from '../../utils/validateQuery';
import SelectedItemsPanel from '../../components/SelectedItemsPanel/SelectedItemsPanel';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { Pokemon } from '@/types/apiTypes';

export default function Home() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useLocalStorage('pokemonSearchQuery');

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
    router.replace(`/${locale}?page=1`);
  }
}, [searchParams, router, locale]);

  const handleSearch = (newQuery: string): void => {
    const trimmedQuery = newQuery.trim();
    setQuery(trimmedQuery);

    router.push(`/${locale}?page=1`);
  };

  const handleSelectPokemon = (name: string): void => {
    router.push(`/${locale}/pokemon/${name}`);
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
        </section>

        {!loading && !query && results.length > 0 && <Pagination totalPages={totalPages} />}

        <SelectedItemsPanel />
      </div>
    </main>
  );
}
