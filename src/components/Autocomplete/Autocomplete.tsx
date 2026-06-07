import { useState } from 'react';
import './Autocomplete.css';

type Props = {
  countries: string[];
  value: string;
  onChange: (value: string) => void;
};

export const CountryAutocomplete = ({ countries, value, onChange }: Props) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(value.toLowerCase()),
  );

  return (
    <div className="autocomplete">
      <input
        className="input"
        value={value}
        autoComplete="off"
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => {
          setTimeout(() => setShowSuggestions(false), 150);
        }}
      />

      {showSuggestions && filteredCountries.length > 0 && (
        <ul className="suggestions">
          {filteredCountries.map((country) => (
            <li
              key={country}
              className="suggestion-item"
              onMouseDown={() => {
                onChange(country);
                setShowSuggestions(false);
              }}
            >
              {country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
