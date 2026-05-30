import { getDataByName, getDataList, getDataDetails } from './dataApi';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getDataByName', () => {
  it('calls correct url and returns response', async () => {
    const mockJson = {
      name: 'pikachu',
      weight: 60,
      height: 4,
      sprites: { front_default: 'pikachu.png' },
      types: [{ type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' } }],
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockJson),
    });

    const result = await getDataByName('pikachu');

    expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu');
    expect(result).toEqual(mockJson);
  });
  it('throws not found error for 404 response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(getDataByName('unknown')).rejects.toThrow('Pokémon not found');
  });

  it('throws server error for 500 response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getDataByName('pikachu')).rejects.toThrow('Server error. Please try again later.');
  });

  it('throws generic error for other failed responses', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
    });

    await expect(getDataByName('pikachu')).rejects.toThrow('Something went wrong');
  });
});

describe('getDataList', () => {
  it('calls correct url and returns json data', async () => {
    const mockJson = {
      count: 100,
      next: null,
      previous: null,
      results: [{ name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/pikachu' }],
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockJson),
    });

    const result = await getDataList(10, 20);

    expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=10&offset=20');
    expect(result).toEqual(mockJson);
  });

  it('throws server error for 500 response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getDataList(10, 20)).rejects.toThrow('Server error. Please try again later.');
  });

  it('throws list error for non-500 failed responses', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(getDataList(10, 20)).rejects.toThrow('Failed to load Pokémon list');
  });
});

describe('getDataDetails', () => {
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

  test('throws not found error for 404 response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(getDataDetails('pikachu')).rejects.toThrow('Pokémon not found');
  });

  test('throws server error for 500 response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getDataDetails('pikachu')).rejects.toThrow(
      'Server error. Please try again later.',
    );
  });

  test('throws generic error for other failed responses', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
    });

    await expect(getDataDetails('pikachu')).rejects.toThrow('Failed to fetch pokemon');
  });
});
