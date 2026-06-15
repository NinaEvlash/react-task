import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';

import NotFound from './NotFound';
import About from '../About/About';

describe('NotFound page', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  test('renders 404 page content', () => {
    renderWithRouter(<NotFound />);

    expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();

    expect(screen.getByText(/page not found/i)).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /back to home/i })).toBeInTheDocument();
  });

  test('navigates to home via link', () => {
    render(
      <MemoryRouter initialEntries={['/404']}>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });
});
