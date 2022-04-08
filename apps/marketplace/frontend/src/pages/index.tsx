import { Route, Routes } from 'react-router-dom';
import Home from './home';

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default Routing;
