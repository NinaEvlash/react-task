import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { PokemonDetailsResponse, PokemonListResponse } from '../types/apiTypes';

const cacheTTL = Number(import.meta.env.VITE_POKEMON_CACHE_TTL ?? 300);

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  tagTypes: ['Pokemon', 'PokemonList'],
  endpoints: (builder) => ({
    getPokemonList: builder.query<PokemonListResponse, { limit: number; offset: number }>({
      query: ({ limit, offset }) => `pokemon?limit=${limit}&offset=${offset}`,

      keepUnusedDataFor: cacheTTL,

      providesTags: (_result) => (_result ? ['PokemonList'] : []),
    }),

    getPokemonByName: builder.query<PokemonDetailsResponse, string>({
      query: (name: string) => `pokemon/${name}`,

      keepUnusedDataFor: cacheTTL,

      providesTags: (_result, _error, name) => [{ type: 'Pokemon', id: name }],
    }),
  }),
});

export const { useGetPokemonListQuery, useGetPokemonByNameQuery } = pokemonApi;
