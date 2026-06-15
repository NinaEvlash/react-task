export type PokemonType = {
  name: string;
  url?: string;
};

export type PokemonListResponse = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: PokemonType[];
};
export type PokemonTypeInfo = {
  type: PokemonType;
};

export type PokemonDetailsResponse = {
  name: string;
  weight: number;
  height: number;
  sprites: {
    front_default: string | null;
  };
  types: PokemonTypeInfo[];
};
