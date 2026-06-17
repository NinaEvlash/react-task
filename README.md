# Pokémon Search App

A Pokémon search application built with **Next.js (App Router) + TypeScript**, using the PokéAPI.

The project allows users to search for Pokémon, view details, manage selected items, and demonstrates modern React patterns with Redux Toolkit and RTK Query.

## The project includes:

- Pokémon search and filtering
- Dynamic routing with Next.js App Router
- Server-side and client-side data fetching (RTK Query)
- State management with Redux Toolkit
- Persistent state with localStorage
- Error Boundary handling
- Theme switching (Context API)
- Unit and integration tests (Vitest + React Testing Library)
- URL-based state management
- Responsive UI with Tailwind CSS

---

## Technologies

- Next.js (App Router)
- React
- TypeScript
- Redux Toolkit
- RTK Query
- Context API
- Tailwind CSS
- Vitest
- React Testing Library

---

### Prerequisites

1. Clone repo locally:

```bash
git clone https://github.com/NinaEvlash/react-task.git
```

2. Go to folder:

```bash
cd react-task
```

3. To install all dependencies:

```bash
npm install
```

4. Run development server:

```bash
npm run dev
```

5. Run all tests:

```bash
 npm run test
```

6. Generate coverage report:

```bash
 npm run test:coverage
```

---

## Changes made:

- React Router was removed
- Routing is now based on Next.js file system routing
- Pages moved to app/ directory
- Navigation replaced with next/link and useRouter
- Redux Toolkit and RTK Query adapted for Next.js environment
- API calls remain unchanged (PokéAPI via RTK Query)
