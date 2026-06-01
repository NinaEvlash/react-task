import { describe, it, expect } from 'vitest';
import { pokemonApi, useGetPokemonListQuery, useGetPokemonByNameQuery } from './api';

describe('pokemonApi', () => {
  it('has correct reducerPath', () => {
    expect(pokemonApi.reducerPath).toBe('pokemonApi');
  });

  it('exports hooks', () => {
    expect(useGetPokemonListQuery).toBeDefined();
    expect(useGetPokemonByNameQuery).toBeDefined();
  });

  it('has endpoints configured', () => {
    expect(pokemonApi.endpoints.getPokemonList).toBeDefined();
    expect(pokemonApi.endpoints.getPokemonByName).toBeDefined();
  });
});
