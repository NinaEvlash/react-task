import { render, screen } from '@testing-library/react';
import Results from './Results';

describe('Results', () => {
  it('renders error message', () => {
    render(<Results results={[]} loading={false} error="Pokémon not found" />);

    expect(screen.getByText('Pokémon not found')).toBeInTheDocument();
  });
});
