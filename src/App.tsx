import { Routes, Route } from 'react-router-dom';

import Home from './components/Home/Home';
import Details from './components/Details/Details';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="pokemon/:name" element={<Details />} />
      </Route>
    </Routes>
  );
}

export default App;
