import { Routes, Route } from 'react-router-dom';

import { routes } from 'shared/config';

import { Home } from './home';
import { Programs } from './programs';
import { NotFound } from './notFound';

const Routing = () => (
  <Routes>
    <Route path={routes.home} element={<Home />} />
    <Route path={routes.programs} element={<Programs />} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export { Routing };
