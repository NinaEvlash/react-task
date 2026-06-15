import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import About from './About';

describe('About page', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  test('renders about page content', () => {
    renderWithRouter(<About />);

    expect(
      screen.getByRole('heading', {
        name: /about this project/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(/this application was created/i)).toBeInTheDocument();

    expect(screen.getByText(/author: nina yeulash/i)).toBeInTheDocument();
  });

  test('renders external links', () => {
    renderWithRouter(<About />);

    const githubLink = screen.getByRole('link', {
      name: /my github/i,
    });

    const courseLink = screen.getByRole('link', {
      name: /rs school react course/i,
    });

    expect(githubLink).toHaveAttribute('href', 'https://github.com/ninaevlash');

    expect(courseLink).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
  });
});
