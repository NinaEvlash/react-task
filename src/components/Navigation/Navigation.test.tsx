import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Navigation from './Navigation';

describe('Navigation', () => {
  test('renders navigation links', () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });
});
