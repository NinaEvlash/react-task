import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CountryAutocomplete } from './Autocomplete';

const countries = ['Poland', 'Portugal', 'Germany', 'France'];

describe('CountryAutocomplete', () => {
  test('renders input with value', () => {
    render(
      <CountryAutocomplete
        countries={countries}
        value="Pol"
        onChange={() => {
          //specifically for verification purposes
        }}
      />,
    );

    const input = screen.getByRole('textbox');

    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Pol');
  });

  test('shows filtered suggestions on focus', async () => {
    const user = userEvent.setup();

    render(
      <CountryAutocomplete
        countries={countries}
        value=""
        onChange={() => {
          //specifically for verification purposes
        }}
      />,
    );

    const input = screen.getByRole('textbox');

    await user.click(input);

    expect(screen.getByText('Poland')).toBeInTheDocument();
    expect(screen.getByText('Portugal')).toBeInTheDocument();
  });

  test('filters suggestions based on input', async () => {
    const user = userEvent.setup();

    const onChange = vi.fn();

    render(<CountryAutocomplete countries={countries} value="" onChange={onChange} />);

    const input = screen.getByRole('textbox');

    await user.type(input, 'ger');

    expect(onChange).toHaveBeenCalledWith('g');
    expect(screen.getByText('Germany')).toBeInTheDocument();
  });

  test('selects country from suggestion list', async () => {
    const user = userEvent.setup();

    let value = '';
    const onChange = (v: string) => (value = v);

    const { rerender } = render(
      <CountryAutocomplete countries={countries} value={value} onChange={onChange} />,
    );

    const input = screen.getByRole('textbox');

    await user.click(input);

    const option = screen.getByText('France');

    await user.click(option);

    rerender(<CountryAutocomplete countries={countries} value={value} onChange={onChange} />);

    expect(value).toBe('France');
    expect(screen.queryByText('France')).not.toBeInTheDocument();
  });
});
