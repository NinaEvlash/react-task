import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import type { RootState } from '../../store/store';
import SelectedItemsPanel from './SelectedItemsPanel';

const mockDispatch = vi.fn();

const mockState: RootState = {
  selectedItem: {
    items: [
      {
        name: 'Item 1',
        description: 'Description 1',
      },
    ],
  },

  pokemonApi: {} as RootState['pokemonApi'],
};

const mockSelector = vi.fn((selector: (state: RootState) => unknown) => selector(mockState));

vi.mock('../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: RootState) => unknown) => mockSelector(selector),
}));

describe('SelectedItemsPanel', () => {
  beforeEach(() => {
    mockDispatch.mockReset();
    mockSelector.mockReset();
    mockSelector.mockImplementation((selector) => selector(mockState));
  });

  it('renders selected items count', () => {
    render(<SelectedItemsPanel />);

    expect(screen.getByText('Selected items: 1')).toBeInTheDocument();
  });

  it('does not render when no items are selected', () => {
    mockSelector.mockImplementation((selector) => selector(mockState));

    render(<SelectedItemsPanel />);

    expect(screen.queryByText(/Selected items:/)).not.toBeInTheDocument();
  });

  it('dispatches clearItems', async () => {
    const user = userEvent.setup();

    render(<SelectedItemsPanel />);

    await user.click(screen.getByRole('button', { name: /clear all/i }));

    expect(mockDispatch).toHaveBeenCalled();
  });
});
