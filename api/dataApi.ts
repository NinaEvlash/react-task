import { isPokemonDetailsResponse, isPokemonListResponse } from './dataGuards';
import { HTTP_NOT_FOUND, HTTP_SERVER_ERROR } from './dataGuards';
import type { PokemonDetailsResponse, PokemonListResponse } from '../types/apiTypes';

export async function getDataByName(name: string): Promise<PokemonDetailsResponse> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`);

  if (!response.ok) {
    if (response.status === HTTP_NOT_FOUND) {
      throw new Error('Pokémon not found');
    }

    if (response.status >= HTTP_SERVER_ERROR) {
      throw new Error('Server error. Please try again later.');
    }

    throw new Error('Something went wrong');
  }

  const data: unknown = await response.json();

  if (!isPokemonDetailsResponse(data)) {
    throw new Error('Invalid Pokémon response');
  }

  return data;
}

export async function getDataList(limit: number, offset: number): Promise<PokemonListResponse> {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${String(limit)}&offset=${String(offset)}`,
  );

  if (!response.ok) {
    if (response.status >= HTTP_SERVER_ERROR) {
      throw new Error('Server error. Please try again later.');
    }

    throw new Error('Failed to load Pokémon list');
  }

  const data: unknown = await response.json();

  if (!isPokemonListResponse(data)) {
    throw new Error('Invalid Pokémon list response');
  }

  return data;
}