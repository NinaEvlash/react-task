import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home/Home';
import About from './pages/About/About';
import Details from './components/Details/Details';
import Navigation from './components/Navigation/Navigation';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="pokemon/:name" element={<Details />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
