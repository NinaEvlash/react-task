import { useState } from 'react';
import { useTranslations } from 'next-intl';

export type SearchBarProps = {
  query: string;
  onSearch: (query: string) => void;
};

export default function SearchBar({ query, onSearch }: SearchBarProps) {
  const t = useTranslations('Search');
  const [input, setInput] = useState(query ?? '');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(event.target.value);
  };

  const handleClick = (): void => {
    onSearch(input);
    setInput('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      handleClick();
    }
  };
  return (
    <section className="flex items-center gap-3 space-y-2 mb-5">
      <label htmlFor="search" className="sr-only">
        {t('placeholder')}
      </label>
      <input
        id="search"
        type="text"
        placeholder={t('placeholder')}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="
        
  px-4 py-2
  w-64
  rounded-xl
  border border-gray-300

  bg-white
  text-gray-900
  placeholder:text-gray-500

  dark:bg-gray-800
  dark:text-white
  dark:border-gray-600
  dark:placeholder:text-gray-400

  focus:outline-none
  focus:ring-2
  focus:ring-blue-500
  focus:border-blue-500
  transition
        "
      />
      <button
        type="button"
        onClick={handleClick}
        className="cursor-pointer px-4 py-2 rounded-xl bg-blue-600 text-white 
               hover:bg-blue-700 active:scale-95 
               transition duration-200 shadow-md"
      >
        {t('button')}
      </button>
    </section>
  );
}
