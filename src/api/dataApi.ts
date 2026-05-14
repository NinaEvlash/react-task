export async function getDataByName(name: string) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

  return response;
}

export async function getDataList(limit: number, offset: number) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);

  return response.json();
}

export async function getDataDetails(name: string) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

  if (!response.ok) {
    throw new Error('Failed to fetch pokemon');
  }

  return response.json();
}
