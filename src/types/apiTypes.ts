interface PokemonListResult {
  name: string;
  url?: string;
}

export interface PokemonListResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: PokemonListResult[];
}

interface PokemonTypeInfo {
  type: {
    name: string;
    url?: string;
  };
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
