import { Component } from 'react';
import Spinner from '../Spinner';

interface ResultItem {
  name: string;
  description: string;
}

interface ResultsProps {
  results: ResultItem[];
  loading: boolean;
  error: string | null;
}

class Results extends Component<ResultsProps> {
  render() {
    const { results, loading, error } = this.props;

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
        {results.map((item, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <strong className="block text-lg font-semibold text-gray-800 mb-1">{item.name}</strong>

            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    );
  }
}

export default Results;
