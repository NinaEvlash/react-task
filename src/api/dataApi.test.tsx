import { getDataDetails } from './dataApi';

describe('getDataDetails', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('returns pokemon data', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        name: 'pikachu',
      }),
    });

    const result = await getDataDetails('pikachu');

    expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu');

    expect(result).toEqual({
      name: 'pikachu',
    });
  });

  test('throws error when response is not ok', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    await expect(getDataDetails('pikachu')).rejects.toThrow('Failed to fetch pokemon');
  });
});
