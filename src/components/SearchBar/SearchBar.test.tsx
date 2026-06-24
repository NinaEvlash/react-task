import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders search input and button', () => {
    render(<SearchBar />);

    expect(screen.getByPlaceholderText('Enter a Pokémon name')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('renders saved query in input', () => {
    render(<SearchBar />);

    expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
  });

  it('updates input value when user types', async () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText('Enter a Pokémon name');

    await userEvent.type(input, 'pikachu');

    expect(input).toHaveValue('pikachu');
  });

  it('calls onSearch with correct value when button is clicked', async () => {
    const onSearchMock = vi.fn();

    render(<SearchBar />);

    const input = screen.getByPlaceholderText('Enter a Pokémon name');

    const button = screen.getByRole('button', {
      name: /search/i,
    });

    await userEvent.type(input, 'pikachu');

    await userEvent.click(button);

    expect(onSearchMock).toHaveBeenCalledWith('pikachu');
  });

  it('calls onSearch when Enter key is pressed', async () => {
    const onSearchMock = vi.fn();

    render(<SearchBar />);

    const input = screen.getByPlaceholderText('Enter a Pokémon name');

    await userEvent.type(input, 'pikachu{enter}');

    expect(onSearchMock).toHaveBeenCalledWith('pikachu');
  });

  it('updates input when query prop changes', () => {
    const { rerender } = render(<SearchBar />);

    expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();

    rerender(<SearchBar />);

    expect(screen.getByDisplayValue('charizard')).toBeInTheDocument();
  });
});
