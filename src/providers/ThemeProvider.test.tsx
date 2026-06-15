import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ThemeProvider from '../providers/ThemeProvider';
import { useTheme } from '../hooks/useTheme';

function TestComponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders default theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('toggles theme', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    await user.click(screen.getByText('toggle'));

    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });
});
