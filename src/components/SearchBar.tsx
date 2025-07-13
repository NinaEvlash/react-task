import React, { Component } from 'react'

interface SearchBarProps {
  query: string
  onSearch: (query: string) => void
}

interface SearchBarState {
  input: string
}

class SearchBar extends Component<SearchBarProps, SearchBarState> {
  constructor(props: SearchBarProps) {
    super(props)
    this.state = {
      input: props.query || '',
    }
  }

  componentDidUpdate(prevProps: SearchBarProps) {
    if (prevProps.query !== this.props.query) {
      this.setState({ input: this.props.query })
    }
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ input: e.target.value })
  }

  handleClick = () => {
    this.props.onSearch(this.state.input)
    this.setState({ input: '' })
  }

  handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.handleClick()
    }
  }

  render() {
    return (
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter a Pokémon name"
          value={this.state.input}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button onClick={this.handleClick}>Search</button>
      </div>
    )
  }
}

export default SearchBar
