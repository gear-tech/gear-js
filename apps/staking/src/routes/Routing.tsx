import { Route, Routes } from 'react-router-dom';

import { Home } from 'pages/home';

import { routes } from './const';

function Routing() {
  return (
    <Routes>
      <Route path={routes.home} element={<Home />} />
    </Routes>
  );
}

export { Routing };
