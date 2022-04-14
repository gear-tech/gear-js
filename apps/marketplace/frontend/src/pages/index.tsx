import { Route, Routes } from 'react-router-dom';
import Listing from './listing';
import Listings from './listings';

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Listings />} />
      <Route path="/listing" element={<Listing />} />
    </Routes>
  );
}

export default Routing;
