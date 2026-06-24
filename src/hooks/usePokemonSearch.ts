import { useSearchParams } from 'react-router';
import { useGetPokemonListQuery, useGetPokemonByNameQuery } from '../store/api';
import { validateQuery } from '../utils/validateQuery';
import { getErrorMessage } from '../utils/getErrorMessage';
import type { Pokemon } from '../types/apiTypes';

type UsePokemonSearchResult = {
  results: Pokemon[];
  loading: boolean;
  errorMessage: string;
  page: number;
  isSearchMode: boolean;
  totalPages: number;
  handleRefresh: () => void;
};

export function usePokemonSearch(): UsePokemonSearchResult {
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get('page') ?? '1');
  const query = searchParams.get('search') ?? '';

  const normalizedQuery = validateQuery(query) ? query.trim().toLowerCase() : '';

  const limit = 20;
  const offset = (page - 1) * limit;

  const {
    data: listData,
    isLoading: listLoading,
    error: listError,
    refetch,
  } = useGetPokemonListQuery({
    limit,
    offset,
  });

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useGetPokemonByNameQuery(normalizedQuery, {
    skip: !normalizedQuery,
  });

  const isSearchMode = Boolean(normalizedQuery);

  const results: Pokemon[] = isSearchMode
    ? searchData
      ? [
          {
            name: searchData.name,
            description: `Pokemon named ${searchData.name}`,
          },
        ]
      : []
    : (listData?.results.map((p) => ({
        name: p.name,
        description: `Pokemon named ${p.name}`,
      })) ?? []);

  const loading = isSearchMode ? searchLoading : listLoading;
  const activeError = isSearchMode ? searchError : listError;

  const handleRefresh = (): void => {
    void refetch();
  };

  return {
    results,
    loading,
    errorMessage: getErrorMessage(activeError),
    page,
    isSearchMode,
    totalPages: Math.ceil((listData?.count ?? 0) / limit),
    handleRefresh,
  };
}
