import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { describe } from 'vitest';
import App from './App';
import { waitFor } from '@testing-library/react';
import { store } from './store/store';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>{' '}
    </Provider>,
  );
};

describe('App', () => {
  it('adds card from RHF form', async () => {
    const user = userEvent.setup();

    renderWithRouter(<App />);

    await user.click(screen.getByRole('button', { name: /react hook form/i }));

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/name/i), 'Alice');
    await user.type(screen.getByLabelText(/email/i), 'alice@test.com');
    await user.type(screen.getByLabelText(/age/i), '30');
    await user.click(screen.getByLabelText(/terms/i));
    await user.type(screen.getByLabelText(/^password$/i), 'Test123!');
    await user.type(screen.getByLabelText(/confirm password/i), 'Test123!');
    await user.selectOptions(screen.getByLabelText(/gender/i), 'female');
    await user.type(screen.getByLabelText(/country/i), 'Poland');
    const file = new File(['img'], 'test.png', { type: 'image/png' });
    await user.upload(screen.getByLabelText(/upload photo/i), file);
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText('Alice')).toBeInTheDocument();
  });
});
