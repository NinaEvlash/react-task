import { useEffect, useState } from 'react';

import { SearchBarProps } from '../../types/search';

export default function SearchBar({ query, onSearch }: SearchBarProps) {
  const [input, setInput] = useState(query || '');

  useEffect(() => {
    setInput(query ?? '');
  }, [query]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleClick = () => {
    onSearch(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };
  return (
    <div className="space-y-2 mb-5">
      <section className="flex items-center gap-3">
        <label htmlFor="search" className="sr-only">
          Search Pokémon
        </label>
        <input
          id="search"
          type="text"
          placeholder="Enter a Pokémon name"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="px-4 py-2 w-64 rounded-xl border border-gray-300 
               focus:outline-none focus:ring-2 focus:ring-blue-500 
               focus:border-blue-500 transition"
        />
        <button
          type="button"
          onClick={handleClick}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white 
               hover:bg-blue-700 active:scale-95 
               transition duration-200 shadow-md"
        >
          Search
        </button>
      </section>
    </div>
  );
}
