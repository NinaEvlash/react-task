import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home/Home';
import About from './pages/About/About';
import Details from './components/Details/Details';
import Navigation from './components/Navigation/Navigation';

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="pokemon/:name" element={<Details />} />
        </Route>
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
