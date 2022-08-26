import { Routes, Route } from 'react-router-dom';

import { routes } from 'shared/config';

import { Home } from './home';

const Routing = () => (
  <Routes>
    <Route path={routes.home} element={<Home />} />
  </Routes>
);

export { Routing };
