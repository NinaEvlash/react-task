import { describe, expect, it } from 'vitest';
import { pokemonApi } from './api';

describe('pokemonApi', () => {
  it('has correct reducerPath', () => {
    expect(pokemonApi.reducerPath).toBe('pokemonApi');
  });

  it('has correct endpoints defined', () => {
    expect(pokemonApi.endpoints.getPokemonList).toBeDefined();
    expect(pokemonApi.endpoints.getPokemonByName).toBeDefined();
  });
});
