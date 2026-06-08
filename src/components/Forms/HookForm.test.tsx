import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import userEvent from '@testing-library/user-event';
import { describe, it, vi } from 'vitest';
import { HookForm } from './HookForm';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>{' '}
    </Provider>,
  );
};

describe('HookForm', () => {
  it('renders form fields', () => {
    renderWithRouter(<HookForm onClose={vi.fn()} />);

    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^age$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^gender$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('submit button is disabled initially', () => {
    renderWithRouter(<HookForm onClose={vi.fn()} />);

    const submitButton = screen.getByRole('button', {
      name: /submit/i,
    });

    expect(submitButton).toBeDisabled();
  });

  it('shows validation error for invalid name', async () => {
    const user = userEvent.setup();

    renderWithRouter(<HookForm onClose={vi.fn()} />);

    const nameInput = screen.getByLabelText(/^name$/i);

    await user.type(nameInput, 'john');

    expect(await screen.findByText(/must start with a capital letter/i)).toBeInTheDocument();
  });

  it('shows email validation error', async () => {
    const user = userEvent.setup();

    renderWithRouter(<HookForm onClose={vi.fn()} />);

    const emailInput = screen.getByLabelText(/^email$/i);

    await user.type(emailInput, 'wrong-email');

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });

  it('updates password strength indicator', async () => {
    const user = userEvent.setup();

    renderWithRouter(<HookForm onClose={vi.fn()} />);

    const passwordInput = screen.getByLabelText(/^password$/i);

    await user.type(passwordInput, 'Test1!');

    expect(screen.getByText(/uppercase letter/i)).toHaveClass('valid');
    expect(screen.getByText(/lowercase letter/i)).toHaveClass('valid');
    expect(screen.getByText(/number/i)).toHaveClass('valid');
    expect(screen.getByText(/special character/i)).toHaveClass('valid');
  });
});
