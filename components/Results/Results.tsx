import ResultsItem from './ResultsItem';
import type { Pokemon } from '@/types/apiTypes';

type ResultsProps = {
  results: Pokemon[];
};

export default function Results({ results }: ResultsProps) {
  if (!results.length) {
    return <p>No results found.</p>;
  }

  return (
    <div className="space-y-4 flex-1">
      {results.map((item) => (
        <ResultsItem key={item.name} item={item} />
      ))}
    </div>
  );
}
