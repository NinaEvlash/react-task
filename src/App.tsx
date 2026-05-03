import Home from './components/Home';
import { PureComponent, type ReactNode } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

class App extends PureComponent {
  render(): ReactNode {
    return (
      <ErrorBoundary>
        <Home />
      </ErrorBoundary>
    );
  }
}

export default App;
