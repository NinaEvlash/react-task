import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import * as dataApi from '../../api/dataApi';
import ThemeProvider from '../../providers/ThemeProvider';
import Navigation from '../../components/Navigation/Navigation';

describe('Home', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('renders fetched pokemon data', async () => {
    localStorage.setItem('pokemonSearchQuery', 'pikachu');
    vi.spyOn(dataApi, 'getDataByName').mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          name: 'pikachu',
          weight: 60,
          height: 4,
        }),
    } as Response);

    renderWithRouter(<Home />);

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });

    expect(screen.getByText('Weight: 60, Height: 4')).toBeInTheDocument();
  });

  it('loads default pokemon list when query is empty', async () => {
    localStorage.clear();

    vi.spyOn(dataApi, 'getDataList').mockResolvedValue({
      results: [
        { name: 'bulbasaur', url: '' },
        { name: 'ivysaur', url: '' },
      ],
    });

    renderWithRouter(<Home />);

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('ivysaur')).toBeInTheDocument();
    });

    expect(screen.getAllByText('No description available')).toHaveLength(2);
  });

  it('shows message in case of error 404', async () => {
    localStorage.setItem('pokemonSearchQuery', 'unknown');

    vi.spyOn(dataApi, 'getDataByName').mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    renderWithRouter(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Pokémon not found')).toBeInTheDocument();
    });
  });

  it('shows message in case of error 500', async () => {
    localStorage.setItem('pokemonSearchQuery', 'unknown');

    vi.spyOn(dataApi, 'getDataByName').mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    renderWithRouter(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Server error. Please try again later.')).toBeInTheDocument();
    });
  });

  it('shows network error when fetch fails', async () => {
    localStorage.setItem('pokemonSearchQuery', 'unknown');

    vi.spyOn(dataApi, 'getDataByName').mockRejectedValue(new Error('Network error'));

    renderWithRouter(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Network error. Please check your connection.')).toBeInTheDocument();
    });
  });

  it('handles unknown error', async () => {
    localStorage.setItem('pokemonSearchQuery', 'unknown');

    vi.spyOn(dataApi, 'getDataByName').mockRejectedValue('unexpected');

    renderWithRouter(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Network error. Please check your connection.')).toBeInTheDocument();
    });
  });

  it('loads saved query from localStorage on mount', async () => {
    localStorage.setItem('pokemonSearchQuery', 'pikachu');
    vi.spyOn(dataApi, 'getDataByName').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ name: 'pikachu', weight: 60, height: 4 }),
    } as Response);

    renderWithRouter(<Home />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
    });
  });

  it('saves query to localStorage on search', async () => {
    const user = userEvent.setup();
    vi.spyOn(dataApi, 'getDataList').mockResolvedValue({ results: [] });

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

    vi.spyOn(dataApi, 'getDataByName').mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          name: 'newpoke',
          weight: 10,
          height: 1,
        }),
    } as Response);

    const user = userEvent.setup();

    renderWithRouter(<Home />);

    const input = screen.getByPlaceholderText('Enter a Pokémon name');

    await user.clear(input);
    await user.type(input, 'newpoke');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem('pokemonSearchQuery')).toBe('newpoke');
  });

  it('removes query from localStorage on 404 error', async () => {
    localStorage.setItem('pokemonSearchQuery', 'pikachu');

    vi.spyOn(dataApi, 'getDataByName').mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    renderWithRouter(<Home />);

    await waitFor(() => {
      expect(localStorage.getItem('pokemonSearchQuery')).toBeNull();
    });
  });

  it('shows loading state during fetch', async () => {
    vi.spyOn(dataApi, 'getDataList').mockImplementation(() => new Promise(() => {}));

    renderWithRouter(<Home />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('trims whitespace from query before saving', async () => {
    const user = userEvent.setup();
    vi.spyOn(dataApi, 'getDataByName').mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          name: 'pikachu',
          weight: 60,
          height: 4,
        }),
    } as Response);

    renderWithRouter(<Home />);

    const input = screen.getByPlaceholderText('Enter a Pokémon name');

    await user.type(input, '   pikachu   ');

    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(localStorage.getItem('pokemonSearchQuery')).toBe('pikachu');
    });
  });

  it('shows No results found when list is empty', async () => {
    vi.spyOn(dataApi, 'getDataList').mockResolvedValue({ results: [] });

    renderWithRouter(<Home />);

    await waitFor(() => {
      expect(screen.getByText('No results found.')).toBeInTheDocument();
    });
  });

  it('goes to next page when Next is clicked', async () => {
    const user = userEvent.setup();

    vi.spyOn(dataApi, 'getDataList').mockResolvedValue({
      results: [{ name: 'pikachu', url: '' }],
    });

    render(
      <MemoryRouter initialEntries={['/?page=1']}>
        <Home />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/page 1/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(await screen.findByText(/page 2/i)).toBeInTheDocument();
  });

  it('goes to previous page when Prev is clicked', async () => {
    const user = userEvent.setup();

    vi.spyOn(dataApi, 'getDataList').mockResolvedValue({
      results: [{ name: 'pikachu', url: '' }],
    });

    render(
      <MemoryRouter initialEntries={['/?page=2']}>
        <Home />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/page 2/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /prev/i }));

    expect(await screen.findByText(/page 1/i)).toBeInTheDocument();
  });

  it('disables Prev button on page 1', async () => {
    vi.spyOn(dataApi, 'getDataList').mockResolvedValue({
      results: [{ name: 'pikachu', url: '' }],
    });

    render(
      <MemoryRouter initialEntries={['/?page=1']}>
        <Home />
      </MemoryRouter>,
    );

    const prevButton = await screen.findByRole('button', { name: /prev/i });

    expect(prevButton).toBeDisabled();
  });

  it('shows correct page from query param', async () => {
    vi.spyOn(dataApi, 'getDataList').mockResolvedValue({
      results: [{ name: 'pikachu', url: '' }],
    });

    render(
      <MemoryRouter initialEntries={['/?page=2']}>
        <Home />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/page 2/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /prev/i })).not.toBeDisabled();

    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('navigates to root after search', async () => {
    render(
      <MemoryRouter initialEntries={['/?page=5']}>
        <Routes>
          <Route path="*" element={<Home />} />
        </Routes>
      </MemoryRouter>,
    );

    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/enter a pokémon name/i), 'pikachu');

    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem('pokemonSearchQuery')).toBe('pikachu');
  });

  it('navigates to details page when selecting pokemon', async () => {
    vi.spyOn(dataApi, 'getDataList').mockResolvedValue({
      results: [{ name: 'bulbasaur', url: '' }],
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/details/:name" element={<div>DETAILS</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('bulbasaur')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /details/i }));

    expect(screen.getByText('DETAILS')).toBeInTheDocument();
  });

  it('triggers ErrorBoundary when fatal error happens', async () => {
    const user = userEvent.setup();
    vi.spyOn(dataApi, 'getDataList').mockResolvedValue({ results: [] });

    render(
      <ErrorBoundary>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </ErrorBoundary>,
    );

    await user.click(
      screen.getByRole('button', {
        name: /trigger error/i,
      }),
    );

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
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
