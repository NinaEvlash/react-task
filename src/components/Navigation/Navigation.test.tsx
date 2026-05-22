import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Navigation from './Navigation';
import ThemeProvider from '../../providers/ThemeProvider';

describe('Navigation', () => {
  test('renders navigation links', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <Navigation />
        </ThemeProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });
});
