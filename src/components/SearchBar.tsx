import { Component } from 'react'
import { Box, Input, Button, Flex } from '@chakra-ui/react'

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

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ input: e.target.value })
  }

  handleClick = () => {
    this.props.onSearch(this.state.input)
  }

  render() {
    return (
      <Box mb={6}>
        <Flex gap={4}>
          <Input
            placeholder="Enter a Pokémon name"
            value={this.state.input}
            onChange={this.handleChange}
            size="md"
          />
          <Button colorScheme="teal" onClick={this.handleClick}>
            Search
          </Button>
        </Flex>
      </Box>
    )
  }
}

export default SearchBar
