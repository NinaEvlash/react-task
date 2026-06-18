import { useState } from 'react';
import { Outlet, useParams, useSearchParams } from 'react-router';
import SearchBar from '../../components/SearchBar/SearchBar';
import Results from '../../components/Results/Results';
import Pagination from '../../components/Pagination/Pagination';
import SelectedItemsPanel from '../../components/SelectedItemsPanel/SelectedItemsPanel';
import { useGetPokemonListQuery } from '../../store/api';

export default function Home() {
  const params = useParams<{ name?: string }>();
  const selectedPokemon = params.name ?? null;

  const [fatalError, setFatalError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get('page') ?? '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data: listData, refetch } = useGetPokemonListQuery({
    limit,
    offset,
  });

  const isSearchMode = Boolean(searchParams.get('search'));
  const totalPages = Math.ceil((listData?.count ?? 0) / limit);

  if (fatalError) {
    throw new Error(fatalError);
  }

  const handleRefresh = (): void => {
    void refetch();
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 pb-24 flex flex-col items-center dark:bg-gray-950">
      <div className="w-full max-w-2xl space-y-6">
        <SearchBar />

        <section className="flex items-start gap-6 mt-6">
          <div className="w-full">
            <Results />
          </div>

          {selectedPokemon && (
            <aside className="w-1/2 sticky top-6 bg-white rounded-2xl shadow-md p-6 bg-white dark:bg-gray-800">
              <Outlet />
            </aside>
          )}
        </section>

        {!isSearchMode && <Pagination totalPages={totalPages} />}

        <section className="flex justify-between items-center">
          <button
            type="button"
            onClick={handleRefresh}
            className="
      px-4 py-2
      rounded-xl
      bg-blue-500
      text-white
      hover:bg-blue-600
      dark:bg-blue-600
      dark:hover:bg-blue-700
      transition-colors
    "
          >
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setFatalError('Manual test error')}
            className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
          >
            Trigger Error
          </button>
        </section>
        <SelectedItemsPanel />
      </div>
    </main>
  );
}
