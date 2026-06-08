import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import userEvent from '@testing-library/user-event';
import { describe, it, vi } from 'vitest';
import { UncontrolledForm } from './UncontrolledForm';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>{' '}
    </Provider>,
  );
};

describe('UncontrolledForm', () => {
  it('renders uncontrolled form', () => {
    renderWithRouter(<UncontrolledForm onClose={vi.fn()} />);

    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('submit button is enabled initially', () => {
    renderWithRouter(<UncontrolledForm onClose={vi.fn()} />);

    const submitButton = screen.getByRole('button', {
      name: /submit/i,
    });

    expect(submitButton).toBeEnabled();
  });

  it('shows validation errors only after submit', async () => {
    const user = userEvent.setup();

    renderWithRouter(<UncontrolledForm onClose={vi.fn()} />);

    expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
  });

  it('shows email validation error after submit', async () => {
    const user = userEvent.setup();

    renderWithRouter(<UncontrolledForm onClose={vi.fn()} />);

    await user.type(screen.getByLabelText(/^email$/i), 'wrong-email');

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });

  it('updates password strength indicators', async () => {
    const user = userEvent.setup();

    renderWithRouter(<UncontrolledForm onClose={vi.fn()} />);

    await user.type(screen.getByLabelText(/^password$/i), 'Test1!');

    expect(screen.getByText(/uppercase letter/i)).toHaveClass('valid');
    expect(screen.getByText(/lowercase letter/i)).toHaveClass('valid');
    expect(screen.getByText(/number/i)).toHaveClass('valid');
    expect(screen.getByText(/special character/i)).toHaveClass('valid');
  });
});
