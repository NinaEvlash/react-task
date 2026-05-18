import Spinner from '../Spinner/Spinner';
import { ResultsProps } from '../../types/results';

export default function Results({ results, loading, error, onSelect }: ResultsProps) {
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner />
      </div>
    );
  if (error) {
    return (
      <div className="text-center text-red-500 bg-red-50 border border-red-200 rounded-xl p-4">
        {error}
      </div>
    );
  }
  if (!results.length) return <p>No results found.</p>;

  return (
    <div className="space-y-4">
      {results.map((item) => (
        <div
          key={item.name}
          className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
        >
          <strong className="block text-lg font-semibold text-gray-800 mb-1">{item.name}</strong>

          <p className="text-gray-600 mb-4">{item.description}</p>

          <button
            onClick={() => onSelect(item.name)}
            className="inline-flex items-center
    px-3 py-1.5
    text-sm font-medium
    text-gray-700
    bg-gray-100
    rounded-lg
    hover:bg-gray-200
    transition-colors
    "
          >
            Details
          </button>
        </div>
      ))}
    </div>
  );
}
