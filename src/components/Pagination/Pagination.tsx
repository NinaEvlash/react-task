export default function Pagination({
  page,
  onPageChange,
}: {
  page: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <section aria-label="Pagination" className="flex gap-3 justify-center">
      <button
        type="button"
        aria-label="Go to previous page"
        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium transition hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>
      <span className="flex items-center text-sm font-medium text-gray-600">Page {page}</span>
      <button
        type="button"
        aria-label="Go to next page"
        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium transition hover:bg-gray-100"
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </section>
  );
}
