import { Component } from 'react';

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

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!results.length) return <p>No results found.</p>;

    return (
      <div>
        {results.map((item, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>{item.name}</strong>
            <p>{item.description}</p>
            <hr />
          </div>
        ))}
      </div>
    );
  }
}

export default Results;
