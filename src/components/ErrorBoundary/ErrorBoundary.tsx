import type { ReactNode } from 'react';
import React, { Component } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('Caught error in ErrorBoundary:', error, info);
  }

  public handleReset = (): void => {
    localStorage.removeItem('pokemonSearchQuery');
    this.setState({ hasError: false });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
          <article
            className="
             w-full 
             max-w-md 
             flex f
             lex-col 
             items-center 
             justify-center 
             p-8 bg-red-50 
             border 
             border-red-200 
             rounded-2xl 
             shadow-md
             text-centerspace-y-4"
          >
            <h2 className="text-2xl font-semibold text-red-600">Something went wrong</h2>

            <p className="text-gray-600 text-sm">
              An unexpected error occurred. You can try again.
            </p>

            <button
              type="button"
              onClick={this.handleReset}
              className="cursor-pointer px-5 py-2 bg-red-500 text-white rounded-xl 
                 hover:bg-red-600 active:scale-95 
                 transition shadow-sm"
            >
              Try Again
            </button>
          </article>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
