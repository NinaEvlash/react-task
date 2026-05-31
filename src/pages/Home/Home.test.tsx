import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import ThemeProvider from '../../providers/ThemeProvider';
import Navigation from '../../components/Navigation/Navigation';
import { store } from '../../store/store';
import * as api from '../../store/api';
import { createQueryResult, createListQueryResult } from '../../__tests__/queryFactories';

vi.mock('../../store/api', async () => {
  const actual = await vi.importActual('../../store/api');

  return {
    ...actual,
    useGetPokemonByNameQuery: vi.fn(),
    useGetPokemonListQuery: vi.fn(),
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>,
  );
};

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

    expect(screen.getByText(/pokémon not found/i)).toBeInTheDocument();
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

  it('shows loading state during fetch', async () => {
    localStorage.clear();

    vi.mocked(api.useGetPokemonListQuery).mockReturnValue(
      createListQueryResult({
        isLoading: true,
      }),
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

  it('goes to next page when Next is clicked', async () => {
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

  it('goes to previous page when Prev is clicked', async () => {
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

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/?page=1']}>
          <Home />
        </MemoryRouter>
      </Provider>,
    );

    const prevButton = await screen.findByRole('button', { name: /prev/i });

    expect(prevButton).toBeDisabled();
  });

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
});
