import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as dataApi from '../../api/dataApi';
import Details from './Details';

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
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <MemoryRouter initialEntries={['/pokemon/pikachu']}>
        <Routes>
          <Route path="/pokemon/:name" element={component} />
        </Routes>
      </MemoryRouter>,
    );
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders pokemon details', async () => {
    vi.spyOn(dataApi, 'getDataByName').mockResolvedValue({
      name: 'pikachu',
      height: 4,
      weight: 60,
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
    });

    renderWithRouter(<Details />);

    expect(await screen.findByText(/pikachu/i)).toBeInTheDocument();

    expect(screen.getByText(/Height: 4/i)).toBeInTheDocument();

    expect(screen.getByText(/Weight: 60/i)).toBeInTheDocument();

    expect(screen.getByText(/electric/i)).toBeInTheDocument();
  });

  test('shows error message', async () => {
    vi.spyOn(dataApi, 'getDataByName').mockRejectedValue(new Error('API error'));

    renderWithRouter(<Details />);

    expect(await screen.findByText(/failed to load pokemon/i)).toBeInTheDocument();
  });

  test('calls navigate when close button clicked', async () => {
    vi.spyOn(dataApi, 'getDataByName').mockResolvedValue({
      name: 'pikachu',
      height: 4,
      weight: 60,
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
    });

    renderWithRouter(<Details />);
    const button = await screen.findByRole('button', {
      name: /close/i,
    });

    await userEvent.click(button);

    expect(mockedNavigate).toHaveBeenCalledWith('..');
  });
});
