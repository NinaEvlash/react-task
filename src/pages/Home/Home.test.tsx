import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Home from './Home';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

describe('Home', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('renders fetched pokemon data', async () => {
    localStorage.setItem('pokemonSearchQuery', 'pikachu');
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              name: 'pikachu',
              weight: 60,
              height: 4,
            }),
        } as Response),
      ),
    );

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });

    expect(screen.getByText('Weight: 60, Height: 4')).toBeInTheDocument();
  });

  it('loads default pokemon list when query is empty', async () => {
    localStorage.clear();

    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              results: [
                { name: 'bulbasaur', url: '' },
                { name: 'ivysaur', url: '' },
              ],
            }),
        } as Response),
      ),
    );

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('ivysaur')).toBeInTheDocument();
    });

    expect(screen.getAllByText('No description available in general list')).toHaveLength(2);
  });

  it('shows message in case of error 404', async () => {
    localStorage.setItem('pokemonSearchQuery', 'unknown');

    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        } as Response),
      ),
    );

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Pokémon not found')).toBeInTheDocument();
    });
  });

  it('shows message in case of error 500', async () => {
    localStorage.setItem('pokemonSearchQuery', 'unknown');

    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        } as Response),
      ),
    );

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Server error. Please try again later.')).toBeInTheDocument();
    });
  });

  it('shows network error when fetch fails', async () => {
    localStorage.setItem('pokemonSearchQuery', 'unknown');

    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('Network error'))),
    );

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Network error. Please check your connection.')).toBeInTheDocument();
    });
  });

  it('handles unknown error', async () => {
    localStorage.setItem('pokemonSearchQuery', 'unknown');

    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject('unexpected')),
    );

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Unknown error occurred')).toBeInTheDocument();
    });
  });

  it('loads saved query from localStorage on mount', async () => {
    localStorage.setItem('pokemonSearchQuery', 'pikachu');

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
    });
  });

  it('saves query to localStorage on search', async () => {
    const user = userEvent.setup();

    render(<Home />);

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

    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              name: 'newpoke',
              weight: 10,
              height: 1,
            }),
        } as Response),
      ),
    );

    const user = userEvent.setup();

    render(<Home />);

    const input = screen.getByPlaceholderText('Enter a Pokémon name');

    await user.clear(input);
    await user.type(input, 'newpoke');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem('pokemonSearchQuery')).toBe('newpoke');
  });

  it('removes query from localStorage on 404 error', async () => {
    localStorage.setItem('pokemonSearchQuery', 'pikachu');

    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        } as Response),
      ),
    );

    render(<Home />);

    await waitFor(() => {
      expect(localStorage.getItem('pokemonSearchQuery')).toBeNull();
    });
  });

  it('shows loading state during fetch', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {}) as unknown as Promise<Response>),
    );

    render(<Home />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('trims whitespace from query before saving', async () => {
    const user = userEvent.setup();

    render(<Home />);

    const input = screen.getByPlaceholderText('Enter a Pokémon name');

    await user.type(input, '   pikachu   ');

    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem('pokemonSearchQuery')).toBe('pikachu');
  });

  it('triggers ErrorBoundary when fatal error happens', async () => {
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <Home />
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
});
