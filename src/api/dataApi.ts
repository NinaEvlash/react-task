export async function getDataByName(name: string) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
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

export async function getDataList(limit: number, offset: number) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);

  if (!response.ok) {
    if (response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }

    throw new Error('Failed to load Pokémon list');
  }

  return response.json();
}

export async function getDataDetails(name: string) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

  if (!response.ok) {
    throw new Error('Failed to fetch pokemon');
  }

  return response.json();
}
