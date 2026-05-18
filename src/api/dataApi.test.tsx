import { getDataByName, getDataList, getDataDetails } from './dataApi';

describe('getDataByName', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls correct url and returns response', async () => {
    const mockResponse = { ok: true } as Response;

    globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await getDataByName('pikachu');

    expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu');

    expect(result).toBe(mockResponse);
  });
});

describe('getDataList', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls correct url and returns json data', async () => {
    const mockJson = { results: [{ name: 'pikachu' }] };

    globalThis.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockJson),
    });

    const result = await getDataList(10, 20);

    expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=10&offset=20');

    expect(result).toEqual(mockJson);
  });
});

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
