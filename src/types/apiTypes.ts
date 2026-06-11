export interface PokemonType {
  name: string;
  url?: string;
}

export interface PokemonListResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: PokemonType[];
}
export interface PokemonTypeInfo {
  type: PokemonType;
}

export interface PokemonDetailsResponse {
  name: string;
  weight: number;
  height: number;
  sprites: {
    front_default: string | null;
  };
  types: PokemonTypeInfo[];
}
