import { getDataByName, getDataList } from './dataApi';

const originalFetch = globalThis.fetch;

afterEach(() => {
  vi.restoreAllMocks();
  globalThis.fetch = originalFetch;
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
