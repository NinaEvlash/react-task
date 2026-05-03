import React, { Component } from 'react';

interface SearchBarProps {
  query: string;
  onSearch: (query: string) => void;
}

interface SearchBarState {
  input: string;
}

class SearchBar extends Component<SearchBarProps, SearchBarState> {
  constructor(props: SearchBarProps) {
    super(props);
    this.state = {
      input: props.query || '',
    };
  }

  componentDidUpdate(prevProps: SearchBarProps) {
    if (prevProps.query !== this.props.query) {
      this.setState({ input: this.props.query });
    }
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ input: e.target.value });
  };

  handleClick = () => {
    this.props.onSearch(this.state.input);
    this.setState({ input: '' });
  };

  handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.handleClick();
    }
  };

  render() {
    return (
      <div className="flex items-center gap-3 mb-5">
        <input
          type="text"
          placeholder="Enter a Pokémon name"
          value={this.state.input}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          className="px-4 py-2 w-64 rounded-xl border border-gray-300 
               focus:outline-none focus:ring-2 focus:ring-blue-500 
               focus:border-blue-500 transition"
        />
        <button
          onClick={this.handleClick}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white 
               hover:bg-blue-700 active:scale-95 
               transition duration-200 shadow-md"
        >
          Search
        </button>
      </div>
    );
  }
}

export default SearchBar;
