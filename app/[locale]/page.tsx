import { Suspense } from 'react';
import Results from '@/components/Results/Results';
import SearchBar from '@/components/SearchBar/SearchBar';
import Pagination from '@/components/Pagination/Pagination';
import SelectedItemsPanel from '@/components/SelectedItemsPanel/SelectedItemsPanel';
import DetailsPanel from '@/components/DetailsPanel/DetailsPanel';

import { getDataList, getDataByName } from '@/api/dataApi';

type Props = {
  searchParams?: {
    page?: string;
    search?: string;
    selected?: string;
  };
};

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params?.page ?? 1);
  const query = params?.search ?? '';
  const selected = params?.selected;

  const limit = 20;
  const offset = (page - 1) * limit;

  const isSearchMode = query.trim().length > 0;

  let results = [];
  let totalPages = 1;
  
  if (isSearchMode) {
  const pokemon = await getDataByName(query);

  results = [
    {
      name: pokemon.name,
      description: `Pokemon named ${pokemon.name}`,
    },
  ];
} else {
  const list = await getDataList(limit, offset);

  results = list.results.map((p) => ({
    name: p.name,
    description: `Pokemon named ${p.name}`,
  }));

  totalPages = Math.ceil(list.count / limit);
}

  return (
    <main className="min-h-screen bg-gray-100 p-6 flex flex-col items-center dark:bg-gray-950">
      <div className="w-full max-w-2xl space-y-6">

        <SearchBar />

        <section className="flex items-start gap-6 mt-6">
          <div className="w-full">
            <Results results={results} />
          </div>

          {selected && (
            <aside className="w-1/2 sticky top-6 bg-white rounded-2xl shadow-md p-6 dark:bg-gray-800">
              <Suspense fallback={<div>Loading details...</div>}>
                <DetailsPanel name={selected} />
              </Suspense>
            </aside>
          )}
        </section>

        {!isSearchMode && (
          <Pagination totalPages={totalPages} />
        )}

        <SelectedItemsPanel />

      </div>
    </main>
  );
}