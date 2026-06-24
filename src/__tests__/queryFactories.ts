import { vi } from 'vitest';
import type * as api from '../store/api';

export type PokemonQueryResult = ReturnType<typeof api.useGetPokemonByNameQuery>;
export type PokemonListQueryResult = ReturnType<typeof api.useGetPokemonListQuery>;

export function createQueryResult(overrides: Partial<PokemonQueryResult>): PokemonQueryResult {
  return {
    data: undefined,
    error: undefined,
    isLoading: false,
    isFetching: false,
    isSuccess: false,
    isError: false,
    refetch: vi.fn(),
    ...overrides,
  };
}

export function createListQueryResult(
  overrides: Partial<PokemonListQueryResult>,
): PokemonListQueryResult {
  return {
    data: undefined,
    error: undefined,
    isLoading: false,
    isFetching: false,
    isSuccess: false,
    isError: false,
    refetch: vi.fn(),
    ...overrides,
  };
}
