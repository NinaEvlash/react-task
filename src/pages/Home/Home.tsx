import { useEffect, useState } from 'react';
import { Outlet, useSearchParams, useNavigate, useLocation } from 'react-router-dom';

import SearchBar from '../../components/Search/SearchBar';
import Results from '../../components/Results/Results';
import { Pokemon } from '../../types/pokemon';
import { getDataByName, getDataList } from '../../api/dataApi';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fatalError, setFatalError] = useState<string | null>(null);

  const navigate = useNavigate();

  const location = useLocation();
  const showDetails = location.pathname.includes('/pokemon/');

  useEffect(() => {
    const savedQuery = localStorage.getItem('pokemonSearchQuery') || '';
    setQuery(savedQuery);
  }, []);

  useEffect(() => {
    fetchData(query, page);
  }, [query, page]);

  const fetchData = async (query: string, page: number) => {
    const normalizedQuery = query.trim().toLowerCase();

    setLoading(true);
    setError(null);

    try {
      let response: Response;
      if (normalizedQuery) {
        response = await getDataByName(normalizedQuery);
        if (!response.ok) {
          let message = 'Something went wrong';

          if (response.status >= 400 && response.status < 500) {
            message = 'Pokémon not found';
          } else if (response.status >= 500) {
            message = 'Server error. Please try again later.';
          }

          setResults([]);
          setError(message);
          setLoading(false);

          localStorage.removeItem('pokemonSearchQuery');
          return;
        }

        const data = await response.json();

        setResults([
          {
            name: data.name,
            description: `Weight: ${data.weight}, Height: ${data.height}`,
          },
        ]);

        setLoading(false);
        return;
      }

      const limit = 20;
      const offset = (page - 1) * limit;

      const data = await getDataList(limit, offset);

      const mapped: Pokemon[] = data.results.map((p: { name: string }) => ({
        name: p.name,
        description: 'No description available',
      }));

      setResults(mapped);
      setLoading(false);
    } catch {
      setError('Network error. Please check your connection.');
      setLoading(false);
    }
  };

  const handleSearch = (newQuery: string) => {
    const normalized = newQuery.trim();

    setQuery(normalized);
    localStorage.setItem('pokemonSearchQuery', normalized);

    setSearchParams({ page: '1' });
    if (!normalized) {
      navigate('/');
    }
  };

  const setPage = (newPage: number) => {
    setSearchParams({ page: String(newPage) });
  };

  if (fatalError) {
    throw new Error(fatalError);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        <SearchBar query={query} onSearch={handleSearch} />

        <div className="flex gap-6 mt-6">
          <div className="flex-1">
            <Results results={results} loading={loading} error={error} />
          </div>

          {showDetails && (
            <div className="w-1/2 bg-white rounded-2xl shadow-md p-6">
              <Outlet />
            </div>
          )}
        </div>

        {!query && results.length > 0 && (
          <div className="flex gap-3 justify-center">
            <button
              className="
      px-4 py-2
      rounded-xl
      bg-blue-500
      text-white
      shadow-md
      transition
      hover:bg-blue-600
      active:scale-95
      disabled:bg-gray-300
      disabled:cursor-not-allowed
      disabled:active:scale-100
    "
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            <span className="text-lg font-semibold text-gray-700">Page {page}</span>

            <button
              className="
      px-4 py-2
      rounded-xl
      bg-blue-500
      text-white
      shadow-md
      transition
      hover:bg-blue-600
      active:scale-95
      disabled:bg-gray-300
      disabled:cursor-not-allowed
      disabled:active:scale-100
    "
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}

        <button
          onClick={() => setFatalError('Manual test error')}
          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
        >
          Trigger Error
        </button>
      </div>
    </div>
  );
}
