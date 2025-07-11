import { Component } from 'react'
import { Box, Text, Divider, Spinner } from '@chakra-ui/react'

interface ResultItem {
  name: string
  description: string
}

interface ResultsProps {
  results: ResultItem[]
  loading: boolean
  error: string | null
}

class Results extends Component<ResultsProps> {
  render() {
    const { results, loading, error } = this.props

    if (loading) return <Spinner size="lg" color="teal.500" />
    if (error) return <Text color="red.500">Error: {error}</Text>
    if (!results.length) return <Text>No results found.</Text>

    return (
      <Box>
        {results.map((item, index) => (
          <Box key={index} mb={4}>
            <Text fontWeight="bold">{item.name}</Text>
            <Text>{item.description}</Text>
            <Divider mt={2} />
          </Box>
        ))}
      </Box>
    )
  }
}

export default Results
