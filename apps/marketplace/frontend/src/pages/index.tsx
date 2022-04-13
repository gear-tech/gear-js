import { Route, Routes } from 'react-router-dom';
import Listings from './listings';

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Listings />} />
    </Routes>
  );
}

export default Routing;
