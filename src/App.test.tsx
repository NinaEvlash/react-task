import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { vi } from 'vitest';
import App from './App';
import * as dataApi from './api/dataApi';
import ThemeProvider from './providers/ThemeProvider';
import { store } from './store/store';

describe('App', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Home component', () => {
    vi.spyOn(dataApi, 'getDataList').mockResolvedValue({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });

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
