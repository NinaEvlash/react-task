import { useEffect, useState } from 'react';

import { SearchBarProps } from '../../types/search';

export default function SearchBar({ query, onSearch }: SearchBarProps) {
  const [input, setInput] = useState(query || '');

  useEffect(() => {
    setInput(query);
  }, [query]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleClick = () => {
    onSearch(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };
  return (
    <div className="flex items-center gap-3 mb-5">
      <input
        type="text"
        placeholder="Enter a Pokémon name"
        value={input}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        className="px-4 py-2 w-64 rounded-xl border border-gray-300 
               focus:outline-none focus:ring-2 focus:ring-blue-500 
               focus:border-blue-500 transition"
      />
      <button
        onClick={handleClick}
        className="px-4 py-2 rounded-xl bg-blue-600 text-white 
               hover:bg-blue-700 active:scale-95 
               transition duration-200 shadow-md"
      >
        Search
      </button>
    </div>
  );
}
