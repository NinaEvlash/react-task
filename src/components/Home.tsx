import { Component } from 'react';
import SearchBar from './SearchBar';
import Results from './Results/Results';
interface Pokemon {
  name: string;
  description: string;
}

interface AppState {
  query: string;
  results: Pokemon[];
  loading: boolean;
  error: string | null;
  fatalError: string | null;
}

class Home extends Component<Record<string, never>, AppState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      query: '',
      results: [],
      loading: false,
      error: null,
      fatalError: null,
    };
  }

  componentDidMount() {
    const savedQuery = localStorage.getItem('pokemonSearchQuery') || '';
    this.setState({ query: savedQuery }, () => {
      this.fetchData(savedQuery);
    });
  }

  fetchData = async (query: string) => {
    const normalizedQuery = query.trim().toLowerCase();
    this.setState({ loading: true, error: null });
    try {
      let response: Response;

      if (normalizedQuery) {
        response = await fetch(`https://pokeapi.co/api/v2/pokemon/${normalizedQuery}`);
        if (!response.ok) {
          let message = 'Something went wrong';

          if (response.status === 404) {
            message = 'Pokémon not found';
            localStorage.removeItem('pokemonSearchQuery');
          } else if (response.status >= 500) {
            message = 'Server error. Please try again later.';
          }

          this.setState({
            results: [],
            error: message,
            loading: false,
          });
          return;
        }

        const data: {
          name: string;
          weight: number;
          height: number;
        } = await response.json();

        this.setState({
          results: [
            {
              name: data.name,
              description: `Weight: ${data.weight}, Height: ${data.height}`,
            },
          ],
          loading: false,
        });
      } else {
        response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
        const data: {
          results: { name: string; url: string }[];
        } = await response.json();

        const results: Pokemon[] = data.results.map((p) => ({
          name: p.name,
          description: 'No description available in general list',
        }));

        this.setState({ results, loading: false });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.setState({ error: 'Network error. Please check your connection.', loading: false });
      } else {
        this.setState({ error: 'Unknown error occurred', loading: false });
      }
    }
  };

  handleSearch = (newQuery: string) => {
    const normalizedQuery = newQuery.trim();
    localStorage.setItem('pokemonSearchQuery', normalizedQuery);
    this.setState({ query: newQuery }, () => {
      this.fetchData(newQuery);
    });
  };

  render() {
    const { query, results, loading, error, fatalError } = this.state;

    if (fatalError) {
      throw new Error(fatalError);
    }

    return (
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-6">
          <SearchBar query={query} onSearch={this.handleSearch} />

          <Results results={results} loading={loading} error={error} />

          <button
            onClick={() => {
              this.setState({ fatalError: 'Manual test error' });
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-xl 
                 hover:bg-red-600 active:scale-95 
                 transition shadow-md"
          >
            Trigger Error
          </button>
        </div>
      </div>
    );
  }
}

export default Home;
