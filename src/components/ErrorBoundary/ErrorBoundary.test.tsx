import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { JSX } from 'react';
import ErrorBoundary from './ErrorBoundary';

function BuggyComponent(): JSX.Element {
  throw new Error('Test error');
}

function RecoverableComponent() {
  const saved = localStorage.getItem('pokemonSearchQuery');

  if (saved) {
    throw new Error('Test error');
  }

  return <div>Recovered successfully</div>;
}

describe('ErrorBoundary', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('catches JavaScript errors from child components', () => {
    render(
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('renders fallback UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('logs error to console', () => {
    render(
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>,
    );

    expect(console.error).toHaveBeenCalled();
  });

  it('recovers after clicking Try Again', async () => {
    localStorage.setItem('pokemonSearchQuery', 'pikachu');

    render(
      <ErrorBoundary>
        <RecoverableComponent />
      </ErrorBoundary>,
    );

    await userEvent.click(screen.getByRole('button', { name: /try again/i }));

    expect(screen.getByText(/recovered successfully/i)).toBeInTheDocument();
  });
});
