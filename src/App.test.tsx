import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { vi } from 'vitest';
import App from './App';
import * as api from './store/api';
import ThemeProvider from './providers/ThemeProvider';
import { store } from './store/store';
import { createListQueryResult, createQueryResult } from './__tests__/queryFactories';

vi.mock('./store/api', async () => {
  const actual = await vi.importActual('./store/api');

  return {
    ...actual,
    useGetPokemonListQuery: vi.fn(),
    useGetPokemonByNameQuery: vi.fn(),
  };
});

describe('App', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Home component', () => {
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

    vi.mocked(api.useGetPokemonByNameQuery).mockReturnValue(createQueryResult({}));

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.getByPlaceholderText('Enter a Pokémon name')).toBeInTheDocument();
  });
});
