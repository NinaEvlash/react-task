import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { vi } from 'vitest';
import App from './App';
import * as dataApi from './api/dataApi';

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
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );

    expect(screen.getByPlaceholderText('Enter a Pokémon name')).toBeInTheDocument();
  });
});
