import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

export default function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('search') ?? '';

  const [input, setInput] = useState(query);

  useEffect(() => {
    setInput(query);
  }, [query]);

  const handleSearch = (): void => {
    const params = new URLSearchParams(searchParams);

    const trimmed = input.trim();

    if (trimmed) {
      params.set('search', trimmed);
    } else {
      params.delete('search');
    }

    params.set('page', '1');

    setSearchParams(params);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(event.target.value);
  };

  const handleClick = (): void => {
    handleSearch();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      handleClick();
    }
  };
  return (
    <section className="flex items-center gap-3 space-y-2 mb-5">
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
        className="cursor-pointer px-4 py-2 rounded-xl bg-blue-600 text-white 
               hover:bg-blue-700 active:scale-95 
               transition duration-200 shadow-md"
      >
        Search
      </button>
    </section>
  );
}
