import { render, screen } from '@testing-library/react';
import Results from './Results';

describe('Results', () => {
  it('shows spinner when loading', () => {
    render(<Results results={[]} loading={true} error={null} />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<Results results={[]} loading={false} error="Pokémon not found" />);

    expect(screen.getByText('Pokémon not found')).toBeInTheDocument();
  });

  it('renders list of results', () => {
    const mockData = [
      {
        name: 'pikachu',
        description: 'Weight: 60, Height: 4',
      },
      {
        name: 'charmander',
        description: 'Weight: 85, Height: 6',
      },
    ];

    render(<Results results={mockData} loading={false} error={null} />);

    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('charmander')).toBeInTheDocument();

    expect(screen.getByText('Weight: 60, Height: 4')).toBeInTheDocument();
  });

  it('handles missing data safely', () => {
    const mockData = [
      { name: 'pikachu', description: '' },
      { name: '', description: 'no name' },
    ];

    render(<Results results={mockData} loading={false} error={null} />);

    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.queryByText('no name')).toBeInTheDocument();
  });

  it('displays error message when api call fails', () => {
    render(<Results results={[]} loading={false} error="Something went wrong" />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('shows 404 not found error message', () => {
    render(<Results results={[]} loading={false} error="Pokémon not found" />);

    expect(screen.getByText('Pokémon not found')).toBeInTheDocument();
  });

  it('shows server error message for 5xx errors', () => {
    render(<Results results={[]} loading={false} error="Server error. Please try again later." />);

    expect(screen.getByText('Server error. Please try again later.')).toBeInTheDocument();
  });

  it('shows network error message', () => {
    render(
      <Results results={[]} loading={false} error="Network error. Please check your connection." />,
    );

    expect(screen.getByText('Network error. Please check your connection.')).toBeInTheDocument();
  });
});
