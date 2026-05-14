export async function getPokemonByName(name: string) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

  return response;
}

export async function getPokemonList(limit: number, offset: number) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);

  return response.json();
}
