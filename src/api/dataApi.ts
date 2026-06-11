import {
  PokemonDetailsResponse,
  PokemonListResponse,
  PokemonType,
  PokemonTypeInfo,
} from '../types/apiTypes';

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string';
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPokemonTypeInfo(value: unknown): value is PokemonTypeInfo {
  if (!isObject(value)) {
    return false;
  }

  const type = value.type;
  if (!isObject(type)) {
    return false;
  }

  return isString(type.name) && (type.url === undefined || isString(type.url));
}

function isPokemonDetailsResponse(value: unknown): value is PokemonDetailsResponse {
  if (!isObject(value)) {
    return false;
  }

  const sprites = value.sprites;
  if (!isObject(sprites) || !isNullableString(sprites.front_default)) {
    return false;
  }

  const types = value.types;
  if (!Array.isArray(types) || !types.every(isPokemonTypeInfo)) {
    return false;
  }

  return isString(value.name) && isNumber(value.weight) && isNumber(value.height);
}

function isPokemonListResult(value: unknown): value is PokemonType {
  if (!isObject(value)) {
    return false;
  }

  return isString(value.name) && (value.url === undefined || isString(value.url));
}

function isPokemonListResponse(value: unknown): value is PokemonListResponse {
  if (!isObject(value)) {
    return false;
  }

  const results = value.results;
  if (!Array.isArray(results) || !results.every(isPokemonListResult)) {
    return false;
  }

  return (
    isNumber(value.count) &&
    (value.next === undefined || value.next === null || isString(value.next)) &&
    (value.previous === undefined || value.previous === null || isString(value.previous))
  );
}

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

  const data = await response.json();

  if (!isPokemonDetailsResponse(data)) {
    throw new Error('Invalid Pokémon response');
  }

  return data;
}

export async function getDataList(limit: number, offset: number): Promise<PokemonListResponse> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);

  if (!response.ok) {
    if (response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }

    throw new Error('Failed to load Pokémon list');
  }

  const data = await response.json();

  if (!isPokemonListResponse(data)) {
    throw new Error('Invalid Pokémon list response');
  }

  return data;
}
