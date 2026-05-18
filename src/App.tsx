import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home/Home';
import About from './pages/About/About';
import Navigation from './components/Navigation/Navigation';
import NotFound from './pages/NotFound/NotFound';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

function App() {
  return (
    <>
      <ErrorBoundary>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
}

export default App;
