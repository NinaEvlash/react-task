import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useSearchParams, useParams } from 'react-router-dom';

import SearchBar from '../../components/Search/SearchBar';
import Results from '../../components/Results/Results';
import { Pokemon } from '../../types/pokemon';
import { getDataByName, getDataList } from '../../api/dataApi';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const params = useParams<{ name?: string }>();
  const selectedPokemon = params.name || null;
  const navigate = useNavigate();

  const [results, setResults] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fatalError, setFatalError] = useState<string | null>(null);

  const [query, setQuery] = useLocalStorage('pokemonSearchQuery');

  useEffect(() => {
    if (!searchParams.get('page')) {
      const params = new URLSearchParams(searchParams);
      params.set('page', '1');

      setSearchParams(params);
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchData = async () => {
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
      } catch {
        setError('Network error. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, page]);

  const handleSearch = (newQuery: string) => {
    const trimmedQuery = newQuery.trim();
    setQuery(trimmedQuery);

    const params = new URLSearchParams();
    params.set('page', '1');

    setSearchParams(params);
    navigate('/');
  };

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
  };

  if (fatalError) {
    throw new Error(fatalError);
  }

  const handleSelectPokemon = (name: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete('details');
    params.set('page', String(page));

    navigate(`/details/${name}${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        <SearchBar query={query} onSearch={handleSearch} />

        <section className="flex items-start gap-6 mt-6">
          <section className="flex-1">
            <Results
              results={results}
              loading={loading}
              error={error}
              onSelect={handleSelectPokemon}
            />
          </section>

          {selectedPokemon && (
            <aside className="w-1/2 sticky top-6 bg-white rounded-2xl shadow-md p-6">
              <Outlet />
            </aside>
          )}
        </section>

        {!loading && !query && results.length > 0 && (
          <section aria-label="Pagination" className="flex gap-3 justify-center">
            <button
              type="button"
              className=" px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium transition hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed "
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>
            <span className="flex items-center text-sm font-medium text-gray-600">Page {page}</span>
            <button
              type="button"
              className=" px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium transition hover:bg-gray-100 "
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </section>
        )}

        <section className="flex justify-center">
          <button
            type="button"
            onClick={() => setFatalError('Manual test error')}
            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
          >
            Trigger Error
          </button>
        </section>
      </div>
    </main>
  );
}
