import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Details from './Details';
import * as api from '../../store/api';

type PokemonQueryResult = ReturnType<typeof api.useGetPokemonByNameQuery>;

function createQueryResult(overrides: Partial<PokemonQueryResult>): PokemonQueryResult {
  return {
    data: undefined,
    error: undefined,
    isLoading: false,
    isFetching: false,
    isSuccess: false,
    isError: false,
    refetch: vi.fn(),
    ...overrides,
  } as PokemonQueryResult;
}

vi.mock('../../store/api', async () => {
  const actual = await vi.importActual('../../store/api');

  return {
    ...actual,
    useGetPokemonByNameQuery: vi.fn(),
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter initialEntries={['/pokemon/pikachu']}>
      <Routes>
        <Route path="/pokemon/:name" element={component} />
      </Routes>
    </MemoryRouter>,
  );
};

const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useParams: () => ({
      name: 'pikachu',
    }),
    useNavigate: () => mockedNavigate,
  };
});

describe('Details', () => {
  it('shows spinner while loading', () => {
    vi.mocked(api.useGetPokemonByNameQuery).mockReturnValue(createQueryResult({ isLoading: true }));

    renderWithRouter(<Details />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('shows error message', () => {
    vi.mocked(api.useGetPokemonByNameQuery).mockReturnValue(
      createQueryResult({ error: { status: 404 } }),
    );

    renderWithRouter(<Details />);

    expect(screen.getByText(/failed to load pokemon/i)).toBeInTheDocument();
  });

  it('renders pokemon details', () => {
    vi.mocked(api.useGetPokemonByNameQuery).mockReturnValue(
      createQueryResult({
        data: {
          name: 'pikachu',
          weight: 60,
          height: 4,
          sprites: {
            front_default: 'pikachu.png',
          },
          types: [
            {
              type: {
                name: 'electric',
              },
            },
          ],
        },
        isSuccess: true,
      }),
    );

    renderWithRouter(<Details />);

    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('Height: 4')).toBeInTheDocument();
    expect(screen.getByText('Weight: 60')).toBeInTheDocument();
    expect(screen.getByText('Types: electric')).toBeInTheDocument();
  });

  it('navigates home when close button clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(api.useGetPokemonByNameQuery).mockReturnValue(
      createQueryResult({
        data: {
          name: 'pikachu',
          weight: 60,
          height: 4,
          sprites: {
            front_default: 'pikachu.png',
          },
          types: [
            {
              type: {
                name: 'electric',
              },
            },
          ],
        },
        isLoading: false,
        error: undefined,
      }),
    );

    renderWithRouter(<Details />);
    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });
});
