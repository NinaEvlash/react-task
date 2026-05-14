export interface Pokemon {
  name: string;
  description: string;
}

export interface PokemonDetails {
  name: string;
  weight: number;
  height: number;
  sprites: {
    front_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
}
