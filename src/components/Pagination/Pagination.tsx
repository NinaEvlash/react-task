import { useSearchParams } from 'react-router-dom';

type PaginationProps = {
  totalPages: number;
};

export default function Pagination({ totalPages }: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;

  const changePage = (page: number): void => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(Math.max(1, page)));
    setSearchParams(params);
  };

  return (
    <section aria-label="Pagination" className="flex gap-3 justify-center">
      <button
        type="button"
        aria-label="Go to previous page"
        className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium transition hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
      >
        Prev
      </button>
      <span className="flex items-center text-sm font-medium text-gray-600">
        Page {currentPage}
      </span>
      <button
        type="button"
        aria-label="Go to next page"
        className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium transition hover:bg-gray-100"
        disabled={currentPage === totalPages}
        onClick={() => changePage(currentPage + 1)}
      >
        Next
      </button>
    </section>
  );
}
