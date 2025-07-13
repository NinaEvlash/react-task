import { Component } from 'react'
import SearchBar from './components/SearchBar'
import Results from './components/Results'

interface Pokemon {
  name: string
  description: string
}

interface AppState {
  query: string
  results: Pokemon[]
  loading: boolean
  error: string | null
}

class App extends Component<Record<string, never>, AppState> {
  constructor(props: Record<string, never>) {
    super(props)
    this.state = {
      query: '',
      results: [],
      loading: false,
      error: null,
    }
  }

  componentDidMount() {
    const savedQuery = localStorage.getItem('pokemonSearchQuery') || ''
    this.setState({ query: savedQuery }, () => {
      this.fetchData(savedQuery)
    })
  }

  fetchData = async (query: string) => {
    this.setState({ loading: true, error: null })
    try {
      let response: Response

      if (query) {
        response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`)
        if (!response.ok) throw new Error('Pokémon not found')

        const data: {
          name: string
          weight: number
          height: number
        } = await response.json()

        this.setState({
          results: [
            {
              name: data.name,
              description: `Weight: ${data.weight}, Height: ${data.height}`,
            },
          ],
          loading: false,
        })
      } else {
        response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
        const data: {
          results: { name: string; url: string }[]
        } = await response.json()

        const results: Pokemon[] = data.results.map((p) => ({
          name: p.name,
          description: 'No description available in general list',
        }))

        this.setState({ results, loading: false })
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.setState({ error: error.message, loading: false })
      } else {
        this.setState({ error: 'Unknown error occurred', loading: false })
      }
    }
  }

  handleSearch = (newQuery: string) => {
    localStorage.setItem('pokemonSearchQuery', newQuery)
    this.setState({ query: newQuery }, () => {
      this.fetchData(newQuery)
    })
  }

  render() {
    const { query, results, loading, error } = this.state

    return (
      <div style={{ padding: '20px' }}>
        <SearchBar query={query} onSearch={this.handleSearch} />
        <Results results={results} loading={loading} error={error} />
        <button
          onClick={() => {
            throw new Error('Test error from button')
          }}
          style={{
            marginBottom: '20px',
            padding: '8px 12px',
            backgroundColor: '#ff4d4f',
            color: 'white',
            border: 'none',
          }}
        >
          Trigger Error
        </button>
      </div>
    )
  }
}

export default App
