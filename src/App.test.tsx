import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders Home component', () => {
    render(<App />);

    expect(screen.getByPlaceholderText('Enter a Pokémon name')).toBeInTheDocument();
  });
});
