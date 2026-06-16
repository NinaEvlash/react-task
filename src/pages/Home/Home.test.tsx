import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router';
import Home from './Home';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import ThemeProvider from '../../providers/ThemeProvider';
import Navigation from '../../components/Navigation/Navigation';
import { store } from '../../store/store';
<<<<<<< HEAD
import * as api from '../../store/api';
import { createQueryResult, createListQueryResult } from '../../__tests__/queryFactories';
import { pokemonApi } from '../../store/api';

vi.mock('../../store/api', async () => {
  const actual = await vi.importActual('../../store/api');

  return {
    ...actual,
    useGetPokemonByNameQuery: vi.fn(),
    useGetPokemonListQuery: vi.fn(),
  };
});

const mockedDispatch = vi.fn();

vi.mock('react-redux', async () => {
  const actual = await vi.importActual<typeof import('react-redux')>('react-redux');

  return {
    ...actual,
    useDispatch: () => mockedDispatch,
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>,
  );
};
=======
import type { PokemonListResponse } from '../../types/apiTypes';
>>>>>>> app-state-management

describe('Home', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('renders fetched pokemon data', async () => {
    localStorage.setItem('pokemonSearchQuery', 'pikachu');
    vi.mocked(api.useGetPokemonByNameQuery).mockReturnValue(
      createQueryResult({
        data: {
          name: 'pikachu',
          weight: 60,
          height: 40,
          sprites: {
            front_default: 'pikachu.png',
          },
          types: [
            {
              type: {
                name: 'electric',
              },
            },
          ],
        },
        isSuccess: true,
      }),
    );

    vi.mocked(api.useGetPokemonListQuery).mockReturnValue(
      createListQueryResult({
        data: {
          count: 1,
          next: null,
          previous: null,
          results: [],
        },
        isSuccess: true,
      }),
    );

    renderWithRouter(<Home />);

    expect(screen.getByText('pikachu')).toBeInTheDocument();

    expect(screen.getByText('Weight: 60, Height: 40')).toBeInTheDocument();
  });

  it('loads default pokemon list when query is empty', async () => {
    localStorage.clear();

    vi.mocked(api.useGetPokemonListQuery).mockReturnValue(
      createListQueryResult({
        data: {
          count: 2,
          next: null,
          previous: null,
          results: [
            { name: 'bulbasaur', url: '' },
            { name: 'ivysaur', url: '' },
          ],
        },
        isSuccess: true,
      }),
    );

    renderWithRouter(<Home />);

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('ivysaur')).toBeInTheDocument();

    expect(screen.getByText('Pokemon named bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Pokemon named ivysaur')).toBeInTheDocument();
  });

  it('shows message in case of error 404', async () => {
    localStorage.setItem('pokemonSearchQuery', 'unknown');

    const error404: FetchBaseQueryError = {
      status: 404,
      data: 'Not found',
    };

    vi.mocked(api.useGetPokemonByNameQuery).mockReturnValue(
      createQueryResult({
        isError: true,
        error: error404,
      }),
    );

    vi.mocked(api.useGetPokemonListQuery).mockReturnValue(
      createListQueryResult({
        data: {
          count: 0,
          next: null,
          previous: null,
          results: [],
        },
        isSuccess: true,
      }),
    );

    renderWithRouter(<Home />);

<<<<<<< HEAD
    expect(screen.getByText(/pokémon not found/i)).toBeInTheDocument();
=======
    const input = screen.getByPlaceholderText('Enter a Pokémon name');
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'unknown');
    await user.click(button);

    const errorMessage = await screen.findByText('Network request failed');
    expect(errorMessage).toBeInTheDocument();
>>>>>>> app-state-management
  });

  it('shows message in case of error 500', async () => {
    localStorage.setItem('pokemonSearchQuery', 'unknown');

    const error500: FetchBaseQueryError = {
      status: 500,
      data: 'Server error',
    };
    vi.mocked(api.useGetPokemonByNameQuery).mockReturnValue(
      createQueryResult({
        isError: true,
        error: error500,
      }),
    );

    vi.mocked(api.useGetPokemonListQuery).mockReturnValue(
      createListQueryResult({
        data: {
          count: 0,
          next: null,
          previous: null,
          results: [],
        },
        isSuccess: true,
      }),
    );

    renderWithRouter(<Home />);

    expect(screen.getByText(/Server error. Please try again later./i)).toBeInTheDocument();
  });

  it('shows network error when fetch fails', () => {
    localStorage.setItem('pokemonSearchQuery', 'unknown');

    const networkError: FetchBaseQueryError = {
      status: 'FETCH_ERROR',
      error: 'Failed to fetch',
    };

    vi.mocked(api.useGetPokemonByNameQuery).mockReturnValue(
      createQueryResult({
        isError: true,
        error: networkError,
      }),
    );

    vi.mocked(api.useGetPokemonListQuery).mockReturnValue(
      createListQueryResult({
        data: {
          count: 0,
          next: null,
          previous: null,
          results: [],
        },
        isSuccess: true,
      }),
    );

    renderWithRouter(<Home />);

    expect(screen.getByText(/Network error\. Please check your connection\./i)).toBeInTheDocument();
  });

  it('shows fallback message for unknown error', () => {
    localStorage.setItem('pokemonSearchQuery', 'unknown');

    const unknownError: FetchBaseQueryError = {
      status: 418,
      data: null,
    };

    vi.mocked(api.useGetPokemonByNameQuery).mockReturnValue(
      createQueryResult({
        isError: true,
        error: unknownError,
      }),
    );

    vi.mocked(api.useGetPokemonListQuery).mockReturnValue(
      createListQueryResult({
        data: {
          count: 0,
          next: null,
          previous: null,
          results: [],
        },
        isSuccess: true,
      }),
    );

    renderWithRouter(<Home />);

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('saves query to localStorage on search', async () => {
    const user = userEvent.setup();
    vi.mocked(api.useGetPokemonByNameQuery).mockReturnValue(
      createQueryResult({
        data: {
          name: 'pikachu',
          weight: 60,
          height: 40,
          sprites: {
            front_default: 'pikachu.png',
          },
          types: [
            {
              type: {
                name: 'electric',
              },
            },
          ],
        },
        isSuccess: true,
      }),
    );

    renderWithRouter(<Home />);

    const input = screen.getByPlaceholderText('Enter a Pokémon name');

    await user.type(input, 'pikachu');

    const button = screen.getByRole('button', {
      name: /search/i,
    });

    await user.click(button);

    expect(localStorage.getItem('pokemonSearchQuery')).toBe('pikachu');
  });

  it('overwrites previous localStorage value', async () => {
    localStorage.setItem('pokemonSearchQuery', 'old');

    vi.mocked(api.useGetPokemonByNameQuery).mockReturnValue(
      createQueryResult({
        data: {
          name: 'newpoke',
          weight: 10,
          height: 1,
          sprites: {
            front_default: 'newpoke.png',
          },
          types: [
            {
              type: {
                name: 'normal',
              },
            },
          ],
        },
        isSuccess: true,
      }),
    );

    const user = userEvent.setup();

    renderWithRouter(<Home />);

    const input = screen.getByPlaceholderText('Enter a Pokémon name');

    await user.clear(input);
    await user.type(input, 'newpoke');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem('pokemonSearchQuery')).toBe('newpoke');
  });

<<<<<<< HEAD
  it('shows loading state during fetch', async () => {
    localStorage.clear();

    vi.mocked(api.useGetPokemonListQuery).mockReturnValue(
      createListQueryResult({
        isLoading: true,
      }),
=======
  it.skip('removes query from localStorage on 404 error', async () => {
    const user = userEvent.setup({ delay: null });

    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Pokémon not found'));

    renderWithRouter(<Home />);

    const input = screen.getByPlaceholderText('Enter a Pokémon name');
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'pikachu');
    await user.click(button);

    await screen.findByText('Pokémon not found');
    expect(localStorage.getItem('pokemonSearchQuery')).toBeNull();
  });

  it('shows loading state during fetch', () => {
    vi.spyOn(dataApi, 'getDataList').mockImplementation(
      () =>
        new Promise<PokemonListResponse>(() => {
          // intentionally never resolves to test loading state
        }),
>>>>>>> app-state-management
    );

    vi.mocked(api.useGetPokemonByNameQuery).mockReturnValue(createQueryResult({}));

    renderWithRouter(<Home />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('trims whitespace from query before saving', async () => {
    const user = userEvent.setup();
    vi.mocked(api.useGetPokemonByNameQuery).mockReturnValue(
      createQueryResult({
        data: {
          name: 'pikachu',
          weight: 60,
          height: 40,
          sprites: {
            front_default: 'pikachu.png',
          },
          types: [
            {
              type: {
                name: 'electric',
              },
            },
          ],
        },
        isSuccess: true,
      }),
    );

    renderWithRouter(<Home />);

    const input = screen.getByPlaceholderText('Enter a Pokémon name');

    await user.type(input, '   pikachu   ');

    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem('pokemonSearchQuery')).toBe('pikachu');
  });

  it.skip('goes to next page when Next is clicked', async () => {
    const user = userEvent.setup();

    vi.mocked(api.useGetPokemonListQuery).mockReturnValue(
      createListQueryResult({
        data: {
          count: 50,
          next: 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=20',
          previous: null,
          results: [
            {
              name: 'bulbasaur',
              url: '',
            },
          ],
        },
        isSuccess: true,
      }),
    );

    vi.mocked(api.useGetPokemonByNameQuery).mockReturnValue(createQueryResult({}));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/?page=1']}>
          <Home />
        </MemoryRouter>
      </Provider>,
    );

    expect(await screen.findByText(/page 1/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(await screen.findByText(/page 2/i)).toBeInTheDocument();
  });

  it.skip('goes to previous page when Prev is clicked', async () => {
    const user = userEvent.setup();

    vi.mocked(api.useGetPokemonListQuery).mockReturnValue(
      createListQueryResult({
        data: {
          count: 1,
          next: 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0',
          previous: null,
          results: [
            {
              name: 'pikachu',
              url: '',
            },
          ],
        },
        isSuccess: true,
      }),
    );

    vi.mocked(api.useGetPokemonByNameQuery).mockReturnValue(createQueryResult({}));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/?page=2']}>
          <Home />
        </MemoryRouter>
      </Provider>,
    );

    expect(await screen.findByText(/page 2/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /prev/i }));

    expect(await screen.findByText(/page 1/i)).toBeInTheDocument();
  });

<<<<<<< HEAD
  it('disables Prev button on page 1', async () => {
    vi.mocked(api.useGetPokemonListQuery).mockReturnValue(
      createListQueryResult({
        data: {
          count: 1,
          next: 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0',
          previous: null,
          results: [{ name: 'pikachu', url: '' }],
        },
        isSuccess: true,
      }),
    );
=======
  it.skip('disables Prev button on page 1', async () => {
    vi.spyOn(dataApi, 'getDataList').mockResolvedValue({
      count: 1,
      next: 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=20',
      previous: null,
      results: [{ name: 'pikachu', url: '' }],
    });
>>>>>>> app-state-management

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/?page=1']}>
          <Home />
        </MemoryRouter>
      </Provider>,
    );

    const previousButton = await screen.findByRole('button', { name: /prev/i });

    expect(previousButton).toBeDisabled();
  });

<<<<<<< HEAD
  it('shows correct page from query param', async () => {
    vi.mocked(api.useGetPokemonListQuery).mockReturnValue(
      createListQueryResult({
        data: {
          count: 50,
          next: 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=40',
          previous: 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0',
          results: [{ name: 'pikachu', url: '' }],
        },
        isSuccess: true,
      }),
    );

    vi.mocked(api.useGetPokemonByNameQuery).mockReturnValue(createQueryResult({}));
=======
  it.skip('shows correct page from query param', async () => {
    vi.spyOn(dataApi, 'getDataList').mockResolvedValue({
      count: 1,
      next: 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=40',
      previous: 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0',
      results: [{ name: 'pikachu', url: '' }],
    });
>>>>>>> app-state-management

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/?page=2']}>
          <Home />
        </MemoryRouter>
      </Provider>,
    );

    expect(await screen.findByText(/page 2/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /prev/i })).not.toBeDisabled();

    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('navigates to root after search', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/?page=5']}>
          <Routes>
            <Route path="*" element={<Home />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/enter a pokémon name/i), 'pikachu');

    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem('pokemonSearchQuery')).toBe('pikachu');
  });

  it('navigates to details page when selecting pokemon', async () => {
    vi.mocked(api.useGetPokemonListQuery).mockReturnValue(
      createListQueryResult({
        data: {
          count: 1,
          next: null,
          previous: null,
          results: [{ name: 'bulbasaur', url: '' }],
        },
        isSuccess: true,
      }),
    );

    vi.mocked(api.useGetPokemonByNameQuery).mockReturnValue(createQueryResult({}));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/details/:name" element={<div>DETAILS</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(await screen.findByText('bulbasaur')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /details/i }));

    expect(screen.getByText('DETAILS')).toBeInTheDocument();
  });

  it('triggers ErrorBoundary when fatal error happens', async () => {
    const user = userEvent.setup();

    vi.mocked(api.useGetPokemonListQuery).mockReturnValue(
      createListQueryResult({
        data: {
          count: 1,
          next: null,
          previous: null,
          results: [{ name: 'pikachu', url: '' }],
        },
        isSuccess: true,
      }),
    );

    vi.mocked(api.useGetPokemonByNameQuery).mockReturnValue(createQueryResult({}));

    render(
      <ErrorBoundary>
        <Provider store={store}>
          <BrowserRouter>
            <Home />
          </BrowserRouter>
        </Provider>
      </ErrorBoundary>,
    );

    await user.click(
      screen.getByRole('button', {
        name: /trigger error/i,
      }),
    );

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('toggles theme from header button', async () => {
    render(
      <ThemeProvider>
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      </ThemeProvider>,
    );

    const button = screen.getByRole('button');

    await userEvent.click(button);

    expect(localStorage.getItem('app-theme')).toBe('dark');
  });

  it('invalidates pokemon list cache when Refresh is clicked', async () => {
    const user = userEvent.setup();

    vi.mocked(api.useGetPokemonListQuery).mockReturnValue(
      createListQueryResult({
        data: {
          count: 1,
          next: null,
          previous: null,
          results: [{ name: 'pikachu', url: '' }],
        },
        isSuccess: true,
      }),
    );

    vi.mocked(api.useGetPokemonByNameQuery).mockReturnValue(createQueryResult({}));

    renderWithRouter(<Home />);

    await user.click(screen.getByRole('button', { name: /refresh/i }));

    expect(mockedDispatch).toHaveBeenCalled();
  });

  it('dispatches invalidateTags action on Refresh click', async () => {
    const user = userEvent.setup();

    vi.mocked(api.useGetPokemonListQuery).mockReturnValue(
      createListQueryResult({
        data: {
          count: 1,
          next: null,
          previous: null,
          results: [{ name: 'pikachu', url: '' }],
        },
        isSuccess: true,
      }),
    );

    renderWithRouter(<Home />);

    await user.click(screen.getByRole('button', { name: /refresh/i }));

    expect(mockedDispatch).toHaveBeenCalledWith(pokemonApi.util.invalidateTags(['PokemonList']));
  });

  it('invalidates list and selected pokemon cache when Refresh is clicked', async () => {
    const user = userEvent.setup();

    vi.mocked(api.useGetPokemonListQuery).mockReturnValue(
      createListQueryResult({
        data: {
          count: 1,
          next: null,
          previous: null,
          results: [{ name: 'pikachu', url: '' }],
        },
        isSuccess: true,
      }),
    );

    vi.mocked(api.useGetPokemonByNameQuery).mockReturnValue(
      createQueryResult({
        data: {
          name: 'pikachu',
          weight: 60,
          height: 4,
          sprites: {
            front_default: 'pikachu.png',
          },
          types: [
            {
              type: {
                name: 'electric',
              },
            },
          ],
        },
        isSuccess: true,
      }),
    );

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/details/pikachu?page=1']}>
          <Routes>
            <Route path="/details/:name" element={<Home />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    await user.click(screen.getByRole('button', { name: /refresh/i }));

    expect(mockedDispatch).toHaveBeenCalledWith(
      pokemonApi.util.invalidateTags([
        'PokemonList',
        {
          type: 'Pokemon',
          id: 'pikachu',
        },
      ]),
    );
  });
});
