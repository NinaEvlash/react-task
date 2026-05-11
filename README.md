# Pokémon Search App

A React + TypeScript application for searching Pokémon using the PokéAPI.

The project includes:

- class-based React components
- API integration
- localStorage persistence
- Error Boundary handling
- unit and integration tests with Vitest + React Testing Library
- coverage reporting

---

## Technologies

- React
- TypeScript
- Vite
- Vitest
- React Testing Library
- Tailwind CSS

---

### Prerequisites

1. Clone repo locally: https://github.com/NinaEvlash/react-task.git
2. Go to folder `unit-testing`
3. To install all dependencies use [`npm install`](https://docs.npmjs.com/cli/install)
4. Run **test scripts** in command line.
5. You will see the number of skipped, passing and failing tests.

---

### Test scripts

#### Run all tests:

```bash
 npm run test
```

#### Run tests in watch mode:

```bash
 npm run test:watch
```

#### Generate coverage report:

```bash
 npm run test:coverage
```

# Coverage results will be generated in the coverage/ folder.

---

## Features

## Search Functionality

- Search Pokémon by name
- Handles empty queries
- Displays loading spinner
- Displays API errors

## localStorage Integration

- Saves latest search query
- Restores saved query on page reload

## Error Handling

- Handles 404 and 500 API errors
- Handles network errors
- Includes Error Boundary fallback UI

## Testing

- Unit tests
- Integration tests
- API mocking with Vitest
- localStorage testing
- User interaction testing
