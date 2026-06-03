import { PokemonDetailsResponse, PokemonListResponse } from '../types/apiTypes';

export async function getDataByName(name: string): Promise<PokemonDetailsResponse> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Pokémon not found');
    }

    if (response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }

    throw new Error('Something went wrong');
  }

  return response.json();
}

export async function getDataList(limit: number, offset: number): Promise<PokemonListResponse> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);

  if (!response.ok) {
    if (response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }

    throw new Error('Failed to load Pokémon list');
  }

  return response.json();
}
