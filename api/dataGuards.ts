import type {
  PokemonDetailsResponse,
  PokemonListResponse,
  PokemonType,
  PokemonTypeInfo,
} from '../types/apiTypes';

export const HTTP_NOT_FOUND = 404;
export const HTTP_SERVER_ERROR = 500;

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

export function isPokemonDetailsResponse(
  value: unknown,
): value is PokemonDetailsResponse {
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

  return (
    isString(value.name) && isNumber(value.weight) && isNumber(value.height)
  );
}

function isPokemonListResult(value: unknown): value is PokemonType {
  if (!isObject(value)) {
    return false;
  }

  return (
    isString(value.name) && (value.url === undefined || isString(value.url))
  );
}

export function isPokemonListResponse(
  value: unknown,
): value is PokemonListResponse {
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
    (value.previous === undefined ||
      value.previous === null ||
      isString(value.previous))
  );
}
